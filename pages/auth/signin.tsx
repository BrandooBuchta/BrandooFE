import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Card, Input } from "@nextui-org/react";
import NextLink from "next/link";

import useUserStore from "@/stores/user";
import { SignInRequest } from "@/interfaces/user";

const SignIn: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInRequest>();

  const { signIn } = useUserStore();

  const onSubmit: SubmitHandler<SignInRequest> = async (data) => {
    signIn(data);
  };

  return (
    <div className="relative h-screen">
      <div className="flex h-screen">
        <div className="flex-1 flex justify-center items-center">
          <Card className="p-5 w-80 h-fit gap-5">
            <h2 className="font-bold text-2xl text-center">Přihlášení</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <Input
                  color="primary"
                  label="Email"
                  type="email"
                  variant="underlined"
                  {...register("email", { required: "Email je požadován" })}
                  errorMessage={errors.email?.message}
                />
              </div>
              <div className="mb-4">
                <Input
                  color="primary"
                  label="Heslo"
                  type="password"
                  variant="underlined"
                  {...register("password", {
                    required: "Heslo je požadováno.",
                  })}
                  errorMessage={errors.password?.message}
                />
              </div>
              <div>
                <Button
                  className="w-full"
                  color="primary"
                  size="lg"
                  type="submit"
                  variant="shadow"
                >
                  Přihlásit se
                </Button>
                <NextLink href="/auth/reset-password">
                  <h6
                    className="mt-4 text-xs text-right"
                    style={{ color: "#0072F5" }}
                  >
                    Resetovat heslo
                  </h6>
                </NextLink>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
