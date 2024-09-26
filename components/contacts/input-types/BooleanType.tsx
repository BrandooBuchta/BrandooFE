import React, { FC } from "react";
import { Checkbox } from "@nextui-org/react";

import { InputProp } from "./InputTypes";

const BooleanType: FC<InputProp> = ({ label }) => {
  return (
    <div className="flex justify-start align-center gap-2">
      <span className="text-default-500">{label}</span>
      <Checkbox isDisabled isSelected />
    </div>
  );
};

export default BooleanType;
