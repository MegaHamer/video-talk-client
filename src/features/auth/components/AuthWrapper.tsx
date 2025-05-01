import { type PropsWithChildren } from "react";

interface AuthWrapperProps {
  heading: string;
}

export function AuthWrapper({
  children,
  heading,
}: PropsWithChildren<AuthWrapperProps>) {
  return (
    <div className="flex flex-col gap-4 border-gray-200 bg-background w-[400px] rounded-2xl p-8 border-2">
      <h2 className="cursor-default text-center text-3xl font-semibold">
        {heading}
      </h2>
      <div className="w-full">{children}</div>
    </div>
  );
}
