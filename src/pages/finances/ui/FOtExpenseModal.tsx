/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'

import { CreateExpenseDto } from '@/entities/deal/deal.types'
import { useCreateExpenseMutation } from '@/entities/purchase'
import { useMeQuery } from '@/entities/session'
import { WorkerDto, useGetDepartmentsQuery, useGetWorkersQuery } from '@/entities/workers'

interface ExtendedWorkerDto extends WorkerDto {
  calculatedSalary?: number
  workedDays: number
}

interface FOTExpenseModalProps {
  isOpen: boolean
  onClose: () => void
}

const FOTExpenseModal: React.FC<FOTExpenseModalProps> = ({ isOpen, onClose }) => {
  const [createExpense] = useCreateExpenseMutation()
  const { data: departments, error, isLoading } = useGetDepartmentsQuery()
  const { data: allWorkersData = [] } = useGetWorkersQuery()
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('')
  const [expenseDate, setExpenseDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [workers, setWorkers] = useState<ExtendedWorkerDto[]>([])
  const [workingDaysInMonth, setWorkingDaysInMonth] = useState<number>(21)

  const { data: user } = useMeQuery()
  const userId = user?.id || undefined

  useEffect(() => {
    if (!selectedDepartmentId) {
      setWorkers([])

      return
    }

    const baseFilter = (w: WorkerDto) => w.salary > 0

    let filteredWorkers: WorkerDto[] = []

    if (selectedDepartmentId === 'all') {
      filteredWorkers = allWorkersData.filter(baseFilter)
    } else if (selectedDepartmentId === 'none') {
      filteredWorkers = allWorkersData.filter(w => w.department_id === null && baseFilter(w))
    } else {
      const department = departments?.find(dep => dep.id.toString() === selectedDepartmentId)

      filteredWorkers = (department?.users || []).filter(baseFilter)
    }

    setWorkers(
      filteredWorkers.map(worker => {
        const salaryPerDay = worker.salary / workingDaysInMonth

        return {
          ...worker,
          calculatedSalary: +(salaryPerDay * workingDaysInMonth).toFixed(2),
          workedDays: workingDaysInMonth,
        }
      })
    )
  }, [departments, allWorkersData, selectedDepartmentId, workingDaysInMonth])

  const handleChangeWorkedDays = (id: number, days: number) => {
    setWorkers(prev =>
      prev.map(worker => {
        if (worker.id === id) {
          const salaryPerDay = worker.salary / workingDaysInMonth

          return {
            ...worker,
            calculatedSalary: +(salaryPerDay * days).toFixed(2),
            workedDays: days,
          }
        }

        return worker
      })
    )
  }

  const handleWorkingDaysChange = (days: number) => {
    setWorkingDaysInMonth(days)
    setWorkers(prev =>
      prev.map(worker => {
        const salaryPerDay = worker.salary / days

        return {
          ...worker,
          calculatedSalary: +(salaryPerDay * worker.workedDays).toFixed(2),
        }
      })
    )
  }

  const handleSaveExpense = async () => {
    try {
      const promises = workers.map(worker => {
        const newExpense: CreateExpenseDto = {
          category: 'Зарплата сотрудников',
          date: new Date(expenseDate).toISOString(),
          expense: worker.calculatedSalary || 0,
          name: `Оклад: ${worker.name} ${worker.surname}`, // ФИО сотрудника в названии
          subcategory: 'Оклад',
          userId: userId, // кто создал
          workerId: worker.id, // для кого расход
        }

        return createExpense(newExpense)
      })

      await Promise.all(promises)
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
              onChange={e => setSelectedDepartmentId(e.target.value)}
              value={selectedDepartmentId}
            >
              <option value={''}>Выберите отдел</option>
              <option value={'all'}>Все отделы</option>
              <option value={'none'}>Сотрудники вне отдела</option>
              {departments?.map(department => (
                <option key={department.id} value={department.id.toString()}>
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
                    <input
                      className={'w-20 border border-gray-300 rounded px-2 py-1'}
                      onChange={e => handleChangeWorkedDays(worker.id, Number(e.target.value))}
                      type={'number'}
                      value={worker.workedDays}
                    />
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
