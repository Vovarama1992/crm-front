import React from 'react'

import { useCreateNotificationMutation } from '@/entities/notifications'
import { useMeQuery } from '@/entities/session'

interface SalesCreateFormProps {
  onClose: () => void
  sale: any
}

export const SalesCreateForm: React.FC<SalesCreateFormProps> = ({ onClose, sale }) => {
  const [createNotification] = useCreateNotificationMutation()
  const { data: meData } = useMeQuery()

  const handleSave = () => {
    // Создаем уведомление о том, что продажа обновлена
    createNotification({
      content: `Продажа #${sale.id} была успешно обновлена.`,
      createdBy: meData?.id || 1,
      seenBy: [],
      title: 'Обновление продажи',
    }).catch(error => {
      console.error('Ошибка при создании уведомления:', error)
    })

    onClose() // Закрываем окно после уведомления
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
