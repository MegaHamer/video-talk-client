import { user } from "@/features/friends/types/user.type";

export interface Chat {
  id: number;
  name: string;
  hidden: boolean;
  owner_id:number;
  icon:string;
  type: "GROUP" | "PRIVATE";
  recipients: {
    id: number;
    avatar_url: string;
    username: string;
    // status: "OFFLINE" | "ONLINE" | "DND" | "IDLE";
  }[];
}
