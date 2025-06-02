import React, { useEffect, useState } from 'react'

import { CreateExpenseDto, ExpenseDto } from '@/entities/deal/deal.types'
import { useCreateExpenseMutation, useGetAllExpensesQuery } from '@/entities/purchase'
import { useMeQuery } from '@/entities/session'

interface RentExpenseModalProps {
  isOpen: boolean
  onClose: () => void
}

const RentExpenseModal: React.FC<RentExpenseModalProps> = ({ isOpen, onClose }) => {
  const [expenseName, setExpenseName] = useState('Аренда офиса')
  const [expenseAmount, setExpenseAmount] = useState(0)

  const { data: allExpenses } = useGetAllExpensesQuery() // Получаем все расходы
  const [createExpense] = useCreateExpenseMutation()
  const { data: user } = useMeQuery()
  const userId = user?.id

  useEffect(() => {
    if (allExpenses) {
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()

      const lastOfficeRentExpense = allExpenses.find((expense: ExpenseDto) => {
        const expenseDate = new Date(expense.date)

        return (
          expense.category === 'Офис' &&
          expense.subcategory === 'Аренда' &&
          expenseDate.getMonth() === currentMonth - 1 &&
          expenseDate.getFullYear() === currentYear
        )
      })

      if (lastOfficeRentExpense) {
        setExpenseAmount(lastOfficeRentExpense.expense)
      }
    }
  }, [allExpenses])

  const handleAddExpense = () => {
    const newExpense: CreateExpenseDto = {
      category: 'Офис',
      date: new Date().toISOString(),
      expense: expenseAmount,
      name: expenseName,
      subcategory: 'Аренда',
      userId, // <- добавили сюда
    }

    createExpense(newExpense)
    onClose()
  }

  return isOpen ? (
    <div className={'fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center'}>
      <div
        className={
          'bg-white p-8 rounded-xl shadow-lg w-[400px] max-w-full transform transition-all duration-300 scale-100 hover:scale-105'
        }
      >
        <h3 className={'text-2xl font-semibold text-center mb-6 text-gray-800'}>
          Добавить расход: АРЕНДА
        </h3>

        <input
          className={
            'w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          }
          onChange={e => setExpenseName(e.target.value)}
          placeholder={'Название расхода'}
          type={'text'}
          value={expenseName}
        />

        <input
          className={
            'w-full p-3 mb-6 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          }
          onChange={e => setExpenseAmount(Number(e.target.value))}
          placeholder={'Сумма'}
          type={'number'}
          value={expenseAmount}
        />

        <div className={'flex justify-between gap-4'}>
          <button
            className={
              'w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200'
            }
            onClick={handleAddExpense}
          >
            Добавить
          </button>

          <button
            className={
              'w-full py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-200'
            }
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  ) : null
}

export default RentExpenseModal
