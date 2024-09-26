import React, { FC } from "react";
import { Input } from "@nextui-org/react";

import { InputProp } from "./InputTypes";

const FileType: FC<InputProp> = ({ label }) => {
  return (
    <div className="flex justify-center">
      <Input
        isDisabled
        className="w-[300px]"
        label={label}
        placeholder="Stručná odpověď"
        type="file"
        variant="flat"
      />
    </div>
  );
};

export default FileType;
