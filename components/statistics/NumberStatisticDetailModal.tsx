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

import { StatisticDetailModalProps } from "@/interfaces/statistics";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const NumberStatisticDetailModal: FC<StatisticDetailModalProps> = ({
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

  const primaryColor = "#006fee";

  const [currentInterval, setCurrentInterval] = useState<string | null>(
    "last-week",
  );
  const [filteredData, setFilteredData] = useState<
    { time: string; number: number }[]
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

    const data = filteredValues.map((e, idx) => ({
      time: e.createdAt,
      number: idx + 1,
    }));

    setFilteredData(data);
  };

  const buttons = [
    { key: "today", title: "Dnes" },
    { key: "last-week", title: "Minulý týden" },
    { key: "last-month", title: "Minulý měsíc" },
    { key: "last-year", title: "Minulý rok" },
  ];

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
        data: filteredData.map((e) => ({
          x: dayjs(e.time).format(),
          y: e.number,
        })),
        color: primaryColor,
      },
    ],
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      title: {
        text: "Number",
      },
    },
    tooltip: {
      enabled: true,
    },
  };

  return (
    <Modal
      backdrop="opaque"
      className="w-1/2 transform translate-x-1/2"
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
                {filteredData.length > 0 ? (
                  <Chart
                    height={350}
                    options={chartOptions}
                    series={chartOptions.series}
                    type="area"
                  />
                ) : (
                  <div>No data available for the selected period.</div>
                )}
              </Card>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NumberStatisticDetailModal;
