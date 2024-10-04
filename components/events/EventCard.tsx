import { Button, Card } from "@nextui-org/react";
import React, { FC, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import UTC plugin
import { createEvent, DateArray, EventAttributes } from "ics"; // Import necessary modules from ics

import SmallFilesDisplay from "../utils/SmallFilesDisplay";

import EventLinkEditor from "./EventLinkEditor";

import { Event } from "@/interfaces/event";
import useEventStore from "@/stores/event";

// Enable UTC support in dayjs
dayjs.extend(utc);

interface EventCardProps {
  event: Event;
}

const EventCard: FC<EventCardProps> = ({ event }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [links, setLinks] = useState(event.links || "");

  const titleRef = useRef<HTMLHeadingElement>(null);
  const notesRef = useRef<HTMLParagraphElement>(null);
  const addressRef = useRef<HTMLParagraphElement>(null);

  const eventStore = useEventStore();

  const updateData = async (
    payload: Partial<Omit<Event, "id" | "createdAt" | "updatedAt">>,
  ) => {
    try {
      await eventStore.updateEvent(event.id, payload);
      await eventStore.fetchEventsByResponseId(event.responseId);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const deleteEvent = async () => {
    try {
      await eventStore.deleteEvent(event.id);
      await eventStore.fetchEventsByResponseId(event.responseId);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const getCalendarDate = (eventDate: string): DateArray => {
    const utcDate = dayjs.utc(eventDate);

    return [
      utcDate.year(),
      utcDate.month() + 1,
      utcDate.date(),
      utcDate.hour(),
      utcDate.minute(),
    ];
  };

  const generateICSFile = async () => {
    const eventData: EventAttributes = {
      start: getCalendarDate(event.fromDate),
      end: getCalendarDate(event.toDate),
      title: event.title,
      description: event.notes || "",
      location: event.address || "",
    };

    const { value } = createEvent(eventData);

    if (value) {
      const blob = new Blob([value], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${event.title}.ics`;
      link.click();

      URL.revokeObjectURL(url);
    }
  };

  const toggleDetails = () => setIsOpen(!isOpen);

  const handleContentChange = (
    ref: React.RefObject<HTMLElement>,
    key: string,
  ) => {
    if (ref.current) {
      const value = ref.current.innerText;

      updateData({ [key]: value });
    }
  };

  const handleLinkChange = (newLinks: string) => {
    setLinks(newLinks);
    updateData({ links: newLinks });
  };

  return (
    <Card className="w-full p-3 flex-col">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <div className="flex justify-between items-center">
            <div>
              <h3
                ref={titleRef}
                contentEditable
                className="text-default-700 text-lg font-bold"
                onBlur={() => handleContentChange(titleRef, "title")}
              >
                {event.title}
              </h3>
            </div>
            <div className="flex gap-1 h-full justify-center">
              <Button
                isIconOnly
                radius="full"
                size="sm"
                startContent={
                  <i className="mdi mdi-calendar text-primary text-lg" />
                }
                onPress={generateICSFile}
              />
              <Button
                isIconOnly
                color="danger"
                radius="full"
                size="sm"
                startContent={<i className="mdi mdi-delete text-lg" />}
                variant="shadow"
                onPress={() => deleteEvent()}
              />
              <Button
                isIconOnly
                color="primary"
                radius="full"
                size="sm"
                startContent={<i className="mdi mdi-dots-vertical text-lg" />}
                variant="shadow"
                onPress={toggleDetails}
              />
            </div>
          </div>
          {event.allDay ? (
            <p className="text-xs text-primary">Celý den</p>
          ) : isOpen ? (
            <>
              <p className="text-default-500 ml-1 mb-1">Datum</p>
              <div className="text-xs flex gap-2">
                <div className="flex items-center justify-center gap-1 bg-default-100 p-2 rounded-md">
                  <p className="text-primary">Od:</p>
                  <input
                    className="bg-transparent"
                    defaultValue={event.fromDate}
                    type="datetime-local"
                    onChange={({ target: { value: fromDate } }) =>
                      updateData({ fromDate })
                    }
                  />
                </div>
                <div className="flex items-center justify-center gap-1 bg-default-100 px-2 rounded-md">
                  <p className="text-primary">Do:</p>
                  <input
                    className="bg-transparent"
                    defaultValue={event.toDate}
                    type="datetime-local"
                    onChange={({ target: { value: toDate } }) =>
                      updateData({ toDate })
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-primary">
                {dayjs(event.fromDate).format("DD. MM. YYYY") ===
                dayjs(event.toDate).format("DD. MM. YYYY") ? (
                  <>
                    {dayjs(event.fromDate).format("DD. MM. YYYY")}{" "}
                    {dayjs(event.fromDate).format("HH:mm")} -{" "}
                    {dayjs(event.toDate).format("HH:mm")}
                  </>
                ) : (
                  <>
                    {dayjs(event.fromDate).format("DD. MM. YYYY HH:mm")} -{" "}
                    {dayjs(event.toDate).format("DD. MM. YYYY HH:mm")}
                  </>
                )}
              </p>
            </>
          )}

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                initial={{ height: 0, opacity: 0 }}
                style={{ overflow: "hidden" }}
                transition={{ duration: 0.3 }}
              >
                <div className="mt-4">
                  {event.notes && (
                    <div className="my-4">
                      <p className="text-default-500">Poznámky</p>
                      <p
                        ref={notesRef}
                        contentEditable
                        onBlur={() => handleContentChange(notesRef, "notes")}
                      >
                        {event.notes}
                      </p>
                    </div>
                  )}
                  <div className="my-4">
                    <p className="text-default-500">Soubory</p>
                    <SmallFilesDisplay ev={event} />
                  </div>
                  <div className="my-4">
                    <p className="text-default-500">Odkazy</p>
                    <EventLinkEditor
                      links={links}
                      onChange={handleLinkChange}
                    />
                  </div>
                  {event.address && (
                    <div className="my-4">
                      <p className="text-default-500">Adresa</p>
                      <p
                        ref={addressRef}
                        contentEditable
                        onBlur={() =>
                          handleContentChange(addressRef, "address")
                        }
                      >
                        {event.address}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
