import type { infer as Infer } from 'zod'

import { object, string } from 'zod'

export const MIN_LENGTH_SHOP_NAME = 3

export const createShopSchema = object({
  name: string()
    .min(MIN_LENGTH_SHOP_NAME, `Use ${MIN_LENGTH_SHOP_NAME} characters or more for your shop name`)
    .regex(/^\S.*\S$/, 'Your shop name can’t start or end with a blank space'),
})

export type CreateShopFormData = Infer<typeof createShopSchema>
