import React, { FC } from "react";
import { Input } from "@nextui-org/react";

import { InputProp } from "./InputTypes";

const TextShortType: FC<InputProp> = ({ label }) => {
  return (
    <div>
      <Input
        isDisabled
        label={label}
        placeholder="Stručná odpověď"
        variant="flat"
      />
    </div>
  );
};

export default TextShortType;
