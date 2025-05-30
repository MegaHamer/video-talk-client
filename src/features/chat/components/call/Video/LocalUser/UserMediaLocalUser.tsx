"use client";
import { useVolumeTracker } from "@/shared/utils/call/useVolumeTracker";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { LuMonitor } from "react-icons/lu";
import { useUserProfile } from "@/features/friends/hooks/useGetUserProfile";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import useUserStore from "@/shared/hooks/mediasoup/localUser/localUserStore";
import { useMyProfile } from "@/features/friends/hooks/useGetMyProfile";

export const LocalUserMedia = memo(() => {
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  const animationFrameRef = useRef<number>();

  const { getProducer } = useUserStore();
  const video = getProducer("camera");
  const audio = getProducer("mic");
  const videoLocalTrack = video?.track;
  const audioLocalTrack = audio?.track;

  const { data: Profile } = useMyProfile();
  // console.log(Profile);
  // Обработка аудио и определение активности речи
  useEffect(() => {
    if (!audioLocalTrack) {
      return;
    }

    const audioTrack = audioLocalTrack;
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(
      new MediaStream([audioTrack]),
    );
    source.connect(analyser);
    analyser.fftSize = 32;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      setVolume(average);
      setIsSpeaking(average > 30); // Порог для определения активности
      animationFrameRef.current = requestAnimationFrame(checkVolume);
    };

    animationFrameRef.current = requestAnimationFrame(checkVolume);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      audioContext.close();
    };
  }, [audioLocalTrack]);

  // Установка видео потоков
  useEffect(() => {
    if (userVideoRef.current && videoLocalTrack) {
      userVideoRef.current.srcObject = new MediaStream([videoLocalTrack]);
    }
  }, [videoLocalTrack]);

  const renderAvatar = useMemo(() => {
    if (Profile?.avatar) {
      return (
        <Image
          src={process.env.SERVER_URL + Profile.avatar}
          alt={Profile?.globalName}
          width={48}
          height={48}
          className="rounded-full"
        />
      );
    }
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white">
        <FaUser className="text-xl" />
      </div>
    );
  }, [Profile]);

  return (
    <div className="relative flex aspect-video h-full w-full flex-col gap-2">
      <div
        className={twMerge(
          "relative h-full w-full rounded-lg bg-gray-800",
          isSpeaking && "ring-2 ring-green-400",
        )}
      >
        {/* Видео с камеры */}
        {videoLocalTrack ? (
          <video
            ref={userVideoRef}
            className="h-auto w-full rounded-lg"
            autoPlay
            playsInline
            muted
          />
        ) : (
          /* Аватар, если нет видео */
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-800 p-4">
            {renderAvatar}
          </div>
        )}
        <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-sm text-white">
          {Profile?.globalName}
        </div>
      </div>
    </div>
  );
});

LocalUserMedia.displayName = "LocalUserMedia";

export default LocalUserMedia;
