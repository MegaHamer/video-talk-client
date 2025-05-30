import api from "@/shared/api/axios";
import { Chat } from "../types/chat.type";

class ChatService {
  //get all
  public async getAllChats() {
    const result = await api.get<Chat[]>("/chats");
    return result.data;
  }
  public async createChat(){
    const {data} = await api.post("/chats")
    return data
  }
  public async checkChat(chatId) {
    const result = await api.get(`/chats/check-room/${chatId}`);
    return result.data;
  }
}
export const chatService = new ChatService();
