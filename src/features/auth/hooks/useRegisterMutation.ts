import { useMutation } from "@tanstack/react-query";
import { TypeRegisterSchema } from "../shemes/register.shema";
import { RegisterResponse, registerUser } from "../api/auth";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/hooks/useToast";

export default function useRegisterMutation() {
  const { showToast } = useToast();
  const router = useRouter()
  const { mutate: register, isPending: isLoading } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      showToast('Успешная регистрация!', 'success');
      router.push("/")
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { register, isLoading };
}
