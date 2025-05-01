"use client";
import { useForm } from "react-hook-form";
import { AuthWrapper } from "./AuthWrapper";
import { RegisterShema, TypeRegisterSchema } from "../shemes/register.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLabeledInput from "./AuthLabeledInput";
import { IoIosMail } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { TbLockPassword } from "react-icons/tb";
import Link from "next/link";
import useRegisterMutation from "../hooks/useRegisterMutation";

export default function RegisterForm({}) {
  const form = useForm<TypeRegisterSchema>({
    resolver: zodResolver(RegisterShema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordRepeat: "",
    },
    mode: "onBlur",
  });
  const errors = form.formState.errors;

  const { register, isLoading } = useRegisterMutation();

  const onSubmit = (values: TypeRegisterSchema) => {
    console.log(values);
    register(values)
  };
  return (
    <AuthWrapper heading="Регистрация">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AuthLabeledInput
          label="Логин"
          inputName="username"
          form={form}
          icon={
            <FaUser
              className="size-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
            />
          }
          className="mb-2"
        />
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
        <AuthLabeledInput
          label="Повтор пароля"
          inputName="passwordRepeat"
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
            Отправить
          </button>
        </div>
      </form>
      <div className="mt-6 flex justify-center">
        <Link
          href={"/auth/login"}
          className="relative w-fit text-center font-normal after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:transform after:bg-current after:transition-all after:duration-300 after:content-[''] hover:after:w-full"
        >
          Уже есть аккаунт? Войти
        </Link>
      </div>
    </AuthWrapper>
  );
}
