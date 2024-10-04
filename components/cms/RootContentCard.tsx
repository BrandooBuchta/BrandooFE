import React, { FC, useEffect, useState } from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";

import DeletionConfirmation from "../UI/DeletionConfirmation";

import ContentSelectType from "./ContentTypeSelect";
import ContentAPIModal from "./ContentAPIModal";

import useContentStore from "@/stores/cms";
import useUserStore from "@/stores/user";
import {
  Content,
  ContentType,
  ContentTypeComponent,
} from "@/interfaces/content";
import { CONTENT_COMPONENTS } from "@/constants/cms";

interface RootContentCardProps {
  id: string;
  alias?: string;
  isRoot: boolean;
  rootId: string;
  index: number
}

const RootContentCard: FC<RootContentCardProps> = ({
  id,
  alias,
  isRoot,
  rootId,
  index,
}) => {
  const contentStore = useContentStore();
  const userStore = useUserStore();
  const [content, setContent] = useState<Content | null>(null);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const { onOpenChange, isOpen, onOpen } = useDisclosure();
  const [isCardOpen, setIsCardOpen] = useState<boolean>(index === 0);

  const updateType = async () => {
    if (!selectedType) return;
    try {
      await contentStore.updateContent(id, {
        contentType: selectedType,
      });
      await contentStore.getContent(id, setContent);
    } catch (error) {
      console.error(error);
    }
  };

  const updateContent = async (alias: string) => {
    if (!userStore.user?.id) return;

    try {
      await contentStore.updateRootContent(id, alias);
      await contentStore.fetchContentsByUserId(userStore.user.id);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRootContent = async () => {
    if (!userStore.user?.id) return;

    try {
      await contentStore.deleteRootContent(id);
      await contentStore.fetchContentsByUserId(userStore.user.id);
    } catch (error) {
      console.error(error);
    }
  };

  const CurrentComponentType: React.FC<ContentTypeComponent> | null =
    selectedType ? CONTENT_COMPONENTS[selectedType] : null;

  useEffect(() => {
    if (content?.contentType) {
      setSelectedType(content.contentType); // Set selectedType to contentType after fetching content
    }
  }, [content]);

  useEffect(() => {
    contentStore.getContent(id, setContent);
  }, []);

  useEffect(() => {
    updateType();
  }, [selectedType]);

  return (
    <div className="p-2">
      {isRoot && (
        <div className="mb-3 flex items-center justify-between relative w-full">
          <div className="flex items-center">
            <span
              className="text-2xl font-bold"
              contentEditable={true}
              onBlur={(e) => updateContent(e.currentTarget.textContent || "")}
            >
              {alias || "Alias (Klikněte pro úpravu)"}
            </span>
            <DeletionConfirmation
              button={
                <Button
                  isIconOnly
                  className="ml-3"
                  color="danger"
                  radius="full"
                  startContent={<i className="mdi mdi-delete text-xl" />}
                  variant="shadow"
                />
              }
              fn={() => deleteRootContent()}
            />
            <Button
              isIconOnly
              className="ml-3"
              color="success"
              radius="full"
              startContent={<i className="mdi mdi-api text-xl text-white" />}
              variant="shadow"
              onClick={() => onOpen()}
            />
          </div>
          <Button
            isIconOnly
            className="absolute inset-y-0 right-0 left-0 mx-auto lg:translate-x-0"
            endContent={
              <i
                className={`mdi mdi-chevron-${isCardOpen ? "up" : "down"} text-3xl`}
              />
            }
            radius="full"
            variant="light"
            onClick={() => setIsCardOpen((prev) => !prev)}
          />
        </div>
      )}
      <AnimatePresence>
        {isCardOpen && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
            transition={{ duration: 0.3 }}
          >
            <ContentSelectType
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />
            {CurrentComponentType && content && (
              <CurrentComponentType
                content={content}
                refetch={() => contentStore.getContent(id, setContent)}
                rootId={rootId}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <ContentAPIModal
        contentId={id}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

export default RootContentCard;
