import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
  useRef,
} from "react";
import { Button, Card } from "@nextui-org/react";
import { useDrag, useDrop } from "react-dnd";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

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
  isAllCardsShouldBeClosed: boolean;
  setIsAllCardsShouldBeClosed: Dispatch<SetStateAction<boolean>>;
}

const ItemContentWithNoParentContent: FC<
  ItemContentWithNoParentContentProps
> = ({
  properties,
  index,
  content,
  refetch,
  moveItem,
  onDrop,
  rootId,
  isAllCardsShouldBeClosed,
  setIsAllCardsShouldBeClosed,
}) => {
  const contentStore = useContentStore();
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
  const indexRef = useRef<number>(index); // Store the initial index

  const shouldBeOpened = isAllCardsShouldBeClosed ? false : isCardOpen;
  const cardNo = `Položka ${indexRef.current + 1}`; // Use ref for card number

  const addProperty = async () => {
    try {
      await contentStore.createListItemProperty(content.id, index, rootId);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const [{ isDragging }, ref] = useDrag({
    type: "ITEM_PROPERTY",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Close all cards, including the dragged one, as soon as dragging starts
  useEffect(() => {
    if (isDragging) {
      setIsAllCardsShouldBeClosed(true); // Close all cards
      setIsCardOpen(false); // Explicitly close the dragged item
    }
  }, [isDragging]);

  const [, drop] = useDrop({
    accept: "ITEM_PROPERTY",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveItem(item.index, index);
        item.index = index;
      }
    },
    drop: () => {
      onDrop();
    },
  });

  // Update indexRef only after refetch
  useEffect(() => {
    indexRef.current = index; // Update the ref with the new index after refetch
  }, [index]); // Ensure this runs only after the refetch has completed and the index is updated

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

      <div className="flex gap-2 items-center py-2 justify-between">
        <div className="flex items-center">
          <p className="font-bold mb-1 mx-2">{cardNo}</p>{" "}
          {/* Display using ref */}
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
        <Button
          isIconOnly
          className="mx-1"
          color="primary"
          endContent={
            <i
              className={`mdi mdi-chevron-${shouldBeOpened ? "up" : "down"} text-3xl`}
            />
          }
          radius="full"
          variant={shouldBeOpened ? "solid" : "light"}
          onClick={() => setIsCardOpen((prev) => !prev)}
        />
      </div>

      <AnimatePresence>
        {shouldBeOpened && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ItemContentWithNoParentContent;
