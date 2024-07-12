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
  { name: 'Директор', value: 'Директор' },
  { name: 'Бухгалтер', value: 'Бухгалтер' },
  { name: 'РОП', value: 'РОП' },
  { name: 'Закупщик', value: 'Закупщик' },
  { name: 'Логист', value: 'Логист' },
  { name: 'Менеджер', value: 'Менеджер' },
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
      roleName: '',
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
    if (!roleName) {
      alert('roleName is empty')
    } else {
      alert('roleName:' + roleName)

      return
    }
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

      <TextField.Password
        {...register('password')}
        errorMessage={errors.password?.message}
        label={'Пароль'}
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
