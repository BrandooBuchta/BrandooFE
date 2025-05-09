import type { AppProps } from "next/app";

import "react-toastify/dist/ReactToastify.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import "../global";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";

import useUserStore from "@/stores/user";
import { ThemeSwitch } from "@/components/theme-switch";
import DefaultLayout from "@/layouts/default";
import { setAuthTokenHeader } from "@/utils/api";

import Cookies from "js-cookie";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Extend dayjs with utc and timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set the default timezone
dayjs.tz.setDefault("Europe/Prague");

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const userStore = useUserStore();
  const authToken = Cookies.get("authToken");

  const mountedAsyncStack = async () => {
    authToken && setAuthTokenHeader(authToken);
    if (userStore.isLoggedIn) {
      if (router.pathname.includes("auth")) router.push("/dashboard");

      return;
    }
    !(
      router.pathname.includes("reset") || router.pathname.includes("signup")
    ) && router.push("/auth/signin");
  };

  useEffect(() => {
    mountedAsyncStack();
  }, [userStore.isLoggedIn]);

  useEffect(() => {
    if (dayjs().isAfter(userStore.authTokenExpiresAt)) userStore.signOut();
  }, [userStore.authTokenExpiresAt]);

  return (
    <NextUIProvider navigate={router.push}>
      <DndProvider backend={HTML5Backend}>
        <NextThemesProvider>
          <DefaultLayout>
            <div className="relative">
              <Component {...pageProps} />
              <div className="fixed bottom-0 right-0 m-7">
                <ThemeSwitch variant="shadow" />
              </div>
            </div>
            <ToastContainer theme="dark" />
          </DefaultLayout>
        </NextThemesProvider>
      </DndProvider>
    </NextUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
