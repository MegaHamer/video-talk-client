"use client";
import FriendSearchForm from "@/features/friends/components/friendSeracrhForm";
import { FriendsList } from "@/features/friends/components/friendsList";
import { FriendsTabs } from "@/features/friends/components/Tab";
import { FriendTab } from "@/features/friends/types/friendTab.types";
import { useEffect, useState } from "react";
import { useFriends } from "@/features/friends/hooks/useFriends";
import { RequestsList } from "@/features/friends/components/RequestsList";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<FriendTab>("all");

  const { data: friends = [], isLoading } = useFriends();

  useEffect(() => {
    if (friends.filter((f) => f.status === "ONLINE").length > 0)
      setActiveTab("online");
    else setActiveTab("all");
  }, [friends]);

  return (
    <div>
      <FriendsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="p-2">
        {activeTab == "send" ? (
          <FriendSearchForm />
        ) : activeTab == "request" ? (
          <RequestsList />
        ) : (
          <FriendsList mode={activeTab == "all" ? "all" : "online"} />
        )}
      </div>
    </div>
  );
}
