import { useQuery } from "@tanstack/react-query";
import { friendsService } from "../api/friends.api";

export const useUserProfile = (id: number) => {
  return useQuery({
    queryKey: ["user_profile", id],
    queryFn: () => friendsService.getUserProfile(id),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
  });
};
