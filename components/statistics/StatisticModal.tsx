import React, { FC } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

import IconSelect from "./IconSelect";

import { api } from "@/utils/api";
import useUserStore from "@/stores/user";
import { Statistic } from "@/interfaces/statistics";

interface StatisticProps {
  onOpenChange: () => void;
  isOpen: boolean;
  statistic?: Statistic;
  refetch?: () => Promise<void>;
}

interface FormValues {
  name: string;
  description: string;
  type: string;
  icon: string;
}

const StatisticModal: FC<StatisticProps> = ({
  isOpen,
  onOpenChange,
  statistic,
  refetch,
}) => {
  const { control, handleSubmit, setValue, reset, getValues } =
    useForm<FormValues>({
      defaultValues: statistic
        ? {
            name: statistic.name,
            description: statistic.description,
            icon: statistic.icon,
            type: statistic.type,
          }
        : {},
    });

  const userStore = useUserStore();

  const types = [
    {
      name: "Number",
      value: "number",
    },
    {
      name: "Poměr | Ano/Ne",
      value: "boolean",
    },
    {
      name: "Time",
      value: "time",
    },
  ];

  const handleIconChange = (icon: string) => {
    setValue("icon", icon);
  };

  const createStatistic = async (data: FormValues) => {
    try {
      if (statistic) {
        await api.put(`statistics/update-statistic/${statistic.id}`, data);
      } else {
        await api.post(`statistics/new-statistic/${userStore.user?.id}`, data);
      }
      toast.success("Success!");

      refetch && (await refetch());
    } catch (error) {
      toast.error(`${error}`);
    } finally {
    }
  };

  const onSubmit = async (data: FormValues) => {
    await createStatistic(data);
    reset(); // Reset the form after submission
    onOpenChange(); // Close the modal after submission
  };

  const slideInFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  return (
    <Modal
      backdrop="opaque"
      className="lg:w-1/2 w-full transform lg:translate-x-1/2"
      isOpen={isOpen}
      motionProps={{
        initial: "hidden",
        animate: "visible",
        exit: "hidden",
        variants: slideInFromRight,
        transition: { duration: 0.3 },
      }}
      size="full"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="p-5">
        {(onClose) => (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1 text-2xl">
                {statistic ? "Update" : "Create"} Statistic
              </ModalHeader>
              <ModalBody>
                <div className="mb-1b  ">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input
                        className="mb-2"
                        color="primary"
                        label="Name"
                        variant="bordered"
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <Textarea
                        color="primary"
                        label="Description"
                        variant="bordered"
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select
                        className="max-w-full"
                        color="primary"
                        label="Type"
                        placeholder="Select type"
                        variant="bordered"
                        {...field}
                        defaultSelectedKeys={[getValues().type]}
                      >
                        {types.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <IconSelect
                    defaultInputValue={getValues().icon}
                    onIconChange={handleIconChange}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit" variant="flat">
                  {statistic ? "Update" : "Create"}
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => {
                    onClose();
                    reset(); // Reset the form when closing the modal
                  }}
                >
                  Close
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default StatisticModal;
