import { useMutation } from "@tanstack/react-query"
import { friendsService } from "../api/friends.api"

export const useAcceptRequest=()=>{
    return useMutation({
        mutationFn:friendsService.acceptFriendshipRequest
        
    })
}