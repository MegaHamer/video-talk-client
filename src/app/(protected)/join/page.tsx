"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Join() {
  const router = useRouter()
  const [roomId, setRoomId] = useState("");
  const handleSubmit = (e)=>{
    e.preventDefault()
    
    router.push(`/room/${roomId}`)
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-200">
      <div className="flex w-80 flex-col items-start rounded-2xl bg-white p-3.5 backdrop-blur-2xl">
        <Link href={"/"} className="mb-1.5 text-sm/tight">
          Назад
        </Link>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
          <span className="text-center text-2xl/tight">
            Укажите идентификатор для подключения
          </span>

          <input
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
            className="p w-full rounded-2xl bg-gray-200 px-4 py-2 outline-0 focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="rounded-2xl bg-green-500 px-4 py-2 text-white backdrop-blur-2xl"
          >
            Подключиться
          </button>
        </form>
      </div>
    </div>
  );
}
