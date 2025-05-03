import { api } from "@/shared/components/api/init";
import { user } from "../types/user.type";



class FriendsService {
  public async getFriends() {
    const result = await api.get<user[]>("/friends/list");

    return result.data;
  }
  //send frienship
  
}
export const friendsService = new FriendsService();
