"use client";

import { TabButton } from "@/features/friends/components/TabButton";
import { FriendTab } from "../types/friendTab.types";
import { user } from "../types/user.type";
import { useEffect } from "react";
import { useFriends } from "../hooks/useFriends";
import { useRequests } from "../hooks/useRequests";

type FriendsTabsProps = {
  activeTab: FriendTab;
  onTabChange: (tab: FriendTab) => void;
  className?: string;
};

export function FriendsTabs({
  activeTab,
  onTabChange,
  className = "",
}: FriendsTabsProps) {
  const { data: friends = [] } = useFriends();
  const { data: requests = [] } = useRequests();

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
        active={activeTab === "request"}
        onClick={() => onTabChange("request")}
        visible={
          requests.length > 0
        }
      >
        Запросы
      </TabButton>
      <TabButton
        active={activeTab === "send"}
        onClick={() => onTabChange("send")}
        className="text-background hover:text-background rounded-[8px] bg-blue-500 px-3 py-1 transition hover:bg-blue-600"
      >
        Добавить в друзья
      </TabButton>
    </div>
  );
}
