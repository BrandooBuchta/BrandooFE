import { Card, Divider, Link } from "@nextui-org/react";
import React, { FC } from "react";

interface FileCardProps {
  fileUrl: string;
}

interface FilesDisplayProps {
  files: string[];
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

const FileCard: FC<FileCardProps> = ({ fileUrl }) => {
  const fileExstension = fileUrl.split(".").at(-1);

  return (
    <Card className="w-full">
      <div className="flex gap-5 p-4 w-full justify-between">
        <p>{fileUrl.split("/").slice(-1)}</p>
        <div className="flex h-5 items-center space-x-3">
          {fileExstension && (
            <i
              className={`text-primary text-lg mdi mdi-${extensionToIconMap.get(fileExstension)}`}
            />
          )}
          <Divider orientation="vertical" />
          <Link isExternal showAnchorIcon href={fileUrl} target="_blank" />
        </div>
      </div>
    </Card>
  );
};

const FilesDisplay: FC<FilesDisplayProps> = ({ files }) => {
  return (
    <div className="flex flex-col mt-1 gap-2">
      {files.map((file) => (
        <FileCard key={file} fileUrl={file} />
      ))}
    </div>
  );
};

export default FilesDisplay;
