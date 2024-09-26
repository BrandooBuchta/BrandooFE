import React, { FC, useState, useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { cloneDeep, isEqual } from "lodash"; // Přidali jsme isEqual pro porovnávání

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

  // Uložíme 2D pole, kde každé pole reprezentuje itemContent
  const [items, setItems] = useState<ContentItemProperty[][]>(
    content.listItemContent || [],
  );

  // Ref pro uložení původního pole
  const originalItemsRef = useRef<ContentItemProperty[][]>(cloneDeep(items));

  // Přidat položku
  const addItem = async () => {
    try {
      await contentStore.createListItem(content.id);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  // Funkce pro přesun položky
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const updatedItems = cloneDeep(items); // Hluboká kopie položek
    const draggedItem = updatedItems[dragIndex]; // Položka, která se přesouvá

    // Přesuneme položku na nové místo
    updatedItems.splice(dragIndex, 1);
    updatedItems.splice(hoverIndex, 0, draggedItem);

    setItems(updatedItems);
  };

  // Funkce volaná po dropnutí
  const handleDrop = () => {
    const originalItems = originalItemsRef.current;
    const currentItems = items;

    // Zjistíme, které položky byly prohozeny
    const newOrder: number[] = [];

    originalItems.forEach((item, originalIndex) => {
      const newIndex = currentItems.findIndex((currentItem) =>
        isEqual(currentItem, item),
      );

      newOrder[originalIndex] = newIndex;
    });

    console.log("newOrder after drop:", newOrder);

    // Odeslat nové pořadí na backend
    contentStore
      .reorderListItem(content.id, newOrder)
      .then(() => refetch()) // Po úspěšné aktualizaci znovu získat obsah
      .catch((error) => console.error("Error reordering items:", error));

    // Aktualizovat referenci na původní pořadí
    originalItemsRef.current = cloneDeep(items);
  };

  useEffect(() => {
    content.listItemContent && setItems(content.listItemContent);
  }, [content]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {items.map((e, index) => (
          <ItemContentWithNoParentContent
            key={e[0] ? e[0].id : `${content.id}-${index}`} // Použití e[0].id jako klíče, aby React správně renderoval komponenty
            content={content}
            index={index}
            moveItem={moveItem}
            properties={e}
            refetch={refetch}
            rootId={rootId}
            onDrop={handleDrop} // Voláme handleDrop při dokončení přesunu
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
    </DndProvider>
  );
};

export default ListItemContent;
