import { ChatList } from "@/features/chat/components/ChatList";

export default function ChatLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex h-screen">
        <div className="min-w-48 max-w-80 border-r">
          <ChatList />
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  }