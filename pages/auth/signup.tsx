import { FC, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Input,
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form"; // Import react-hook-form
import { toast } from "react-toastify";
import Confetti from "react-confetti"; // Import Confetti

import CodeInput from "@/components/CodeInput";
import { api } from "@/utils/api";
import useUserStore from "@/stores/user";

interface FormValues {
  email: string;
  name: string;
  webUrl: string;
  password: string;
  confirmPassword: string; // Still in the form for validation purposes
  code: string;
}

interface Screen {
  id: number;
  title: string | JSX.Element;
  subTitle: string | JSX.Element;
  form: JSX.Element;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
};

const SignUp: FC = () => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [code, setCode] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userStore = useUserStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true);
      const { confirmPassword, ...loggedData } = data;

      if (confirmPassword !== loggedData.password) {
        toast.error("Hesla se neshodují");

        return;
      }

      if (page === screens.length - 1) {
        userStore.signUp({
          ...loggedData,
          code,
        });
      }
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const paginate = async (newDirection: number) => {
    if (page === 0) {
      setIsLoading(true);

      try {
        const {
          data: { isEqual },
        } = await api.post<{ isEqual: boolean }>(
          `user/verify-code/new?code=${code}`,
        );

        if (isEqual) {
          setPage([page + newDirection, newDirection]);
          setShowConfetti(true); // Show confetti on success
          setTimeout(() => {
            setShowConfetti(false);
          }, 3500);

          return;
        }

        toast.error("Kód který jste zadali neevidujeme.");

        return;
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }

    setPage([page + newDirection, newDirection]);
  };

  const screens: Screen[] = [
    {
      id: 1,
      title: "Vítejte v Brandoo!",
      subTitle: (
        <>
          Pokud jste tady, musíte vědět co je nejlepší pro váš Online Business
          📈🤩
          <br />
          Vložte tedy zde váš kód a můžeme začít! ✅
        </>
      ),
      form: (
        <div className="flex justify-center">
          <CodeInput onChange={(e) => setCode(e)} />
        </div>
      ),
    },
    {
      id: 2,
      title: "O vás",
      subTitle: "Základní informace o vás",
      form: (
        <div className="gap-3 flex flex-col">
          <Input
            label="Email"
            placeholder="email@email.com"
            {...register("email", { required: "Email je požadován" })}
          />
          <Input
            label="Jméno"
            placeholder="Jméno"
            {...register("name", { required: "Jméno je požadováno" })}
          />
        </div>
      ),
    },
    {
      id: 3,
      title: "O Stránce",
      subTitle: "O Stránce subtitle",
      form: (
        <Input
          label="Doména"
          placeholder="vasedomena.com"
          {...register("webUrl", { required: "Doména je požadována" })}
        />
      ),
    },
    {
      id: 4,
      title: "Heslo",
      subTitle: (
        <div className="gap-2 flex flex-col">
          <div className="bg-danger-100 text-danger-500 rounded-lg p-3">
            <b>Pozor!</b>
            <p className="text-sm">
              Heslo které zde zadáte bude sloužit i jako klíč k vašim kontaktům,
              jeho zapomenutím a následným resetem neztratíte přístup k CMS a
              Statistikám, ale pouze k datům z vašich formulářů.
            </p>
          </div>
          <span className="text-xs text-primary">
            <i className="mdi mdi-information-outline mr-1" />
            {`Podrobnější informace`}
          </span>
        </div>
      ),
      form: (
        <div className="flex flex-col gap-2">
          <Input
            label="Heslo"
            type="password"
            {...register("password", { required: "Heslo je požadováno" })}
          />
          <Input
            label="Heslo znovu"
            type="password"
            {...register("confirmPassword")}
          />
        </div>
      ),
    },
  ];

  const currentScreen = screens[page % screens.length];

  return (
    <div>
      {showConfetti && <Confetti gravity={0.5} />}{" "}
      {/* Show confetti on success */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative h-screen flex justify-center items-center">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentScreen.id}
              animate="center"
              className="w-full max-w-lg absolute"
              custom={direction}
              exit="exit"
              initial="enter"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              variants={variants}
            >
              <Card className="p-5">
                <CardHeader className="flex-col flex items-start">
                  <h2 className="font-bold text-2xl text-default-800 mb-1">
                    {currentScreen.title}
                  </h2>
                  <h2 className="text-lg text-default-600">
                    {currentScreen.subTitle}
                  </h2>
                </CardHeader>
                <CardBody>{currentScreen.form}</CardBody>
                <CardFooter
                  className={page > 1 ? "justify-between" : "justify-end"}
                >
                  {page > 1 && (
                    <Button
                      aria-label="Previous"
                      color="primary"
                      endContent={
                        <i className="mdi mdi-play text-2xl rotate-180" />
                      }
                      isLoading={isLoading}
                      radius="full"
                      variant="shadow"
                      onPress={() => paginate(-1)}
                    />
                  )}
                  {page < screens.length - 1 ? (
                    <Button
                      aria-label="Next"
                      color="primary"
                      endContent={<i className="mdi mdi-play text-2xl" />}
                      isLoading={isLoading}
                      radius="full"
                      variant="shadow"
                      onPress={() => paginate(1)}
                    />
                  ) : (
                    <Button
                      aria-label="Submit"
                      color="primary"
                      isLoading={isLoading}
                      radius="full"
                      type="submit"
                      variant="shadow"
                    >
                      Vytvořit účet
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
