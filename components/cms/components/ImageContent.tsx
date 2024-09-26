import React, { useRef } from "react";
import { Button } from "@nextui-org/react";

import useFileStore from "@/stores/file";
import { ContentTypeComponent } from "@/interfaces/content";
import useContentStore from "@/stores/cms";

const ImageContent: React.FC<ContentTypeComponent> = ({ content, refetch }) => {
  const fileStore = useFileStore();
  const contentStore = useContentStore();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (!file) return;
    try {
      if (content.image) {
        await fileStore.deleteFile(content.image.split("/").slice(-1)[0]);
      }

      const filePath = await fileStore.uploadFile(file);

      await contentStore.updateContent(content.id, {
        image: filePath,
      });

      if (filePath === "File upload failed") return;
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex justify-center my-2 flex-col gap-3">
      {/* TODO: Handle loading */}
      <input
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
        onChange={handleFileChange}
      />
      {content.image && (
        <img alt={content.image} className="rounded-lg" src={content.image} />
      )}
      <Button
        as="span"
        className="w-full"
        color="primary"
        endContent={<i className="mdi mdi-plus" />}
        onClick={() => inputRef.current?.click()}
      >
        {content.image ? "Upravit" : "Přidat"} obrázek
      </Button>
    </div>
  );
};

export default ImageContent;
