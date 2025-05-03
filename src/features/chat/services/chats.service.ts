import { api } from "@/shared/components/api/init";
import { Chat } from "../types/chat.type";

class ChatService {
  //get all
  public async getAllChats() {
    const result = await api.get<Chat[]>("/chats/all");
    return result.data;
  }
  //get visible

  //hide

  //show

  //create private

  //create group

  //leave

  //change group

  //invite into group
}
export const chatService = new ChatService();
