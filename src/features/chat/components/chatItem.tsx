"use client";
import Link from "next/link";
import { Chat } from "../types/chat.type";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

type ChatProps = {
  chat: Chat;
};

export default function ChatItem({ chat }: ChatProps) {
  const pathname = usePathname();
  const active = pathname === `/chat/${chat.id}`;
  return (
    <div className="mx-1.5 py-px">
      <div
        className={twMerge(
          "rounded-lg hover:bg-black/20",
          active ? "bg-black/25" : "",
        )}
      >
        <Link href={`/chat/${chat.id}`}>
          <div className="w-full px-2">
            <div className="flex h-10 flex-row items-center gap-1.5">
              <div className="aspect-square h-8 rounded-lg bg-gray-500"></div>
              <div>{chat.name}</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
