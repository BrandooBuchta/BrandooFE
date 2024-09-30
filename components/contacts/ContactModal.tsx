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
import Cookies from "js-cookie";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import FilesDisplay from "../utils/FilesDisplay";
import EventDisplayGrid from "../events/EventDisplayGrid";
import DeletionConfirmation from "../UI/DeletionConfirmation";

import LabelDropdown from "./LabelDropdown";
import { InputType } from "./input-types/InputTypes";

import { api } from "@/utils/api";
import useUserStore from "@/stores/user";
import useEventStore from "@/stores/event";
import { DetailedResponse } from "@/interfaces/form";

dayjs.extend(relativeTime);

interface ContactModalProps {
  onOpenChange: () => void;
  isOpen: boolean;
  responseId: string;
  refetch?: () => Promise<void>;
}

export interface ChatMessage {
  id: string;
  responseId: string;
  userId: string;
  message: string;
  createdAt: string;
  editableUntil: string; // Přidáno pro sledování konce editační doby
}

const LONG_TYPES = ["file", "long_text"];

const ContactModal: FC<ContactModalProps> = ({
  isOpen,
  onOpenChange,
  refetch,
  responseId,
}) => {
  const slideInFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  const [response, setResponse] = useState<DetailedResponse | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState("");

  const userStore = useUserStore();
  const eventStore = useEventStore();

  const getResponse = async () => {
    const privateKey = Cookies.get("privateKey");

    if (!privateKey) return;

    try {
      const { data } = await api.get<DetailedResponse>(
        `forms/get-single-response/${responseId}`,
        {
          headers: {
            "X-Private-Key": privateKey,
          },
        },
      );

      setResponse(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const getChatMessages = async () => {
    const privateKey = Cookies.get("privateKey");

    if (!privateKey) return;

    try {
      const { data, status } = await api.get<ChatMessage[]>(
        `/forms/form-response-messages/${responseId}`,
        {
          headers: {
            "X-Private-Key": privateKey,
          },
        },
      );

      setChatMessages(data);
    } catch (error) {
      toast.error(`Error loading chat messages: ${error}`);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await api.post("/forms/form-response-message", {
        response_id: responseId,
        user_id: userStore.user?.id,
        message: newMessage,
      });

      setNewMessage("");
      getChatMessages();
    } catch (error) {
      toast.error(`Error sending message: ${error}`);
    }
  };

  const updateAlias = async (alias: string) => {
    try {
      await api.put(
        `/forms/update-response-alias/${responseId}?alias=${alias}`,
      );
    } catch (error) {
      toast.error(`Error loading chat messages: ${error}`);
    }
  };

  const handleUpdateMessage = async () => {
    if (!editingMessageText.trim() || !editingMessageId) return;

    try {
      await api.put(`/forms/form-response-message/${editingMessageId}`, {
        message: editingMessageText,
      });

      setEditingMessageId(null);
      setEditingMessageText("");
      getChatMessages();
    } catch (error) {
      toast.error(`Error updating message: ${error}`);
    }
  };

  const startEditingMessage = (message: ChatMessage) => {
    const isEditable =
      dayjs().isBefore(dayjs(message.editableUntil)) && !editingMessageId;

    if (isEditable) {
      setEditingMessageId(message.id);
      setEditingMessageText(message.message);
    } else {
      toast.info("Zprávu lze upravovat pouze do 15 minut od jejího vytvoření.");
    }
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingMessageText("");
  };

  const userHasSeenResponse = async () => {
    try {
      await api.put(`forms/user-has-seen-response/${responseId}`);
      refetch && (await refetch());
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const deleteResponse = async () => {
    try {
      await api.delete(`forms/delete-response/${responseId}`);
      if (refetch) {
        await refetch();
      }
      onOpenChange();
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const formatCellValue = (
    type: InputType,
    value: string | string[] | boolean,
  ) => {
    if (value === undefined || value === null) {
      return "N/A";
    }

    switch (type) {
      case InputType.BOOLEAN:
        return value ? "Ano" : "Ne";
      case InputType.CHECKBOX:
        return Array.isArray(value) ? value.join(", ") : value;
      case InputType.DATETIME:
        return dayjs(value as any).format("DD. MM. YYYY HH:mm");
      case InputType.FILE:
        return <FilesDisplay files={value as string[]} />;
      default:
        return value;
    }
  };

  useEffect(() => {
    getResponse();
    getChatMessages();
    userHasSeenResponse();
  }, []);

  return (
    <>
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
          {(onClose) => (
            <>
              {response ? (
                <Card className="p-3 h-full overflow-scroll	" shadow="none">
                  <CardHeader className="justify-between">
                    <div className="flex gap-5">
                      <div className="flex flex-col gap-1 items-start justify-center">
                        <h4
                          className="text-md font-semibold leading-none text-default-600"
                          contentEditable={true}
                          onBlur={(e) =>
                            updateAlias(e.currentTarget.textContent || "")
                          }
                        >
                          {response.alias ||
                            "Žádný alias (Klikněte pro úpravu)"}
                        </h4>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <LabelDropdown
                        refetch={getResponse}
                        response={response}
                        responseId={responseId}
                      />
                      <DeletionConfirmation
                        button={
                          <Button
                            isIconOnly
                            color="danger"
                            radius="full"
                            size="sm"
                            startContent={
                              <i className="mdi mdi-delete text-lg" />
                            }
                            variant="shadow"
                          />
                        }
                        fn={deleteResponse}
                      />
                    </div>
                  </CardHeader>
                  <CardBody className="px-3 py-0 text-small text-default-400">
                    <div className="gap-y-3 my-5 flex flex-wrap">
                      {response.response
                        .sort((a, b) => {
                          const isALongOrFile = LONG_TYPES.includes(
                            a.propertyType,
                          );
                          const isBLongOrFile = LONG_TYPES.includes(
                            b.propertyType,
                          );

                          if (isALongOrFile && !isBLongOrFile) {
                            return 1; // move a down
                          }
                          if (!isALongOrFile && isBLongOrFile) {
                            return -1; // move b down
                          }

                          return 0; // keep the same order
                        })
                        .map((e) => (
                          <div
                            key={e.label}
                            className={`flex justify-between gap-1 px-2 ${LONG_TYPES.includes(e.propertyType) ? "flex-col w-full" : "flex-row w-1/2"}`}
                          >
                            <p className="font-bold text-primary">
                              {e.label}:{" "}
                            </p>
                            <p>{formatCellValue(e.propertyType, e.value)}</p>
                          </div>
                        ))}
                    </div>
                    <p className="font-bold text-primary mb-2">Poznámky</p>
                    <div className="flex flex-col gap-3 max-h-60 overflow-y-auto rounded-md justify-end">
                      {chatMessages.map((msg) => (
                        <Card
                          key={msg.id}
                          className={`flex flex-col ${editingMessageId === msg.id ? "bg-default-200" : "bg-primary"} w-fit p-2 rounded-xl shadow relative`}
                          onDoubleClick={() => startEditingMessage(msg)}
                        >
                          {editingMessageId === msg.id ? (
                            <>
                              <Textarea
                                className="mb-2"
                                color="default"
                                value={editingMessageText}
                                onChange={(e) =>
                                  setEditingMessageText(e.target.value)
                                }
                              />
                              <div className="flex gap-2">
                                <Button
                                  color="primary"
                                  onClick={handleUpdateMessage}
                                >
                                  Uložit
                                </Button>
                                <Button color="danger" onClick={cancelEditing}>
                                  Zrušit
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-default-700">{msg.message}</p>
                              <p className="text-xs text-default-500 text-right">
                                {dayjs(msg.createdAt).format(
                                  "HH:mm DD.MM.YYYY",
                                )}
                              </p>
                            </>
                          )}
                        </Card>
                      ))}
                    </div>
                    {editingMessageId === null && (
                      <div className="mt-2 flex flex-col items-center gap-2">
                        <Textarea
                          className="flex-grow"
                          placeholder="Něco..."
                          rows={1}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button
                          className="w-full"
                          color="primary"
                          onClick={() => handleSendMessage()}
                        >
                          Přidat poznámku
                        </Button>
                      </div>
                    )}
                    <EventDisplayGrid response={response} />
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
    </>
  );
};

export default ContactModal;
