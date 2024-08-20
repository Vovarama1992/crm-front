import React, { useState } from 'react'

import { useCreatePaymentMutation } from '@/entities/deal'
import { PaymentType } from '@/entities/deal/deal.types'
import { useGetWorkersQuery } from '@/entities/workers' // Импортируем типы платежей

type CreatePaymentFormProps = {
  onClose: () => void
}

// Определяем типы платежей с русскими отображаемыми значениями
const PAYMENT_TYPES = [
  { label: 'Оклад', value: 'SALARY' as PaymentType },
  { label: 'Бонус', value: 'BONUS' as PaymentType },
]

const CreatePaymentForm: React.FC<CreatePaymentFormProps> = ({ onClose }) => {
  const [amount, setAmount] = useState<null | number>(null)
  const [selectedUserId, setSelectedUserId] = useState<null | number>(null)
  const [type, setType] = useState<PaymentType>(PAYMENT_TYPES[0].value) // Значение по умолчанию для типа
  const { data: users } = useGetWorkersQuery()
  const [createPayment, { isLoading }] = useCreatePaymentMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (amount !== null && selectedUserId !== null) {
      await createPayment({ amount, type, userId: selectedUserId })
      window.location.reload()
      onClose()
    }
  }

  return (
    <div className={'fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center'}>
      <div className={'bg-white p-6 rounded shadow-md'}>
        <h2 className={'text-xl font-bold mb-4'}>Создать выплату</h2>
        <form onSubmit={handleSubmit}>
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
              {users?.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.surname}
                </option>
              ))}
            </select>
          </div>
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
            <label className={'block text-sm font-medium text-gray-700'}>Сумма</label>
            <input
              className={'mt-1 block w-full p-2 border border-gray-300 rounded'}
              onChange={e => setAmount(Number(e.target.value))}
              type={'number'}
              value={amount ?? ''}
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
