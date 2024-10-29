import React, { FC } from "react";
import { Input } from "@nextui-org/react";

import { ContentTypeComponent } from "@/interfaces/content";
import useContentStore from "@/stores/cms";

const TextContent: FC<ContentTypeComponent> = ({ content }) => {
  const contentStore = useContentStore();

  const updateTextContent = async (text: string) => {
    try {
      await contentStore.updateContent(content.id, { text });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-2">
      <Input
        defaultValue={content.text}
        label="Jednoduchý text"
        variant="faded"
        // @ts-ignore
        onBlur={(e) => updateTextContent(e.target.value)}
      />
    </div>
  );
};

export default TextContent;
