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
      <div>Page {id}</div>
      <div className="flex flex-col items-start">
        <label>Подключение</label>
        <button onClick={handleclick}>{isConnected ? "выкл" : "вкл"}</button>
        <label>Трансляция</label>
        <button onClick={handlevidoeclick}>
          {localUser.isScreenShare ? "выкл" : "вкл"}
        </button>
        <label>Голос</label>
        <button onClick={handleaudiolick}>
          {localUser.isMicrophoneWork ? "выкл" : "вкл"}
        </button>
      </div>
      <div>
        {participantsList.map((participant) => {
          const track = participant.consumers.displaymedia.video?.track;
          if (!track) return "";

          console.log(track);
          const stream = new MediaStream([track]);
          return (
            <ParticipantVideo key={participant.id} participant={participant} />
          );
        })}
      </div>
    </>
  );
}

import { memo } from "react";
import { twMerge } from "tailwind-merge";

const ParticipantVideo = memo(({ participant }: { participant }) => {
  const track = participant.consumers.usermedia.audio?.track;
  const displayVideoTrack = participant.consumers.displaymedia.video?.track;
  const userVideoTrack = participant.consumers.usermedia.video?.track;
  const audioTrack = participant.consumers.usermedia.audio?.track;

  console.log(displayVideoTrack);

  console.log("Rendering video for participant:", participant.id); // Для отладки

  return (
    <div>
      {displayVideoTrack && (
        <div className="relative">
          {/* <video
            className="w-full max-w-md rounded-lg border"
            playsInline
            autoPlay
            ref={(videoEl) => {
              if (videoEl)
                videoEl.srcObject = new MediaStream([displayVideoTrack]);
            }}
          /> */}

          <UserWindow
            name=""
            className=""
            stream={new MediaStream([displayVideoTrack])}
          ></UserWindow>
          <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-sm text-white">
            Экран {participant.name}
          </span>
        </div>
      )}
      {track && (
        <>
          <AudioTracker track={track} />
          <video
            className={twMerge(
              "h-10 bg-gray-500",
              // volume > 50 ? "border-2 border-amber-300" : "",
            )}
            key={participant.id}
            playsInline
            autoPlay
            ref={(videoEl) => {
              if (videoEl) videoEl.srcObject = new MediaStream([track]);
            }}
          />
        </>
      )}
    </div>
  );
});

ParticipantVideo.displayName = "ParticipantVideo";

const AudioTracker = memo(({ track }: { track: MediaStreamTrack }) => {
  const volume = useVolumeTracker(track);
  return volume;
});
AudioTracker.displayName = "AudioTracker";
