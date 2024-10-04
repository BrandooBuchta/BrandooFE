import React, { FC, useState } from "react";
import { Button, Card } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";

import ItemProperty from "../ItemProperty";

import { Content } from "@/interfaces/content";
import useContentStore from "@/stores/cms";
import AsyncButton from "@/components/UI/AsyncButton";

interface ItemContentProps {
  content: Content;
  refetch: () => Promise<void>;
  rootId: string;
}

const ItemContent: FC<ItemContentProps> = ({ content, refetch, rootId }) => {
  const contentStore = useContentStore();
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);

  const addProperty = async () => {
    try {
      await contentStore.createProperty(content.id, rootId);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className={`mx-5 mt-5 px-3 pb-3 bg-default-100 pb-6`}>
      <div className="flex py-3 relative items-center">
        <p className="font-bold mt-3 mb-1 ml-2">Vlastnosti položky</p>
        <Button
          isIconOnly
          className="absolute inset-y-0 right-0 left-0 mx-auto mt-2 lg:translate-x-0"
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
      <AnimatePresence>
        {isCardOpen && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
            transition={{ duration: 0.3 }}
          >
            {content.itemContent &&
              content.itemContent.map(
                (e, idx) =>
                  content.itemContent && (
                    <ItemProperty
                      key={idx}
                      contentId={content.id}
                      isLast={content.itemContent.length - 1 === idx}
                      property={e}
                      refetch={refetch}
                      rootId={rootId}
                    />
                  ),
              )}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-center mt-5">
        <AsyncButton
          color="primary"
          endContent={<i className="mdi mdi-plus text-2xl" />}
          variant="shadow"
          onPress={() => addProperty()}
        >
          Přidat vlastnost
        </AsyncButton>
      </div>
    </Card>
  );
};

export default ItemContent;
