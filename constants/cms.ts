import HTMLContent from "@/components/cms/components/HTMLContent";
import ImageContent from "@/components/cms/components/ImageContent";
import ItemContent from "@/components/cms/components/ItemContent";
import ListItemContent from "@/components/cms/components/ListItemContent";
import ListTextContent from "@/components/cms/components/ListTextContent";
import TextContent from "@/components/cms/components/TextContent";
import { ContentType, ContentTypeComponent, ContentTypeSelect, InputTypeComponentHandler } from "@/interfaces/content";

export const CONTENT_TYPES: ContentTypeSelect[] = [
  {
    type: ContentType.Text,
    label: "Jednoduchý Text",
    icon: "text-box",
  },
  {
    type: ContentType.ListTextContent,
    label: "List Textu",
    icon: "format-list-bulleted-square",
  },
  {
    type: ContentType.Image,
    label: "Obrázek",
    icon: "image",
  },
  {
    type: ContentType.HTML,
    label: "Složitý text",
    icon: "code-block-tags",
  },
  {
    type: ContentType.ItemContent,
    label: "Položka",
    icon: "card",
  },
  {
    type: ContentType.ListItemContent,
    label: "List Položek",
    icon: "list-box",
  },
];

export const CONTENT_COMPONENTS: InputTypeComponentHandler = {
  [ContentType.HTML]: HTMLContent,
  [ContentType.Image]: ImageContent,
  [ContentType.ItemContent]: ItemContent,
  [ContentType.ListItemContent]: ListItemContent,
  [ContentType.ListTextContent]: ListTextContent,
  [ContentType.Text]: TextContent,
};

