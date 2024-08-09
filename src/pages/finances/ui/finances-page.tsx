/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react'

import {
  useGetAllExpensesQuery,
  useGetAllUsersMonthlyTurnoverAndMarginQuery,
} from '@/entities/deal'

import ExpenseTable from './ExpenseTable'
import IncomeTable from './IncomeTable'

const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

const years = [2020, 2021, 2022, 2023, 2024]

type FlatReport = {
  completionPercent: number
  marginAmount: number
  marginPercent: number
  month: string
  totalMargin: number
  totalTurnover: number
  userId: number
  year: number
  yearlyProfitPlan: number
}

type Employee = {
  name: string
  reports: FlatReport[]
}

export const FinancesPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedQuarter, setSelectedQuarter] = useState<'' | number>('')
  const [startMonthIndex, setStartMonthIndex] = useState<number>(0)
  const [endMonthIndex, setEndMonthIndex] = useState<number>(11)

  const startDate = `${selectedYear}-01-01`
  const endDate = `${selectedYear}-12-31`

  const { data: turnoverAndMarginData, isLoading: isLoadingTurnoverAndMargin } =
    useGetAllUsersMonthlyTurnoverAndMarginQuery({
      endDate,
      startDate,
    })

  const { data: expensesData, isLoading: isLoadingExpenses } = useGetAllExpensesQuery()

  const [incomeData, setIncomeData] = useState<Employee[]>([])

  useEffect(() => {
    if (turnoverAndMarginData) {
      const employeeData: Employee[] = turnoverAndMarginData.map(userData => ({
        name: `User ${userData.userId}`,
        reports: userData.monthlyData.map((monthlyData: any) => ({
          completionPercent: monthlyData.completionPercent,
          marginAmount: monthlyData.marginAmount,
          marginPercent: monthlyData.marginPercent,
          month: months[monthlyData.month - 1],
          totalMargin: monthlyData.totalMargin,
          totalTurnover: monthlyData.totalTurnover,
          userId: userData.userId,
          year: monthlyData.year,
          yearlyProfitPlan: monthlyData.yearlyProfitPlan,
        })),
      }))

      setIncomeData(employeeData)
    }
  }, [turnoverAndMarginData, selectedYear])

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value))
  }

  const handleQuarterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const quarter = Number(event.target.value)

    setSelectedQuarter(quarter)

    if (quarter) {
      const quarterStartMonth = (quarter - 1) * 3

      setStartMonthIndex(quarterStartMonth)
      setEndMonthIndex(quarterStartMonth + 2)
    } else {
      setStartMonthIndex(0)
      setEndMonthIndex(11)
    }
  }

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>, isStart: boolean) => {
    const monthIndex = Number(event.target.value)

    if (isStart) {
      setStartMonthIndex(monthIndex)
      if (monthIndex > endMonthIndex) {
        setEndMonthIndex(monthIndex)
      }
    } else {
      setEndMonthIndex(monthIndex)
      if (monthIndex < startMonthIndex) {
        setStartMonthIndex(monthIndex)
      }
    }
    setSelectedQuarter('')
  }

  const getSelectedMonths = () => {
    return months.slice(startMonthIndex, endMonthIndex + 1)
  }

  const selectedMonths = getSelectedMonths()

  return (
    <div className={'absolute top-[10%] left-[10%] w-[80%] h-auto'}>
      <div className={'flex w-full mb-4'}>
        <div className={'ml-[300px] flex flex-col mr-4'}>
          <label htmlFor={'yearSelect'}>Выберите год: </label>
          <select
            className={'border p-2'}
            id={'yearSelect'}
            onChange={handleYearChange}
            value={selectedYear || ''}
          >
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className={'flex flex-col mr-4'}>
          <label htmlFor={'quarterSelect'}>Выберите квартал: </label>
          <select
            className={'border p-2'}
            id={'quarterSelect'}
            onChange={handleQuarterChange}
            value={selectedQuarter || ''}
          >
            <option value={''}>Все</option>
            {[1, 2, 3, 4].map((quarter, index) => (
              <option key={index} value={quarter}>
                {`Квартал ${quarter}`}
              </option>
            ))}
          </select>
        </div>
        <div className={'flex flex-col mr-4'}>
          <label htmlFor={'startMonthSelect'}>Выберите начальный месяц: </label>
          <select
            className={'border p-2'}
            id={'startMonthSelect'}
            onChange={e => handleMonthChange(e, true)}
            value={startMonthIndex}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className={'flex flex-col'}>
          <label htmlFor={'endMonthSelect'}>Выберите конечный месяц: </label>
          <select
            className={'border p-2'}
            id={'endMonthSelect'}
            onChange={e => handleMonthChange(e, false)}
            value={endMonthIndex}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h2 className={'text-xl font-bold mt-4'}>Таблица доходов</h2>
      <div>
        <IncomeTable data={incomeData} months={selectedMonths} />
      </div>

      <h2 className={'text-xl font-bold mt-4'}>Таблица расходов</h2>
      <ExpenseTable expenses={expensesData || []} months={selectedMonths} />
    </div>
  )
}

export default FinancesPage
