// components/navbar.tsx

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  User,
  Divider,
  Button,
  Badge,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import NextLink from "next/link";
import { FC, useEffect, useState } from "react";
import { useTheme } from "next-themes";

import VerificationModal from "./VerificationModal";

import useUserStore from "@/stores/user";

interface AppBarProps {
  toggleSidebar: () => void;
}

export const AppBar: FC<AppBarProps> = ({ toggleSidebar }) => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { signOut } = useUserStore();
  const userStore = useUserStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <NextUINavbar
      className={`${
        isDark ? "bg-stone-950 border-b border-gray-700" : "bg-white shadow-md"
      }`}
      isBordered={isDark}
      maxWidth="full"
      position="sticky"
    >
      <VerificationModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            {mounted ? (
              <img
                alt="logo"
                className="w-[100px] drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] mr-3"
                src={`/brandoo-logo-${currentTheme}.svg`}
              />
            ) : (
              <Spinner />
            )}
          </NextLink>
        </NavbarBrand>
        <Divider className="h-1/2" orientation="vertical" />
        <Button
          isIconOnly
          aria-label="menu"
          variant="light"
          onClick={toggleSidebar}
        >
          <span className="mdi mdi-menu text-2xl" />
        </Button>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <Badge
          color="primary"
          content="!"
          isInvisible={userStore.user?.isVerified}
          placement="top-left"
          size="md"
          variant="shadow"
        >
          <User
            avatarProps={{
              name: userStore.user?.name
                .split(" ")
                .map((e) => e[0])
                .join()
                .replaceAll(",", ""),
            }}
            description={userStore.user?.webUrl.replaceAll("https://www.", "")}
            name={userStore.user?.name}
            onMouseEnter={() => !userStore.user?.isVerified && onOpen()}
          />
        </Badge>
        <Button
          className="ml-2"
          color="primary"
          variant="shadow"
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      </NavbarContent>
    </NextUINavbar>
  );
};
