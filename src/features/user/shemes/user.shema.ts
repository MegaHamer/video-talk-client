import { z } from "zod";

export const updateUserSchema = z.object({
  globalName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  avatar: z.any() // Изменяем валидацию для файлов
    .refine((file) => !file || (typeof window !== 'undefined' && file instanceof FileList), {
      message: "Необходимо выбрать файл",
    })
    .refine((file) => !file?.[0] || file[0].size <= 5 * 1024 * 1024, {
      message: "Максимальный размер файла - 5MB",
    })
    .refine((file) => !file?.[0] || ['image/jpeg', 'image/png', 'image/webp'].includes(file[0].type), {
      message: "Поддерживаются только .jpg, .png и .webp форматы",
    }),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
