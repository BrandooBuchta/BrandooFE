import React, { useRef } from "react";
import { Button } from "@nextui-org/react";

import useFileStore from "@/stores/file";
import useEventStore from "@/stores/event";
import { Event } from "@/interfaces/event";

interface FileInputButtonProps {
  ev: Event;
}

const FileInputButton: React.FC<FileInputButtonProps> = ({ ev }) => {
  const fileStore = useFileStore();
  const eventStore = useEventStore();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (!file) return;
    try {
      const filePath = await fileStore.uploadFile(file);

      if (filePath === "File upload failed") return;

      await eventStore.updateEvent(ev.id, {
        files: ev.files ? [...ev.files, filePath] : [filePath],
      });

      await eventStore.fetchEventsByResponseId(ev.responseId);
    } catch (error) {
      console.error(error);
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex justify-center my-2">
      <input
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
        onChange={handleFileChange}
      />
      <Button
        isIconOnly
        as="span"
        color="primary"
        radius="full"
        startContent={<i className="mdi mdi-plus" />}
        onClick={() => inputRef.current?.click()}
      />
    </div>
  );
};

export default FileInputButton;
