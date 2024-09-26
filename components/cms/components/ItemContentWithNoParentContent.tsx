import React, { FC } from "react";
import { Card } from "@nextui-org/react";
import { useDrag, useDrop } from "react-dnd";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";

import ItemProperty from "../ItemProperty";

import { Content, ContentItemProperty } from "@/interfaces/content";
import useContentStore from "@/stores/cms";
import AsyncButton from "@/components/UI/AsyncButton";

interface ItemContentWithNoParentContentProps {
  properties: ContentItemProperty[];
  index: number;
  content: Content;
  refetch: () => Promise<void>;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onDrop: () => void;
  rootId: string;
}

const ItemContentWithNoParentContent: FC<
  ItemContentWithNoParentContentProps
> = ({ properties, index, content, refetch, moveItem, onDrop, rootId }) => {
  const contentStore = useContentStore();
  const { theme } = useTheme();

  const addProperty = async () => {
    try {
      await contentStore.createListItemProperty(content.id, index, rootId);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const [, ref] = useDrag({
    type: "ITEM_PROPERTY",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "ITEM_PROPERTY",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveItem(item.index, index);
        item.index = index; // Aktualizujeme index položky, aby se předešlo více pohybům
      }
    },
    drop: () => {
      onDrop(); // Zavoláme onDrop po dropnutí
    },
  });

  const deleteItem = async () => {
    try {
      await contentStore.deleteItemFromListItemContent(content.id, index);
      await refetch();
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <Card ref={(node) => ref(drop(node))} className={`mx-5 mt-5 px-3 pb-6`}>
      <div className="flex justify-center">
        <i className="mdi mdi-drag-horizontal text-2xl h-[20px] cursor-pointer text-default-500" />
      </div>

      <div className="flex gap-2 items-center">
        <p className="font-bold mt-3 mb-1 ml-2">Vlastnosti položky</p>
        <AsyncButton
          isIconOnly
          color="danger"
          endContent={<i className="mdi mdi-delete text-lg" />}
          radius="full"
          size="sm"
          variant="shadow"
          onPress={() => deleteItem()}
        />
      </div>
      {properties.map((e, idx) => (
        <ItemProperty
          key={idx}
          contentId={content.id}
          isLast={properties.length - 1 === idx}
          property={e}
          refetch={refetch}
          rootId={rootId}
        />
      ))}
      <div className="flex justify-center mt-5">
        <AsyncButton
          color="primary"
          endContent={<i className="mdi mdi-plus text-2xl" />}
          variant="shadow"
          onPress={() => addProperty()}
        >
          Přidat vlastnost
        </AsyncButton>
      </div>
    </Card>
  );
};

export default ItemContentWithNoParentContent;
