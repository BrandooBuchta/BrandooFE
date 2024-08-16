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

import { StatisticDetailModalProps } from "@/interfaces/statistics";

// Dynamically import the chart to avoid server-side rendering issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const NumberStatisticDetailModal: FC<StatisticDetailModalProps> = ({
  isOpen,
  onOpenChange,
  statistic,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

    const now = new Date();
    let filteredValues = statistic.values;

    switch (interval) {
      case "today":
        filteredValues = statistic.values.filter(
          (value) =>
            new Date(value.createdAt).toDateString() === now.toDateString(),
        );
        break;
      case "last-week":
        filteredValues = statistic.values.filter(
          (value) =>
            new Date(value.createdAt) >
            new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        );
        break;
      case "last-month":
        filteredValues = statistic.values.filter(
          (value) =>
            new Date(value.createdAt) >
            new Date(now.setMonth(now.getMonth() - 1)),
        );
        break;
      case "last-year":
        filteredValues = statistic.values.filter(
          (value) =>
            new Date(value.createdAt) >
            new Date(now.setFullYear(now.getFullYear() - 1)),
        );
        break;
      default:
        filteredValues = statistic.values;
    }

    const data = filteredValues.map((e, idx) => {
      const date = new Date(e.createdAt);
      // Convert to ISO string, preserving the local timezone offset
      const time = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000,
      ).toISOString();

      return {
        time, // Store as string
        number: idx + 1,
      };
    });

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
          x: new Date(e.time), // Convert string back to Date for the chart
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
      className="lg:w-1/2 w-full transform lg:translate-x-1/2"
      isOpen={isOpen}
      motionProps={{
        initial: "hidden",
        animate: "visible",
        exit: "hidden",
        variants: {
          hidden: { opacity: 0, x: 100 },
          visible: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 100 },
        },
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
