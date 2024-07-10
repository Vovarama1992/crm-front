import type { UpdateShopFormData } from '../model/update-shop-schema'
import type { ShopDto } from '@/entities/shop'

import type { ComponentPropsWithoutRef } from 'react'
import { useForm } from 'react-hook-form'

import { useUpdateShopMutation } from '@/entities/shop'
import { cn } from '@/shared/lib/tailwind'
import { TextField } from '@/shared/ui/text-field'
import { Button } from '@/shared/ui-shad-cn/ui/button'
import { useToast } from '@/shared/ui-shad-cn/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'

import { updateShopSchema } from '../model/update-shop-schema'

type UpdateShopFormProps = {
  shop: ShopDto
} & Omit<ComponentPropsWithoutRef<'form'>, 'children' | 'onSubmit'>

export const UpdateShopForm = ({ className, shop, ...rest }: UpdateShopFormProps) => {
  const { toast } = useToast()

  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
  } = useForm<UpdateShopFormData>({
    defaultValues: {
      name: shop?.name_shop ?? '',
    },
    resolver: zodResolver(updateShopSchema),
  })

  const [updateShop, { isLoading }] = useUpdateShopMutation()

  const onSubmit = handleSubmit(({ name }) => {
    updateShop({ id: shop.id_shop, name })
      .unwrap()
      .then(() => {
        toast({
          title: 'Магазин успешно обновлён',
        })
      })
      .catch(error => {
        toast({
          description: JSON.stringify(error),
          title: 'Ошибка!',
          variant: 'destructive',
        })
      })
  })

  return (
    <form className={cn('grid gap-4', className)} noValidate {...rest} onSubmit={onSubmit}>
      <TextField
        {...register('name')}
        errorMessage={errors.name?.message}
        label={'Название магазина'}
      />

      <Button disabled={isLoading || !isDirty}>Обновить магазин</Button>

      {/*{import.meta.env.DEV && <DevTool control={control} />}*/}
    </form>
  )
}
