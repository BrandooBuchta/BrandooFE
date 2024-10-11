import React, { FC, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Link,
  Button,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Switch,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import StatisticModal from "./StatisticModal";
import ForDevelopersStatistic from "./ForDevelopersStatistic";
import NumberStatisticDetailModal from "./NumberStatisticDetailModal";
import BooleanStatisticDetailModal from "./BooleanStatisticDetailModal";
import TimeStatisticDetailModal from "./TimeStatisticDetailModal";

import { Statistic, StatisticType } from "@/interfaces/statistics";
import useUserStore from "@/stores/user";
import { api } from "@/utils/api";

const ratioKeywords = ["poměr", "Poměr", "poměru", "Poměru", "Ratio", "ratio"];

interface StatisticProps {
  statistic: Statistic;
  refetch?: () => Promise<void>;
}

dayjs.extend(duration);

const StatisticCard: FC<StatisticProps> = ({ statistic, refetch }) => {
  const userStore = useUserStore();
  const { onOpenChange, isOpen, onOpen } = useDisclosure();
  const {
    onOpenChange: onOpenChangeDev,
    isOpen: isOpenDev,
    onOpen: onOpenDev,
  } = useDisclosure();
  const {
    onOpenChange: onOpenChangeDetail,
    isOpen: isOpenDetail,
    onOpen: onOpenDetail,
  } = useDisclosure();
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const [isPercentage, setIsPercentage] = useState<boolean>(
    ratioKeywords.some((e) => statistic.name.includes(e)) ||
      ratioKeywords.some((e) => statistic.description.includes(e)),
  );

  const deleteStatistic = async () => {
    try {
      await api.delete(`statistics/delete-statistic/${statistic.id}`);
      toast.success("Success!");

      refetch && (await refetch());
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const resetStatistic = async () => {
    try {
      await api.delete(`statistics/reset/${statistic.id}`);
      toast.success("Success!");

      refetch && (await refetch());
    } catch (error) {
      toast.error(`${error}`);
    } finally {
    }
  };

  const value = (type: StatisticType) => {
    switch (type) {
      case "time": {
        const timeValues = statistic.values.map((value) => {
          const [hours, minutes, seconds] = value.time.split(":").map(Number);

          return (hours * 3600 + minutes * 60 + seconds) * 1000; // převést čas na milisekundy
        });

        const totalMilliseconds = timeValues.reduce(
          (total, time) => total + time,
          0,
        );

        const averageTimeInMs = totalMilliseconds / timeValues.length;

        // Převod průměrného času zpět na HH:mm:ss
        const durationObject = dayjs.duration(averageTimeInMs);
        const averageTime = dayjs()
          .startOf("day")
          .add(durationObject)
          .format("HH:mm:ss");

        return (
          <p className="text-small text-default-500 font-bold text-xl">
            {averageTime}
          </p>
        );
      }
      case "text": {
        return <p>nic</p>;
      }
      case "number": {
        return (
          <p className="text-small text-default-500 font-bold text-xl">
            {statistic.values.length}
          </p>
        );
      }
      case "boolean": {
        const trueVals = statistic.values.filter((e) => e.boolean).length;
        const falseVals = statistic.values.filter((e) => !e.boolean).length;

        return (
          <div className="flex gap-1 items-center">
            <p className="text-default-500 font-bold text-xl flex gap-1">
              {isPercentage ? (
                <>
                  <span>{((falseVals / trueVals) * 100).toFixed(2)} %</span>
                </>
              ) : (
                <>
                  <span className="text-primary">{trueVals}</span>|
                  <span className="text-danger">{falseVals}</span>
                </>
              )}
            </p>
          </div>
        );
      }
    }
  };

  const getDetailsComponent = () => {
    switch (statistic.type) {
      case "boolean":
        return BooleanStatisticDetailModal;
      case "time":
        return TimeStatisticDetailModal;
      case "number":
      case "text":
        return NumberStatisticDetailModal;
    }
  };

  const Details = getDetailsComponent();

  return (
    <Card
      className={`w-full p-1 cursor-pointer ${
        isDark
          ? "bg-stone-950 border border-gray-700 shadow-none"
          : "bg-white shadow-xl"
      }`}
      onClick={() => onOpenDetail()}
    >
      <StatisticModal
        isOpen={isOpen}
        refetch={refetch}
        statistic={statistic}
        onOpenChange={onOpenChange}
      />
      <ForDevelopersStatistic
        isOpen={isOpenDev}
        statistic={statistic}
        onOpenChange={onOpenChangeDev}
      />
      <Details
        isOpen={isOpenDetail}
        statistic={statistic}
        onOpenChange={onOpenChangeDetail}
      />
      <CardHeader className="flex gap-3">
        <Button
          isIconOnly
          className="w-12 h-12 pointer-events-none mr-1"
          color="primary"
          variant="shadow"
        >
          <i className={`mdi ${statistic.icon || "mdi-chart-box"} text-2xl`} />
        </Button>
        <div className="flex flex-col">
          <p className="text-md">{statistic.name}</p>
          <div className="flex gap-2 items-center">
            {statistic.type === "boolean" && (
              <Switch
                color="primary"
                isSelected={isPercentage}
                size="sm"
                thumbIcon={({ isSelected, className }) =>
                  isSelected ? (
                    <i className={`${className} mdi mdi-slash-forward`} />
                  ) : (
                    <i className={`${className} mdi mdi-percent`} />
                  )
                }
                onClick={() => setIsPercentage((e) => !e)}
              />
            )}
            {value(statistic.type)}
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <p>{statistic.description}</p>
      </CardBody>
      <CardFooter
        className={`gap-3 ${userStore.isDevMode ? "justify-between" : "justify-end"}`}
      >
        {userStore.isDevMode && (
          <Link
            isExternal
            showAnchorIcon
            className="cursor-pointer"
            onPress={() => onOpenDev()}
          >
            Pro vývojáře
          </Link>
        )}
        <div className="flex gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                aria-label="menu"
                color="primary"
                radius="full"
                size="sm"
                variant="shadow"
              >
                <span className="mdi mdi-dots-vertical text-lg" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Dropdown menu with description"
              className="p-2 mx-3"
              variant="faded"
            >
              <DropdownSection>
                <DropdownItem
                  key="detail"
                  description="Detail statistiky"
                  startContent={<i className="mdi mdi-eye text-xl mr-2" />}
                  onPress={() => onOpenDetail()}
                >
                  Detail
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  description="Upravení jména a popisu"
                  startContent={<i className="mdi mdi-pencil text-xl mr-2" />}
                  onPress={() => onOpen()}
                >
                  Upravit
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  description="Smazání celé statistiky"
                  startContent={<i className="mdi mdi-delete text-xl mr-2" />}
                  onPress={() => deleteStatistic()}
                >
                  Smazat
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  description="Vynulování celé statistiky"
                  startContent={<i className="mdi mdi-restart text-xl mr-2" />}
                  onPress={() => resetStatistic()}
                >
                  Resetovat
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StatisticCard;
