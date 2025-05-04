import { useQuery } from "@tanstack/react-query";
import { friendsService } from "../api/friends.api";

export const useRequests = () => {
    return useQuery({
      queryKey: ["friendshipRequests"],
      queryFn: friendsService.getRequests,
      staleTime: Infinity,
      gcTime: 24 * 60 * 60 * 1000,
    });
  };