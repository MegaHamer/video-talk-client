import { useQuery } from "@tanstack/react-query";
import { chatService } from "../api/chats.api";

export const useChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: chatService.getAllChats,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
  });
};
