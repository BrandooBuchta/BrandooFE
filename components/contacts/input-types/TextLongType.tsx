import React, { FC } from "react";
import { Textarea } from "@nextui-org/react";

import { InputProp } from "./InputTypes";

const TextLongType: FC<InputProp> = ({ label }) => {
  return (
    <div>
      <Textarea
        isDisabled
        label={label}
        placeholder="Dlouhá odpověď"
        variant="flat"
      />
    </div>
  );
};

export default TextLongType;
