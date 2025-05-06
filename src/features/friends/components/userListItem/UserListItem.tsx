import { twMerge } from "tailwind-merge";
import { user } from "../../types/user.type";
import { ReactNode } from "react";
import { UserInfo } from "./userInfo";
import { MessageAction } from "./actions/MessageAction";
import { CancelAction } from "./actions/CancelAction";

export function UserListItem({
  user,
  className,
  children,
  ...props
}: {
  user: user;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={twMerge("w-full", className)} {...props}>
      <div className="flex flex-row items-center justify-between">
        <UserInfo user={user} />
        <div className="flex flex-row">
          <MessageAction userId={user.id} />
          <CancelAction userId={user.id}/>
        </div>
        {children}
      </div>
    </div>
  );
}
