import { FC, useState } from "react";
import { Button, Input, Modal, ModalContent } from "@nextui-org/react";
import { toast } from "react-toastify";

import { api } from "@/utils/api";
import useUserStore from "@/stores/user";
import { UserFormInfo } from "@/interfaces/user";

interface UserFormInfoModalProps {
  onOpenChange: () => void;
  isOpen: boolean;
}

const UserFormInfoModal: FC<UserFormInfoModalProps> = ({
  onOpenChange,
  isOpen,
}) => {
  const [info, setInfo] = useState<UserFormInfo>({
    contactEmail: "",
    contactPhone: "",
    registrationNo: "",
  });

  const editForm = (key: keyof UserFormInfo, value: string) => {
    setInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const userStore = useUserStore();

  const onSubmit = async () => {
    try {
      await api.put(`user/update/${userStore.user?.id}`, info);

      toast.success("Úspěnš jsme uložili kontaktní údaje!");
      userStore.setUserFormInfo(info);
      onOpenChange();
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
          <span className="text-lg font-bold">Kontaktní údaje</span>
          <span className="text-sm mb-3 text-default-400">
            Potřebujeme vaše kontaktní údaje pro vytvoření podmínek zpracování
            osobních údajů
          </span>
          <div className="flex flex-col gap-4 mb">
            <Input
              color="primary"
              label="Email"
              type="email"
              variant="bordered"
              onChange={({ target: { value } }) =>
                editForm("contactEmail", value)
              }
            />
            <Input
              color="primary"
              label="Telefonní číslo"
              variant="bordered"
              onChange={({ target: { value } }) =>
                editForm("contactPhone", value)
              }
            />
            <Input
              color="primary"
              label="IČO"
              variant="bordered"
              onChange={({ target: { value } }) =>
                editForm("registrationNo", value)
              }
            />
            <Button color="primary" onPress={() => onSubmit()}>
              Odeslat
            </Button>
          </div>
        </>
      </ModalContent>
    </Modal>
  );
};

export default UserFormInfoModal;
