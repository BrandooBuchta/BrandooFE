import { FC, useState } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import * as mdiIcons from "@mdi/js";
import "@mdi/font/css/materialdesignicons.min.css"; // Ensure you import the MDI CSS for icons to be displayed

function convertToFont(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

interface IconSelectProps {
  onIconChange: (icon: string) => void;
  defaultInputValue?: string;
}

const IconSelect: FC<IconSelectProps> = ({
  onIconChange,
  defaultInputValue,
}) => {
  const [query, setQuery] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<string>("");

  const icons = Object.keys(mdiIcons).map((e) => ({
    label: convertToFont(e),
    value: convertToFont(e),
  }));

  const filteredIcons = icons
    .filter((icon) => icon.label.includes(`mdi-${query.toLowerCase()}`))
    .slice(0, 20);

  const handleInputChange = (value: string) => {
    setQuery(value);
  };

  const handleSelectionChange = (icon: string) => {
    setSelectedIcon(icon);
    onIconChange(icon);
  };

  return (
    <>
      <Autocomplete
        className="max-w-full"
        color="primary"
        defaultInputValue={
          defaultInputValue ? defaultInputValue.replaceAll("mdi-", "") : ""
        }
        endContent={<i className={`mdi ${selectedIcon}`} />}
        label="Icon"
        maxLength={20}
        placeholder="Select an icon"
        prefix="mdi-"
        variant="bordered"
        onInputChange={handleInputChange}
        onSelectionChange={(e) => handleSelectionChange(e as string)}
      >
        {filteredIcons
          .sort((a, b) => a.label.length - b.label.length)
          .map((icon) => (
            <AutocompleteItem
              key={icon.value}
              endContent={<i className={`mdi ${icon.value}`} />}
              value={icon.value}
            >
              {icon.label.replaceAll("mdi-", "")}
            </AutocompleteItem>
          ))}
      </Autocomplete>
    </>
  );
};

export default IconSelect;
