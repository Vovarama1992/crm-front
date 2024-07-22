import type { SignUpFormData } from '../model/sign-up-schema'

import { useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useSignUpMutation } from '@/entities/session'
import { WorkerDto } from '@/entities/workers'
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
  const [isRoleSelected, setRole] = useState(true)
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
        // Сохраняем сотрудника в localStorage
        const workersData = JSON.parse(localStorage.getItem('workers') || '[]') as WorkerDto[]
        const newWorker: WorkerDto = {
          birthday: '', // Оставьте пустым или добавьте логику для его заполнения
          cardNumber: '', // Оставьте пустым или добавьте логику для его заполнения
          department: '', // Оставьте пустым или добавьте логику для его заполнения
          dobNumber: '', // Оставьте пустым или добавьте логику для его заполнения
          email,
          hireDate: '', // Оставьте пустым или добавьте логику для его заполнения
          manager: '', // Оставьте пустым или добавьте логику для его заполнения
          mobile: '', // Оставьте пустым или добавьте логику для его заполнения
          name,
          position: '', // Оставьте пустым или добавьте логику для его заполнения
          roleName,
          salary: '', // Оставьте пустым или добавьте логику для его заполнения
          table_id:
            workersData.length > 0
              ? Math.max(...workersData.map(worker => worker.table_id)) + 1
              : 1,
        }

        workersData.push(newWorker)
        localStorage.setItem('workers', JSON.stringify(workersData))

        toast({
          description: `Мы отправили сообщение на почту ${user.email}`,
          title: 'Регистрация успешна',
          type: 'background',
        })

        navigate(ROUTER_PATHS.HOME, { replace: true })
      })
      .catch(error => {
        toast({
          description: JSON.stringify(error.data),
          title: 'Ошибка регистрации',
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
    <form className={'grid gap-4'} noValidate translate={'no'} {...props} onSubmit={onSubmit}>
      <RoleSelect handleRoleChange={handleRoleChange} roles={roles} />

      <TextField
        {...register('name')}
        errorMessage={errors.name?.message}
        label={'Имя'}
        onFocus={() => setValue('password', '')}
        placeholder={''}
      />

      <TextField
        {...register('middleName')}
        errorMessage={errors.surname?.message}
        label={'Отчество'}
        onFocus={() => setValue('password', '')}
        placeholder={''}
      />

      <TextField
        {...register('surname')}
        errorMessage={errors.surname?.message}
        label={'Фамилия'}
        onFocus={() => setValue('password', '')}
        placeholder={''}
      />

      <TextField.Email
        {...register('email')}
        errorMessage={errors.email?.message}
        label={'Почта'}
        onFocus={() => setValue('password', '')}
        placeholder={''}
      />

      <TextField.Password
        {...register('password')}
        errorMessage={errors.password?.message}
        label={'Пароль'}
        onFocus={() => setValue('password', '')}
        placeholder={''}
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
