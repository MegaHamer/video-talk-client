"use client";
import Image from "next/image";
import { useChats } from "../../hooks/useChats";
import { FaUser, FaUserGroup } from "react-icons/fa6";

export function ChatIcon({ chatId }: { chatId: number }) {
  const { data: chats } = useChats();
  const currentChat = chats?.find((chat) => chat.id == chatId);
  const chatImg = currentChat?.icon;
  const members = currentChat?.recipients;

  if (members?.length == 1) {
    const userImg = members[0].avatar_url;
    if (userImg) return <Image alt="" src={userImg} />;
    return <FaUser />;
  }

  if (chatImg) {
    return <Image alt="" src={chatImg} />;
  }

  if (members?.length > 1) {
    const userImg = members[0].avatar_url;
    if (userImg) return <Image alt="" src={userImg} />;
    return <FaUser />;
  }

  return <FaUserGroup />;
}
