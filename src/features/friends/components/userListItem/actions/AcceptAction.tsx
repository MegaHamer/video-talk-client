import { useAcceptRequest } from "@/features/friends/hooks/useAcceptRequest";
import { FaCheck } from "react-icons/fa6";

interface CancelActionProps {
  userId: number;
}

export function AcceptAction({ userId }: CancelActionProps) {
  const { mutate: acceptRequest } = useAcceptRequest();
  return (
    <button
      onClick={() => acceptRequest(userId)}
      className="flex aspect-square h-10 items-center justify-center rounded-full text-gray-600 transition group-hover:bg-gray-300 hover:text-black"
    >
      <FaCheck size={24} />
    </button>
  );
}
