export interface ContentRootLight {
  id: string;
  alias?: string;
  isRoot: boolean;
}

export enum ContentType {
  Text = "text",
  Image = "image",
  HTML = "html",
  ItemContent = "item_content",
  ListTextContent = "list_text_content",
  ListItemContent = "list_item_content",
}

export interface ContentItemProperty {
  key: string;
  contentId: string;
  id: string;
}

export interface ContentTypeSelect {
  type: ContentType;
  label: string;
  icon: string;
}

export interface Content {
  id: string;
  userId: string;

  isRoot: boolean;
  alias?: string;

  contentType?: ContentType;
  text?: string;
  image?: string;
  html?: string;
  listTextContent?: string[];
  itemContent?: ContentItemProperty[];
  listItemContent?: ContentItemProperty[][];

  createdAt: Date;
  updatedAt: Date;
}

export interface ContentTypeComponent {
  content: Content;
  refetch: () => Promise<void>;
  rootId: string;
}

export type InputTypeComponentHandler = Record<
  ContentType,
  React.FC<ContentTypeComponent>
>;
