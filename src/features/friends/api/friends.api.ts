import { api } from "@/shared/api/axios";
import { user } from "../types/user.type";

class FriendsService {
  public async getFriends() {
    const result = await api.get<user[]>("/friends");

    return result.data;
  }
  public async getRequests() {
    const result = await api.get<user[]>("/friends/requests");

    return result.data;
  }
  //send frienship
  public async sendFriendshipRequest(username: string) {
    const result = await api.post("/friends/sendrequest", { username });
    return result.data;
  }
  //accept frienship
  public async acceptFriendshipRequest(id: number) {
    const result = await api.post("/friends/accept", { requestId: id });
    return result.data;
  }
  //cancel frienship
  public async cancelFriendshipRequest(id: number) {
    const result = await api.post("/friends/deny", { requestId: id });
    return result.data;
  }
}
export const friendsService = new FriendsService();
