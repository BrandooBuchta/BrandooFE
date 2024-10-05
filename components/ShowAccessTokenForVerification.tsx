import React, { FC, useState } from "react";
import { Button, Chip, Input } from "@nextui-org/react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const ShowAccessTokenForVerification: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const authToken = Cookies.get("authToken");

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      <Chip
        className="mt-5"
        color="warning"
        size="lg"
        startContent={<i className="mdi mdi-information-outline" />}
        variant="flat"
      >
        Pokud budete lokálně testovat svůj projekt na localhost:XXXX, budete
        muset přiložit autorizační token
      </Chip>
      <p className="text-default-500 ml-3 font-bold">Autorizační token</p>
      <div className="flex gap-2 ">
        {authToken && (
          <Input
            endContent={
              <Button
                isIconOnly
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                variant="light"
                onClick={() => {
                  authToken && navigator.clipboard.writeText(authToken);
                  toast.success("Zkopírováno do schránky!");
                }}
              >
                <i className="mdi mdi-content-copy text-2xl text-default-400 pointer-events-none" />
              </Button>
            }
            startContent={
              <Button
                isIconOnly
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                variant="light"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <i className="mdi mdi-eye-off text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <i className="mdi mdi-eye text-2xl text-default-400 pointer-events-none" />
                )}
              </Button>
            }
            type={isVisible ? "text" : "password"}
            value={authToken}
            variant="flat"
          />
        )}
      </div>
    </>
  );
};

export default ShowAccessTokenForVerification;
