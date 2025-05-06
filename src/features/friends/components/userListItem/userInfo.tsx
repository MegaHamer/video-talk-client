import { twMerge } from "tailwind-merge";
import { user } from "../../types/user.type";

interface UserInfoProps {
  user: user;
}

export function UserInfo({ user }: UserInfoProps) {
  const statusInfo = () => {
    switch (user.status) {
      case "ONLINE":
        return { name: "В сети", color: "green" };
        break;
      case "IDLE":
        return { name: "Не активен", color: "orange" };
        break;
      case "DND":
        return { name: "Не беспокоить", color: "red" };
        break;
      case "OFFLINE":
        return { name: "Не в сети", color: "gray" };
        break;
      default:
        return { name: user.status, color: "gray" };
        break;
    }
  };
  return (
    <div className="flex flex-row">
      <div className="me-2 flex aspect-square h-10 items-center justify-center overflow-hidden rounded-lg bg-gray-600">
        {/* img */}img
      </div>
      <div className="flex flex-col">
        <div className="flex items-center overflow-hidden">
          <span className="h-5 overflow-hidden text-base/[20px]">
            {user.username}
          </span>
        </div>
        <div className="flex flex-row items-center">
          <div
            className={twMerge(
              "me-1 aspect-square h-3.5 rounded-full",
              `bg-${statusInfo().color}-500`,
            )}
          ></div>
          <span className="text-sm text-nowrap">{statusInfo().name}</span>
        </div>
      </div>
      <span></span>
    </div>
  );
}
