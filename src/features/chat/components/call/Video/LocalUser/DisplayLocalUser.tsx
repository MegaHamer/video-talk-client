"use client";
import { useVolumeTracker } from "@/shared/utils/call/useVolumeTracker";
import { memo, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { LuMonitor } from "react-icons/lu";
import { useUserProfile } from "@/features/friends/hooks/useGetUserProfile";
import useUserStore from "@/shared/hooks/mediasoup/localUser/localUserStore";
import { useMyProfile } from "@/features/friends/hooks/useGetMyProfile";

export const LocalDisplay = memo(() => {
  const screenVideoRef = useRef<HTMLVideoElement>(null);

  const { getProducer } = useUserStore();
  const video = getProducer("screen");
  const track = video?.track;

  const { data: Profile } = useMyProfile();
  console.log(Profile);

  // Установка видео потоков
  useEffect(() => {
    if (screenVideoRef.current && track) {
      screenVideoRef.current.srcObject = new MediaStream([track]);
    }
  }, [track]);



  return (
    <div className="relative flex h-full flex-col gap-2">
      {/* Видео с экрана (если есть) */}
      {track && (
        <div className="relative h-full aspect-video rounded-lg bg-black">
          <video
            ref={screenVideoRef}
            className="h-full rounded-lg"
            autoPlay
            playsInline
          />
          <div className="absolute bottom-2 left-2 flex flex-row items-center gap-1 rounded bg-black/70 px-2 py-1 text-sm text-white">
            <LuMonitor className="" />{" "}
            <span className="cursor-default">{Profile.username}</span>
          </div>
        </div>
      )}
    </div>
  );
});

LocalDisplay.displayName = "LocalDisplay";

export default LocalDisplay;
