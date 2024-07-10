import type { ButtonProps } from '@/shared/ui-shad-cn/ui/button'

import { forwardRef, useState } from 'react'

import { Button } from '@/shared/ui-shad-cn/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui-shad-cn/ui/sheet'

import { AccessConnectionForm } from './access-connection-form'

type AccessConnectionButtonProps = {
  shopId: number
} & Omit<ButtonProps, 'asChild' | 'children'>

export const AccessConnectionButton = forwardRef<HTMLButtonElement, AccessConnectionButtonProps>(
  ({ shopId, ...rest }, ref) => {
    const [open, setOpen] = useState(false)

    return (
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button ref={ref} size={'sm'} variant={'ghost'} {...rest}>
            Подключение
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className={'mb-4'}>
            <SheetTitle>Добавление подключения</SheetTitle>
            <SheetDescription>Выберите нужный маркетплейс и создайте поделючение</SheetDescription>
          </SheetHeader>
          <AccessConnectionForm onSuccess={() => setOpen(false)} shopId={shopId} />
        </SheetContent>
      </Sheet>
    )
  }
)
