import api from "@/shared/api/axios";
import { Chat } from "../types/chat.type";

class ChatService {
  //get all
  public async getAllChats() {
    const result = await api.get<Chat[]>("/chats");
    return result.data;
  }
  //get visible

  //hide

  //show

  //create private
  public async createChat(recipients:number[]){
    const {data} = await api.post("/chats",{recipients})
    return data
  }
  //create group

  //leave

  //change group

  //invite into group
}
export const chatService = new ChatService();
