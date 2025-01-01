import React from 'react'

import { useGetExpenseChangesQuery } from '@/entities/deal'

type ExpenseChangesModalProps = {
  expenseId: number
  isOpen: boolean
  onClose: () => void
}

const ExpenseChangesModal: React.FC<ExpenseChangesModalProps> = ({
  expenseId,
  isOpen,
  onClose,
}) => {
  const { data: changes = [], isLoading } = useGetExpenseChangesQuery({ entityId: expenseId })

  if (!isOpen) {
    return null
  }

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }

    return new Date(date).toLocaleDateString('ru-RU', options)
  }

  return (
    <div className={'fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'}>
      <div className={'bg-white p-6 rounded shadow-lg w-96'}>
        <h2 className={'text-xl mb-4'}>История изменений</h2>
        {isLoading ? (
          <p>Загрузка...</p>
        ) : (
          <ul className={'space-y-2'}>
            {changes.map((change, index) => (
              <li className={'border-b pb-2'} key={index}>
                <div className={'text-sm text-gray-400'}>
                  <span>
                    <strong>Дата:</strong> {formatDate(change.changedAt)}
                  </span>
                </div>
                <div className={'text-sm text-gray-600 mt-1'}>
                  <strong>Изменения:</strong> {change.description}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className={'flex justify-end mt-4'}>
          <button className={'bg-gray-500 text-white px-4 py-2 rounded'} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExpenseChangesModal
