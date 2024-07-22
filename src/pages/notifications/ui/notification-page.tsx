import React, { MouseEvent, useEffect, useState } from 'react'

import { useMeQuery } from '@/entities/session'
// Тип для уведомлений
interface Notification {
  content: string
  readBy?: number[]
  title: string
}

export function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const { data } = useMeQuery()
  const userId = data?.id

  useEffect(() => {
    // Получаем уведомления из localStorage
    const storedNotifications = JSON.parse(
      localStorage.getItem('notifications') || '[]'
    ) as Notification[]

    setNotifications(storedNotifications)
  }, [])

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification)
  }

  const handleRemoveNotification = (notificationToRemove: Notification) => {
    const updatedNotifications = notifications.filter(
      notification => notification !== notificationToRemove
    )

    setNotifications(updatedNotifications)
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
  }

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
                    handleRemoveNotification(notification)
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
