import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../api/message.api";
import { Message } from "../types/message.type";

export const useMessages = (chatId: string) => {
  return useQuery<Message[], Error>({
    queryKey: ['messages', chatId],
    queryFn: () => messageService.getAllMessages(chatId),
    enabled: !!chatId, // Автоматически запрашивает сообщения при наличии chatId
    staleTime: 1000 * 60 * 5, // 5 минут до устаревания данных
  });
};

export const useCreateMessage = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => messageService.createMessage(chatId, content),
    onSuccess: () => {
      // Инвалидируем кэш сообщений после успешного создания
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });
};

export const useUpdateMessage = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, content }: { messageId: number; content: string }) =>
      messageService.changeMessage(chatId, messageId, content),
    onSuccess: (updatedMessage) => {
      // Оптимистичное обновление
      queryClient.setQueryData<Message[]>(['messages', chatId], (old) =>
        old?.map((msg) => (msg.messageId === updatedMessage.messageId ? updatedMessage : msg))
      );
    },
  });
};

export const useDeleteMessage = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId:number) => messageService.deleteMessage(chatId, messageId),
    onMutate: async (messageId) => {
      // Оптимистичное обновление
      await queryClient.cancelQueries({ queryKey: ['messages', chatId] });
      
      const previousMessages = queryClient.getQueryData<Message[]>(['messages', chatId]);
      
      queryClient.setQueryData<Message[]>(['messages', chatId], (old) =>
        old?.filter((msg) => msg.messageId !== messageId)
      );

      return { previousMessages };
    },
    onError: (err, messageId, context) => {
      // Откат при ошибке
      queryClient.setQueryData(['messages', chatId], context?.previousMessages);
    },
    onSettled: () => {
      // Инвалидируем после завершения
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });
};