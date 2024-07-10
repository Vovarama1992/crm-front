import type { SignInFormData } from '../model/sign-in-schema'

import type { ComponentPropsWithoutRef } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useSignInMutation } from '@/entities/session'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { cn } from '@/shared/lib/tailwind'
import { TextField } from '@/shared/ui/text-field'
import { Button } from '@/shared/ui-shad-cn/ui/button'
import { useToast } from '@/shared/ui-shad-cn/ui/use-toast'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'

import { signInSchema } from '../model/sign-in-schema'

type SignInFormProps = Omit<ComponentPropsWithoutRef<'form'>, 'children' | 'onSubmit'>

export const SignInForm = ({ className, ...rest }: SignInFormProps) => {
  const { toast } = useToast()

  const {
    control,
    formState: { dirtyFields, errors },
    handleSubmit,
    register,
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInSchema),
  })

  const [login, { isLoading }] = useSignInMutation()
  const isAllDirtyFields = dirtyFields.password && dirtyFields.email

  const navigate = useNavigate()

  const onSubmit = handleSubmit(data => {
    login(data)
      .unwrap()
      .then(response => {
        localStorage.setItem('token', response.access_token)

        navigate(ROUTER_PATHS.HOME, { replace: true })
        window.location.reload() // Перезагрузка страницы после навигации
      })

      .catch(error => {
        toast({
          description: JSON.stringify(error.data),
          title: 'Sign In Error',
          variant: 'destructive',
        })
      })
  })

  return (
    <form className={cn('grid gap-4 ', className)} noValidate {...rest} onSubmit={onSubmit}>
      <TextField.Email
        {...register('email')}
        errorMessage={errors.email?.message}
        label={'Почта'}
        placeholder={'email@example.com'}
      />

      <TextField.Password
        {...register('password')}
        errorMessage={errors.password?.message}
        label={'Пароль'}
        placeholder={'******'}
      />

      <Button
        className={'w-full mt-[38px]'}
        disabled={isLoading || !isAllDirtyFields}
        type={'submit'}
      >
        Войти
      </Button>

      {import.meta.env.DEV && <DevTool control={control} />}
    </form>
  )
}
