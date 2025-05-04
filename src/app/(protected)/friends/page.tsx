"use client";
import FriendSearchForm from "@/features/friends/components/friendSeracrhForm";
import { FriendsList } from "@/features/friends/components/friendsList";
import { FriendsTabs } from "@/features/friends/components/friendsTab";
import { TabButton } from "@/features/friends/components/TabButton";
import { UserItem } from "@/features/friends/components/userItem";
import { friendsService } from "@/features/friends/api/friends.api";
import { FriendTab } from "@/features/friends/types/friendTab.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFriends } from "@/features/friends/hooks/useFriends";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<FriendTab>("all");
  
  const {data:friends = [],isLoading}=useFriends()

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
