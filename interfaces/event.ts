import { DateValue } from "@nextui-org/react";

export interface Event {
  id: string;
  responseId: string;
  userId: string;
  title: string;
  notes: string;
  fromDate: string;
  toDate: string;
  allDay: boolean;
  links?: string;
  address?: string;
  files: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventCreate {
  responseId: string;
  userId: string;
  title: string;
  notes: string;
  fromDate: string;
  toDate: string;
  allDay: boolean;
  links?: string;
  address?: string;
  files?: string[];
  createdAt: string;
  updatedAt: string;
}
