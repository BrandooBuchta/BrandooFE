import BooleanType from "./BooleanType";
import CheckboxType from "./CheckboxType";
import DatetimeType from "./DatetimeType";
import FileType from "./FileType";
import RadioType from "./RadioType";
import SelectionType from "./SelectionType";
import TextLongType from "./TextLongType";
import TextShortType from "./TextShortType";
import TimeType from "./TimeType";

export interface InputProp {
  options?: string[];
  label: string;
  onOptionsChange?: (options: string[]) => void;
}

export enum InputType {
  BOOLEAN = "boolean",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  SELECTION = "selection",
  LONG_TEXT = "long_text",
  SHORT_TEXT = "short_text",
  DATETIME = "date_time",
  TIME = "time",
  FILE = "file",
}

type InputTypeComponentHandler = Record<InputType, React.FC<InputProp>>;

export const INPUTS: InputTypeComponentHandler = {
  [InputType.BOOLEAN]: BooleanType,
  [InputType.CHECKBOX]: CheckboxType,
  [InputType.RADIO]: RadioType,
  [InputType.SELECTION]: SelectionType,
  // [InputType.STRING_ARRAY]: StringArrayType,
  [InputType.LONG_TEXT]: TextLongType,
  [InputType.SHORT_TEXT]: TextShortType,
  [InputType.DATETIME]: DatetimeType,
  [InputType.TIME]: TimeType,
  [InputType.FILE]: FileType,
};
