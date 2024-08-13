import React, { FC, useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

import { StatisticDetailModalProps } from "@/interfaces/statistics";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TimeStatisticDetailModal: FC<StatisticDetailModalProps> = ({
  isOpen,
  onOpenChange,
  statistic,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const slideInFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  const [currentInterval, setCurrentInterval] = useState<string | null>(
    "last-week",
  );
  const [filteredData, setFilteredData] = useState<
    { createdAt: string; time: string }[]
  >([]);

  useEffect(() => {
    if (statistic) {
      filterData(currentInterval);
    }
  }, [currentInterval, statistic]);

  const filterData = (interval: string | null) => {
    if (!statistic) return;

    const now = dayjs();
    let filteredValues = statistic.values;

    switch (interval) {
      case "today":
        filteredValues = statistic.values.filter((value) =>
          dayjs(value.createdAt).isSame(now, "day"),
        );
        break;
      case "last-week":
        filteredValues = statistic.values.filter((value) =>
          dayjs(value.createdAt).isAfter(now.subtract(1, "week")),
        );
        break;
      case "last-month":
        filteredValues = statistic.values.filter((value) =>
          dayjs(value.createdAt).isAfter(now.subtract(1, "month")),
        );
        break;
      case "last-year":
        filteredValues = statistic.values.filter((value) =>
          dayjs(value.createdAt).isAfter(now.subtract(1, "year")),
        );
        break;
      default:
        filteredValues = statistic.values;
    }

    const data = filteredValues.map((e) => ({
      createdAt: e.createdAt,
      time: e.time,
    }));

    setFilteredData(data);
  };

  const buttons = [
    { key: "today", title: "Dnes" },
    { key: "last-week", title: "Minulý týden" },
    { key: "last-month", title: "Minulý měsíc" },
    { key: "last-year", title: "Minulý rok" },
  ];

  const primaryColor = "#006fee";

  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: true,
      },
      background: "transparent",
    },
    theme: {
      mode: isDark ? "dark" : "light",
    },
    title: {
      text: "Sample Area Chart",
      align: "left",
    },
    stroke: {
      curve: "smooth",
    },
    series: [
      {
        name: "Sample Data",
        data: filteredData.map((e) => [
          new Date(e.createdAt).getTime(),
          new Date(`1970-01-01T${e.time}Z`).getTime() / 1000,
        ]),
        color: primaryColor,
      },
    ],
    xaxis: {
      type: "datetime",
      title: {
        text: "Created At",
      },
    },
    yaxis: {
      title: {
        text: "Time (seconds)",
      },
      labels: {
        formatter: (val) =>
          dayjs()
            .startOf("day")
            .second(val as number)
            .format("HH:mm:ss"),
      },
    },
    tooltip: {
      enabled: true,
      x: {
        format: "dd MMM yyyy HH:mm:ss",
      },
      y: {
        formatter: (val) =>
          dayjs()
            .startOf("day")
            .second(val as number)
            .format("HH:mm:ss"),
      },
    },
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
            <ModalHeader>
              <span className="text-default-800 font-bold text-xl">
                {statistic?.name}
              </span>
            </ModalHeader>
            <ModalBody>
              <span className="text-default-800 font-bold text-xl">Title</span>
              <ButtonGroup className="w-full my-2">
                {buttons.map((e) => (
                  <Button
                    key={e.key}
                    className="w-1/4"
                    color={currentInterval === e.key ? "primary" : "default"}
                    variant="shadow"
                    onPress={() => setCurrentInterval(e.key)}
                  >
                    {e.title}
                  </Button>
                ))}
              </ButtonGroup>
              <Card className="p-3">
                <Chart
                  height={350}
                  options={chartOptions}
                  series={chartOptions.series}
                  type="area"
                />
              </Card>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TimeStatisticDetailModal;
