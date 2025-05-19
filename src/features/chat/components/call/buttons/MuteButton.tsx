import useUserStore from "@/shared/hooks/mediasoup/localUser/localUserStore";
import { memo } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const MuteButton = memo(({ className }: { className?: string }) => {
  const {
    localUser: { isMuted },
    toggleMute,
  } = useUserStore();
  const handleMicrophoneClick = () => {
    toggleMute();
  };
  return (
    <button
      onClick={handleMicrophoneClick}
      className={className}
    >
      {isMuted ? (
        <FaMicrophoneSlash className="h-5 w-5" />
      ) : (
        <FaMicrophone className="h-5 w-5" />
      )}
    </button>
  );
});

MuteButton.displayName = "MuteButton";

export default MuteButton;
