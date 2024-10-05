import React, { FC, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Input,
  Select,
  SelectItem,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import { useDrag, useDrop } from "react-dnd";

import { INPUTS, InputProp, InputType } from "./input-types/InputTypes";
import NoSelectedComponent from "./input-types/NoSelctedComponent";
import PropertyOptionsAPIModal from "./PropertyOptionsAPIModal";

import { PROPERTY_TYPES } from "@/constants/form";
import { FormPropertyType } from "@/interfaces/form";

const PROPERTIES_TYPES_WITH_OPTIONS: InputType[] = [
  InputType.SELECTION,
  InputType.CHECKBOX,
  InputType.RADIO,
];

interface FormPropertyProps {
  property: FormPropertyType;
  onPropertyChange: (updatedProperty: FormPropertyType) => void;
  index: number;
  moveProperty: (dragIndex: number, hoverIndex: number) => void;
  formProperties: FormPropertyType[];
  setFormProperties: (properties: FormPropertyType[]) => void;
}

const FormProperty: FC<FormPropertyProps> = ({
  property,
  onPropertyChange,
  index,
  moveProperty,
  formProperties,
  setFormProperties,
}) => {
  const { onOpenChange, isOpen, onOpen } = useDisclosure();

  const [selectedType, setSelectedType] = useState<InputType>(
    property.propertyType,
  );
  const [isRequired, setIsRequired] = useState<boolean>(
    property.required || false,
  );

  const handleLabelChange = (newLabel: string) => {
    onPropertyChange({
      ...property,
      label: newLabel,
    });
  };

  const handleTypeChange = (newType: InputType) => {
    setSelectedType(newType);
    onPropertyChange({ ...property, propertyType: newType, options: [] }); // reset options on type change
  };

  const handleOptionsChange = (newOptions: string[]) => {
    onPropertyChange({ ...property, options: newOptions });
  };

  const handleRequiredChange = () => {
    const updatedRequired = !isRequired;

    setIsRequired(updatedRequired);
    onPropertyChange({ ...property, required: updatedRequired });
  };

  const CurrentComponentType: React.FC<InputProp> = selectedType
    ? INPUTS[selectedType]
    : NoSelectedComponent;

  const [, ref] = useDrag({
    type: "FORM_PROPERTY",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "FORM_PROPERTY",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveProperty(item.index, index);
        item.index = index;
      }
    },
  });

  const deleteFormProperty = (id: string | undefined) => {
    if (!id) return;
    const updatedProperties = formProperties.filter((e) => e.id !== id);

    setFormProperties(updatedProperties);
  };

  return (
    <Card
      ref={(node) => ref(drop(node))}
      className="flex flex-col items-center"
    >
      {property.id &&
        !property.id.startsWith("subId") &&
        PROPERTIES_TYPES_WITH_OPTIONS.includes(property.propertyType) && (
          <PropertyOptionsAPIModal
            isOpen={isOpen}
            propertyId={property.id}
            onOpenChange={onOpenChange}
          />
        )}
      <i className="mdi mdi-drag-horizontal text-2xl h-[20px] cursor-pointer text-default-500" />
      <div className="p-3 w-full">
        <div className="flex gap-3 flex-col pb-0">
          <div className="flex w-[70%] gap-2">
            <Input
              defaultValue={property.label}
              label="Label"
              variant="underlined"
              onChange={({ target: { value } }) => handleLabelChange(value)}
            />
            <Select
              defaultSelectedKeys={[selectedType]}
              label="Typ"
              className="w-[30%]"
              startContent={
                <i
                  className={`mdi mdi-${PROPERTY_TYPES.find((e) => e.key === selectedType)?.icon}`}
                />
              }
              variant="underlined"
              onChange={(e) => handleTypeChange(e.target.value as InputType)}
            >
              {PROPERTY_TYPES.map(({ key, label, icon }) => (
                <SelectItem
                  key={key}
                  endContent={<i className={`mdi mdi-${icon}`} />}
                  value={key}
                >
                  {label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <p className="text-default-400 text-sm mb-2">Náhled</p>
          <div className="p-3">
            <CurrentComponentType
              label={property.label}
              options={property.options}
              onOptionsChange={handleOptionsChange}
            />
          </div>
        </div>
      </div>
      <Divider orientation="vertical" />

      <div className="w-full p-3">
        <Divider />
        <div className="flex justify-end space-x-3 w-full h-full p-3">
          <Switch
            isDisabled={property.key === "privacyPolicy"}
            isSelected={isRequired}
            onChange={handleRequiredChange}
          >
            Povinné
          </Switch>
          {property.key !== "privacyPolicy" && (
            <>
              <Divider className="h-[40px] ml-5" orientation="vertical" />
              <Button
                isIconOnly
                color="danger"
                radius="full"
                startContent={<i className="mdi mdi-delete text-xl" />}
                onClick={() => deleteFormProperty(property.id)}
              />
              {PROPERTIES_TYPES_WITH_OPTIONS.includes(property.propertyType) &&
                !property.id.startsWith("subId") && (
                  <Button
                    isIconOnly
                    color="success"
                    radius="full"
                    startContent={
                      <i className="mdi mdi-api text-xl text-white" />
                    }
                    onClick={() => onOpen()}
                  />
                )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FormProperty;
