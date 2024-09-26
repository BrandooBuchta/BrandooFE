import React, { FC } from "react";
import { Card } from "@nextui-org/react";

import ItemProperty from "../ItemProperty";

import { Content } from "@/interfaces/content";
import useContentStore from "@/stores/cms";
import AsyncButton from "@/components/UI/AsyncButton";

interface ItemContentProps {
  content: Content;
  refetch: () => Promise<void>;
  rootId: string;
}

const ItemContent: FC<ItemContentProps> = ({ content, refetch, rootId }) => {
  const contentStore = useContentStore();

  const addProperty = async () => {
    try {
      await contentStore.createProperty(content.id, rootId);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className={`mx-5 mt-5 px-3 pb-3 bg-default-100 pb-6`}>
      <p className="font-bold mt-3 mb-1 ml-2">Vlastnosti položky</p>
      {content.itemContent &&
        content.itemContent.map(
          (e, idx) =>
            content.itemContent && (
              <ItemProperty
                key={idx}
                contentId={content.id}
                isLast={content.itemContent.length - 1 === idx}
                property={e}
                refetch={refetch}
                rootId={rootId}
              />
            ),
        )}
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

export default ItemContent;
