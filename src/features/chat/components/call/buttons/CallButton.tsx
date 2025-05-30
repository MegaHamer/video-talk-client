import { useMediasoupContext } from "@/shared/components/providers/MediasoupProvider";
import { useMediasoupStore } from "@/shared/hooks/mediasoup/newUseMediasoup";

export function CallButton({
  chatId,
  children,
  className = "",
}: {
  chatId: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { connect, disconnect, isConnected } = useMediasoupStore();
  const handlerClick = () => {
    if (isConnected) {
      disconnect();
    }
    connect(String(chatId));
  };
  return (
    <button className={className} onClick={handlerClick}>
      {children}
    </button>
  );
}
