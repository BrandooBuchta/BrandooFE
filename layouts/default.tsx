// default.tsx

import { Link } from "@nextui-org/react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

import { Head } from "./head";

import { AppBar } from "@/components/layout/AppBar";
import { Sidebar } from "@/components/layout/SideBar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const { pathname } = useRouter();
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (pathname.includes("auth"))
    return <main className="px-4 py-2">{children}</main>;

  return (
    <div className="relative flex flex-col min-h-screen">
      <Head />
      <AppBar toggleSidebar={toggleSidebar} />
      <Sidebar
        isDark={isDark}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div
        className={`flex flex-grow transition-all duration-300 ${sidebarOpen ? "lg:ml-64 ml-0" : "ml-0"}`}
      >
        <main className="px-4 py-2 w-full">{children}</main>
      </div>
    </div>
  );
}
