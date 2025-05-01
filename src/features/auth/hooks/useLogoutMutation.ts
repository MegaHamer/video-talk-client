import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../api/auth";

export default function useLogoutMutation() {
  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { logout, isLoading };
}
