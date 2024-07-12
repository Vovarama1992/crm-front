import type { SignUpFormData } from '../model/sign-up-schema'

import { useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useSignUpMutation } from '@/entities/session'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { RoleSelect } from '@/shared/ui/RoleSelect'
import { TextField } from '@/shared/ui/text-field'
import { Button } from '@/shared/ui-shad-cn/ui/button'
import { useToast } from '@/shared/ui-shad-cn/ui/use-toast'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'

const roles = [
  { name: 'Менеджер', value: 'Менеджер' },
  { name: 'Директор', value: 'Директор' },
  { name: 'Бухгалтер', value: 'Бухгалтер' },
  { name: 'РОП', value: 'РОП' },
  { name: 'Закупщик', value: 'Закупщик' },
  { name: 'Логист', value: 'Логист' },
]

import { signUpSchema } from '../model/sign-up-schema'

type SignUpFormProps = Omit<ComponentPropsWithoutRef<'form'>, 'children' | 'onSubmit'>

export const SignUpForm = (props: SignUpFormProps) => {
  const [isRoleSelected, setRole] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const {
    control,
    formState: { dirtyFields, errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      roleName: 'Менеджер',
      surname: '',
    },
    resolver: zodResolver(signUpSchema),
  })

  const [signUp, { isLoading }] = useSignUpMutation()

  const handleRoleChange = (selectedValue: string) => {
    setValue('roleName', selectedValue)
    setRole(true)
  }

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
    dirtyFields.middleName &&
    dirtyFields.password

  return (
    <form className={'grid gap-4'} noValidate {...props} onSubmit={onSubmit}>
      <RoleSelect handleRoleChange={handleRoleChange} roles={roles} />

      <TextField
        {...register('name')}
        errorMessage={errors.name?.message}
        label={'Имя'}
        onFocus={() => setValue('password', '')}
        placeholder={'Ваше имя'}
      />

      <TextField
        {...register('middleName')}
        errorMessage={errors.surname?.message}
        label={'Отчество'}
        onFocus={() => setValue('password', '')}
        placeholder={'Ваше отчество'}
      />

      <TextField
        {...register('surname')}
        errorMessage={errors.surname?.message}
        label={'Фамилия'}
        onFocus={() => setValue('password', '')}
        placeholder={'Ваша фамилия'}
      />

      <TextField.Email
        {...register('email')}
        errorMessage={errors.email?.message}
        label={'Почта'}
        onFocus={() => setValue('password', '')}
        placeholder={'email@example.com'}
      />

      <TextField.Password
        {...register('password')}
        errorMessage={errors.password?.message}
        label={'Пароль'}
        onFocus={() => setValue('password', '')}
        placeholder={'******'}
      />

      <Button
        className={'w-full mt-[35px] h-[40px]'}
        disabled={isLoading || !isAllFieldsDirty || !isRoleSelected}
        type={'submit'}
      >
        Зарегистрировать
      </Button>

      {import.meta.env.DEV && <DevTool control={control} />}
    </form>
  )
}
