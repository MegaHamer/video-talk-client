import { FaPhoneSlash } from "react-icons/fa6";
import {
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
} from "react-icons/bs";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useMediasoupContext } from "@/shared/components/providers/MediasoupProvider";
import { UserWindow } from "./UserWindow";
import { twJoin, twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { UserWindowsList } from "./UserWindowsList";
import { useVolumeTracker } from "@/shared/utils/call/useVolumeTracker";
import { useMediasoupStore } from "@/shared/hooks/mediasoup/newUseMediasoup";
import useParticipantsStore from "@/shared/hooks/mediasoup/paricipants/participantsStore";
import useUserStore from "@/shared/hooks/mediasoup/localUser/localUserStore";
import MuteButton from "./buttons/MuteButton";
import DisplayButton from "./buttons/DisplayButton";
import DisconnectButton from "./buttons/disconnectButton";

export function CallWindow({ className }: { className?: string }) {
  const {
    disconnect,
    isConnected,
    produceAudio,
    produceVideo,
    stopProduceVideo,
    sendTransport,
  } = useMediasoupStore();

  const { participants } = useParticipantsStore();
  const {
    localUser: { isMuted, isScreenShare, isMicrophoneWork },
    toggleMute,
  } = useUserStore();

  const handleMicrophoneClick = () => {
    toggleMute();
  };
  const handleDisplayClick = () => {
    if (isScreenShare) {
      stopProduceVideo();
    } else {
      produceVideo();
    }
  };
  const handleDisconnectClick = () => {
    disconnect();
  };

  useEffect(() => {
    console.log(isConnected, sendTransport);
    if (isConnected && sendTransport) produceAudio();
  }, [isConnected, sendTransport]);

  // const myStream = getMyStream("UserMedia");

  useEffect(() => {
    console.log("rerender call window");
  }, []);

  return (
    <div className={twMerge("flex flex-col p-1.5", className)}>
      {/* users */}
      <UserWindowsList />
      {/* buttons */}
      <div className="flex justify-center">
        <div className="flex flex-row gap-2">
          <div className="flex flex-row items-center rounded-2xl bg-gray-400 p-1">
            <MuteButton className="rounded-xl p-2.5 transition hover:bg-white/20" />

            <DisplayButton className="rounded-xl p-2.5 transition hover:bg-white/20" />
          </div>
          {/* <div className=" flex items-center"> */}
          <DisconnectButton className="rounded-2xl bg-red-600 p-2.5 transition hover:bg-red-500" />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
