import React, { FC, useState } from "react";

import WysiwygEditor from "@/components/contacts/WysiwygEditor";
import useContentStore from "@/stores/cms";
import { ContentTypeComponent } from "@/interfaces/content";

const HTMLContent: FC<ContentTypeComponent> = ({ content }) => {
  const [textContent, setTextContent] = useState<string>(content.html || "");

  const contentStore = useContentStore();

  const updateTextContent = async (html: string) => {
    try {
      await contentStore.updateContent(content.id, { html });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-2">
      <WysiwygEditor
        content={textContent}
        setContent={setTextContent}
        onBlur={() => updateTextContent(textContent)}
      />
    </div>
  );
};

export default HTMLContent;
