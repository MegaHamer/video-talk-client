import { useMutation, useQueryClient } from "@tanstack/react-query"
import { friendsService } from "../api/friends.api"

export const useAcceptRequest=()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:friendsService.acceptFriendshipRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friendshipRequests"] });
            queryClient.invalidateQueries({ queryKey: ["friends"] });
          },
    })
}