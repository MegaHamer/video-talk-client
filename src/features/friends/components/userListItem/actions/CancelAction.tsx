import { useCancelRequest } from "@/features/friends/hooks/useCancelRequest";
import { IoClose } from "react-icons/io5";

interface CancelActionProps {
  userId: number;
}

export function CancelAction({ userId }: CancelActionProps) {
  const { mutate: cancelRequest } = useCancelRequest();
  return (
    <button
      onClick={() => cancelRequest(userId)}
      className="flex aspect-square h-10 items-center justify-center rounded-full text-gray-600 transition group-hover:bg-gray-300 hover:text-black"
    >
      <IoClose size={24} />
    </button>
  );
}
