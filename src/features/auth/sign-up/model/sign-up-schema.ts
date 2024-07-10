import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().email('Некорректный email').nonempty('Email обязателен'),
  middleName: z.string(),
  name: z.string().nonempty('Имя обязательно'),
  password: z
    .string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .regex(/(?=.*[0-9])/, 'Пароль должен содержать хотя бы одну цифру')
    .regex(/(?=.*[a-z])/, 'Пароль должен содержать хотя бы одну строчную букву')
    .regex(/(?=.*[A-Z])/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .regex(
      /(?=.*[!@#$%^&*(),.?":{}|<>])/,
      'Пароль должен содержать хотя бы один специальный символ'
    ),
  roleName: z.string().nonempty('Роль обязательна'),
  surname: z.string().nonempty('Фамилия обязательна'),
})

export type SignUpFormData = z.infer<typeof signUpSchema>
