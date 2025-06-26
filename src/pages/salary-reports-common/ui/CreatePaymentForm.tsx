import React, { useState } from 'react'

import { useCreateMultiplePaymentsMutation, useCreatePaymentMutation } from '@/entities/deal'
import { PaymentType } from '@/entities/deal/deal.types'
import { DepartmentDto, useGetDepartmentsQuery } from '@/entities/workers'

const DEPARTMENT_ALL_ID = -1
const DEPARTMENT_NONE_ID = -2

const PAYMENT_TYPES = [
  { label: 'Оклад', value: 'SALARY' as PaymentType },
  { label: 'Бонус', value: 'BONUS' as PaymentType },
]

const CreatePaymentForm: React.FC<{ onClose: () => void; usersWithRemaining: any[] }> = ({
  onClose,
  usersWithRemaining,
}) => {
  const [amount, setAmount] = useState<null | number>(null)
  const [selectedUserId, setSelectedUserId] = useState<null | number>(null)
  const [type, setType] = useState<PaymentType>(PaymentType.SALARY)
  const [date, setDate] = useState<string>('')
  const [isPayAll, setIsPayAll] = useState(false)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(DEPARTMENT_ALL_ID)

  const [createPayment, { isLoading }] = useCreatePaymentMutation()
  const [createMultiplePayments] = useCreateMultiplePaymentsMutation()
  const { data: departments } = useGetDepartmentsQuery()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) {
      return alert('Пожалуйста, выберите дату')
    }

    const isoDate = new Date(date).toISOString()

    const filteredUsers = usersWithRemaining.filter(user => {
      if (selectedDepartmentId === DEPARTMENT_ALL_ID) {
        return true
      }
      if (selectedDepartmentId === DEPARTMENT_NONE_ID) {
        return user.department_id === null
      }

      return user.department_id === selectedDepartmentId
    })

    if (isPayAll) {
      const usersToPay = filteredUsers.filter(user => user.remaining > 0)
      const payments = usersToPay.map(user => ({
        amount: Math.ceil(user.remaining),
        date: isoDate,
        type,
        userId: user.id,
      }))

      const confirmation = window.confirm(
        `Вы собираетесь выплатить:\n` +
          usersToPay.map(u => `${u.surname} ${u.name}: ${u.remaining}`).join('\n') +
          `\n\nДата: ${isoDate}`
      )

      if (confirmation) {
        await createMultiplePayments(payments)
        window.location.reload()
      }
    } else {
      if (amount !== null && selectedUserId !== null) {
        await createPayment({ amount, date: isoDate, type, userId: selectedUserId })
      } else {
        alert('Выберите пользователя и сумму')

        return
      }
    }

    window.location.reload()
    onClose()
  }

  const filteredUsers = usersWithRemaining.filter(user => {
    if (selectedDepartmentId === DEPARTMENT_ALL_ID) {
      return true
    }
    if (selectedDepartmentId === DEPARTMENT_NONE_ID) {
      return user.department_id === null
    }

    return user.department_id === selectedDepartmentId
  })

  return (
    <div className={'fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center'}>
      <div className={'bg-white p-6 rounded shadow-md w-full max-w-lg'}>
        <h2 className={'text-xl font-bold mb-4'}>Создать выплату</h2>
        <form onSubmit={handleSubmit}>
          <div className={'mb-4'}>
            <label className={'block text-sm font-medium'}>Отдел</label>
            <select
              className={'mt-1 block w-full p-2 border border-gray-300 rounded'}
              onChange={e => setSelectedDepartmentId(Number(e.target.value))}
              value={selectedDepartmentId}
            >
              <option value={DEPARTMENT_ALL_ID}>Все отделы</option>
              <option value={DEPARTMENT_NONE_ID}>Сотрудники вне отдела</option>
              {departments?.map((d: DepartmentDto) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className={'mb-4'}>
            <label className={'block text-sm font-medium'}>
              <input
                checked={isPayAll}
                className={'mr-2'}
                onChange={() => setIsPayAll(prev => !prev)}
                type={'checkbox'}
              />
              Всем с ненулевым остатком
            </label>
          </div>

          {!isPayAll && (
            <>
              <div className={'mb-4'}>
                <label className={'block text-sm font-medium'}>Пользователь</label>
                <select
                  className={'mt-1 block w-full p-2 border border-gray-300 rounded'}
                  onChange={e => setSelectedUserId(Number(e.target.value))}
                  value={selectedUserId ?? ''}
                >
                  <option value={''}>Выберите пользователя</option>
                  {filteredUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.surname} {user.name} {user.middleName}
                    </option>
                  ))}
                </select>
              </div>
              <div className={'mb-4'}>
                <label className={'block text-sm font-medium'}>Сумма</label>
                <input
                  className={'mt-1 block w-full p-2 border border-gray-300 rounded'}
                  onChange={e => setAmount(Number(e.target.value))}
                  type={'number'}
                  value={amount ?? ''}
                />
              </div>
            </>
          )}

          <div className={'mb-4'}>
            <label className={'block text-sm font-medium'}>Тип выплаты</label>
            <select
              className={'mt-1 block w-full p-2 border border-gray-300 rounded'}
              onChange={e => setType(e.target.value as PaymentType)}
              value={type}
            >
              {PAYMENT_TYPES.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={'mb-4'}>
            <label className={'block text-sm font-medium'}>Дата</label>
            <input
              className={'mt-1 block w-full p-2 border border-gray-300 rounded'}
              onChange={e => setDate(e.target.value)}
              type={'date'}
              value={date}
            />
          </div>

          <div className={'flex justify-end'}>
            <button
              className={'mr-4 px-4 py-2 bg-gray-200 text-gray-800 rounded'}
              onClick={onClose}
              type={'button'}
            >
              Отмена
            </button>
            <button
              className={'px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50'}
              disabled={isLoading}
              type={'submit'}
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePaymentForm
