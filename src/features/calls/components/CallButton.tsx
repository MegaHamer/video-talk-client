"use client";
import { useMediaSocketStore } from "@/shared/components/store/mediaSocketStore";
import { useEffect, useRef, useState } from "react";
import { twJoin } from "tailwind-merge";
import { Device, types } from "mediasoup-client";
import { useMediasoupContext } from "@/shared/components/providers/MediasoupProvider";

export function CallButton({
  className = "",
  chatId,
}: {
  className?: string;
  chatId: number;
}) {
  const {
    connect,
    disconnect,
    members,
    isConnected,
    broadcastMicro,
    brodcastCamera,
    brodcastVideo,
    getStream,
    check,
    stopTracks,
    localCheck,
    stopBroadcatVideo,
    isVideoBroadcast,
    isCameraBroadcast,
    isMicrophoneBroadcast,
  } = useMediasoupContext();

  useEffect(() => {
    // console.log(members);
  }, [members]);

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => {
          if (isConnected) {
            disconnect();
          } else {
            connect(String(chatId));
          }
        }}
        className={twJoin("", className)}
      >
        {isConnected ? "Откл" : "подкл"}
      </button>
      <button
        onClick={() => {
          if (isConnected) {
            broadcastMicro();
          } else {
          }
        }}
        className={twJoin("", className)}
      >
        Микрофон
      </button>
      <button
        onClick={() => {
          if (isConnected) {
            brodcastCamera();
          } else {
          }
        }}
        className={twJoin("", className)}
      >
        камера
      </button>
      <button
        onClick={() => {
          if (isVideoBroadcast) {
            stopBroadcatVideo();
          } else {
            brodcastVideo();
          }
        }}
        className={twJoin("", className)}
      >
        {isVideoBroadcast?"Остановить показ экрана":"Начать показ экрана"}
      </button>
      <button
        onClick={() => {
          check();
        }}
        className={twJoin("", className)}
      >
        check
      </button>
      <button
        onClick={() => {
          localCheck();
        }}
        className={twJoin("", className)}
      >
        local check
      </button>
      <button
        onClick={() => {
          stopTracks();
        }}
        className={twJoin("", className)}
      >
        stopTracks
      </button>

      {[...members.values()].map((member) => {
        // const refVideo = useRef(null);
        const userStream = getStream(member.memberId, "UserMedia");
        const displayStream = getStream(member.memberId, "DisplayMedia");
        // refVideo.current.srcObject = stream;
        return (
          <div key={member.memberId} className="flex gap-1 bg-gray-300 p-1">
            <video
              autoPlay
              playsInline
              ref={(videoEl) => {
                if (videoEl) videoEl.srcObject = userStream;
              }}
              className="bg-gray-400"
            />
            <video
              autoPlay
              playsInline
              ref={(videoEl) => {
                if (videoEl) videoEl.srcObject = displayStream;
              }}
              className="aspect-video bg-gray-400"
            />
          </div>
        );
      })}
    </div>
  );
}
