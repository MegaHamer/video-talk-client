"use client";
import { useVolumeTracker } from "@/shared/utils/call/useVolumeTracker";
import { memo, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { LuMonitor } from "react-icons/lu";
import { useUserProfile } from "@/features/friends/hooks/useGetUserProfile";

interface ParticipantVideoProps {
  participant: {
    id: string;
    name: string;
    consumers: {
      usermedia: {
        video?: { track: MediaStreamTrack };
        audio?: { track: MediaStreamTrack };
      };
      displaymedia: {
        video?: { track: MediaStreamTrack };
        audio?: { track: MediaStreamTrack };
      };
    };
  };
  isMuted: boolean;
}

export const ParticipantDisplay = memo(
  ({ participant, isMuted = false }: ParticipantVideoProps) => {
    const screenVideoRef = useRef<HTMLVideoElement>(null);
    const screenAudioRef = useRef<HTMLAudioElement>(null);

    const { data: Profile } = useUserProfile(Number(participant.id));
    console.log(Profile);

    // Установка видео потоков
    useEffect(() => {
      if (
        screenVideoRef.current &&
        participant.consumers.displaymedia.video?.track
      ) {
        screenVideoRef.current.srcObject = new MediaStream([
          participant.consumers.displaymedia.video.track,
        ]);
      }
    }, [participant.consumers.displaymedia.video?.track]);
    useEffect(() => {
      if (
        screenAudioRef.current &&
        participant.consumers.displaymedia.audio?.track
      ) {
        screenAudioRef.current.srcObject = new MediaStream([
          participant.consumers.displaymedia.audio?.track,
        ]);
      }
    }, [participant.consumers.displaymedia.audio?.track]);

    return (
      <div className="relative flex flex-col gap-2 h-full">
        <audio ref={screenAudioRef} autoPlay playsInline className="hidden" />

        {/* Видео с экрана (если есть) */}
        {participant.consumers.displaymedia.video?.track && (
          <div className="relative aspect-video rounded-lg bg-gray-800 h-full flex justify-center items-center">
            <video
              ref={screenVideoRef}
              className="h-full  rounded-lg"
              autoPlay
              playsInline
            />
            <div className="absolute bottom-2 left-2 flex flex-row items-center gap-1 rounded bg-black/70 px-2 py-1 text-sm text-white">
              <LuMonitor className="" /> <span className="cursor-default">{Profile.globalName}</span>
            </div>
          </div>
        )}
      </div>
    );
  },
);

ParticipantDisplay.displayName = "ParticipantDisplay";

export default ParticipantDisplay;
