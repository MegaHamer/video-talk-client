import useUserStore from "@/shared/hooks/mediasoup/localUser/localUserStore";
import { useMediasoupStore } from "@/shared/hooks/mediasoup/newUseMediasoup";
import { memo } from "react";
import { FaPhoneSlash } from "react-icons/fa6";

const DisconnectButton = memo(({ className }: { className?: string }) => {
  
  const { disconnect } = useMediasoupStore();
  const handleDisconnectClick = () => {
    disconnect();
  };
  return (
    <button onClick={handleDisconnectClick} className={className}>
      <div className="px-2">
        <FaPhoneSlash className="h-5 w-5" />
      </div>
    </button>
  );
});

DisconnectButton.displayName = "DisconnectButton";

export default DisconnectButton;
