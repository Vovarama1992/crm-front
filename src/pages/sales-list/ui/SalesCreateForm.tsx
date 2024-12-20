import type { SaleDto } from '@/entities/deal/deal.types'

import React from 'react'

import { useUpdateSaleWithRemainingMutation } from '@/entities/deal'

interface SalesCreateFormProps {
  onClose: () => void
  sale: SaleDto
}

export const SalesCreateForm: React.FC<SalesCreateFormProps> = ({ onClose, sale }) => {
  const [updateSaleWithRemaining] = useUpdateSaleWithRemainingMutation()

  const handleSave = () => {
    // Обновляем продажу с оставшейся частью
    updateSaleWithRemaining({ id: sale.id, sale: { ...sale, progressed: true } })
      .unwrap()
      .then(() => {
        onClose() // Закрываем окно после успешного обновления
      })
      .catch(error => {
        console.error('Ошибка при обновлении продажи:', error)
      })
  }

  return (
    <div className={'flex flex-col items-center space-y-4'}>
      <p>Продажа была обновлена.</p>
      <button className={'mt-2 bg-blue-500 text-white p-2 rounded'} onClick={handleSave}>
        ОК
      </button>
    </div>
  )
}
