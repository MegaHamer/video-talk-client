import useUserStore from "@/shared/hooks/mediasoup/localUser/localUserStore";
import { useMediasoupStore } from "@/shared/hooks/mediasoup/newUseMediasoup";
import { memo } from "react";
import { BsFillCameraVideoFill, BsFillCameraVideoOffFill } from "react-icons/bs";

const CameraButton = memo(({ className }: { className?: string }) => {
  const {
    localUser: { isCameraShare },
  } = useUserStore();
  const { produceCamera, stopProduceCamera } = useMediasoupStore();
  const handleCameraClick = () => {
    if (isCameraShare) {
      stopProduceCamera();
    } else {
      produceCamera();
    }
  };
  return (
    <button onClick={handleCameraClick} className={className}>
      {isCameraShare ? (
        <BsFillCameraVideoOffFill className="h-5 w-5" />
      ) : (
        <BsFillCameraVideoFill className="h-5 w-5" />
      )}
    </button>
  );
});

CameraButton.displayName = "CameraButton";

export default CameraButton;
