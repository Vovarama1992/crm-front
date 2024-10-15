import React, { useState } from 'react'

import { useCreateMultiplePaymentsMutation, useCreatePaymentMutation } from '@/entities/deal'
import { PaymentType } from '@/entities/deal/deal.types'

type User = {
  id: number
  middleName: string
  name: string
  remaining: number // Поле remaining для остатков
  surname: string
}

type CreatePaymentFormProps = {
  onClose: () => void
  usersWithRemaining: User[] // Получаем массив пользователей с остатками через пропсы
}

const PAYMENT_TYPES = [
  { label: 'Оклад', value: 'SALARY' as PaymentType },
  { label: 'Бонус', value: 'BONUS' as PaymentType },
]

const CreatePaymentForm: React.FC<CreatePaymentFormProps> = ({ onClose, usersWithRemaining }) => {
  const [amount, setAmount] = useState<null | number>(null)
  const [selectedUserId, setSelectedUserId] = useState<null | number>(null)
  const [type, setType] = useState<PaymentType>(PAYMENT_TYPES[0].value) // Значение по умолчанию для типа
  const [date, setDate] = useState<string>('') // Поле для выбора даты в формате ISO
  const [isPayAll, setIsPayAll] = useState(false) // Стейт для переключения между выплатой всем и конкретному пользователю
  const [createPayment, { isLoading }] = useCreatePaymentMutation()
  const [createMultiplePayments] = useCreateMultiplePaymentsMutation() // Хук для массовой выплаты

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (date === '') {
      alert('Пожалуйста, выберите дату')

      return
    }

    const isoDate = new Date(date).toISOString() // Преобразуем дату в ISO строку

    if (isPayAll) {
      // Выплата всем пользователям с ненулевым остатком
      const usersToPay = usersWithRemaining.filter(user => user.remaining > 0) // Фильтруем пользователей с ненулевым остатком
      const payments = usersToPay.map(user => ({
        amount: Math.ceil(user.remaining),
        date: isoDate,
        type,
        userId: user.id,
      }))

      // Подтверждение перед массовой выплатой
      const confirmation = window.confirm(
        `Вы собираетесь выплатить следующим пользователям:\n\n` +
          usersToPay.map(user => `${user.surname} ${user.name}: ${user.remaining}`).join('\n') +
          `\n\nДата выплаты: ${isoDate}\n\nНажмите ОК, чтобы продолжить.`
      )

      if (confirmation) {
        await createMultiplePayments(payments)
        window.location.reload() // Используем хук для массовой выплаты
      }
    } else {
      // Выплата конкретному пользователю
      if (amount !== null && selectedUserId !== null) {
        await createPayment({ amount, date: isoDate, type, userId: selectedUserId })
      } else {
        alert('Пожалуйста, выберите сумму и пользователя')

        return
      }
    }
    window.location.reload()
    onClose()
  }

  return (
    <div className={'fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center'}>
      <div className={'bg-white p-6 rounded shadow-md'}>
        <h2 className={'text-xl font-bold mb-4'}>Создать выплату</h2>
        <form onSubmit={handleSubmit}>
          <div className={'mb-4'}>
            <label className={'block text-sm font-medium text-gray-700'}>
              <input
                checked={isPayAll}
                className={'mr-2'}
                onChange={() => setIsPayAll(prev => !prev)}
                type={'checkbox'}
              />
              Выплатить всем пользователям с ненулевым остатком
            </label>
          </div>

          {!isPayAll && (
            <>
              <div className={'mb-4'}>
                <label className={'block text-sm font-medium text-gray-700'}>
                  Выберите пользователя
                </label>
                <select
                  className={'mt-1 block w-full p-2 border border-gray-300 rounded'}
                  onChange={e => setSelectedUserId(Number(e.target.value))}
                  value={selectedUserId ?? ''}
                >
                  <option value={''}>Выберите пользователя</option>
                  {usersWithRemaining?.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.surname} {user.name} {user.middleName}
                    </option>
                  ))}
                </select>
              </div>
              <div className={'mb-4'}>
                <label className={'block text-sm font-medium text-gray-700'}>Сумма</label>
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
            <label className={'block text-sm font-medium text-gray-700'}>Тип выплаты</label>
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
            <label className={'block text-sm font-medium text-gray-700'}>Дата</label>
            <input
              className={'mt-1 block w-full p-2 border border-gray-300 rounded'}
              onChange={e => setDate(e.target.value)}
              type={'date'}
              value={date}
            />
          </div>

          <div className={'flex justify-end'}>
            <button
              className={'mr-4 px-4 py-2 bg-gray-200 rounded text-gray-800'}
              onClick={onClose}
              type={'button'}
            >
              Отмена
            </button>
            <button
              className={`px-4 py-2 bg-blue-500 text-white rounded ${isLoading ? 'opacity-50' : ''}`}
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
