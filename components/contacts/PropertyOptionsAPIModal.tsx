import React, { FC, useEffect, useState } from "react";
import {
  Chip,
  Code,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Snippet,
} from "@nextui-org/react";
import { toast } from "react-toastify";

import { api, baseURL } from "@/utils/api";
import ShowAccessTokenForVerification from "../ShowAccessTokenForVerification";

interface OptionsResponse {
  propertyName: string;
  formName: string;
  options: string[];
}

interface PropertyOptionsAPIModalProps {
  onOpenChange: () => void;
  isOpen: boolean;
  propertyId: string;
}

const PropertyOptionsAPIModal: FC<PropertyOptionsAPIModalProps> = ({
  isOpen,
  onOpenChange,
  propertyId,
}) => {
  const [options, setOptions] = useState<OptionsResponse | null>(null);
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
    labels: "",
  };

  const getOptions = async () => {
    try {
      const { data } = await api.get<OptionsResponse>(
        `forms/property/options/${propertyId}`,
      );

      setOptions(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    getOptions();
  }, []);

  return (
    <Modal
      backdrop="opaque"
      className="lg:w-4/5 w-full transform lg:translate-x-[12.5%]"
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
            Získání možností dané vlastnosti
          </span>
        </ModalHeader>
        <ModalBody>
          <span className="text-default-600 font-semibold text-lg">
            API Endpoints
          </span>
          <span className="text-default-400 text-md">
            Získání možností dané vlastnosti
          </span>
          <div className="flex items-center">
            <Chip
              className="px-4 mr-1 h-full"
              color="primary"
              radius="sm"
              size="lg"
              variant="shadow"
            >
              GET
            </Chip>
            <Snippet
              className="flex w-full"
              size="sm"
              symbol={null}
              variant="bordered"
            >
              <span>{`${baseURL}forms/property/options/${propertyId}`}</span>
            </Snippet>
          </div>
          <Code className="p-4">
            {`{`}
            <br />
            <div className="ml-4">
              <span>{`propertyName: "${options?.propertyName}"`}</span>
              <br />
              <span>{`formName: "${options?.formName}"`}</span>
              <br />
              <span>{`options: [`}</span>
              <br />
              {options?.options.map((e) => (
                <span key={e} className="ml-4">
                  {`"${e}",`}
                  <br />
                </span>
              ))}
              <span>{`]`}</span>
              <br />
            </div>
            {`}`}
          </Code>
          <ShowAccessTokenForVerification />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PropertyOptionsAPIModal;
