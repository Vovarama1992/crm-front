import { MouseEvent, useState } from 'react'

import { NotificationDto } from '@/entities/notifications'
import {
  useGetNotificationsQuery,
  useMarkNotificationAsSeenMutation,
} from '@/entities/notifications'
import { useMeQuery } from '@/entities/session'

export function NotificationPage() {
  const { data: meData } = useMeQuery()
  const userId = meData?.id || 1

  // Используем хук для получения уведомлений
  const { data: notifications = [], refetch } = useGetNotificationsQuery(userId)

  // Хук для отметки уведомления как прочитанного
  const [markAsSeen] = useMarkNotificationAsSeenMutation()

  const [selectedNotification, setSelectedNotification] = useState<NotificationDto | null>(null)

  // Обработка клика по уведомлению
  const handleNotificationClick = async (notification: NotificationDto) => {
    setSelectedNotification(notification)

    // Помечаем уведомление как прочитанное, если пользователь не в списке прочитавших
    if (!notification.seenBy?.includes(userId)) {
      await markAsSeen({ id: notification.id, userId }) // Вызываем API для отметки
      refetch() // Перезапрашиваем уведомления после обновления
    }
  }

  // Закрытие модального окна
  const closeModal = () => {
    setSelectedNotification(null)
  }

  return (
    <div className={'p-4'}>
      {notifications.length === 0 ? (
        <div className={'text-center text-gray-500'}>Уведомлений нет</div>
      ) : (
        <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'}>
          {notifications.map((notification, index) => (
            <div
              className={'p-4 border rounded-lg cursor-pointer hover:shadow-lg'}
              key={index}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className={'flex justify-between items-center'}>
                <h3 className={'text-lg font-bold'}>{notification.title}</h3>
                <button
                  className={'text-red-500'}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation()
                    // Тут могло бы быть удаление уведомления, но так как в API его нет, убираем.
                  }}
                >
                  &#x2716;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedNotification && (
        <div
          className={'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'}
        >
          <div className={'bg-white p-6 rounded-lg shadow-lg max-w-md w-full'}>
            <h3 className={'text-xl font-bold mb-4'}>{selectedNotification.title}</h3>
            <p className={'mb-4'}>{selectedNotification.content}</p>
            <button className={'px-4 py-2 bg-blue-500 text-white rounded-lg'} onClick={closeModal}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
