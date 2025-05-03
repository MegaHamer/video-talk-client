"use client";
import FriendSearchForm from "@/features/friends/components/friendSeracrhForm";
import { FriendsList } from "@/features/friends/components/friendsList";
import { FriendsTabs } from "@/features/friends/components/friendsTab";
import { TabButton } from "@/features/friends/components/TabButton";
import { UserItem } from "@/features/friends/components/userItem";
import { friendsService } from "@/features/friends/services/friends.services";
import { FriendTab } from "@/features/friends/types/friendTab.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<FriendTab>("all");
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: friendsService.getFriends,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
  });

  const filteredFriends = friends.filter((friend) => {
    if (activeTab === "online") return friend.status !== "OFFLINE";
    if (activeTab === "pending") return friend.status === "PENDING";
    return true;
  });

  useEffect(() => {
    if (friends.filter((f) => f.status === "ONLINE").length > 0)
      setActiveTab("online");
    else setActiveTab("all");
  }, [friends]);

  return (
    <div>
      <FriendsTabs
        activeTab={activeTab}
        friends={friends}
        onTabChange={setActiveTab}
      />
      {activeTab == "send" ? (
        <FriendSearchForm />
      ) : (
        <FriendsList
          friends={friends}
          activeTab={activeTab}
          isLoading={isLoading}
          className="flex-1 overflow-y-auto px-2"
        />
      )}
    </div>
  );
}
