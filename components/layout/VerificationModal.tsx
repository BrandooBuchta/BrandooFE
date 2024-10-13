import React, { FC, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

import CodeInput from "../CodeInput";

import useUserStore from "@/stores/user";

interface VerificationModalProps {
  onOpenChange: () => void;
  isOpen: boolean;
}

const VerificationModal: FC<VerificationModalProps> = ({
  onOpenChange,
  isOpen,
}) => {
  const [isCode, setIsCode] = useState<boolean>(false);
  const { startVerification, finishVerification } = useUserStore();
  const user = useUserStore();

  const sendCode = async () => {
    user.user && (await startVerification(user.user.id));
    setIsCode(true);
  };

  const finish = async (code: string) => {
    if (code.length !== 6) return;
    user.user && (await finishVerification(code, user.user.id));
  };

  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              You haven`t verified yourself yet.
            </ModalHeader>
            <ModalBody>
              {!isCode ? (
                <Button color="primary" onClick={() => sendCode()}>
                  Start Verification
                </Button>
              ) : (
                <div className="flex justify-center">
                  <CodeInput onChange={(code) => finish(code)} />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default VerificationModal;
