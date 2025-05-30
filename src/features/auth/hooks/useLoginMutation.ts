'use client'
import { useMutation } from "@tanstack/react-query";
import { TypeRegisterSchema } from "../shemes/register.shema";
import { loginUser, RegisterResponse, registerUser } from "../api/auth";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/hooks/useToast";

export default function useLoginMutation() {
  const { showToast } = useToast();
  const router = useRouter()
  const {
    mutate: login,
    isPending: isLoading,
    error,
    isError,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      showToast('Успешный вход!', 'success');
      router.push("/chat")
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { login, isLoading, error, isError };
}
