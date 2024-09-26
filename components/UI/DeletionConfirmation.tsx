import React, { FC, ReactElement, cloneElement } from "react";
import {
  ButtonProps,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalContent,
} from "@nextui-org/react";

import AsyncButton from "./AsyncButton";

interface DeletionConfirmationProps {
  button: ReactElement<ButtonProps>; // Prop typu ReactElement
  fn: () => Promise<void>;
}

const DeletionConfirmation: FC<DeletionConfirmationProps> = ({
  button,
  fn,
}) => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  // Použijeme cloneElement pro přiřazení onClick handleru
  const DeletionButton = cloneElement(button, {
    onClick: () => onOpen(),
  });

  return (
    <>
      {DeletionButton}
      <Modal closeButton isOpen={isOpen} onOpenChange={() => onOpenChange()}>
        <ModalContent>
          <ModalHeader className="text-2xl">Potvrďte smazání </ModalHeader>
          <ModalBody>
            <p className="text-lg">
              Tato akce je nevratná, potvrďte jí prosím.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onClick={() => onOpenChange()}
            >
              Zrušit
            </Button>
            <AsyncButton color="danger" variant="shadow" onClick={fn}>
              Smazat
            </AsyncButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeletionConfirmation;
