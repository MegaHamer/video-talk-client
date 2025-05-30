import { useQuery } from "@tanstack/react-query";
import { chatService } from "../api/chats.api";

export const useCheckChat = (chatId: string) => {
  return useQuery({
    queryKey: ['check-chat', chatId],
    queryFn: () => chatService.checkChat(chatId),
    staleTime: Infinity, // Чтобы не делать лишние запросы
  });
};