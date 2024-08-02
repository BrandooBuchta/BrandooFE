import { Card } from "@nextui-org/react";

import useUserStore from "@/stores/user";

export default function Dashboard() {
  const userStore = useUserStore();

  return (
    <div className="p-2">
      <div className="flex h-[400px] gap-5 mb-5">
        <Card className="w-3/5 p-3">Statistic Chart</Card>
        <Card className="w-2/5 p-3">Weekly tip?</Card>
      </div>
      <div className="flex h-[400px] gap-5">
        <Card className="flex-1 p-3">New Contacts</Card>
        <Card className="flex-1 p-3">New emails</Card>
      </div>
    </div>
  );
}
