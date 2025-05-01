import { z } from "zod";

export const LoginShema = z.object({
  email: z.string().email({
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
})
export type TypeLoginSchema = z.infer<typeof LoginShema>