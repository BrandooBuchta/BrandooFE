import React, { FC } from "react";
import { Select, SelectItem, Selection } from "@nextui-org/react";

import { CONTENT_TYPES } from "@/constants/cms";
import { ContentType } from "@/interfaces/content";

interface ContentSelectTypeProps {
  selectedType: ContentType | null;
  setSelectedType?: (type: ContentType) => void;
  selectLabel?: string;
  size?: "lg" | "md" | "sm";
}

const ContentSelectType: FC<ContentSelectTypeProps> = ({
  selectedType,
  setSelectedType,
  selectLabel,
  size,
}) => {
  const handleTypeChange = (keys: Selection) => {
    const selectedKey = Array.from(keys)[0] as ContentType;

    setSelectedType && setSelectedType(selectedKey);
  };

  return (
    <Select
      label={selectLabel || "Typ"}
      selectedKeys={selectedType ? new Set([selectedType]) : undefined}
      size={size}
      onSelectionChange={handleTypeChange}
      variant="faded"
      color="primary"
    >
      {CONTENT_TYPES.map(({ label, type, icon }) => (
        <SelectItem
          key={type}
          endContent={<i className={`mdi mdi-${icon}`} />}
          value={type}
        >
          {label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default ContentSelectType;
