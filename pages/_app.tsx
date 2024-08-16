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

// Extend dayjs with utc and timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set the default timezone
dayjs.tz.setDefault("Europe/Prague");

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const userStore = useUserStore();

  const mountedAsyncStack = async () => {
    userStore.token?.authToken && setAuthTokenHeader(userStore.token?.authToken);
    if (userStore.isLoggedIn) {
      if (router.pathname.includes("auth")) router.push("/dashboard");
      return;
    }
    !router.pathname.includes("reset") && router.push("/auth/signin");
  };

  useEffect(() => {
    mountedAsyncStack();
  }, [userStore.isLoggedIn]);

  return (
    <NextUIProvider navigate={router.push}>
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
    </NextUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
