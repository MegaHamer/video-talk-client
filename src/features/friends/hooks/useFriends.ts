import { useMutation, useQuery } from "@tanstack/react-query";
import { friendsService } from "../api/friends.api";
import { useQueryConfig } from "@/shared/hooks/useQueryConfig";


export const useFriends = () => {
  return useQuery({
    queryKey: ["friends"],
    queryFn: friendsService.getFriends,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
  });
};