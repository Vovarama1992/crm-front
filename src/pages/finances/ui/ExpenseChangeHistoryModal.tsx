import React, { useState } from 'react'

import { ChangeDto } from '@/entities/changes'

interface ExpenseChangeHistoryModalProps {
  changes: ChangeDto[]
  onClose: () => void
}

export const ExpenseChangeHistoryModal: React.FC<ExpenseChangeHistoryModalProps> = ({
  changes,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalPages = Math.ceil(changes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentChanges = changes.slice(startIndex, startIndex + itemsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className={'fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50'}>
      <div className={'relative bg-white p-6 rounded-lg shadow-xl w-full max-w-lg'}>
        <button
          className={'absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none'}
          onClick={onClose}
        >
          <span className={'text-2xl'}>&times;</span>
        </button>
        <h3 className={'text-2xl font-bold mb-6 text-center border-b pb-3'}>История изменений</h3>
        <div className={'space-y-4'}>
          {currentChanges.map(change => (
            <div className={'flex flex-col border-b pb-3 last:border-none'} key={change.id}>
              <div className={'text-sm text-gray-400'}>
                <span>
                  <strong>Дата:</strong> {new Date(change.changedAt).toLocaleString()}
                </span>
              </div>
              <div className={'text-sm text-gray-600 mt-1'}>
                <strong>Изменения:</strong> {change.description}
              </div>
            </div>
          ))}
        </div>
        <div className={'flex justify-between items-center mt-6'}>
          <button
            className={`px-4 py-2 bg-gray-200 text-gray-600 rounded ${
              currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-300'
            }`}
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            Назад
          </button>
          <span className={'text-gray-600'}>
            Страница {currentPage} из {totalPages}
          </span>
          <button
            className={`px-4 py-2 bg-gray-200 text-gray-600 rounded ${
              currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-300'
            }`}
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            Вперед
          </button>
        </div>
        <div className={'text-center mt-4'}>
          <button
            className={
              'px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none'
            }
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}
