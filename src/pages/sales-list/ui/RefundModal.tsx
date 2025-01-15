import React, { useState } from 'react'

import { useCreateCommissionMutation } from '@/entities/sale'
import { ComissionType } from '@/entities/sale/sale.types'

interface RefundModalProps {
  onClose: () => void
  refetch: () => void
  sale: { id: number; paidNow: number }
  userId: number
}

export const RefundModal: React.FC<RefundModalProps> = ({ onClose, refetch, sale, userId }) => {
  const [amount, setAmount] = useState(0)
  const [date, setDate] = useState('')
  const [comment, setComment] = useState('')
  const [createCommission] = useCreateCommissionMutation()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)

    setAmount(value)
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value)
  }

  const handleSave = async () => {
    if (!date) {
      alert('Дата b сумма обязательна')

      return
    }

    try {
      await createCommission({
        category: ComissionType.REFUND,
        commissionAmount: amount,
        createdBy: userId,
        description: comment,
        saleId: sale.id,
        updatedAt: new Date(date).toISOString(), // Преобразуем дату в формат ISO-8601
      })
      refetch()
      onClose()
    } catch (error) {
      console.error('Ошибка при создании возврата:', error)
    }
  }

  return (
    <div className={'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'}>
      <div className={'bg-white p-6 rounded-lg shadow-lg w-96'}>
        <h2 className={'text-xl font-semibold mb-4'}>Возврат</h2>
        <div className={'mb-4'}>
          <label className={'block mb-1'}>Дата</label>
          <input
            className={'w-full p-2 border border-gray-300 rounded'}
            onChange={handleDateChange}
            type={'date'}
            value={date}
          />
        </div>
        <div className={'mb-4'}>
          <label className={'block mb-1'}>Сумма</label>
          <input
            className={'w-full p-2 border border-gray-300 rounded'}
            onChange={handleAmountChange}
            type={'number'}
            value={amount}
          />
        </div>
        <div className={'mb-4'}>
          <label className={'block mb-1'}>Комментарий</label>
          <input
            className={'w-full p-2 border border-gray-300 rounded'}
            onChange={handleCommentChange}
            type={'text'}
            value={comment}
          />
        </div>
        <div className={'flex justify-end space-x-2'}>
          <button
            className={'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'}
            onClick={handleSave}
          >
            Сохранить
          </button>
          <button
            className={'bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400'}
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}
