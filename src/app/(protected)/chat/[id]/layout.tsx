'use client'
import { ChatHeader } from "@/features/chat/components/ChatHeader";
import { ChatList } from "@/features/chat/components/ChatList";
import CreateChatButton from "@/features/chat/components/CreateChatButton";
import { useParams } from "next/navigation";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams();
  return (
    <div className="flex flex-col h-full">
      <div className=" max-h-1/2">
        <ChatHeader  chatId={Number(id)} />
      </div>
      <div>{children}</div>
    </div>
  );
}
