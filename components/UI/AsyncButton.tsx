import React, { useState, FC } from "react";
import { Button, ButtonProps } from "@nextui-org/react";

interface AsyncButtonProps extends ButtonProps {
  onClick?: () => Promise<void> | void;
  onPress?: () => Promise<void> | void;
}

const AsyncButton: FC<AsyncButtonProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAsync = async (asyncFunc?: () => Promise<void> | void) => {
    if (asyncFunc) {
      const maybePromise = asyncFunc();

      if (maybePromise instanceof Promise) {
        setIsLoading(true);
        try {
          await maybePromise;
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleClick = () => handleAsync(props.onClick);
  const handlePress = () => handleAsync(props.onPress);

  return (
    <Button
      {...props}
      endContent={!isLoading ? props.endContent : null}
      isLoading={isLoading}
      startContent={!isLoading ? props.startContent : null}
      onClick={handleClick}
      onPress={handlePress}
    >
      {props.children}
    </Button>
  );
};

export default AsyncButton;
