import type { SignUpFormData } from '../model/sign-up-schema'

import type { ComponentPropsWithoutRef } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useSignUpMutation } from '@/entities/session'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { TextField } from '@/shared/ui/text-field'
import { Button } from '@/shared/ui-shad-cn/ui/button'
import { useToast } from '@/shared/ui-shad-cn/ui/use-toast'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'

import { signUpSchema } from '../model/sign-up-schema'

type SignUpFormProps = Omit<ComponentPropsWithoutRef<'form'>, 'children' | 'onSubmit'>

export const SignUpForm = (props: SignUpFormProps) => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const {
    control,
    formState: { dirtyFields, errors },
    handleSubmit,
    register,
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      roleName: '',
      surname: '',
    },
    resolver: zodResolver(signUpSchema),
  })

  const [signUp, { isLoading }] = useSignUpMutation()

  const onSubmit = handleSubmit(({ email, middleName, name, password, roleName, surname }) => {
    signUp({ email, middleName, name, password, roleName, surname })
      .unwrap()
      .then(user => {
        toast({
          description: `Мы отправили сообщение почту ${user.email}`,
          title: 'Sign Up Success',
          type: 'background',
        })

        navigate(ROUTER_PATHS.HOME, { replace: true })
      })
      .catch(error => {
        toast({
          description: JSON.stringify(error.data),
          title: 'Sign Up Error',
          variant: 'destructive',
        })
      })
  })

  const isAllFieldsDirty =
    dirtyFields.name &&
    dirtyFields.surname &&
    dirtyFields.email &&
    dirtyFields.roleName &&
    dirtyFields.middleName &&
    dirtyFields.password

  return (
    <form className={'grid gap-4'} noValidate {...props} onSubmit={onSubmit}>
      <TextField
        {...register('name')}
        errorMessage={errors.name?.message}
        label={'Имя'}
        placeholder={'Ваше имя'}
      />

      <TextField
        {...register('middleName')}
        errorMessage={errors.surname?.message}
        label={'Отчество'}
        placeholder={'Ваше отчество'}
      />

      <TextField
        {...register('surname')}
        errorMessage={errors.surname?.message}
        label={'Фамилия'}
        placeholder={'Ваша фамилия'}
      />

      <TextField.Email
        {...register('email')}
        errorMessage={errors.email?.message}
        label={'Почта'}
        placeholder={'email@example.com'}
      />

      <TextField
        {...register('roleName')}
        errorMessage={errors.roleName?.message}
        label={'Роль'}
        placeholder={'Ваша роль'}
      />

      <TextField.Password
        {...register('password')}
        errorMessage={errors.password?.message}
        label={'Пароль'}
        placeholder={'******'}
      />

      <Button
        className={'w-full mt-[35px] h-[40px]'}
        disabled={isLoading || !isAllFieldsDirty}
        type={'submit'}
      >
        Зарегистрировать
      </Button>

      {import.meta.env.DEV && <DevTool control={control} />}
    </form>
  )
}
