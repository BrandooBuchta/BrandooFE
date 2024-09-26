import React, { FC } from "react";
import { Card, TimeInput } from "@nextui-org/react";

import { InputProp } from "./InputTypes";

const TimeType: FC<InputProp> = () => {
  return (
    <Card>
      <TimeInput label="Event Time" isDisabled />
    </Card>
  );
};

export default TimeType;
