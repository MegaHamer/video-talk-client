"use client";
import FriendSearchForm from "@/features/friends/components/friendSeracrhForm";
import { FriendsTabs } from "@/features/friends/components/Tab";
import { useEffect, useState } from "react";
import { useFriends } from "@/features/friends/hooks/useFriends";
import { UserList } from "@/features/friends/components/usersList";
import { UsersTab } from "@/features/friends/types/usersTab.types";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<UsersTab>("all");

  const { data: friends = [], isLoading: friendsIsLoading } = useFriends();

  useEffect(() => {
    if (friends.filter((f) => f.status === "ONLINE").length > 0)
      setActiveTab("online");
    else setActiveTab("all");
  }, []);

  return (
    <div>
      <FriendsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="p-2">
        {activeTab == "send" ? (
          <FriendSearchForm />
        ) : (
          <UserList mode={activeTab} />
        )}
      </div>
    </div>
  );
}
