import React, { useState } from 'react'

import { ChangeDto } from '@/entities/changes'

interface ChangesHistoryModalProps {
  changes: ChangeDto[] | undefined
  departureId: number
  isError: boolean
  isLoading: boolean
  onClose: () => void
}

export const ChangesHistoryModal: React.FC<ChangesHistoryModalProps> = ({
  changes,
  isError,
  isLoading,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  if (isLoading) {
    return (
      <div className={'p-4'}>
        <p>Загрузка истории изменений...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={'p-4'}>
        <p>Произошла ошибка при загрузке истории изменений.</p>
      </div>
    )
  }

  const totalPages = changes ? Math.ceil(changes.length / itemsPerPage) : 1
  const paginatedChanges = changes?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))

  return (
    <div className={'fixed top-[10%] left-[10%] bg-black bg-opacity-50 w-[80%] h-[80%] z-50'}>
      <div className={'bg-white p-4 rounded shadow-lg h-full'}>
        <h2 className={'text-lg font-bold mb-4'}>История изменений</h2>
        <ul className={'overflow-y-auto h-[calc(100%-80px)]'}>
          {paginatedChanges?.map(change => (
            <li className={'mb-2'} key={change.id}>
              <div className={'text-sm text-gray-400'}>
                <span>
                  <strong>Дата:</strong> {new Date(change.changedAt).toLocaleString()}
                </span>
              </div>
              <div className={'text-sm text-gray-600 mt-1'}>
                <strong>Изменения:</strong> {change.description}
              </div>
            </li>
          ))}
        </ul>
        <div className={'flex justify-between items-center mt-4'}>
          <button
            className={'bg-gray-300 px-4 py-1 rounded'}
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            Назад
          </button>
          <span>
            Страница {currentPage} из {totalPages}
          </span>
          <button
            className={'bg-gray-300 px-4 py-1 rounded'}
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            Вперед
          </button>
          <button className={'bg-red-500 text-white px-4 py-1 rounded'} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}
