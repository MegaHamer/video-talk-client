// features/friends/components/FriendsList.tsx
"use client";

import { PiChatCircleFill } from "react-icons/pi";
import { useFriends } from "../hooks/useFriends";
import { useRequests } from "../hooks/useRequests";
import { FriendTab } from "../types/friendTab.types";
import { user } from "../types/user.type";
import { UserItem } from "./userItem";

type FriendsListProps = {
  mode?: "online" | "all";
  className?: string;
};

export function FriendsList({
  mode = "all",
  className = "",
}: FriendsListProps) {
  const { data: friends = [], isLoading: friendsIsLoading } = useFriends();
  const filteredFriends = friends.filter((friend) => {
    if (mode === "online") {
      return friend.status !== "OFFLINE";
    }

    return true;
  });

  return (
    <div className={className}>
      {friendsIsLoading ? (
        <div className="p-4 text-center text-gray-500">Загрузка друзей...</div>
      ) : filteredFriends.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          {mode === "online"
            ? "Нет друзей в сети"
            : mode === "all"
              ? "Список друзей пуст"
              : ""}
        </div>
      ) : (
        filteredFriends.map((friend) => (
          <UserItem className="group" type={"message"} key={friend.id} user={friend}>
            <div className="flex flex-row">
              <button className="flex aspect-square h-10 items-center justify-center rounded-full text-gray-600 transition group-hover:bg-gray-300 hover:text-black">
                <PiChatCircleFill size={24} />
              </button>
            </div>
          </UserItem>
        ))
      )}
    </div>
  );
}
