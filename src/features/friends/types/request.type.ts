import { user } from "./user.type";

export type request = user & {
  // id: number;
  // avatar_url: string;
  // username: string;
  role: "requester" | "recipient";
  // status: "ONLINE" | "OFFLINE" | "DND" | "IDLE";
  // friendshipStatus: string;
};
