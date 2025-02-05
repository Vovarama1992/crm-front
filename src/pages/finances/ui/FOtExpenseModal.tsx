/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'

import { CreateExpenseDto } from '@/entities/deal/deal.types'
import { useCreateExpenseMutation } from '@/entities/purchase'
import { DepartmentDto, WorkerDto, useGetDepartmentsQuery } from '@/entities/workers'

import { getWorkingDays } from '../getWorkingDays'

interface ExtendedWorkerDto extends WorkerDto {
  calculatedSalary?: number
  hireDate: string
}

interface FOTExpenseModalProps {
  isOpen: boolean
  onClose: () => void
}

const FOTExpenseModal: React.FC<FOTExpenseModalProps> = ({ isOpen, onClose }) => {
  const [createExpense] = useCreateExpenseMutation()
  const { data: departments, error, isLoading } = useGetDepartmentsQuery()
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<null | number>(null)
  const [expenseDate, setExpenseDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [workers, setWorkers] = useState<ExtendedWorkerDto[]>([])
  const [workingDaysInMonth, setWorkingDaysInMonth] = useState<number>(21)

  useEffect(() => {
    if (selectedDepartmentId !== null) {
      const department: DepartmentDto | undefined = departments?.find(
        (department: DepartmentDto) => department.id === selectedDepartmentId
      )

      setWorkers(department?.users.filter(user => user?.salary > 0) || [])
    }
  }, [departments, selectedDepartmentId])

  useEffect(() => {
    if (workers.length > 0) {
      const updatedWorkers = workers.map(worker => {
        const workedDays = getWorkingDays(worker.hireDate, expenseDate)
        const salaryPerDay = worker.salary / workingDaysInMonth

        return {
          ...worker,
          calculatedSalary: +(salaryPerDay * workedDays).toFixed(2),
        }
      })

      setWorkers(updatedWorkers)
    }
  }, [workingDaysInMonth, expenseDate, workers.length, workers])

  const handleWorkingDaysChange = (days: number) => {
    setWorkingDaysInMonth(days)
  }

  const handleSaveExpense = async () => {
    const newExpenses: CreateExpenseDto[] = workers.map(worker => ({
      category: 'Зарплата сотрудников',
      date: new Date(expenseDate).toISOString(), // Преобразование даты
      expense: worker.calculatedSalary as number,
      name: 'Оклад сотрудников',
      subcategory: 'Оклад',
    }))

    try {
      await Promise.all(newExpenses.map(expense => createExpense(expense)))
      onClose()
    } catch (error) {
      console.error('Ошибка при сохранении расходов:', error)
    }
  }

  return isOpen ? (
    <div className={'fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center'}>
      <div className={'bg-white p-8 rounded-xl shadow-lg w-[600px] max-w-full'}>
        <h3 className={'text-2xl font-semibold text-center mb-6 text-gray-800'}>
          Добавить расход: ФОТ
        </h3>

        <div className={'mb-4'}>
          <input
            className={'w-full p-3 mb-4 border-2 border-gray-300 rounded-lg'}
            onChange={e => handleWorkingDaysChange(Number(e.target.value))}
            placeholder={'Количество рабочих дней в месяце'}
            type={'number'}
            value={workingDaysInMonth}
          />
        </div>

        <div className={'mb-4'}>
          <input
            className={'w-full p-3 mb-4 border-2 border-gray-300 rounded-lg'}
            onChange={e => setExpenseDate(e.target.value)}
            type={'date'}
            value={expenseDate}
          />
        </div>

        <div className={'mb-4'}>
          {isLoading ? (
            <p>Загрузка отделов...</p>
          ) : error ? (
            <p>Ошибка загрузки отделов</p>
          ) : (
            <select
              className={'w-full p-3 border-2 border-gray-300 rounded-lg'}
              onChange={e => setSelectedDepartmentId(Number(e.target.value))}
              value={selectedDepartmentId ?? ''}
            >
              <option value={''}>Выберите отдел</option>
              {departments?.map(department => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {workers.length > 0 && (
          <table className={'w-full mb-4 table-auto'}>
            <thead>
              <tr>
                <th className={'px-4 py-2'}>ФИО</th>
                <th className={'px-4 py-2'}>Отработанные дни</th>
                <th className={'px-4 py-2'}>Сумма оклада</th>
              </tr>
            </thead>
            <tbody>
              {workers.map(worker => (
                <tr key={worker.id}>
                  <td className={'px-4 py-2'}>{`${worker.name} ${worker.surname}`}</td>
                  <td className={'px-4 py-2'}>
                    <span>{getWorkingDays(worker.hireDate, expenseDate)}</span>
                  </td>
                  <td className={'px-4 py-2'}>{worker.calculatedSalary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className={'flex justify-between gap-4'}>
          <button
            className={
              'w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200'
            }
            onClick={handleSaveExpense}
          >
            Сохранить
          </button>

          <button
            className={
              'w-full py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-200'
            }
            onClick={onClose}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  ) : null
}

export default FOTExpenseModal
