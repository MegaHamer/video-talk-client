'use client'
import LogoutButton from "@/features/auth/components/LogoutButton";
import { useCreateChat } from "@/features/chat/hooks/useCreateChat";
import { ChatIcon } from "@/shared/components/svgs";
import { ToggleTheme } from "@/shared/components/ui/ToggleTheme";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { mutate: createChat, isSuccess, data: chatData } = useCreateChat();
  useEffect(() => {
    if (isSuccess) {
      router.push(`/room/${chatData.id}`);
    }
  }, [isSuccess]);
  const handleCreateClick = () => {
    createChat();
  };
  const handleJoinClick = () => {
    router.push(`/join`);
  };
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-200">
      <div className="flex w-72 flex-row gap-2.5">
        <button onClick={handleCreateClick} className="aspect-square w-50 rounded-2xl bg-white backdrop-blur-2xl cursor-pointer shadow-[0_0_10px_#00000038]">
          Создать
        </button>

        <button onClick={handleJoinClick} className="aspect-square w-50 rounded-2xl bg-white backdrop-blur-2xl cursor-pointer shadow-[0_0_10px_#00000038]">
          Подключиться
        </button>
      </div>
    </div>
  );
}
