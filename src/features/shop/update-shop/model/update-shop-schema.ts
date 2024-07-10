import type { infer as Infer } from 'zod'

import { object, string } from 'zod'

export const MIN_LENGTH_SHOP_NAME = 3

export const updateShopSchema = object({
  name: string().min(
    MIN_LENGTH_SHOP_NAME,
    `Название магазина должно быть не короче ${MIN_LENGTH_SHOP_NAME} символов`
  ),
})

export type UpdateShopFormData = Infer<typeof updateShopSchema>
