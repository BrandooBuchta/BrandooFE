import React, { FC, useEffect, useState } from "react";
import { Divider, Input } from "@nextui-org/react";

import AsyncButton from "../UI/AsyncButton";

import ContentSelectType from "./ContentTypeSelect";

import {
  Content,
  ContentItemProperty,
  ContentType,
  ContentTypeComponent,
} from "@/interfaces/content";
import { CONTENT_COMPONENTS } from "@/constants/cms";
import useContentStore from "@/stores/cms";

const ItemProperty: FC<{
  property: ContentItemProperty;
  isLast: boolean;
  refetch?: () => Promise<void>;
  rootId: string;
  contentId: string;
}> = ({ property, isLast, refetch, rootId, contentId }) => {
  const contentStore = useContentStore();

  const [content, setContent] = useState<Content | null>(null);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);

  const updateType = async () => {
    if (!selectedType || !content || content.contentType === selectedType)
      return;
    try {
      await contentStore.updateContent(property.contentId, {
        contentType: selectedType,
      });
      await contentStore.getContent(property.contentId, setContent);
    } catch (error) {
      console.error(error);
    }
  };

  const updateKey = async (key: string) => {
    try {
      await contentStore.updatePropertyKey(property.id, key);
      await contentStore.getContent(property.contentId, setContent);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProperty = async () => {
    try {
      await contentStore.deleteProperty(contentId, property.id);
      refetch && (await refetch());
    } catch (error) {
      console.error(error);
    }
  };

  const CurrentComponentType: React.FC<ContentTypeComponent> | null =
    selectedType ? CONTENT_COMPONENTS[selectedType] : null;

  useEffect(() => {
    contentStore.getContent(property.contentId, setContent);
  }, []);

  useEffect(() => {
    if (content?.contentType && content.contentType !== selectedType) {
      setSelectedType(content.contentType);
    }
  }, [content]);

  useEffect(() => {
    updateType();
  }, [selectedType]);

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input
          defaultValue={property?.key}
          label="Klíč vlastnosti"
          size="sm"
          color="primary"
          // @ts-ignore
          onBlur={({ target: { value } }) => updateKey(value)}
        />
        <ContentSelectType
          selectLabel="Typ vlastnosti"
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          size="sm"
        />
        <AsyncButton
          isIconOnly
          color="danger"
          endContent={<i className="mdi mdi-delete text-xl" />}
          size="lg"
          variant="shadow"
          onPress={() => deleteProperty()}
        />
      </div>
      {CurrentComponentType && content && (
        <CurrentComponentType
          content={content}
          refetch={() =>
            contentStore.getContent(property.contentId, setContent)
          }
          rootId={rootId}
        />
      )}
      {!isLast && <Divider className="my-5" />}
    </div>
  );
};

export default ItemProperty;
