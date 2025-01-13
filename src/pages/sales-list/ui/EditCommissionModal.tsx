import React, { useState } from 'react'

import { useUpdateCommissionMutation } from '@/entities/sale'
import { ComissionType, CommissionDto } from '@/entities/sale/sale.types'

import { comissionTypeMapping } from './PaymentHistoryModal'

interface EditCommissionModalProps {
  commission: CommissionDto
  onClose: () => void
  refetch: () => void // Функция для перезагрузки данных
}

export const EditCommissionModal: React.FC<EditCommissionModalProps> = ({
  commission,
  onClose,
  refetch,
}) => {
  const [formData, setFormData] = useState({
    category: commission.category,
    commissionAmount: commission.commissionAmount,
    description: commission.description || '',
  })

  const [updateCommission] = useUpdateCommissionMutation()

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const updatedCommission = {
      ...formData,
    }

    await updateCommission({
      commission: updatedCommission,
      id: commission?.id as number,
    })

    refetch()

    onClose()
  }

  return (
    <div className={'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'}>
      <div className={'bg-white p-6 rounded-lg shadow-lg w-[400px]'}>
        <h2 className={'text-xl font-semibold mb-4'}>Редактировать комиссию</h2>
        <form>
          <div className={'mb-4'}>
            <label className={'block text-sm font-medium text-gray-700'}>Тип</label>
            <select
              className={'mt-1 block w-full border-gray-300 rounded-md'}
              onChange={e => handleInputChange('category', e.target.value as ComissionType)}
              value={formData.category}
            >
              {Object.values(ComissionType).map(type => (
                <option key={type} value={type}>
                  {comissionTypeMapping[type]}
                </option>
              ))}
            </select>
          </div>
          <div className={'mb-4'}>
            <label className={'block text-sm font-medium text-gray-700'}>Сумма</label>
            <input
              className={'mt-1 block w-full border-gray-300 rounded-md'}
              onChange={e => handleInputChange('commissionAmount', parseFloat(e.target.value))}
              type={'number'}
              value={formData.commissionAmount}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-sm font-medium text-gray-700'}>Комментарий</label>
            <textarea
              className={'mt-1 block w-full border-gray-300 rounded-md'}
              onChange={e => handleInputChange('description', e.target.value)}
              value={formData.description}
            />
          </div>
          <div className={'flex justify-end space-x-2'}>
            <button
              className={'bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400'}
              onClick={onClose}
              type={'button'}
            >
              Отмена
            </button>
            <button
              className={'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'}
              onClick={handleSubmit}
              type={'button'}
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
