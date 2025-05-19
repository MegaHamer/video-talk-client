import { useChats } from "../../hooks/useChats";

export function ChatName({ chatId }: { chatId: number }) {
  const { data: chats, isLoading } = useChats();
  const currentChat = chats?.find((chat) => chat.id == chatId);

  const isPrivate = currentChat?.type == "PRIVATE";

  if (isLoading){
    return ""
  }
  if (isPrivate) {
    return currentChat?.recipients[0].username;
  } else {
    if (currentChat?.name) {
      return currentChat?.name;
    } else {
      return `Группа ${currentChat?.owner_id}`;
    }
  }
}
