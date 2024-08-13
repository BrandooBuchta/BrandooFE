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

import { Statistic } from "@/interfaces/statistics";

interface ForDevelopersStatisticProps {
  onOpenChange: () => void;
  isOpen: boolean;
  statistic?: Statistic;
}

const ForDevelopersStatistic: FC<ForDevelopersStatisticProps> = ({
  isOpen,
  onOpenChange,
  statistic,
}) => {
  const slideInFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
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
            {statistic?.name}
          </span>
        </ModalHeader>
        <ModalBody>
          <span className="text-default-600 font-semibold text-lg">
            API Endpoints
          </span>
          <span className="text-default-400 text-md">
            Přidání hodnoty do statistiky
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
              <span>{`/api/statistics/value/${statistic?.id}`}</span>
            </Snippet>
          </div>
          <span className="text-default-400 text-md">Request body</span>
          <Code className="p-4">
            {`{`}
            <br />
            <div className="ml-4">
              <span>{`time: "hh:mm:ss"`}</span>
              <br />
              <span>{`text: "string"`}</span>
              <br />
              <span>{`number: 0`}</span>
              <br />
              <span>{`boolean: false`}</span>
              <br />
            </div>
            {`}`}
          </Code>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ForDevelopersStatistic;
