import { FC, useEffect, useState } from "react";
import { Button, ButtonGroup, useDisclosure } from "@nextui-org/react";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import StatisticCard from "@/components/statistics/StatisticCard";
import { api, setAuthTokenHeader } from "@/utils/api";
import useUserStore from "@/stores/user";
import { Statistic } from "@/interfaces/statistics";
import StatisticModal from "@/components/statistics/StatisticModal";

const Statistics: FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [filteredStatistics, setFilteredStatistics] = useState<Statistic[]>([]);
  const [currentInterval, setCurrentInterval] = useState<string | null>(
    "last-week",
  );
  const userStore = useUserStore();
  const { onOpenChange, isOpen, onOpen } = useDisclosure();

  const getUsersStatistics = async () => {
    try {
      if (userStore.token?.authToken) {
        setAuthTokenHeader(userStore.token?.authToken);
      }

      const { data: usersStatistics } = await api.get<Statistic[]>(
        `statistics/get-users-statistics/${userStore.user?.id}`,
      );

      setStatistics(usersStatistics);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    getUsersStatistics();
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    filterStatistics(currentInterval);
  }, [currentInterval, statistics]);

  const filterStatistics = (interval: string | null) => {
    const now = dayjs();
    let filteredValues: Statistic[] = statistics.map((stat) => ({
      ...stat,
      values: stat.values.filter((value) => {
        switch (interval) {
          case "today":
            return dayjs(value.createdAt).isSame(now, "day");
          case "last-week":
            return dayjs(value.createdAt).isAfter(now.subtract(1, "week"));
          case "last-month":
            return dayjs(value.createdAt).isAfter(now.subtract(1, "month"));
          case "last-year":
            return dayjs(value.createdAt).isAfter(now.subtract(1, "year"));
          default:
            return true;
        }
      }),
    }));

    // Filter out statistics with no values after filtering
    // filteredValues = filteredValues.filter((stat) => stat.values.length > 0);

    setFilteredStatistics(filteredValues);
  };

  const buttons = [
    { key: "today", title: "Dnes" },
    { key: "last-week", title: "Minulý týden" },
    { key: "last-month", title: "Minulý měsíc" },
    { key: "last-year", title: "Minulý rok" },
  ];

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col m-3">
      <ButtonGroup className="mb-5">
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
      <div className="flex gap-5 flex-wrap">
        <StatisticModal
          isOpen={isOpen}
          refetch={getUsersStatistics}
          onOpenChange={onOpenChange}
        />
        {filteredStatistics.map((s) => (
          <StatisticCard
            key={s.id}
            refetch={getUsersStatistics}
            statistic={s}
          />
        ))}
        <Button
          isIconOnly
          aria-label="Like"
          color="danger"
          size="lg"
          onClick={() => onOpen()}
        >
          <i className="mdi mdi-plus text-3xl" />
        </Button>
      </div>
    </div>
  );
};

export default Statistics;
