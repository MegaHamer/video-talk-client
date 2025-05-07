import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../api/chats.api";

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: chatService.createChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
