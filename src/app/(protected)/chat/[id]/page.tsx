"use client";
import { CallButton } from "@/features/calls/components/CallButton";
import { chatService } from "@/features/chat/api/chats.api";
import { UserWindow } from "@/features/chat/components/call/UserWindow";
import useUserStore from "@/shared/hooks/mediasoup/localUser/localUserStore";
import { useMediasoupStore } from "@/shared/hooks/mediasoup/newUseMediasoup";
import useParticipantsStore from "@/shared/hooks/mediasoup/paricipants/participantsStore";
import { useVolumeTracker } from "@/shared/utils/call/useVolumeTracker";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function ChatPage() {
  const { id } = useParams();

  const {
    connect,
    disconnect,
    isConnected,
    produceVideo,
    stopProduceVideo,
    produceAudio,
    stopProduceAudio,
  } = useMediasoupStore();
  const { localUser } = useUserStore();
  const handleclick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect(String(id));
    }
  };
  const handlevidoeclick = () => {
    if (localUser.isScreenShare) {
      stopProduceVideo();
    } else {
      produceVideo();
    }
  };
  const handleaudiolick = () => {
    if (localUser.isMicrophoneWork) {
      stopProduceAudio();
    } else {
      produceAudio();
    }
  };

  const { participants } = useParticipantsStore();
  const participantsList = useMemo(
    () => [...participants.values()],
    [participants],
  );
  useEffect(() => {
    console.log(participants);
  }, [participants]);

  return (
    <>
      
    </>
  );
}
