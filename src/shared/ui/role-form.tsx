import * as React from 'react'
import { useForm } from 'react-hook-form'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '../ui-shad-cn/ui/select'

const roles = [
  { name: 'Директор', value: 'director' },
  { name: 'Бухгалтер', value: 'accountant' },
  { name: 'РОП', value: 'rop' },
  { name: 'Закупщик', value: 'purchaser' },
  { name: 'Логист', value: 'logistics' },
  { name: 'Менеджер', value: 'manager' },
]

const RoleForm = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm()

  const onSubmit = data => {
    console.log(data) // Обработка отправки формы
  }

  return (
    <Select {...register('roleName')}>
      <SelectTrigger>Выберите роль</SelectTrigger>
      <SelectContent>
        {roles.map(role => (
          <SelectItem key={role.value} value={role.value}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default RoleForm
