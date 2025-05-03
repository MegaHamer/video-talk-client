"use client";
import { useForm } from "react-hook-form";
import { AuthWrapper } from "./AuthWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLabeledInput from "./AuthLabeledInput";
import { IoIosMail } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { TbLockPassword } from "react-icons/tb";
import Link from "next/link";
import { LoginShema, TypeLoginSchema } from "../shemes/login.shema";
import useLoginMutation from "../hooks/useLoginMutation";
import { useEffect } from "react";
import { error } from "console";

export default function LoginForm({}) {
  const form = useForm<TypeLoginSchema>({
    resolver: zodResolver(LoginShema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const {login,isError,error} = useLoginMutation()

  const onSubmit = (values: TypeLoginSchema) => {
    
    login(values)

  };
  useEffect(()=>{
    if (isError){
      console.log(error)
    }
  },[isError])
  return (
    <AuthWrapper heading="Войти">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AuthLabeledInput
          label="Email"
          inputName="email"
          form={form}
          icon={
            <IoIosMail
              className="size-6 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
            />
          }
          className="mb-2"
        />
        <AuthLabeledInput
          label="Пароль"
          inputName="password"
          form={form}
          icon={
            <TbLockPassword
              className="size-6 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
            />
          }
          secure={true}
          className="mb-2"
        />
        <div className="flex justify-center">
          <button
            className="rounded-md bg-blue-400 px-2 py-1 text-xl text-gray-50"
            type="submit"
          >
            Войти в аккаунт
          </button>
        </div>
      </form>
      <div className="mt-6 flex justify-center">
        <Link
          href={"/auth/register"}
          className="relative w-fit text-center font-normal after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:transform after:bg-current after:transition-all after:duration-300 after:content-[''] hover:after:w-full"
        >
          Еще нет аккаунта? Регистрация
        </Link>
      </div>
    </AuthWrapper>
  );
}
