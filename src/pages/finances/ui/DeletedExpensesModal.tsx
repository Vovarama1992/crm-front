import React, { useEffect, useState } from 'react'

import { useGetDeletedExpensesQuery, useRestoreExpenseMutation } from '@/entities/deal'
import { useGetWorkersQuery } from '@/entities/workers'

type DeletedExpense = {
  category: string
  date: string
  expense: number
  id: number
  name: string
  subcategory: string
  userId?: number
}

type DeletedExpensesModalProps = {
  isOpen: boolean
  onClose: () => void
}

const DeletedExpensesModal: React.FC<DeletedExpensesModalProps> = ({ isOpen, onClose }) => {
  const { data: deletedExpenses = [], isLoading: isLoadingDeletedExpenses } =
    useGetDeletedExpensesQuery()
  const { data: workersData, isLoading: isLoadingWorkers } = useGetWorkersQuery()
  const [restoreExpense] = useRestoreExpenseMutation()

  const [userNames, setUserNames] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    if (workersData) {
      const names: { [key: number]: string } = {}

      workersData.forEach((worker: any) => {
        if (worker.id && worker.name) {
          names[worker.id] = `${worker.name} ${worker.surname}`
        }
      })
      setUserNames(names)
    }
  }, [workersData])

  const handleRestore = async (id: number) => {
    try {
      await restoreExpense(id).unwrap()
      alert('Расход восстановлен успешно')
      onClose()
    } catch (error) {
      console.error('Ошибка при восстановлении расхода:', error)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className={'fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'}>
      <div className={'bg-white p-6 rounded shadow-lg w-96'}>
        <h2 className={'text-xl mb-4'}>Удаленные расходы</h2>
        {isLoadingDeletedExpenses || isLoadingWorkers ? (
          <div>Загрузка...</div>
        ) : (
          <div className={'space-y-4'}>
            {deletedExpenses.length === 0 ? (
              <div>Нет удаленных расходов</div>
            ) : (
              deletedExpenses.map((expense: DeletedExpense) => (
                <div className={'flex justify-between items-center'} key={expense.id}>
                  <div>
                    <div>{expense.name}</div>
                    <div>
                      {expense.category} / {expense.subcategory}
                    </div>
                    <div>{expense.expense} руб.</div>
                    {expense.userId && userNames[expense.userId] && (
                      <div className={'text-sm text-gray-500'}>
                        Удалено пользователем: {userNames[expense.userId]}
                      </div>
                    )}
                  </div>
                  <button
                    className={'bg-blue-500 text-white px-3 py-1 rounded'}
                    onClick={() => handleRestore(expense.id)}
                  >
                    Восстановить
                  </button>
                </div>
              ))
            )}
          </div>
        )}
        <div className={'flex justify-end space-x-2 mt-4'}>
          <button className={'bg-gray-500 text-white px-3 py-1 rounded'} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletedExpensesModal
