import { useMutation } from "@tanstack/react-query";
import { friendsService } from "../api/friends.api";

export default function useSendFrienship() {
  const {
    mutate: sendRequest,
    isPending: isLoading,
    isError,
    error,
    data,
  } = useMutation({
    mutationFn: friendsService.sendFriendshipRequest,
    onSuccess: (data) => {
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { isError, sendRequest, isLoading,error ,data};
}
