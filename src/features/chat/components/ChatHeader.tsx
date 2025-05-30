import Image from "next/image";
import { FaUserGroup } from "react-icons/fa6";
import { ChatIcon } from "./icon/ChatIcon";
import { ChatName } from "./chat-name/ChatName";
import { FaPhoneAlt } from "react-icons/fa";
import { CallWindow } from "./call/CallWindow";
import { useMediasoupContext } from "@/shared/components/providers/MediasoupProvider";
import { twMerge } from "tailwind-merge";
import { useMediasoup } from "@/shared/hooks/useMediasoup";
import { useMediasoupStore } from "@/shared/hooks/mediasoup/newUseMediasoup";
import { CallButton } from "./call/buttons/CallButton";

export function ChatHeader({
  chatId,
  className,
}: {
  chatId: string;
  className?: string;
}) {
  const chatName = "";// ChatName({ chatId });
  const img = null;

  const { isConnected, currentChat } = useMediasoupStore();

  const isCalling = isConnected && currentChat == String(chatId);

  return (
    <div
      className={twMerge(
        "flex flex-col h-full",
        className,
        isCalling
          ? "bg-linear-to-b from-blue-950 from-70% to-indigo-900"
          : "bg-gray-300",
      )}
    >
      {/* заголовок */}
      <div className={twMerge("flex h-12 flex-row justify-between px-5 py-2")}>
        {/* имя и фото */}
        <div className="flex flex-row items-center gap-2">
          <div className="flex aspect-square h-6 items-center justify-center rounded-full bg-white">
            <ChatIcon chatId={chatId}></ChatIcon>
          </div>
          <span
            className={twMerge("text-lg/tight", isCalling ? "text-white" : "")}
          >
            {chatName}
          </span>
        </div>
        <div className="flex flex-row">
          {!isCalling && (
            <CallButton
              className="group flex aspect-square items-center justify-center"
              chatId={chatId}
            >
              <FaPhoneAlt className="text-gray-800 transition group-hover:text-gray-600" />
            </CallButton>
          )}
        </div>
      </div>
      {/* звонок */}
      {isCalling && <CallWindow className="min-h-48" />}
    </div>
  );
}
