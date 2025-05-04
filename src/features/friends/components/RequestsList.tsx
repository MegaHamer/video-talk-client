import { PiChatCircleFill, PiChatDuotone } from "react-icons/pi";
import { useRequests } from "../hooks/useRequests";
import { UserItem } from "./userItem";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useCancelRequest } from "../hooks/useCancelRequest";
import { useAcceptRequest } from "../hooks/useAcceptRequest";

export function RequestsList({ className = "" }) {
  const { data: requests = [], isLoading } = useRequests();

  const {mutate:acceptRequest} = useAcceptRequest()
  const {mutate:cancelRequest} = useCancelRequest()

  return (
    <div className={`${className}`}>
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">
          Загрузка запросов...
        </div>
      ) : requests.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          Нет запрсов дружбы, ожидающих подтверждения.
        </div>
      ) : (
        requests.map((request) => (
          <UserItem
            className="group"
            type={"request"}
            key={request.id}
            user={request}
          >
            <div className="flex flex-row gap-2.5">
              {request.role == "recipient" && (
                <button onClick={()=>acceptRequest(request.friendshipId)}  className="flex aspect-square h-10 items-center justify-center rounded-full text-gray-600 transition group-hover:bg-gray-300 hover:text-black">
                  <FaCheck size={24} />
                </button>
              )}
              <button onClick={()=>cancelRequest(request.friendshipId)} className="flex aspect-square h-10 items-center justify-center rounded-full text-gray-600 transition group-hover:bg-gray-300 hover:text-black">
                <IoClose size={24} />
              </button>
            </div>
          </UserItem>
        ))
      )}
    </div>
  );
}
