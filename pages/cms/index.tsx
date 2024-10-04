import { FC, useEffect, useState } from "react";
import { Card, Spinner } from "@nextui-org/react";

import RootContentCard from "@/components/cms/RootContentCard";
import useUserStore from "@/stores/user";
import useContentStore from "@/stores/cms";
import AsyncButton from "@/components/UI/AsyncButton";

const CMS: FC = () => {
  const [isClient, setIsClient] = useState<boolean>(false);

  const userStore = useUserStore();
  const contentStore = useContentStore();

  const createContent = async () => {
    if (!userStore.user?.id) return;
    try {
      await contentStore.createRootContent(userStore.user.id);
      await contentStore.fetchContentsByUserId(userStore.user.id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    isClient &&
      userStore.user?.id &&
      contentStore.fetchContentsByUserId(userStore.user?.id);
  }, [isClient]);

  if (contentStore.isLoading) {
    return (
      <div className="w-full flex justify-center">
        <Spinner className="mt-[250px]" size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {contentStore.contents.map((e, index) => (
        <Card key={e.id} className="p-3">
          <RootContentCard
            alias={e.alias}
            id={e.id}
            index={index}
            isRoot={e.isRoot}
            rootId={e.id}
          />
        </Card>
      ))}
      <div className="grid place-content-center">
        <AsyncButton
          isIconOnly
          color="primary"
          radius="full"
          size="lg"
          startContent={<i className="mdi mdi-plus text-2xl" />}
          variant="shadow"
          onPress={() => createContent()}
        />
      </div>
    </div>
  );
};

export default CMS;
