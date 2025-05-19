import { useQuery } from "@tanstack/react-query";
import { friendsService } from "../api/friends.api";

export const useMyProfile = () => {
  return useQuery({
    queryKey: ["my_profile"],
    queryFn:  friendsService.getMyProfile,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
  });
};
