import React, { FC } from "react";
import {
  Chip,
  Code,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Snippet,
} from "@nextui-org/react";

import { FormWithProperties } from "@/interfaces/form";

interface FormAPIModalProps {
  onOpenChange: () => void;
  isOpen: boolean;
  form: FormWithProperties;
}

const FormAPIModal: FC<FormAPIModalProps> = ({
  isOpen,
  onOpenChange,
  form,
}) => {
  const slideInFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  const types = {
    short_text: `"string"`,
    long_text: `"string"`,
    boolean: true,
    radio: `"string"`,
    checkbox: `["string"]`,
    selection: `["string"]`,
    date_time: `"2024-08-29T12:34:56Z"`,
    time: `"12:34:56"`,
    file: "filename.pdf", // TODO:
  };

  return (
    <Modal
      backdrop="opaque"
      className="lg:w-1/2 w-full transform lg:translate-x-1/2"
      isOpen={isOpen}
      motionProps={{
        initial: "hidden",
        animate: "visible",
        exit: "hidden",
        variants: slideInFromRight,
        transition: { duration: 0.3 },
      }}
      size="full"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="p-5">
        <ModalHeader>
          <span className="text-default-800 font-bold text-xl">
            {form.name}
          </span>
        </ModalHeader>
        <ModalBody>
          <span className="text-default-600 font-semibold text-lg">
            API Endpoints
          </span>
          <span className="text-default-400 text-md">
            Vytvoření odpovědi na formulář
          </span>
          <div className="flex items-center">
            <Chip
              className="px-4 mr-1 h-full"
              color="success"
              radius="sm"
              size="lg"
              variant="shadow"
            >
              POST
            </Chip>
            <Snippet
              className="flex w-full"
              size="sm"
              symbol={null}
              variant="bordered"
            >
              <span>{`/api/statistics/value/${form.id}`}</span>
            </Snippet>
          </div>
          <Code className="p-4">
            {`{`}
            <br />
            <div className="ml-4">
              {form.properties.map(({ key, propertyType }) => {
                return (
                  <>
                    <span>{`"${key}": ${types[propertyType]},`}</span>
                    <br />
                  </>
                );
              })}
            </div>
            {`}`}
          </Code>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FormAPIModal;
