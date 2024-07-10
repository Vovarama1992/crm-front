import type { infer as Infer } from 'zod'

import { object, string } from 'zod'

/**
 * TODO: сделать проверку, добавить ошибки
 */
export const accessConnectionSchema = object({
  apiKey: string(),
  clientId: string(),
  connection: string(),
})

export type AccessConnectionFormData = Infer<typeof accessConnectionSchema>
