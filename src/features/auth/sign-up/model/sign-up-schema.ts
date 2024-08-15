import { z } from 'zod'

export const signUpSchema = z.object({
  address: z.string().optional(),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Дата рождения должна быть в формате YYYY-MM-DD')
    .optional(),
  cardNumber: z.string().optional(),
  department_id: z.string().optional(),
  dobNumber: z.string().optional(),
  email: z.string().email('Некорректный email').nonempty('Email обязателен'),
  hireDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Дата приема на работу должна быть в формате YYYY-MM-DD')
    .optional(),
  isActive: z.boolean().optional(), // Добавлено поле isActive
  managed_by: z.string().optional(), // Изменено на number
  margin_percent: z.string().optional(),
  middleName: z.string().nonempty('Отчество обязательно'),
  mobile: z.string().regex(/^\+7\d{10}$/, 'Мобильный телефон должен быть в формате +7XXXXXXXXXX'),
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
  position: z.string().optional(),
  roleName: z.string().nonempty('Роль обязательна'),
  salary: z.number().optional(),
  surname: z.string().nonempty('Фамилия обязательна'),
})

export type SignUpFormData = z.infer<typeof signUpSchema>
