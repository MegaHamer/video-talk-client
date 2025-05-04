import { twMerge } from "tailwind-merge";
import { user } from "../types/user.type";
import { ReactNode } from "react";

export function UserItem({
  user,
  className,
  type = "message",
  children,
  ...props
}: {
  user: user;
  className?: string;
  type?: "checkbox" | "request" | "message" | "space";
  children?: ReactNode;
}) {
  const status = () => {
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
    <div className={twMerge("w-full", className)} {...props}>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row">
          <div className="me-2 flex aspect-square h-10 items-center justify-center overflow-hidden rounded-lg bg-gray-600">
            {/* img */}1
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
                  status().color == "green" ? "bg-green-500" : "",
                  status().color == "red" ? "bg-red-500" : "",
                  status().color == "orange" ? "bg-orange-500" : "",
                  status().color == "gray" ? "bg-gray-500" : "",
                )}
              ></div>
              <span className="text-sm text-nowrap">{status().name}</span>
            </div>
          </div>
          <span></span>
        </div>
        {children}
      </div>
    </div>
  );
}
