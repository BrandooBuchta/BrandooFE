import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  Modal,
  ModalContent,
  Textarea,
} from "@nextui-org/react";
import { toast } from "react-toastify";

import LabelDropdown from "./LabelDropdown";

import { Contact } from "@/interfaces/contacts";
import useUserStore from "@/stores/user";
import { api, setAuthTokenHeader } from "@/utils/api";
import { SELECT_FORM_PROPERTIES } from "@/constants/contact";

interface ContactModalProps {
  onOpenChange: () => void;
  isOpen: boolean;
  contactId: string;
  formProperties: string[];
  refetch: () => Promise<void>;
}

const ContactModal: FC<ContactModalProps> = ({
  isOpen,
  onOpenChange,
  contactId,
  formProperties,
  refetch,
}) => {
  const slideInFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };
  const userStore = useUserStore();

  const [contact, setContact] = useState<Contact | null>(null);
  const [description, setDescription] = useState<string>("");

  const getContact = async () => {
    try {
      userStore.token?.authToken &&
        setAuthTokenHeader(userStore.token?.authToken);
      const { data } = await api.get<Contact>(
        `contacts/get-contact/${contactId}`,
      );

      setContact(data);
      !data.hasReadInitialMessage && (await hasReadInitialMessage());
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const hasReadInitialMessage = async () => {
    try {
      userStore.token?.authToken &&
        setAuthTokenHeader(userStore.token?.authToken);
      await api.put(`contacts/has-read-initial-message/${contactId}`);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const updateDescription = async () => {
    try {
      userStore.token?.authToken &&
        setAuthTokenHeader(userStore.token?.authToken);
      await api.put(`contacts/update-contact-description/${contactId}`, {
        description,
      });
      getContact();
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const renderValue = (value: string) => {
    if (typeof value === "boolean") {
      return (
        <i
          className={`mdi mdi-${value ? "check" : "close"} ${value ? "text-success" : "text-danger"} text-lg`}
        />
      );
    }

    return value;
  };

  useEffect(() => {
    getContact();
  }, []);

  const deleteContact = async (id: string) => {
    try {
      userStore.token?.authToken &&
        setAuthTokenHeader(userStore.token?.authToken);
      await api.delete(`contacts/delete-contact/${id}`);
      await refetch();
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <Modal
      backdrop="opaque"
      className="w-1/2 transform translate-x-1/2"
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
        {(onClose) => (
          <>
            {contact ? (
              <Card className="p-3" shadow="none">
                <CardHeader className="justify-between">
                  <div className="flex gap-5">
                    <div className="flex flex-col gap-1 items-start justify-center">
                      <h4 className="text-md font-semibold leading-none text-default-600">
                        {contact.name}
                      </h4>
                      <h5 className="text-lg tracking-tight text-default-500">
                        {contact.firstName} {contact.lastName}
                      </h5>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <LabelDropdown contact={contact} refetch={getContact} />
                    <Button
                      isIconOnly
                      color="danger"
                      radius="full"
                      size="sm"
                      startContent={<i className="mdi mdi-delete text-lg" />}
                      variant="shadow"
                      onClick={() => deleteContact(contact.id)}
                    />
                  </div>
                </CardHeader>
                <CardBody className="px-3 py-0 text-small text-default-400">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-5 my-5">
                    {formProperties
                      .filter((e) => e !== "initialMessage")
                      .map((e) => {
                        if (contact && contact[`${e}`])
                          return (
                            <div
                              key={e}
                              className="flex gap-1 w-full justify-between"
                            >
                              <p className="font-semibold text-primary text-small">
                                {
                                  SELECT_FORM_PROPERTIES.find(
                                    ({ key }) => key === e,
                                  )?.name
                                }
                                :
                              </p>
                              <p className="text-default-400 text-small text-default-400">
                                {renderValue(contact[`${e}`])}
                              </p>
                            </div>
                          );
                      })}
                  </div>
                  <div>
                    <div className="w-full mt-3">
                      <p className="font-semibold text-small text-primary">
                        Úvodní zpráva
                      </p>
                      <p className="text-default-400 text-small">
                        {contact.initialMessage}
                      </p>
                    </div>
                    <p className="font-semibold text-small text-primary mt-5 mb-2">
                      Popis
                    </p>
                    <Textarea
                      defaultValue={contact.description}
                      variant="flat"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button
                      className="mt-3 mb-10 w-full"
                      color="primary"
                      size="md"
                      variant="shadow"
                      onPress={() => updateDescription()}
                    >
                      Uložit popis
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <div className="grid place-content-center h-full">
                <CircularProgress label="Loading contact..." size="lg" />
              </div>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ContactModal;
