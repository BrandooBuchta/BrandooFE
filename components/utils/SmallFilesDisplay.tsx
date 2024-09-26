import { Button, Card, Divider, Link } from "@nextui-org/react";
import React, { FC } from "react";

import FileInputButton from "./FileInputButton";

import { Event } from "@/interfaces/event";
import useFileStore from "@/stores/file";
import useEventStore from "@/stores/event";

interface FileCardProps {
  fileUrl: string;
  ev: Event;
}

interface SmallFilesDisplayProps {
  ev: Event;
}

const extensionToIconMap: Map<string, string> = new Map([
  ["png", "file-image"],
  ["jpg", "file-image"],
  ["jpeg", "file-image"],
  ["gif", "file-image"],
  ["bmp", "file-image"],
  ["pdf", "file-pdf-box"],
  ["doc", "file-word"],
  ["docx", "file-word"],
  ["xls", "file-excel"],
  ["xlsx", "file-excel"],
  ["ppt", "file-powerpoint"],
  ["pptx", "file-powerpoint"],
  ["txt", "file-document"],
  ["csv", "file-document"],
  ["html", "file-code"],
  ["css", "file-code"],
  ["js", "file-code"],
  ["ts", "file-code"],
  ["json", "file-code"],
]);

const FileCard: FC<FileCardProps> = ({ fileUrl, ev }) => {
  const fileExstension = fileUrl.split(".").at(-1);
  const fileStore = useFileStore();
  const eventStore = useEventStore();

  const deleteFile = async (fileName: string) => {
    try {
      await fileStore.deleteFile(fileName);

      const updatedFiles = ev.files.filter((e) => fileName.includes(e));

      await eventStore.updateEvent(ev.id, {
        files: updatedFiles,
      });

      await eventStore.fetchEventById(ev.id);

      // await eventStore.fetchEventsByResponseId(ev.responseId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-full p-2" radius="sm">
      <div className="flex gap-5 w-full justify-between">
        <p>{fileUrl.split("/").slice(-1)}</p>
        <div className="flex h-5 items-center space-x-3">
          {fileExstension && (
            <i
              className={`text-primary text-lg mdi mdi-${extensionToIconMap.get(fileExstension)}`}
            />
          )}
          <Divider orientation="vertical" />
          <Link isExternal showAnchorIcon href={fileUrl} target="_blank" />
          <Divider orientation="vertical" />
          <Button
            isIconOnly
            color="danger"
            radius="full"
            size="sm"
            startContent={<i className="mdi mdi-delete text-lg" />}
            variant="light"
            onClick={() => deleteFile(fileUrl.split("/").slice(-1)[0])}
          />
        </div>
      </div>
    </Card>
  );
};

const SmallFilesDisplay: FC<SmallFilesDisplayProps> = ({ ev }) => {
  return (
    <div className="flex flex-col mt-1 gap-2">
      {ev.files &&
        ev.files.map((file) => <FileCard key={file} ev={ev} fileUrl={file} />)}
      <FileInputButton ev={ev} />
    </div>
  );
};

export default SmallFilesDisplay;
