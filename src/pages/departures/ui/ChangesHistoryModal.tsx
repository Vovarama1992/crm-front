import React from 'react'

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

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'}>
      <div className={'bg-white p-4 rounded shadow-lg w-[800px] max-w-full'}>
        <h2 className={'text-lg font-bold mb-4'}>История изменений</h2>
        <ul>
          {changes?.map(change => (
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
        <button className={'bg-red-500 text-white px-4 py-2 rounded mt-4'} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  )
}
