import { create } from "zustand";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import dayjs from "dayjs";

import useUserStore from "./user";

import { api } from "@/utils/api";
import { Event } from "@/interfaces/event";
import { DetailedResponse } from "@/interfaces/form";

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  fetchEventById: (eventId: string) => Promise<void>;
  createEvent: (response: DetailedResponse) => Promise<void>;
  updateEvent: (
    eventId: string,
    updateData: Partial<Omit<Event, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  fetchEventsByResponseId: (responseId: string) => Promise<void>;
  fetchEventsByUserId: (userId: string) => Promise<void>;
}

const useEventStore = create<EventState>((set) => ({
  events: [],
  currentEvent: null,
  fetchEventById: async (eventId: string) => {
    const privateKey = Cookies.get("privateKey");

    if (!privateKey) return;

    try {
      const { data } = await api.get<Event>(`event/${eventId}`, {
        headers: {
          "X-Private-Key": privateKey,
        },
      });

      set(() => ({
        currentEvent: data,
      }));
    } catch (error) {
      toast.error(`Error fetching event: ${error}`);
    }
  },
  createEvent: async (response) => {
    const userStore = useUserStore.getState();

    try {
      await api.post<Event>("event", {
        responseId: response.id,
        userId: userStore.user?.id,
        title: response.alias
          ? `Schůzka s ${response.alias}`
          : "Název události",
        notes: "Poznámky",
        fromDate: dayjs().toISOString(),
        toDate: dayjs().toISOString(),
        allDay: false,
        links: "",
        address: "Adresa",
        files: [],
      });

      toast.success("Event created successfully");
    } catch (error) {
      toast.error(`Error creating event: ${error}`);
    }
  },
  updateEvent: async (eventId, updateData) => {
    try {
      await api.put<Event>(`event/${eventId}`, updateData);
    } catch (error) {
      toast.error(`Error updating event: ${error}`);
    }
  },
  deleteEvent: async (eventId) => {
    const privateKey = Cookies.get("privateKey");

    if (!privateKey) return;

    try {
      await api.delete(`event/${eventId}`, {
        headers: {
          "X-Private-Key": privateKey,
        },
      });

      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error(`Error deleting event: ${error}`);
    }
  },
  fetchEventsByResponseId: async (responseId: string) => {
    const privateKey = Cookies.get("privateKey");

    if (!privateKey) return;

    try {
      const { data } = await api.get<Event[]>(
        `event/events/response/${responseId}`,
        {
          headers: {
            "X-Private-Key": privateKey,
          },
        },
      );

      set(() => ({
        events: data,
      }));
    } catch (error) {
      toast.error(`Error fetching events by response: ${error}`);
    }
  },
  fetchEventsByUserId: async (userId: string) => {
    const privateKey = Cookies.get("privateKey");

    if (!privateKey) return;

    try {
      const { data } = await api.get<Event[]>(`event/events/user/${userId}`, {
        headers: {
          "X-Private-Key": privateKey,
        },
      });

      set(() => ({
        events: data,
      }));
    } catch (error) {
      toast.error(`Error fetching events by user: ${error}`);
    }
  },
}));

export default useEventStore;
