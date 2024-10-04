import React, { FC, useState, useRef, useEffect } from "react";
import { cloneDeep, isEqual } from "lodash";

import ItemContentWithNoParentContent from "./ItemContentWithNoParentContent";

import {
  ContentItemProperty,
  ContentTypeComponent,
} from "@/interfaces/content";
import useContentStore from "@/stores/cms";
import AsyncButton from "@/components/UI/AsyncButton";

const ListItemContent: FC<ContentTypeComponent> = ({
  content,
  refetch,
  rootId,
}) => {
  const contentStore = useContentStore();

  const [items, setItems] = useState<ContentItemProperty[][]>(
    content.listItemContent || [],
  );

  const [isAllCardsShouldBeClosed, setIsAllCardsShouldBeClosed] =
    useState<boolean>(false);

  const originalItemsRef = useRef<ContentItemProperty[][]>(cloneDeep(items));

  const addItem = async () => {
    try {
      await contentStore.createListItem(content.id);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const updatedItems = cloneDeep(items);
    const draggedItem = updatedItems[dragIndex];

    updatedItems.splice(dragIndex, 1);
    updatedItems.splice(hoverIndex, 0, draggedItem);

    setItems(updatedItems);
  };

  const handleDrop = () => {
    const originalItems = originalItemsRef.current;
    const currentItems = items;

    const newOrder: number[] = [];

    originalItems.forEach((item, originalIndex) => {
      const newIndex = currentItems.findIndex((currentItem) =>
        isEqual(currentItem, item),
      );

      newOrder[originalIndex] = newIndex;
    });

    contentStore
      .reorderListItem(content.id, newOrder)
      .then(() => refetch())
      .catch((error) => console.error("Error reordering items:", error));

    originalItemsRef.current = cloneDeep(items);
    setIsAllCardsShouldBeClosed(false);
  };

  useEffect(() => {
    content.listItemContent && setItems(content.listItemContent);
  }, [content]);

  return (
    <div>
      <div>
        {items.map((e, index) => (
          <ItemContentWithNoParentContent
            key={e[0] ? e[0].id : `${content.id}-${index}`}
            content={content}
            index={index}
            isAllCardsShouldBeClosed={isAllCardsShouldBeClosed}
            moveItem={moveItem}
            properties={e}
            refetch={refetch}
            rootId={rootId}
            setIsAllCardsShouldBeClosed={setIsAllCardsShouldBeClosed}
            onDrop={handleDrop}
          />
        ))}
      </div>
      <div className="flex justify-center mt-5">
        <AsyncButton
          color="primary"
          endContent={<i className="mdi mdi-plus text-2xl" />}
          variant="shadow"
          onPress={() => addItem()}
        >
          Přidat položku
        </AsyncButton>
      </div>
    </div>
  );
};

export default ListItemContent;
