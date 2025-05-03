"use client";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function TabButton({
  children,
  active,
  onClick,
  visible = true,
  className = "",
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  visible?: boolean;
  className?: string;
}) {
  if (!visible) return "";
  return (
    <button
      className={twMerge(
        "hover:text-foreground rounded-[8px] px-3 py-1 text-gray-600 transition hover:bg-gray-200 dark:text-gray-200",
        active ? "text-foreground bg-gray-200 hover:bg-gray-300" : "",
        className,
      )}
      onClick={onClick}
    >
      <span>{children}</span>
    </button>
  );
}
