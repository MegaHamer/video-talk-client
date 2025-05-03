import { useMutation } from "@tanstack/react-query";
import { friendsService } from "../services/friends.services";

export default function useSendFrienshipMutation() {
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
