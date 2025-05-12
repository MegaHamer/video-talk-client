"use client";
import { CallButton } from "@/features/calls/components/CallButton";
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
    <>
      <div>Page {id}</div>
      <div className="m-3">
        <CallButton chatId={Number(id)} className="bg-blue-400 px-2 py-1 rounded-lg hover:bg-blue-500 transition active:bg-blue-400" />
      </div>
      {/* // <div className="flex h-full flex-col">
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
            // </div> */}
    </>
  );
}
