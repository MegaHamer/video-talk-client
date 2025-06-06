import { user } from "@/features/friends/types/user.type";
import { Chat } from "../types/chat.type";
import Input from "@/shared/components/ui/Input";
import { useFriends } from "@/features/friends/hooks/useFriends";
import { useState } from "react";
import { useCreateChat } from "../hooks/useCreateChat";

interface CreationChatFormProps {
  friends?: user[];
  allChats?: Chat[];
  onFormClose: (visible: boolean) => void;
}
export default function CreationChatForm({
  onFormClose,
}: CreationChatFormProps) {
  const { data: friends = [], isLoading } = useFriends();

  const [selectedUsers, setSelectedUsers] = useState<user[]>([]);
  const { mutate: createChat} = useCreateChat();

  const handleCheckboxChange = (user: user, isChecked: boolean) => {
    if (isChecked) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    }
  };

  return (
    <div className="absolute top-10 left-10 flex w-110 flex-col bg-amber-200">
      <button onClick={() => onFormClose(false)}>Закрыть</button>
      <div>
        <Input />
      </div>
      <div className="flex flex-col">
        {friends?.map((friend) => (
          <div
            key={friend.id}
            className="flex flex-row items-center justify-between"
          >
            <span>{friend.username}</span>
            <input
              type="checkbox"
              checked={selectedUsers.some((u) => u.id === friend.id)}
              onChange={(e) => handleCheckboxChange(friend, e.target.checked)}
            />
          </div>
        ))}
      </div>
      <div>
        <button
          onClick={() => {
            // createChat(selectedUsers.map((user) => user.id));
          }}
        >
          {selectedUsers.length <= 1
            ? "Создать личный чат"
            : "Создать груповой чат"}
        </button>
      </div>
    </div>
  );
}
