import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Card, Input } from "@nextui-org/react";
import { useRouter } from "next/router";

import useUserStore from "@/stores/user";

interface FormValues {
  email: string;
}

const ResetPassword: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const { resetPassword } = useUserStore();
  const { push } = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (body) => {
    await resetPassword(body);
    push(`/auth/reset-password/${body.email}`);
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
              <div>
                <Button
                  className="w-full"
                  color="primary"
                  size="lg"
                  type="submit"
                  variant="shadow"
                >
                  Reset password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
