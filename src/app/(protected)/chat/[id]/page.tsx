'use client'
import { chatService } from "@/features/chat/api/chats.api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const { id } = useParams();
//   const { data: messages, isLoading } = useQuery({
//     queryKey: ["chat", id, "messages"],
//     queryFn: () => chatService.getMessages(id as string),
//   });

  return (
    <div>Page {id}</div>
    // <div className="flex h-full flex-col">
    //   <div className="flex-1 overflow-y-auto p-4">
    //     {isLoading ? (
    //       <div>Loading messages...</div>
    //     ) : messages?.length ? (
    //       messages.map((message) => (
    //         <Message key={message.id} message={message} />
    //       ))
    //     ) : (
    //       <div>No messages yet</div>
    //     )}
    //   </div>
    //   <ChatInput chatId={id as string} />
    // </div>
  );
}
