import useUserStore from "@/shared/hooks/mediasoup/localUser/localUserStore";
import { useMediasoupStore } from "@/shared/hooks/mediasoup/newUseMediasoup";
import { memo } from "react";
import {
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
} from "react-icons/bs";
import { LuMonitorOff, LuMonitorUp } from "react-icons/lu";

const DisplayButton = memo(({ className }: { className?: string }) => {
  const {
    localUser: { isScreenShare },
  } = useUserStore();
  const { produceVideo, stopProduceVideo } = useMediasoupStore();
  const handleDisplayClick = () => {
    if (isScreenShare) {
      stopProduceVideo();
    } else {
      produceVideo();
    }
  };
  return (
    <button onClick={handleDisplayClick} className={className}>
      {isScreenShare ? (
        <LuMonitorOff className="h-5 w-5" />
      ) : (
        <LuMonitorUp className="h-5 w-5" />
      )}
    </button>
  );
});

DisplayButton.displayName = "DisplayButton";

export default DisplayButton;
