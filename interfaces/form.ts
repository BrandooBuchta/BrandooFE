import { InputType } from "@/components/contacts/input-types/InputTypes";

export interface FormPropertyType {
  id?: string;
  formId?: string;
  userId?: string;
  propertyType: InputType;
  label: string;
  key: string;
  options?: string[];
  position: number;
  required: boolean;
}

export interface FormWithProperties {
  id?: string;
  userId?: string;
  name: string;
  description: string;
  properties: FormPropertyType[];
  formPropertiesIds: string[];
}

export interface PropertyType {
  key: string;
  label: string;
  icon: string;
}

export type PropertyTypes = PropertyType[];

export interface FormTable {
  table: Table;
  pagination: Pagination;
}

export interface Table {
  header: Header[];
  body: Response[];
}

export interface Header {
  key: string;
  label: string;
  position: number;
  propertyType: InputType;
}

export interface Response {
  [key: string]: string | string[] | boolean;
  seen: boolean;
  createdAt: string;
  labels: string[];
  id: string;
}

export interface DetailedResponse {
  createdAt: string;
  alias: string;
  labels: string[];
  id: string;
  response: {
    value: string | string[] | boolean;
    label: string;
    propertyType: InputType;
  }[];
}


export interface Pagination {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}
