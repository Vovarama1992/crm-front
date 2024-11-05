import { useState } from 'react'

import { NotificationDto } from '@/entities/notifications'
import {
  useGetNotificationsQuery,
  useMarkNotificationAsSeenMutation,
} from '@/entities/notifications'
import { useMeQuery } from '@/entities/session'
import { useGetWorkersQuery } from '@/entities/workers'

export function NotificationPage() {
  const { data: meData } = useMeQuery()
  const userId = meData?.id || 1
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [author, setAuthor] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { data: workers = [] } = useGetWorkersQuery()
  const { data: notifications = [], refetch } = useGetNotificationsQuery(
    { page, userId },
    { skip: !userId }
  )
  const [markAsSeen] = useMarkNotificationAsSeenMutation()
  const [selectedNotificationId, setSelectedNotificationId] = useState<null | number>(null)

  const handleNotificationClick = async (notification: NotificationDto) => {
    setSelectedNotificationId(notification.id === selectedNotificationId ? null : notification.id)
    if (!notification.seenBy?.includes(userId)) {
      await markAsSeen({ id: notification.id, userId })
      refetch()
    }
  }

  const handleSearch = () => {
    refetch()
  }

  const filteredWorkers = workers.filter(worker =>
    worker.surname.toLowerCase().includes(author.toLowerCase())
  )

  const filteredNotifications = notifications.filter(notification => {
    const matchesTitle = notification.title.includes(search)
    const matchesAuthor =
      filteredWorkers.length === 0 ||
      filteredWorkers.some(worker => worker.id === notification.createdBy)
    const notificationDate = new Date(notification.createdAt)
    const matchesDate =
      (!startDate || notificationDate >= new Date(startDate)) &&
      (!endDate || notificationDate <= new Date(endDate))

    return matchesTitle && matchesAuthor && matchesDate
  })

  const handleNextPage = () => setPage(page + 1)
  const handlePreviousPage = () => setPage(page > 1 ? page - 1 : 1)

  const extractSaleNumber = (title: string) => {
    const match = title.match(/\d+/)

    return match ? match[0] : '—'
  }

  return (
    <div className={'p-4 space-y-4'}>
      <div className={'flex items-center space-x-2'}>
        <input
          className={'border border-gray-300 rounded px-4 py-2'}
          onChange={e => setSearch(e.target.value)}
          placeholder={'Поиск по номеру продажи'}
          type={'text'}
          value={search}
        />
        <input
          className={'border border-gray-300 rounded px-4 py-2'}
          onChange={e => setAuthor(e.target.value)}
          placeholder={'Поиск по фамилии автора'}
          type={'text'}
          value={author}
        />
        <input
          className={'border border-gray-300 rounded px-4 py-2'}
          onChange={e => setStartDate(e.target.value)}
          type={'date'}
          value={startDate}
        />
        <input
          className={'border border-gray-300 rounded px-4 py-2'}
          onChange={e => setEndDate(e.target.value)}
          type={'date'}
          value={endDate}
        />
        <button className={'bg-blue-500 text-white px-4 py-2 rounded-lg'} onClick={handleSearch}>
          Поиск
        </button>
      </div>

      <div className={'border border-gray-300 rounded-lg overflow-hidden'}>
        <div className={'grid grid-cols-6 gap-4 bg-gray-100 p-2 font-semibold text-gray-600'}>
          <span>ID</span>
          <span>№ Продажи</span>
          <span>Заголовок</span>
          <span>Автор</span>
          <span>Дата</span>
          <span>Время</span>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className={'flex items-center justify-center p-4 text-gray-500'}>
            Уведомлений нет
          </div>
        ) : (
          <div className={'flex flex-col space-y-2'}>
            {filteredNotifications.map(notification => {
              const notificationDate = new Date(notification.createdAt)
              const author =
                workers.find(worker => worker.id === notification.createdBy)?.surname || 'Система'
              const saleNumber = extractSaleNumber(notification.title)

              return (
                <div
                  className={`p-4 border-t border-gray-300 grid grid-cols-6 gap-4 items-center ${
                    notification.seenBy?.includes(userId) ? 'bg-gray-100' : 'bg-white'
                  } cursor-pointer`}
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <span className={'text-gray-500 text-sm'}>{notification.id}</span>
                  <span className={'text-blue-600 font-semibold'}>{saleNumber}</span>
                  <span className={'text-gray-800'}>{notification.title}</span>
                  <span className={'text-gray-600'}>{author}</span>
                  <span className={'text-gray-500 text-sm'}>
                    {notificationDate.toLocaleDateString()}
                  </span>
                  <span className={'text-gray-500 text-sm'}>
                    {notificationDate.toLocaleTimeString()}
                  </span>
                  {selectedNotificationId === notification.id && (
                    <div className={'col-span-6 mt-2 text-gray-700 border-t pt-2'}>
                      {notification.content}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className={'flex justify-between mt-4'}>
        <button
          className={'px-4 py-2 bg-gray-300 rounded-lg'}
          disabled={page === 1}
          onClick={handlePreviousPage}
        >
          Предыдущая
        </button>
        <span>Страница {page}</span>
        <button
          className={'px-4 py-2 bg-gray-300 rounded-lg'}
          disabled={filteredNotifications.length < 10}
          onClick={handleNextPage}
        >
          Следующая
        </button>
      </div>
    </div>
  )
}
