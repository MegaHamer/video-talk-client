"use client";

import { TabButton } from "@/features/friends/components/TabButton";
import { FriendTab } from "../types/friendTab.types";
import { user } from "../types/user.type";
import { useEffect } from "react";

type FriendsTabsProps = {
  activeTab: FriendTab;
  onTabChange: (tab: FriendTab) => void;
  friends: user[];
  className?: string;
};

export function FriendsTabs({
  activeTab,
  onTabChange,
  friends,
  className = "",
}: FriendsTabsProps) {
  
  return (
    <div className={`flex flex-row gap-2 p-2 font-semibold ${className}`}>
      <TabButton
        active={activeTab === "online"}
        onClick={() => onTabChange("online")}
        visible={friends.filter((f) => f.status !== "OFFLINE").length > 0}
      >
        В сети
      </TabButton>
      <TabButton
        active={activeTab === "all"}
        onClick={() => onTabChange("all")}
      >
        Все
      </TabButton>
      <TabButton
        active={activeTab === "pending"}
        onClick={() => onTabChange("pending")}
        visible={friends.filter((f) => f.friendshipStatus === "PENDING").length > 0}
      >
        Запросы
      </TabButton>
      <TabButton
        active={activeTab === "send"}
        onClick={() => onTabChange("send")}
        className="text-background rounded-[8px] bg-blue-500 px-3 py-1 transition hover:bg-blue-600 hover:text-background"
      >
        Добавить в друзья
      </TabButton>
    </div>
  );
}