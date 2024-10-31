import { FC, useEffect, useState, ChangeEvent, useCallback } from "react";
import {
  Button,
  ButtonGroup,
  Input,
  Select,
  SelectItem,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import debounce from "lodash.debounce";

import StatisticCard from "@/components/statistics/StatisticCard";
import { api } from "@/utils/api";
import useUserStore from "@/stores/user";
import { Statistic } from "@/interfaces/statistics";
import StatisticModal from "@/components/statistics/StatisticModal";

const Statistics: FC = () => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [filteredStatistics, setFilteredStatistics] = useState<Statistic[]>([]);
  const [currentInterval, setCurrentInterval] = useState<string>("last-week");
  const userStore = useUserStore();
  const { onOpenChange, isOpen, onOpen } = useDisclosure();

  const getUsersStatistics = async () => {
    try {
      const { data: usersStatistics } = await api.get<Statistic[]>(
        `statistics/get-users-statistics/${userStore.user?.id}?searchQuery=${searchQuery}`,
      );

      setStatistics(usersStatistics);
      setIsLoading(false);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    isClient && getUsersStatistics();
  }, [isClient]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    filterStatistics(currentInterval);
  }, [currentInterval, statistics]);

  const filterStatistics = (interval: string) => {
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

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentInterval(event.target.value);
  };

  // Debounced function for updating the search query
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      getUsersStatistics();
    }, 500),
    [],
  );

  if (!isClient) {
    return null; // or a loading spinner
  }

  if (isLoading) {
    return (
      <div className="w-full flex justify-center">
        <Spinner className="mt-[250px]" size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-2 w-full">
      <div className="flex gap-2">
        <Button
          color="primary"
          endContent={<i className="mdi mdi-plus" />}
          variant="shadow"
          onClick={() => onOpen()}
        >
          Přidat
        </Button>
        <div className="hidden lg:block w-full">
          <ButtonGroup className="mb-5 w-full">
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
        </div>
        <div className="block lg:hidden mb-5 w-full">
          <Select
            placeholder="Vyberte období"
            value={currentInterval || undefined} // Ensure value is string or undefined
            onChange={handleSelectChange}
          >
            {buttons.map((e) => (
              <SelectItem key={e.key} value={e.key}>
                {e.title}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <StatisticModal
        isOpen={isOpen}
        refetch={getUsersStatistics}
        onOpenChange={onOpenChange}
      />
      <Input
        className="mb-5"
        endContent={<i className="mdi mdi-magnify" />}
        placeholder="Hledat"
        onChange={({ target: { value } }) => {
          debouncedSearch(value);
        }}
      />
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
        {filteredStatistics.map((s) => (
          <StatisticCard
            key={s.id}
            refetch={getUsersStatistics}
            statistic={s}
          />
        ))}
      </div>
    </div>
  );
};

export default Statistics;
