// features/friends/components/FriendsList.tsx
"use client";

import { PiChatCircleFill } from "react-icons/pi";
import { useFriends } from "../hooks/useFriends";
import { useRequests } from "../hooks/useRequests";
import { UserListItem } from "./userListItem/UserListItem";
import { RequestListItem } from "./userListItem/RequestListItem";
import Input from "@/shared/components/ui/Input";

type UsersListProps = {
  mode?: "all" | "online" | "request";
  className?: string;
};

export function UserList({ mode, className = "" }: UsersListProps) {
  const { data: friends = [], isLoading: friendsIsLoading } = useFriends();
  const { data: requests = [], isLoading: requestsIsLoading } = useRequests();

  const usersIsLoading =
    mode == "request" ? requestsIsLoading : friendsIsLoading;
  const filteredUsers =
    mode != "request"
      ? friends.filter((friend) => {
          if (mode === "online") {
            return friend.status !== "OFFLINE";
          }
          return true;
        })
      : requests;
  if (usersIsLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        {mode != "request" ? "Загрузка друзей..." : "Загрузка запросов..."}
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        {mode === "online"
          ? "Нет друзей в сети"
          : mode === "all"
            ? "Список друзей пуст"
            : "Нет запрсов дружбы, ожидающих подтверждения."}
      </div>
    );
  }

  var listItem = [];
  if (mode == "request") {
    listItem = requests.map((request) => {
      return <RequestListItem key={request.id} request={request} />;
    });
  } else {
    listItem = filteredUsers.map((friend) => {
      return <UserListItem className="group" key={friend.id} user={friend} />;
    });
  }

  return (
    <div className="flex flex-col">
      <div className="mb-3">
        <Input className="" />
      </div>
      <div className="flex flex-col">{listItem}</div>
    </div>
  );
}
