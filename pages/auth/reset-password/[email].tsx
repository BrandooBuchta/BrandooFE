import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Card, Input } from "@nextui-org/react";
import { useRouter } from "next/router";
import QueryString from "qs";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import useUserStore from "@/stores/user";
import { ResetPasswordFinishBody } from "@/interfaces/user";
import CodeInput from "@/components/CodeInput";
import { api } from "@/utils/api";

const ResetPasswordEmail: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFinishBody>();

  const {
    query: { email },
    push,
  } = useRouter();
  const { resetPasswordFinish } = useUserStore();

  const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);
  const [code, setCode] = useState<string | null>(null);

  const onSubmit: SubmitHandler<ResetPasswordFinishBody> = async (body) => {
    if (typeof email !== "string" || !code) return;

    try {
      await resetPasswordFinish({
        password: body.password,
        code,
        email,
      });
      toast.success("We`ve successfully changed your password.");
      push("/auth/signin");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const testCode = async (code: string): Promise<boolean | null> => {
    if (typeof email !== "string") return null;
    setCode(code);

    const query = QueryString.stringify({ code, email });

    try {
      const {
        data: { isEqual },
      } = await api.post<{ isEqual: boolean }>(
        `user/password-reset/code-verification?${query}`,
      );

      setIsCodeValid(isEqual);

      return isEqual;
    } catch (error) {
      toast.error(`${error}`);

      return null;
    }
  };

  return (
    <div className="relative h-screen">
      <div className="flex h-screen">
        <div className="flex-1 flex justify-center items-center">
          <Card className="p-5 w-80 h-fit gap-5">
            <div>
              <h2 className="font-bold text-2xl text-center">
                Resetovat heslo
              </h2>
              <h3 className="text-sm text-center my-2">
                We`ve sent you a code on {email}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence>
                  {!isCodeValid ? (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="my-6 flex justify-center"
                      exit={{ opacity: 0, y: -10 }}
                      initial={{ opacity: 0, y: 10 }}
                    >
                      <CodeInput
                        onChange={(e) => e.length === 6 && testCode(e)}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4"
                      exit={{ opacity: 0, y: -10 }}
                      initial={{ opacity: 0, y: 10 }}
                    >
                      <Input
                        color="primary"
                        label="Heslo"
                        type="password"
                        variant="underlined"
                        {...register("password", {
                          required: "Heslo je požadováno",
                        })}
                        errorMessage={errors.password?.message}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {isCodeValid === true && (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      initial={{ opacity: 0, y: 10 }}
                    >
                      <Button
                        className="w-full"
                        color="primary"
                        size="lg"
                        type="submit"
                        variant="shadow"
                      >
                        Resetovat heslo
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordEmail;
