import { user } from "@/features/friends/types/user.type";

export interface Chat {
  id: number;
  name: string;
  type: "GROUP" | "PRIVATE";
  members: {
    id: number;
    avatar_url: string;
    role: "MEMBER" | "OWNER";
    status: "OFFLINE" | "ONLINE" | "DND" | "IDLE";
    username: string;
  } [];
}
