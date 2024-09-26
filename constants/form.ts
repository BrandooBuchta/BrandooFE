import { PropertyTypes } from "@/interfaces/form";

export const PROPERTY_TYPES: PropertyTypes = [
  {
    key: "short_text",
    label: "Stručná odpověď",
    icon: "text-short",
  },
  {
    key: "long_text",
    label: "Delší odpověď",
    icon: "text-long",
  },
  {
    key: "boolean",
    label: "Ano/Ne",
    icon: "toggle-switch",
  },
  // {
  //   key: "string_array",
  //   label: "Seznam textů",
  //   icon: "format-list-bulleted",
  // },
  {
    key: "radio",
    label: "Výběr jedné možnosti",
    icon: "radiobox-marked",
  },
  {
    key: "checkbox",
    label: "Výběr více možností",
    icon: "checkbox-marked",
  },
  {
    key: "selection",
    label: "Výběr z možností",
    icon: "menu-down",
  },
  {
    key: "time",
    label: "Čas",
    icon: "timer",
  },
  {
    key: "date_time",
    label: "Datum",
    icon: "calendar-blank",
  },
  {
    key: "file",
    label: "Soubor",
    icon: "file",
  },
];
