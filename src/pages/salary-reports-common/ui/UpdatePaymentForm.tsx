import React, { useState } from 'react'

import { useUpdatePaymentMutation } from '@/entities/deal'
import { PaymentDto, PaymentType } from '@/entities/deal/deal.types'

type UpdatePaymentFormProps = {
  onClose: () => void
  payment: PaymentDto // Получаем весь объект payment
}

// Определяем типы платежей с русскими отображаемыми значениями
const PAYMENT_TYPES = [
  { label: 'Оклад', value: 'SALARY' as PaymentType },
  { label: 'Бонус', value: 'BONUS' as PaymentType },
]

const UpdatePaymentForm: React.FC<UpdatePaymentFormProps> = ({ onClose, payment }) => {
  const [updatePayment] = useUpdatePaymentMutation()
  const [amount, setAmount] = useState<number | string>(payment.amount) // Используем данные payment
  const [type, setType] = useState<PaymentType>(payment.type as PaymentType) // Используем данные payment

  const handleSubmit = async () => {
    try {
      const amountN = Number(amount) // Преобразуем строковое значение amount в число

      await updatePayment({ data: { amount: amountN, type }, id: payment.id }).unwrap()
      window.location.reload()
      onClose()
    } catch (error) {
      console.error('Failed to update payment:', error)
    }
  }

  return (
    <div className={'fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'}>
      <div className={'bg-white p-4 rounded shadow-lg w-1/3'}>
        <h2 className={'text-lg font-bold mb-4'}>Update Payment</h2>
        <div className={'mb-4'}>
          <label className={'block text-gray-700'}>Amount:</label>
          <input
            className={'border p-2 w-full'}
            onChange={e => setAmount(e.target.value)}
            type={'number'}
            value={amount}
          />
        </div>
        <div className={'mb-4'}>
          <label className={'block text-gray-700'}>Type:</label>
          <select
            className={'border p-2 w-full'}
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
        <div className={'flex justify-end'}>
          <button
            className={'bg-blue-500 text-white px-4 py-2 rounded mr-2'}
            onClick={handleSubmit}
          >
            Update
          </button>
          <button className={'bg-red-500 text-white px-4 py-2 rounded'} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdatePaymentForm
