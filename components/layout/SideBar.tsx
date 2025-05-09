import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Switch } from "@nextui-org/react";
import Cookies from "js-cookie";

import { MenuItem } from "./MenuItem";

import { Link } from "@/interfaces/link";
import useUserStore from "@/stores/user";
import { api } from "@/utils/api";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDark: boolean;
}

export const Sidebar: FC<SidebarProps> = ({ isOpen, isDark }) => {
  const [mounted, setMounted] = useState(false);
  const userStore = useUserStore();
  const [unseenContacts, setUnseenContacts] = useState<number>();
  const authToken = Cookies.get("authToken");

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && authToken) getUnseenMessages();
  }, [mounted, authToken]);

  if (!mounted) return null;

  const links: Link[] = [
    {
      name: "Statistiky",
      href: "/statistics",
      icon: "poll",
    },
    {
      name: "Kontakty",
      href: "/contacts",
      icon: "card-account-mail",
      value: unseenContacts,
    },
    {
      name: "Správa obsahu",
      href: "/cms",
      icon: "content-save-edit",
    },
  ];

  return (
    <aside
      className={`flex-col justify-between fixed flex z-20 top-0 left-0 h-full w-64 pt-16 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${isDark ? "bg-stone-950 border-r border-gray-700" : "bg-white"}`}
    >
      <div className="flex flex-col m-3 pr-3">
        {links.map((link) => (
          <MenuItem key={link.name} link={link} />
        ))}
      </div>
      <div className="grid place-items-center py-10">
        <div className="flex align-center">
          <Switch
            color="primary"
            isSelected={userStore.isDevMode}
            size="sm"
            onClick={() => userStore.setIsDevMode()}
          />
          <p className="text-default-700 font-semibold">Vývojářský mód</p>
        </div>
      </div>
    </aside>
  );
};
