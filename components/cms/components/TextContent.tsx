import React, { FC } from "react";
import { Input } from "@nextui-org/react";

import { ContentTypeComponent } from "@/interfaces/content";
import useContentStore from "@/stores/cms";
import useUserStore from "@/stores/user";

const TextContent: FC<ContentTypeComponent> = ({ content }) => {
  const contentStore = useContentStore();
  const userStore = useUserStore();

  const updateTextContent = async (text: string) => {
    try {
      await contentStore.updateContent(content.id, { text });
      userStore.user?.id &&
        (await contentStore.fetchContentsByUserId(userStore.user.id));
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
