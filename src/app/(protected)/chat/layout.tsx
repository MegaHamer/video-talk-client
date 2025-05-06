import { ChatList } from "@/features/chat/components/ChatList";
import CreateChatButton from "@/features/chat/components/CreateChatButton";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="max-w-80 min-w-48 border-r">
        <CreateChatButton />
        <ChatList />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
