import { useMutation, useQueryClient } from "@tanstack/react-query";
import { friendsService } from "../api/friends.api";

export const useCancelRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: friendsService.cancelFriendshipRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendshipRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
};
