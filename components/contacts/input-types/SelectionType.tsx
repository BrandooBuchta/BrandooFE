import React, { FC, useEffect, useRef, useState } from "react";
import { Button, Input, Link } from "@nextui-org/react";

import { InputProp } from "./InputTypes";

const SelectionType: FC<InputProp> = ({
  label,
  options = [],
  onOptionsChange,
}) => {
  const [currentEditedIdx, setCurrentEditedIdx] = useState<number | null>(null);
  const [localOptions, setLocalOptions] = useState<string[]>(options);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  const handleInputChange = (index: number, value: string) => {
    const newOptions = [...localOptions];

    newOptions[index] = value;
    setLocalOptions(newOptions);
  };

  const handleBlur = () => {
    onOptionsChange?.(localOptions);
  };

  const addOption = () => {
    const newOption = `Možnost ${localOptions.length + 1}`;
    const newOptions = [...localOptions, newOption];

    setLocalOptions(newOptions);
    onOptionsChange?.(newOptions);
    setCurrentEditedIdx(localOptions.length); // Nastavte na nově přidanou možnost
  };

  const removeOption = (option: string) => {
    const editedOptions = options.filter((e) => e !== option);

    setLocalOptions(editedOptions);
  };

  const addAnother = () => {
    const newOption = "Jiné...";
    const newOptions = [...localOptions, newOption];

    setLocalOptions(newOptions);
    onOptionsChange?.(newOptions);
    setCurrentEditedIdx(localOptions.length); // Nastavte na nově přidanou možnost
  };

  useEffect(() => {
    if (currentEditedIdx !== null && inputRefs.current[currentEditedIdx]) {
      inputRefs.current[currentEditedIdx]?.focus();
      inputRefs.current[currentEditedIdx]?.select();
    }
  }, [currentEditedIdx]);

  return (
    <div>
      <p>{label}</p>
      {localOptions.map((option, idx) => (
        <Input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          endContent={
            <Button
              isIconOnly
              color="danger"
              radius="full"
              size="sm"
              startContent={<i className="mdi mdi-delete text-lg" />}
              variant="light"
              onClick={() => removeOption(option)}
            />
          }
          startContent={
            <i
              className={`mdi mdi-${
                currentEditedIdx === idx ? "menu-down" : "menu-right"
              } text-xl ${currentEditedIdx === idx && "text-primary"}`}
            />
          }
          value={option}
          variant="underlined"
          onBlur={handleBlur}
          onChange={({ target: { value } }) => handleInputChange(idx, value)}
          onFocus={() => setCurrentEditedIdx(idx)}
        />
      ))}
      <div className="flex items-center mt-2 gap-1">
        <Link className="cursor-pointer text-default-500" onClick={addOption}>
          {`Přidat možnost `}
        </Link>
        <p className="p-text">{` nebo `}</p>
        <Link className="cursor-pointer" onClick={addAnother}>
          {`přidat "Jiná?"`}
        </Link>
      </div>
    </div>
  );
};

export default SelectionType;
