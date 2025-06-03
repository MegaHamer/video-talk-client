import api from "@/shared/api/axios";
import { Message } from "../types/message.type";

class MessageService {
  //get all
  public async getAllMessages(chatId) {
    const result = await api.get<Message[]>(`/chats/${chatId}/messages`);
    return result.data;
  }
  public async createMessage(chatId, content) {
    const { data } = await api.post(`/chats/${chatId}/messages`, { content });
    return data;
  }
  public async changeMessage(chatId, messageId, content) {
    const result = await api.put(`/chats/${chatId}/messages/${messageId}`, {
      content,
    });
    return result.data;
  }
  public async deleteMessage(chatId, messageId) {
    const result = await api.delete(`/chats/${chatId}/messages/${messageId}`);
    return result.data;
  }
}
export const messageService = new MessageService();
