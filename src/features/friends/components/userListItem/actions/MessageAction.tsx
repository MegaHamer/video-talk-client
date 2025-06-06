"use client";
import { useCreateChat } from "@/features/chat/hooks/useCreateChat";
import { useCancelRequest } from "@/features/friends/hooks/useCancelRequest";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { PiChatCircleFill } from "react-icons/pi";

interface CancelActionProps {
  userId: number;
}

export function MessageAction({ userId }: CancelActionProps) {
  //   const { mutate: cancelRequest } = useCancelRequest();
  const {
    mutate: createChat,
    data: createdChat,
    isPending,
    isSuccess
  } = useCreateChat();
  const router = useRouter();

  const handleClick = async () => {
    // await createChat([userId]);
  };
  useEffect(() => {
    if (!isPending) {
      if (isSuccess) {
        router.push(`/chat/${createdChat.id}`);
      }
    }
  }, [isPending]);
  return (
    <button
      onClick={handleClick}
      className="flex aspect-square h-10 items-center justify-center rounded-full text-gray-600 transition group-hover:bg-gray-300 hover:text-black"
    >
      <PiChatCircleFill size={24} />
    </button>
  );
}
