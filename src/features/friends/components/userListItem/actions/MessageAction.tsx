import { useCancelRequest } from "@/features/friends/hooks/useCancelRequest";
import { IoClose } from "react-icons/io5";
import { PiChatCircleFill } from "react-icons/pi";

interface CancelActionProps {
  userId: number;
}

export function MessageAction({ userId }: CancelActionProps) {
//   const { mutate: cancelRequest } = useCancelRequest();
  return (
    <button className="flex aspect-square h-10 items-center justify-center rounded-full text-gray-600 transition group-hover:bg-gray-300 hover:text-black">
      <PiChatCircleFill size={24} />
    </button>
  );
}
