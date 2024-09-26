import { FC, useEffect, useState } from "react";
import { useDisclosure } from "@nextui-org/react";

import FormTableComponent from "@/components/contacts/FormTableComponent";
import UserFormInfoModal from "@/components/contacts/UserFormInfoModal";
import useUserStore from "@/stores/user";

const Contacts: FC = () => {
  const [isClient, setIsClient] = useState(false);
  const { onOpen, onOpenChange, isOpen } = useDisclosure();
  const userStore = useUserStore();

  useEffect(() => {
    setIsClient(true);
    !userStore.user?.registrationNo && onOpen();
  }, []);

  useEffect(() => {
    !userStore.user?.registrationNo && onOpen();
  }, [isOpen]);

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <UserFormInfoModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <FormTableComponent />
    </div>
  );
};

export default Contacts;
