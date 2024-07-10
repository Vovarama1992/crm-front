import type { ShopDto } from '@/entities/shop'

import type { ComponentPropsWithoutRef } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui-shad-cn/ui/dialog'

import { UpdateShopForm } from './update-shop-form'

type UpdateShopButtonProps = {
  shop: ShopDto
} & ComponentPropsWithoutRef<typeof DialogTrigger>

export const UpdateShopButton = ({ shop }: UpdateShopButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger>Изменить</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Изменение магазина</DialogTitle>
        </DialogHeader>

        <UpdateShopForm shop={shop} />
      </DialogContent>
    </Dialog>
  )
}
