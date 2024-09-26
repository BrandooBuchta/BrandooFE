import { Button, Tab, Tabs } from "@nextui-org/react";
import { FC, useEffect } from "react";

import EventCard from "./EventCard";

import useEventStore from "@/stores/event";
import { DetailedResponse } from "@/interfaces/form";

interface EventDisplayGridProps {
  response: DetailedResponse;
  userId?: string;
}

const EventDisplayGrid: FC<EventDisplayGridProps> = ({ response }) => {
  const eventStore = useEventStore();

  const createEvent = async (id: string) => {
    try {
      await eventStore.createEvent(response);
      await eventStore.fetchEventsByResponseId(id);
    } catch (e) {}
  };

  useEffect(() => {
    eventStore.fetchEventsByResponseId(response.id);
  }, []);

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <p className="text-lg font-bold text-default-700">Události</p>
        <div className="flex justify-center items-center gap-2">
          <Button
            color="primary"
            size="sm"
            startContent={<i className="mdi mdi-plus text-lg" />}
            variant="shadow"
            onClick={() => createEvent(response.id)}
          >
            Přidat událost
          </Button>
          <Tabs
            aria-label="Options"
            color="primary"
            size="sm"
            variant="bordered"
            // onSelectionChange={(e) => {
            //   if (e === "asc") {
            //     setSortOrder("asc");
            //   } else {
            //     setSortOrder("desc");
            //   }
            // }}
          >
            <Tab
              key="desc"
              title={
                <div className="flex items-center space-x-2">
                  <span>Nejnovější</span>
                </div>
              }
            />
            <Tab
              key="asc"
              title={
                <div className="flex items-center space-x-2">
                  <span>Nejstarší</span>
                </div>
              }
            />
          </Tabs>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-y-2 mt-2">
        {eventStore.events.map((ev) => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>
    </div>
  );
};

export default EventDisplayGrid;
