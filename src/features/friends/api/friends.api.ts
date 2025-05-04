import { api } from "@/shared/api/axios";
import { user } from "../types/user.type";

class FriendsService {
  public async getFriends() {
    const result = await api.get<user[]>("/friends/list");

    return result.data;
  }
  //send frienship
  public async sendFriendshipRequest(username: string) {
    const result = await api.post("/friends/sendrequest", { username });
    return result.data;
  }
}
export const friendsService = new FriendsService();
