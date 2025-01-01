import React, { useEffect, useState } from 'react'

import { useGetExpenseChangesQuery } from '@/entities/deal'

interface HistoryModalProps {
  onClose: () => void
  purchaseId: number
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ onClose, purchaseId }) => {
  const [changes, setChanges] = useState<any[]>([])
  const { data, error, isLoading } = useGetExpenseChangesQuery({ entityId: purchaseId })

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

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'}>
      <div className={'bg-white p-6 rounded shadow-lg w-[70vw] max-h-[80vh] overflow-auto'}>
        <h3 className={'text-lg font-medium'}>История изменений</h3>
        <div className={'mt-4'}>
          {changes.length === 0 ? (
            <p>Нет изменений для отображения</p>
          ) : (
            <ul>
              {changes.map(change => (
                <li className={'border-b py-2'} key={change.id}>
                  <div>
                    <strong>Дата:</strong> {new Date(change.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <strong>Изменение:</strong> {change.changeDescription}
                  </div>
                </li>
              ))}
            </ul>
          )}
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
