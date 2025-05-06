import { twMerge } from "tailwind-merge";
import { user } from "../../types/user.type";
import { ReactNode } from "react";
import { PiChatCircleFill } from "react-icons/pi";
import { UserInfo } from "./userInfo";
import { request } from "../../types/request.type";
import { CancelAction } from "./actions/CancelAction";
import { AcceptAction } from "./actions/AcceptAction";

export function RequestListItem({
  request,
  className,
  children,
  ...props
}: {
  request: request;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={twMerge("w-full group", className)} {...props}>
      <div className="flex flex-row items-center justify-between">
        <UserInfo user={request} />
        <div className="flex flex-row">
          {request.role == "recipient" && <AcceptAction userId={request.id} />}
          <CancelAction userId={request.id} />
        </div>
        {children}
      </div>
    </div>
  );
}
