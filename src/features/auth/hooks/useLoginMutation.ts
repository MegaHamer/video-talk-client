import { useMutation } from "@tanstack/react-query";
import { TypeRegisterSchema } from "../shemes/register.shema";
import { loginUser, RegisterResponse, registerUser } from "../api/auth";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function useLoginMutation() {
  const router = useRouter()
  const {
    mutate: login,
    isPending: isLoading,
    error,
    isError,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log(data);
      router.push("/")
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { login, isLoading, error, isError };
}
