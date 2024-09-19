import React from 'react'

import { useUpdateSaleWithRemainingMutation } from '@/entities/deal'
import { useCreateNotificationMutation } from '@/entities/notifications'
import { useMeQuery } from '@/entities/session'

interface SalesCreateFormProps {
  onClose: () => void
  sale: any
}

export const SalesCreateForm: React.FC<SalesCreateFormProps> = ({ onClose, sale }) => {
  const [createNotification] = useCreateNotificationMutation()
  const { data: meData } = useMeQuery()
  const [updateSaleWithRemaining] = useUpdateSaleWithRemainingMutation()

  const handleSave = () => {
    // Обновляем продажу с оставшейся частью
    updateSaleWithRemaining({ id: sale.id, sale: { ...sale, progressed: true } })
      .unwrap()
      .then(() => {
        // После успешного обновления создаем уведомление
        createNotification({
          content: `Продажа #${sale.id} была успешно обновлена.`,
          createdBy: meData?.id || 1,
          seenBy: [],
          title: 'Обновление продажи',
        }).catch(error => {
          console.error('Ошибка при создании уведомления:', error)
        })

        onClose() // Закрываем окно после уведомления
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
