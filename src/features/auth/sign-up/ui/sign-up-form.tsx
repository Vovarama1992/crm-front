/* eslint-disable max-lines */
import type { SignUpFormData } from '../model/sign-up-schema'

import { useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useSignUpMutation } from '@/entities/session'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { RoleSelect } from '@/shared/ui/RoleSelect'
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
      address: '',
      birthday: '',
      cardNumber: '',
      department_id: undefined,
      dobNumber: undefined,
      email: '',
      hireDate: '',
      isActive: true, // Добавлено поле isActive
      managed_by: undefined, // Изменено на undefined
      margin_percent: undefined,
      middleName: '',
      mobile: '',
      name: '',
      password: '',
      position: '',
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

  const onSubmit = handleSubmit(data => {
    signUp({
      ...data,
      department_id: data.department_id ? Number(data.department_id) : null,
      dobNumber: data.dobNumber ? Number(data.dobNumber) : undefined,
      managed_by: data.managed_by ? Number(data.managed_by) : undefined,
      margin_percent: data.margin_percent ? Number(data.margin_percent) : undefined,
    })
      .unwrap()
      .then(user => {
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

      <div className={'flex flex-col space-y-4'}>
        <div>
          <label className={'block'}>Имя</label>
          <input
            className={'border p-2 w-full'}
            {...register('name')}
            placeholder={''}
            type={'text'}
          />
          {errors.name && <span className={'text-red-500'}>{errors.name.message}</span>}
        </div>

        <div>
          <label className={'block'}>Отчество</label>
          <input
            className={'border p-2 w-full'}
            {...register('middleName')}
            placeholder={''}
            type={'text'}
          />
          {errors.middleName && <span className={'text-red-500'}>{errors.middleName.message}</span>}
        </div>

        <div>
          <label className={'block'}>Фамилия</label>
          <input
            className={'border p-2 w-full'}
            {...register('surname')}
            placeholder={''}
            type={'text'}
          />
          {errors.surname && <span className={'text-red-500'}>{errors.surname.message}</span>}
        </div>

        <div>
          <label className={'block'}>Почта</label>
          <input
            className={'border p-2 w-full'}
            {...register('email')}
            placeholder={''}
            type={'email'}
          />
          {errors.email && <span className={'text-red-500'}>{errors.email.message}</span>}
        </div>

        <div>
          <label className={'block'}>Пароль</label>
          <input
            className={'border p-2 w-full'}
            {...register('password')}
            placeholder={''}
            type={'password'}
          />
          {errors.password && <span className={'text-red-500'}>{errors.password.message}</span>}
        </div>

        <div>
          <label className={'block'}>Дата рождения</label>
          <input
            className={'border p-2 w-full'}
            {...register('birthday')}
            placeholder={'YYYY-MM-DD'}
            type={'date'}
          />
          {errors.birthday && <span className={'text-red-500'}>{errors.birthday.message}</span>}
        </div>

        <div>
          <label className={'block'}>Номер карты</label>
          <input
            className={'border p-2 w-full'}
            {...register('cardNumber')}
            placeholder={''}
            type={'text'}
          />
          {errors.cardNumber && <span className={'text-red-500'}>{errors.cardNumber.message}</span>}
        </div>

        <div>
          <label className={'block'}>ID отдела</label>
          <input
            className={'border p-2 w-full'}
            {...register('department_id')}
            placeholder={''}
            type={'number'}
          />
          {errors.department_id && (
            <span className={'text-red-500'}>{errors.department_id.message}</span>
          )}
        </div>

        <div>
          <label className={'block'}>Добавочный номер</label>
          <input
            className={'border p-2 w-full'}
            {...register('dobNumber')}
            placeholder={''}
            type={'number'}
          />
          {errors.dobNumber && <span className={'text-red-500'}>{errors.dobNumber.message}</span>}
        </div>

        <div>
          <label className={'block'}>Дата приема на работу</label>
          <input
            className={'border p-2 w-full'}
            {...register('hireDate')}
            placeholder={'YYYY-MM-DD'}
            type={'date'}
          />
          {errors.hireDate && <span className={'text-red-500'}>{errors.hireDate.message}</span>}
        </div>

        <div>
          <label className={'block'}>Менеджер</label>
          <input
            className={'border p-2 w-full'}
            {...register('managed_by')}
            placeholder={''}
            type={'number'}
          />
          {errors.managed_by && <span className={'text-red-500'}>{errors.managed_by.message}</span>}
        </div>

        <div>
          <label className={'block'}>Процент маржи</label>
          <input
            className={'border p-2 w-full'}
            {...register('margin_percent')}
            placeholder={''}
            type={'number'}
          />
          {errors.margin_percent && (
            <span className={'text-red-500'}>{errors.margin_percent.message}</span>
          )}
        </div>

        <div>
          <label className={'block'}>Мобильный телефон</label>
          <input
            className={'border p-2 w-full'}
            {...register('mobile')}
            defaultValue={'+7'}
            placeholder={''}
            type={'text'}
          />
          {errors.mobile && <span className={'text-red-500'}>{errors.mobile.message}</span>}
        </div>

        <div>
          <label className={'block'}>Должность</label>
          <input
            className={'border p-2 w-full'}
            {...register('position')}
            placeholder={''}
            type={'text'}
          />
          {errors.position && <span className={'text-red-500'}>{errors.position.message}</span>}
        </div>

        <div>
          <label className={'block'}>Адрес</label>
          <input
            className={'border p-2 w-full'}
            {...register('address')}
            placeholder={''}
            type={'text'}
          />
          {errors.address && <span className={'text-red-500'}>{errors.address.message}</span>}
        </div>

        <div>
          <label className={'block'}>Зарплата</label>
          <input
            className={'border p-2 w-full'}
            {...register('salary')}
            placeholder={''}
            type={'number'}
          />
          {errors.salary && <span className={'text-red-500'}>{errors.salary.message}</span>}
        </div>
      </div>

      <Button
        className={'w-full mt-4 h-[40px]'}
        disabled={isLoading || !isAllFieldsDirty || !isRoleSelected}
        type={'submit'}
      >
        Зарегистрировать
      </Button>

      {import.meta.env.DEV && <DevTool control={control} />}
    </form>
  )
}
