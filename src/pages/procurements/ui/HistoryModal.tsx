import React, { useEffect, useState } from 'react'

import { useGetPurchaseChangesQuery } from '@/entities/purchase'

interface HistoryModalProps {
  onClose: () => void
  purchaseId: number
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ onClose, purchaseId }) => {
  const [changes, setChanges] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10) // Количество записей на странице
  const { data, error, isLoading } = useGetPurchaseChangesQuery({ entityId: purchaseId })

  useEffect(() => {
    if (data) {
      setChanges(data)
    }
  }, [data])

  if (isLoading) {
    return <div>Загрузка...</div>
  }
  if (error) {
    return <div>Ошибка загрузки данных</div>
  }

  // Рассчитать данные для текущей страницы
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentChanges = changes.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(changes.length / itemsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'}>
      <div className={'bg-white p-6 rounded shadow-lg w-[70vw] max-h-[80vh] overflow-auto'}>
        <h3 className={'text-lg font-medium'}>История изменений</h3>
        <div className={'mt-4'}>
          {currentChanges.length === 0 ? (
            <p>Нет изменений для отображения</p>
          ) : (
            <ul>
              {currentChanges.map(change => {
                return (
                  <li className={'border-b py-4'} key={change.id}>
                    <div>
                      <strong>Дата:</strong> {new Date(change.changedAt).toLocaleString()}
                    </div>
                    <div>
                      <strong>Изменение:</strong> {change.description}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        <div className={'mt-4 flex justify-between'}>
          <button
            className={`px-4 py-2 bg-blue-500 text-white rounded ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
          >
            Предыдущая
          </button>
          <span className={'px-4 py-2'}>
            Страница {currentPage} из {totalPages}
          </span>
          <button
            className={`px-4 py-2 bg-blue-500 text-white rounded ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            Следующая
          </button>
        </div>
        <button
          className={'mt-4 bg-red-500 text-white px-4 py-2 rounded'}
          onClick={onClose}
          type={'button'}
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}
