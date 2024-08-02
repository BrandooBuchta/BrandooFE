import React, { useRef, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Chip,
  Tooltip,
} from "@nextui-org/react";

type Key = string | number;

interface Item {
  key: Key;
  label: string;
}

interface MultiSelectAutocompleteProps
  extends Omit<
    AutocompleteProps,
    "selectedKey" | "onSelectionChange" | "children"
  > {
  items: Item[];
}

const MultiSelectAutocomplete: React.FC<MultiSelectAutocompleteProps> = ({
  items,
  ...props
}) => {
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const clearBtnRef = useRef<HTMLButtonElement | null>(null);

  const onClose = (key: Key) => {
    setSelectedKeys((prevSelectedKeys) =>
      prevSelectedKeys.filter((selectedKey) => selectedKey !== key),
    );
  };

  const handleSelectionChange = (key: Key | null) => {
    if (key !== null) {
      setSelectedKeys((prevSelectedKeys) =>
        prevSelectedKeys.includes(key)
          ? prevSelectedKeys.filter((item) => item !== key)
          : [...prevSelectedKeys, key],
      );
    }
  };

  return (
    <>
      <Autocomplete
        {...props}
        clearButtonProps={{
          ref: clearBtnRef,
        }}
        startContent={
          !selectedKeys.length ? (
            <i className="mdi mdi-magnify" />
          ) : (
            <div className="flex gap-1">
              <Tooltip content="Delete all" showArrow={true}>
                <Chip
                  className="cursor-pointer"
                  color="danger"
                  size="sm"
                  onClick={() => setSelectedKeys([])}
                >
                  <i className="mdi mdi-close text-md" />
                </Chip>
              </Tooltip>
              {items
                .filter((e) => selectedKeys.includes(e.key))
                .map((i) => (
                  <Chip key={i.key} size="sm" onClose={() => onClose(i.key)}>
                    {i.label}
                  </Chip>
                ))}
            </div>
          )
        }
        onSelectionChange={handleSelectionChange}
      >
        {items.map((item) => (
          <AutocompleteItem
            key={item.key}
            endContent={
              selectedKeys.includes(item.key) && <i className="mdi mdi-check" />
            }
            textValue={`${item.label}${item.key}`}
            onClick={() =>
              clearBtnRef.current?.click && clearBtnRef.current.click()
            }
          >
            <span className="font-semibold text-default-600">{item.label}</span>
            <br />
            <span className="text-default-400">{item.key}</span>
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </>
  );
};

export default MultiSelectAutocomplete;
