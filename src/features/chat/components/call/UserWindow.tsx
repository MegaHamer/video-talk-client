import { useMediasoupContext } from "@/shared/components/providers/MediasoupProvider";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

export function UserWindow({
  name,
  stream,
  className,
  mute=false
}: {
  name: string;
  stream: MediaStream;
  className: string;
  mute?:boolean
}) {
  useEffect(()=>{
    console.log("перерисовка")
  },[])
  return (
    <div
      className={twMerge(
        "relative aspect-video overflow-hidden rounded-lg bg-black p-2",
        className,
      )}
    >
      {stream?.getTracks().length > 0 && (
        <>
          <video
            className="absolute z-0 top-0 left-0 h-full w-full"
            playsInline
            autoPlay
            ref={(videoEl) => {
              if (videoEl) videoEl.srcObject = stream;
            }}
            muted={mute}
          ></video>
        </>
      )}
      <span className="absolute z-1 bottom-1 left-1 bg-gray-200 rounded-sm px-0.5 text-sm/tight font-semibold">{name}</span>
    </div>
  );
}
