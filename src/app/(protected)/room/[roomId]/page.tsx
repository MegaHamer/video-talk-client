"use client";
import { RoomWindow } from "@/features/chat/components/RoomWindow";
import { useCheckChat } from "@/features/chat/hooks/checkChat";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Room() {
  const [isRoomExist, setIsRoomExist] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { roomId } = useParams();
  const {
    data: roomData,
    isFetching: isRoomChecking,
    error: roomeError,
  } = useCheckChat(roomId.toString());

  useEffect(() => {
    console.log(roomData);
    if (!isRoomChecking) {
      if (roomData?.available) {
        setIsRoomExist(true);
      } else {
        setIsRoomExist(false);
      }
      setIsLoading(false);
    }
  }, [roomData, isRoomChecking]);

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isRoomExist) {
    return <RoomWindow roomId={roomId.toString()} />;
  }
  if (!isRoomExist){
    notFound()
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-200">
      <div className="flex w-80 flex-col items-start rounded-2xl bg-white p-3.5 backdrop-blur-2xl">
        <Link href={"/"} className="mb-1.5 text-sm/tight">
          Назад
        </Link>
        <div className="flex w-full flex-col gap-3">
          <span className="text-center text-2xl/tight">
            Кажется, такой комнаты не существует
          </span>
        </div>
      </div>
    </div>
  );
}
