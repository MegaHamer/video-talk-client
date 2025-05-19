"use client";
import { useVolumeTracker } from "@/shared/utils/call/useVolumeTracker";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { LuMonitor } from "react-icons/lu";
import { useUserProfile } from "@/features/friends/hooks/useGetUserProfile";
import Image from "next/image";
import { FaUser } from "react-icons/fa";

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
  showSpeakingIndicator: boolean;
}

export const ParticipantUserMedia = memo(
  ({ participant, showSpeakingIndicator = false }: ParticipantVideoProps) => {
    const userVideoRef = useRef<HTMLVideoElement>(null);
    const screenVideoRef = useRef<HTMLVideoElement>(null);
    const userAudioRef = useRef<HTMLAudioElement>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [volume, setVolume] = useState(0);
    const animationFrameRef = useRef<number>();

    const { data: Profile } = useUserProfile(Number(participant.id));

    // Обработка аудио и определение активности речи
    useEffect(() => {
      if (
        !showSpeakingIndicator ||
        !participant.consumers.usermedia.audio?.track
      ) {
        return;
      }

      const audioTrack = participant.consumers.usermedia.audio.track;
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
    }, [participant.consumers.usermedia.audio?.track, showSpeakingIndicator]);

    // Установка видео потоков
    useEffect(() => {
      if (
        userVideoRef.current &&
        participant.consumers.usermedia.video?.track
      ) {
        userVideoRef.current.srcObject = new MediaStream([
          participant.consumers.usermedia.video.track,
        ]);
      }
    }, [participant.consumers.usermedia.video?.track]);
    useEffect(() => {
      if (
        userAudioRef.current &&
        participant.consumers.usermedia.audio?.track
      ) {
        userAudioRef.current.srcObject = new MediaStream([
          participant.consumers.usermedia.audio.track,
        ]);
      }
    }, [participant.consumers.usermedia.audio?.track]);

    const renderAvatar = useMemo(() => {
      if (Profile?.avatar) {
        return (
          <Image
            src={Profile.avatar}
            alt={Profile?.username || participant.name}
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
    }, [Profile, participant.name]);

    return (
      <div className="relative flex aspect-video h-full w-full flex-col gap-2">
        <audio ref={userAudioRef} autoPlay playsInline className="hidden" />

        <div
          className={twMerge(
            "relative h-full w-full rounded-lg bg-gray-800",
            isSpeaking && "ring-2 ring-green-400",
          )}
        >
          {/* Видео с камеры */}
          {participant.consumers.usermedia.video?.track ? (
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
            {Profile?.username}
          </div>
        </div>
      </div>
    );
  },
);

ParticipantUserMedia.displayName = "ParticipantUserMedia";

export default ParticipantUserMedia;
