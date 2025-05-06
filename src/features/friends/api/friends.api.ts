import { api } from "@/shared/api/axios";
import { user } from "../types/user.type";
import { request } from "../types/request.type";

class FriendsService {
  public async getFriends() {
    const result = await api.get<user[]>("/relationship/friends");
    return result.data;
  }
  public async getRequest() {
    const result = await api.get<request[]>("/relationship/requests");
    return result.data;
  }
  public async getBlocked() {
    const result = await api.get<user[]>("/relationship/blocked");
    return result.data;
  }
  //send frienship
  public async sendFriendshipRequestByUsernam(username: string) {
    const result = await api.post("/relationship", { username });
    return result.data;
  }
  //accept frienship
  public async acceptFriendshipRequest(id: number) {
    const result = await api.put(`/relationship/${id}`, {});
    return result.data;
  }
  //cancel frienship
  public async cancelFriendshipRequest(id: number) {
    const result = await api.delete(`/relationship/${id}`);
    return result.data;
  }
}
export const friendsService = new FriendsService();
