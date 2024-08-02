import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Card, Input } from "@nextui-org/react";
import NextLink from "next/link";

import useUserStore from "@/stores/user";

interface FormValues {
  email: string;
  password: string;
}

const SignIn: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const { signIn } = useUserStore();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    signIn(data);
  };

  return (
    <div className="relative h-screen">
      <div className="flex h-screen">
        <div className="flex-1 flex justify-center items-center">
          <Card className="p-5 w-80 h-fit gap-5">
            <h2 className="font-bold text-2xl text-center">Sign In</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <Input
                  color="primary"
                  label="Email"
                  type="email"
                  variant="underlined"
                  {...register("email", { required: "Email is required" })}
                  errorMessage={errors.email?.message}
                />
              </div>
              <div className="mb-4">
                <Input
                  color="primary"
                  label="Password"
                  type="password"
                  variant="underlined"
                  {...register("password", {
                    required: "Password is required",
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
                  Sign In
                </Button>
                <NextLink href="/auth/reset-password">
                  <h6
                    className="mt-4 text-xs text-right"
                    style={{ color: "#0072F5" }}
                  >
                    Reset password
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
