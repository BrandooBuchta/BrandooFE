import React, { FC } from "react";
import { DatePicker } from "@nextui-org/react";

import { InputProp } from "./InputTypes";

const DatetimeType: FC<InputProp> = ({ label }) => {
  return (
    <div className="flex justify-center">
      <DatePicker isDisabled granularity="second" label={label} />
    </div>
  );
};

export default DatetimeType;
