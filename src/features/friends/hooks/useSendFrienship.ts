import { useMutation, useQueryClient } from "@tanstack/react-query";
import { friendsService } from "../api/friends.api";

export default function useSendFrienship() {
  const queryClient = useQueryClient();
  const {
    mutate: sendRequest,
    isPending: isLoading,
    isError,
    error,
    data,
  } = useMutation({
    mutationFn: friendsService.sendFriendshipRequestByUsernam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendshipRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { isError, sendRequest, isLoading,error ,data};
}
