import { FC, useState } from "react";
import { Input, Modal, ModalContent } from "@nextui-org/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import AsyncButton from "./UI/AsyncButton";

import { api } from "@/utils/api";
import useUserStore from "@/stores/user";

export interface FormBasicInfo {
  name: string;
  description: string;
}

interface NewFormModalProps {
  onOpenChange: () => void;
  isOpen: boolean;
}

const NewFormModal: FC<NewFormModalProps> = ({ onOpenChange, isOpen }) => {
  const { push } = useRouter();
  const [info, setInfo] = useState<FormBasicInfo>({
    name: "",
    description: "",
  });

  const editForm = (key: keyof FormBasicInfo, value: string) => {
    setInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const userStore = useUserStore();

  const onSubmit = async () => {
    try {
      const {
        data: { id },
      } = await api.post<{ id: string }>(
        `forms/create-form/${userStore.user?.id}`,
        info,
      );

      toast.success("Úspěnš jsme uložili kontaktní údaje!");
      push(`/form/${id}`);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <Modal
      hideCloseButton
      backdrop="blur"
      isOpen={isOpen}
      size="md"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="p-5">
        <>
          <span className="text-lg font-bold">Nový formulář</span>
          <span className="text-sm mb-3 text-default-400">
            Začněte s jménem a popisem formuláře
          </span>
          <div className="flex flex-col gap-4 mb">
            <Input
              color="primary"
              label="Jméno formuláře"
              variant="bordered"
              onChange={({ target: { value } }) => editForm("name", value)}
            />
            <Input
              color="primary"
              label="Popis formuláře"
              variant="bordered"
              onChange={({ target: { value } }) =>
                editForm("description", value)
              }
            />
            <AsyncButton color="primary" onPress={() => onSubmit()}>
              Vytvořit
            </AsyncButton>
          </div>
        </>
      </ModalContent>
    </Modal>
  );
};

export default NewFormModal;
