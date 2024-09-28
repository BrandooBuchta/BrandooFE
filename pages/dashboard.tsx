import { Card } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

import useUserStore from "@/stores/user";
import { api } from "@/utils/api";
import { Statistic } from "@/interfaces/statistics";
import MiniStatisticCard from "@/components/statistics/MiniStatisticCard";

export default function Dashboard() {
  const userStore = useUserStore();
  const [mounted, setMounted] = useState<boolean>(false);
  const [unseenContacts, setUnseenContacts] = useState<number>(0);
  const [statistics, setStatistics] = useState<Statistic[]>([]);

  const getUnseenMessages = async () => {
    try {
      const { data } = await api.get<number>(
        `forms/unseen-responses/${userStore.user?.id}`,
      );

      setUnseenContacts(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const getUsersStatistics = async () => {
    try {
      const { data: usersStatistics } = await api.get<Statistic[]>(
        `statistics/random-statistics/${userStore.user?.id}`,
      );

      setStatistics(usersStatistics);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getUnseenMessages();
      getUsersStatistics();
    }
  }, [mounted]);

  return (
    <div className="p-2">
      <div className="flex gap-5 mb-5">
        <Card className="w-full p-8">
          <h1 className="text-3xl font-bold text-default-800">
            Vítejte zpátky! 🤩
          </h1>
          <h2 className="text-xl font-semibold text-default-600">
            Pojďme se podívat, jak se vám daří! ✅
          </h2>
        </Card>
      </div>
      <div className="flex gap-5">
        <Card className="p-5 w-[70%]">
          <p className="text-xl font-bold text-default-700">
            Statistiky za poslední týden 📈
          </p>
          {statistics.map((e) => (
            <MiniStatisticCard key={e.id} statistic={e} />
          ))}
        </Card>
        <Card
          as={Link}
          className="p-5 w-[30%] min-h-[350px] flex justify-center items-center"
          href="/contacts"
        >
          <h3 className="text-2xl font-bold text-default-700 mb-10">
            Nových kontaktů
          </h3>
          <h4 className="w-[170px] h-[170px] rounded-full text-7xl font-bold grid place-content-center bg-primary-100 text-primary">
            {unseenContacts}
          </h4>
        </Card>
      </div>
    </div>
  );
}
