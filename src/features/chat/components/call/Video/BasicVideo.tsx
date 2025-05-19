"use client";
import { useVolumeTracker } from "@/shared/utils/call/useVolumeTracker";
import { memo, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

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
  showSpeakingIndicator?: boolean;
}

export const ParticipantVideo = memo(
  ({ participant, showSpeakingIndicator = true }: ParticipantVideoProps) => {
    const userVideoRef = useRef<HTMLVideoElement>(null);
    const screenVideoRef = useRef<HTMLVideoElement>(null);
    const userAudioRef = useRef<HTMLAudioElement>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [volume, setVolume] = useState(0);
    const animationFrameRef = useRef<number>();

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

      if (
        screenVideoRef.current &&
        participant.consumers.displaymedia.video?.track
      ) {
        const stream = new MediaStream([
          participant.consumers.displaymedia.video.track,
        ]);
        if (participant.consumers.displaymedia.audio?.track) {
          stream.addTrack(participant.consumers.displaymedia.audio?.track);
        }
        screenVideoRef.current.srcObject = stream;
      }
    }, [
      participant.consumers.usermedia.video?.track,
      participant.consumers.displaymedia.video?.track,
    ]);
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

    return (
      <div className="relative flex flex-col gap-2">
        <audio ref={userAudioRef} autoPlay playsInline className="hidden" />

        {/* Видео с экрана (если есть) */}
        {participant.consumers.displaymedia.video?.track && (
          <div className="relative rounded-lg bg-gray-800">
            <video
              ref={screenVideoRef}
              className="h-auto w-full rounded-lg"
              autoPlay
              playsInline
            />
            <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-sm text-white">
              Экран {participant.name}
            </div>
          </div>
        )}

        {/* Видео с камеры */}
        {participant.consumers.usermedia.video?.track ? (
          <div
            className={twMerge(
              "relative rounded-lg bg-gray-800",
              isSpeaking && "ring-2 ring-green-400",
            )}
          >
            <video
              ref={userVideoRef}
              className="h-auto w-full rounded-lg"
              autoPlay
              playsInline
              muted // Звук воспроизводится через отдельный audio элемент
            />
            <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-sm text-white">
              {participant.name}
            </div>
            {showSpeakingIndicator && (
              <div
                className={twMerge(
                  "absolute right-2 bottom-2 h-3 w-3 rounded-full",
                  isSpeaking ? "bg-green-500" : "bg-gray-500",
                )}
              />
            )}
          </div>
        ) : (
          /* Аватар, если нет видео */
          participant.consumers.usermedia.audio?.track && (
            <div className="flex items-center rounded-lg bg-gray-800 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white">
                {participant.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 text-white">{participant.name}</div>
              {showSpeakingIndicator && (
                <div
                  className={twMerge(
                    "ml-2 h-3 w-3 rounded-full",
                    isSpeaking ? "bg-green-500" : "bg-gray-500",
                  )}
                />
              )}
            </div>
          )
        )}
      </div>
    );
  },
);

ParticipantVideo.displayName = "ParticipantVideo";

export default ParticipantVideo;
