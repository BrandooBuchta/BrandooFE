import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input, Checkbox, Button, Textarea } from "@nextui-org/react";

import useUserStore from "@/stores/user";
import { api, setAuthTokenHeader } from "@/utils/api";

interface IFormInput {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  initial_message: string;
  agreed_to_privacy_policy: boolean;
  agreed_to_news_letter: boolean;
}

const Form: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  function removeEmptyStrings(obj: IFormInput): Partial<IFormInput> {
    const newObj: Partial<IFormInput> = {};

    for (const key in obj) {
      const value = obj[key as keyof IFormInput];

      if (value !== "") {
        newObj[key as keyof IFormInput] = value;
      }
    }

    return newObj;
  }

  const userStore = useUserStore();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      if (userStore.token?.authToken) {
        setAuthTokenHeader(userStore.token?.authToken);
      }

      const cleanedData = removeEmptyStrings(data);

      await api.post(
        `contacts/new-contact/f801c030-00af-4bc6-bd01-3e50a7286768`,
        cleanedData,
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Input
            fullWidth
            label="Name"
            {...register("name")}
            placeholder="Name"
          />
        </div>
        <div className="mb-4">
          <Input
            fullWidth
            label="First Name"
            {...register("first_name")}
            placeholder="First Name"
          />
        </div>
        <div className="mb-4">
          <Input
            fullWidth
            label="Last Name"
            {...register("last_name")}
            placeholder="Last Name"
          />
        </div>
        <div className="mb-4">
          <Input
            fullWidth
            label="Email"
            type="email"
            {...register("email")}
            placeholder="Email"
          />
        </div>
        <div className="mb-4">
          <Input
            fullWidth
            label="Phone"
            {...register("phone")}
            placeholder="Phone"
          />
        </div>
        <div className="mb-4">
          <Input
            fullWidth
            label="Address"
            {...register("address")}
            placeholder="Address"
          />
        </div>
        <div className="mb-4">
          <Textarea
            fullWidth
            label="Initial Message"
            {...register("initial_message")}
            placeholder="Initial Message"
          />
        </div>
        <div className="mb-4">
          <Checkbox {...register("agreed_to_privacy_policy")}>
            I agree to the privacy policy
          </Checkbox>
        </div>
        <div className="mb-4">
          <Checkbox {...register("agreed_to_news_letter")}>
            I agree to receive the newsletter
          </Checkbox>
        </div>
        <div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
