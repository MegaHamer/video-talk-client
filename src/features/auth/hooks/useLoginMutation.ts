import { useMutation } from "@tanstack/react-query";
import { TypeRegisterSchema } from "../shemes/register.shema";
import { loginUser, RegisterResponse, registerUser } from "../api/auth";
import { AxiosError } from "axios";

export default function useLoginMutation() {
  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { login, isLoading };
}
