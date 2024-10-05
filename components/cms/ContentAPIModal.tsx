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
import JsonToTS from "json-to-ts"; // Importujeme json-to-ts

import ShowAccessTokenForVerification from "../ShowAccessTokenForVerification";

import { api, baseURL } from "@/utils/api";

interface PublicContent {
  [key: string]: any;
}

interface StatisticProps {
  onOpenChange: () => void;
  isOpen: boolean;
  contentId: string;
  alias: string;
}

const ContentAPIModal: FC<StatisticProps> = ({
  isOpen,
  onOpenChange,
  contentId,
  alias,
}) => {
  const [contentPreview, setContentPreview] = useState<PublicContent | null>(
    null,
  );
  const [tsInterface, setTsInterface] = useState<string[]>([]);

  const slideInFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  const getContentPreview = async () => {
    try {
      const { data: content } = await api.get<PublicContent>(
        `contents/${contentId}/public`,
      );

      setContentPreview(content);

      // Generujeme TypeScript interface a rozdělujeme ho na jednotlivé řádky
      const generatedInterfaces = JsonToTS(content);

      setTsInterface(generatedInterfaces);
    } catch (error) {
      console.error("Failed to fetch content preview", error);
    }
  };

  useEffect(() => {
    getContentPreview();
  }, []);

  const jsonString = JSON.stringify(contentPreview, null, 2);

  const formattedJson = jsonString.split("\n").map((line, index) => {
    const indentLevel = line.search(/\S|$/);
    const indent = "\u00A0".repeat(indentLevel);

    return (
      <span key={index}>
        {indent}
        {line.trim()}
        <br />
      </span>
    );
  });

  const formatInterfaceWithIndentation = (
    typeInterface: string,
  ): JSX.Element[] => {
    return typeInterface.split("\n").map((line, index) => {
      const indentLevel = line.search(/\S|$/); // Najdeme počet mezer na začátku
      const indent = "\u00A0".repeat(indentLevel); // Vytvoříme odpovídající počet nezlomitelných mezer

      // Ručně zvýrazníme části JSX a odstraníme nadbytečné mezery
      if (line.trim().startsWith("interface")) {
        const parts = line.trim().split(/\s+/); // Rozdělíme na části a odstraníme nadbytečné mezery

        return (
          <span key={index}>
            {indent}
            <span className="text-yellow-400">{parts[0]}</span>{" "}
            {/* interface */}
            <span className="text-blue-400">{parts[1]}</span>{" "}
            {/* Název interface */}
            {parts.slice(2).join(" ")}
            <br />
          </span>
        );
      } else if (line.includes(":")) {
        const [key, value] = line.split(":");

        return (
          <span key={index}>
            {indent}
            <span className="text-white">{key.trim()}</span>:{" "}
            <span className="text-blue-400">{value.trim()}</span>
            <br />
          </span>
        );
      } else {
        return (
          <span key={index}>
            {indent}
            {line.trim()}
            <br />
          </span>
        );
      }
    });
  };

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
      <ModalContent>
        <ModalHeader>
          <span className="text-default-800 font-bold text-xl">{alias}</span>
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
              {`${baseURL}contents/${contentId}/public`}
            </Snippet>
          </div>
          <p className="ml-5 text-default-500">Response Model</p>

          <Code className="p-5 w-full overflow-x-scroll">{formattedJson}</Code>

          <p className="ml-5 text-default-500">
            TypeScript Rozhraní{" "}
            <Chip className="ml-1" color="warning" variant="flat">
              BETA
            </Chip>
          </p>
          <Code className="p-5 w-full overflow-x-scroll">
            {tsInterface.map((typeInterface, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                {formatInterfaceWithIndentation(typeInterface)}
              </div>
            ))}
          </Code>
          <ShowAccessTokenForVerification />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ContentAPIModal;
