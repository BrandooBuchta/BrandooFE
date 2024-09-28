import React, { FC } from "react";
import { Card, CardHeader, Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import dayjs from "dayjs";

import NumberStatisticDetailModal from "./NumberStatisticDetailModal";
import BooleanStatisticDetailModal from "./BooleanStatisticDetailModal";
import TimeStatisticDetailModal from "./TimeStatisticDetailModal";

import { Statistic, StatisticType } from "@/interfaces/statistics";

interface MiniStatisticCardProps {
  statistic: Statistic;
}

const MiniStatisticCard: FC<MiniStatisticCardProps> = ({ statistic }) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

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
              <span className="text-primary">{trueVals}</span>|
              <span className="text-danger">{falseVals}</span>
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
      className={`w-full p-1 mt-4 cursor-pointer ${
        isDark
          ? "bg-stone-950 border border-gray-700 shadow-none"
          : "bg-white shadow-xl"
      }`}
    >
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
          {value(statistic.type)}
        </div>
      </CardHeader>
    </Card>
  );
};

export default MiniStatisticCard;
