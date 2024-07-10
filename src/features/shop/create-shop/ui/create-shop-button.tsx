import type { ComponentPropsWithoutRef } from 'react'

import { Button } from '@/shared/ui-shad-cn/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui-shad-cn/ui/sheet'

import { CreateShopForm } from './create-shop-form'

type CreateShopButtonProps = Omit<ComponentPropsWithoutRef<typeof Button>, 'children'>

export const CreateShopButton = ({ className, ...rest }: CreateShopButtonProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button {...rest}>Добавить</Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader className={'mb-4'}>
          <SheetTitle>Добавление магазина</SheetTitle>
        </SheetHeader>

        <CreateShopForm />
      </SheetContent>
    </Sheet>
  )
}
