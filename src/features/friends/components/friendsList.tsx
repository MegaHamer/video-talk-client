// features/friends/components/FriendsList.tsx
"use client";


import { FriendTab } from "../types/friendTab.types";
import { user } from "../types/user.type";
import { UserItem } from "./userItem";


type FriendsListProps = {
  friends: user[];
  activeTab: FriendTab;
  isLoading: boolean;
  className?: string;
};

export function FriendsList({
  friends,
  activeTab,
  isLoading,
  className = "",
}: FriendsListProps) {
  const filteredFriends = friends.filter((friend) => {
    if (activeTab === "online") return friend.status !== "OFFLINE" && friend.friendshipStatus === "ACCEPTED";
    if (activeTab === "pending") return friend.friendshipStatus === "PENDING";
    if (activeTab === "all") return friend.friendshipStatus === "ACCEPTED";
    return true;
  });

  return (
    <div className={`${className}`}>
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Загрузка друзей...</div>
      ) : filteredFriends.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          {activeTab === "online"
            ? "Нет друзей в сети"
            : activeTab === "pending"
            ? "Нет ожидающих запросов"
            : "Список друзей пуст"}
        </div>
      ) : (
        filteredFriends.map((friend) => (
          <UserItem key={friend.id} user={friend} />
        ))
      )}
    </div>
  );
}