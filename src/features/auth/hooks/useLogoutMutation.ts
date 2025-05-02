import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../api/auth";
import { useRouter } from "next/navigation";

export default function useLogoutMutation() {
  const router = useRouter()
  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      console.log("Logout success");
      router.push("/auth/login")
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { logout, isLoading };
}
