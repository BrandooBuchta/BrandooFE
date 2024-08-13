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
    <div className="relative flex flex-col h-screen">
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
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://nextui-docs-v2.vercel.app?utm_source=next-pages-template"
          title="nextui.org homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">NextUI</p>
        </Link>
      </footer>
    </div>
  );
}
