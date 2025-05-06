export type user = {
  id: number;
  avatar_url: string;
  username: string;
  status: "ONLINE" | "OFFLINE" | "DND" | "IDLE";
  // friendshipStatus: string;
};
