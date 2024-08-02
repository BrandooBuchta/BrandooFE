import { FC, useState, useEffect } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { Button, ButtonProps, SwitchProps, useSwitch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import clsx from "clsx";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";
import useUserStore from "@/stores/user";
import { api, setAuthTokenHeader } from "@/utils/api";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
  variant?: ButtonProps["variant"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
  variant,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  const onChange = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const userStore = useUserStore();

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: theme === "light",
    onChange,
  });

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  // Prevent Hydration Mismatch
  if (!isMounted) return <div className="w-6 h-6" />;

  const sendDarkMode = async () => {
    try {
      if (userStore.token?.authToken) {
        setAuthTokenHeader(userStore.token?.authToken);
      }

      await api.post(
        `statistics/push-statistic-value/c7b1d9e9-a727-4fae-8ace-9aad6fdd50db`,
        {
          number: 1,
        },
      );
    } catch (error) {}
  };

  return (
    <Button
      isIconOnly
      className="rounded-full"
      color="primary"
      variant={variant}
      onPress={() => sendDarkMode()}
    >
      <Component
        {...getBaseProps({
          className: clsx(
            "px-px transition-opacity hover:opacity-80 cursor-pointer",
            className,
            classNames?.base,
          ),
        })}
      >
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: clsx(
              [
                "w-auto h-auto",
                "bg-transparent",
                "rounded-lg",
                "flex items-center justify-center",
                "group-data-[selected=true]:bg-transparent",
                "!text-default-500",
                "pt-px",
                "px-0",
                "mx-0",
              ],
              classNames?.wrapper,
            ),
          })}
        >
          {isSelected ? (
            <MoonFilledIcon color="white" size={22} />
          ) : (
            <SunFilledIcon color="white" size={22} />
          )}
        </div>
      </Component>
    </Button>
  );
};

ThemeSwitch.defaultProps = {
  variant: "light",
};
