export type user = {
  id: number;
  avatar_url: string;
  username: string;
  friendshipId: number;
  role: 'requester' | 'recipient';
  status: "ONLINE" | "OFFLINE" | "DND" | "IDLE";
  // friendshipStatus: string;
};
