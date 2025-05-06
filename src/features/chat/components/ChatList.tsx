"use client";
import { useQuery } from "@tanstack/react-query";
import { Chat } from "../types/chat.type";
import ChatItem from "./chatItem";
import { chatService } from "../api/chats.api";
import { useEffect } from "react";
import CreateChatButton from "./CreateChatButton";
import { useChats } from "../hooks/useChats";

export function ChatList() {
  //   const chats:Chat[] = [
  //     {id:1,name:"11",members:[],type:"GROUP"},
  //     {id:2,name:"22",members:[],type:"GROUP"},
  //     {id:3,name:"33",members:[],type:"GROUP"},
  //     {id:4,name:"44",members:[],type:"GROUP"},
  //   ];
  const { data: chats, isLoading } = useChats()

  useEffect(() => {
    console.log(chats);
  }, [chats]);

  return (
    <div>
      {chats?.map((chat) => <ChatItem chat={chat} key={chat.id} />)}
    </div>
  );
}
