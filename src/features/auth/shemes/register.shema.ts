import { z } from "zod";

export const RegisterShema = z.object({
  username: z.string().min(1, {
    message: "Введите логин",
  }).max(20,{message:"Логин не должен быть длинее 20 символов"}),
  email: z.string().min(1, {
    message: "Введите почту",
  }).email({
    message: "Некорректная почта",
  }),
  password: z
    .string()
    .min(6, { message: "Пароль должен содежать минимум 6 символов" })
    .max(32, { message: "Пароль должен содержать максимум 32 символа" })
    .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/, {
      message:
        "Пароль должен содержать как минимум 1 цифру, 1 строчную букву и 1 заглавную букву",
    }),
  passwordRepeat: z
    .string()
    .min(6, {
      message: "Пароль подтверждения должен содежать минимум 6 символов",
    })
    .max(32, {
      message: "Пароль подтверждения должен содержать максимум 32 символа",
    })
    // .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/, {
    //   message:
    //     "Пароль подтверждения должен содержать как минимум 1 цифру, 1 строчную букву и 1 заглавную букву",
    // }),
}).refine(data => data.password === data.passwordRepeat,{
    message:"Пароли не совпадают",
    path:['passwordRepeat']
})

export type TypeRegisterSchema = z.infer<typeof RegisterShema>