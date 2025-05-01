"use client";
import Input from "@/shared/components/ui/Input";
import { MouseEvent, PropsWithChildren, ReactNode, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

interface AuthLabelesInput {
  label?: string;
  inputName: string;
  icon?: ReactNode;
  placeholder?: string;
  form: UseFormReturn<any>;
  secure?: boolean;
  className?: string;
  inputClassName?: string;
  typeInput?: string;
}

export default function AuthLabeledInput({
  inputName,
  icon,
  children,
  label,
  placeholder,
  form,
  className = "",
  inputClassName = "",
  secure = false,
  typeInput,
}: PropsWithChildren<AuthLabelesInput>) {
  const errors = form.formState.errors;
  const errorMessage = errors?.[inputName]?.message?.toString();
  const [showPassword, setShowPassword] = useState(false);

  const onClick = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  };

  return (
    <div className={twMerge("relative z-0 mb-5 w-full", className)}>
      {label && (
        <label
          htmlFor="inputName"
          className="mb-2 text-lg font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
      )}
      <div className="group flex">
        {icon && (
          <span className="flex w-10 items-center justify-center rounded-s-md border border-e-0 border-gray-300 bg-gray-200 text-sm transition-colors duration-200  peer-focus:text-blue-500">
            {icon}
          </span>
        )}
        <div className="relative w-full">
          <Input
            id="inputName"
            type={secure && !showPassword ? "password" : "text"}
            className={twMerge(
              "w-full rounded-e-lg border border-gray-300 bg-gray-50 px-2 py-1 text-sm text-gray-900 outline-none",
              icon ? "rounded-s-none border-s-0" : "rounded-s-lg",
              secure ? "pr-10" : "",
              inputClassName,
            )}
            {...form.register(inputName)}
            placeholder={placeholder}
          />
          {secure && (
            <button
              tabIndex={-1}
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5" />
              ) : (
                <FiEye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>
      <div
        className={twMerge(
          "mt-2 transform transition-[height] duration-300 ease-in-out",
          errorMessage ? "h-auto" : "h-0",
        )}
      >
        {errorMessage && <p className="text-red-500 text-sm font-semibold">{errorMessage}</p>}
      </div>
    </div>
  );
}
