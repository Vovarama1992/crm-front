import type { CreateShopFormData } from '../model/create-shop-schema'

import type { ComponentPropsWithoutRef } from 'react'
import { useForm } from 'react-hook-form'

import { useMeQuery } from '@/entities/session'
import { useCreateShopMutation } from '@/entities/shop'
import { cn } from '@/shared/lib/tailwind'
import { TextField } from '@/shared/ui/text-field'
import { Button } from '@/shared/ui-shad-cn/ui/button'
import { useToast } from '@/shared/ui-shad-cn/ui/use-toast'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'

import { createShopSchema } from '../model/create-shop-schema'

type CreateShopFormProps = Omit<ComponentPropsWithoutRef<'form'>, 'children' | 'onSubmit'>

export const CreateShopForm = ({ className, ...rest }: CreateShopFormProps) => {
  const { toast } = useToast()
  const { data: user } = useMeQuery()

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    register,
    resetField,
  } = useForm<CreateShopFormData>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(createShopSchema),
  })

  const [createShop, { isLoading }] = useCreateShopMutation()

  const onSubmit = handleSubmit(({ name }) => {
    createShop({ name, owner: user?.id_user ?? 0 })
      .unwrap()
      .then(res => {
        resetField('name')
        toast({
          description: 'Магазин создан, его ID: ' + res.id_shop,
          title: 'Магазин успешно создан',
        })
      })
      .catch(error => {
        toast({
          description: JSON.stringify(error),
          title: 'Произошла ошибка',
          variant: 'destructive',
        })
      })
  })

  return (
    <form className={cn('grid gap-4', className)} noValidate {...rest} onSubmit={onSubmit}>
      <TextField
        errorMessage={errors.name?.message}
        label={'Название магазина'}
        {...register('name')}
      />

      <Button disabled={isLoading || !isDirty} type={'submit'}>
        Создать магазин
      </Button>

      {import.meta.env.DEV && <DevTool control={control} />}
    </form>
  )
}
