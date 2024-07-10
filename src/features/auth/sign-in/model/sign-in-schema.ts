import type { infer as Infer } from 'zod'

import { object, string } from 'zod'

export const MIN_LENGTH_PASSWORD = 6

export const signInSchema = object({
  email: string().email('ВВедите правильный емэйл'),
  password: string()
    .min(MIN_LENGTH_PASSWORD, `Используйте ${MIN_LENGTH_PASSWORD} знаков или больше`)
    .regex(/^\S.*\S$/, 'Пароль не может начинаться или заканчиваться с пробела'),
})

export type SignInFormData = Infer<typeof signInSchema>
