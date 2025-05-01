import { useMutation } from "@tanstack/react-query";
import { TypeRegisterSchema } from "../shemes/register.shema";
import { RegisterResponse, registerUser } from "../api/auth";
import { AxiosError } from "axios";

export default function useRegisterMutation() {
  const {
    mutate: register,
    isPending:isLoading,
  } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return {register,isLoading}
}
