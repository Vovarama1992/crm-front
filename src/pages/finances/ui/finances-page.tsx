/* eslint-disable max-lines */
import React, { useState } from 'react'

import ExpenseTable from './ExpenseTable'
import IncomeTable from './IncomeTable'
import initialCategories from './initialExpenses'

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

type Report = {
  margin: number
  margin_percent: number
  month: string
  planned_margin_year: number
  revenue: number
}

type Employee = {
  name: string
  reports: Report[]
}

const generateRandomIncomeReports = (): Report[] => {
  return months.map(month => {
    const revenue = getRandomNumber(50000, 100000)
    const margin = getRandomNumber(10000, 50000)
    const margin_percent = Math.random()
    const planned_margin_year = getRandomNumber(100000, 300000)

    return {
      margin,
      margin_percent,
      month,
      planned_margin_year,
      revenue,
    }
  })
}

const generateRandomEmployees = (numEmployees: number): Employee[] => {
  const employees: Employee[] = []

  for (let i = 0; i < numEmployees; i++) {
    employees.push({
      name: `Сотрудник ${i + 1}`,
      reports: generateRandomIncomeReports(),
    })
  }

  return employees
}

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const initialEmployeeData: Employee[] = generateRandomEmployees(10)

export const FinancesPage: React.FC = () => {
  const [incomeData, setIncomeData] = useState(initialEmployeeData)
  const [selectedYear, setSelectedYear] = useState<'' | number>('')
  const [selectedQuarter, setSelectedQuarter] = useState<'' | number>('')
  const [startMonthIndex, setStartMonthIndex] = useState<number>(0)
  const [endMonthIndex, setEndMonthIndex] = useState<number>(11)

  const handleIncomeDataChange = (newData: Employee[]) => {
    setIncomeData(newData)
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value) || '')
  }

  const handleQuarterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const quarter = Number(event.target.value) || ''

    setSelectedQuarter(quarter)

    if (quarter) {
      const quarterStartMonth = (quarter - 1) * 3

      setStartMonthIndex(quarterStartMonth)
      setEndMonthIndex(quarterStartMonth + 2)
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
            <option value={''}>Все</option>
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
        <IncomeTable
          data={incomeData}
          months={selectedMonths}
          onDataChange={handleIncomeDataChange}
        />
      </div>

      <h2 className={'text-xl font-bold mt-4'}>Таблица расходов</h2>
      <div>
        <ExpenseTable initialCategories={initialCategories} months={selectedMonths} />
      </div>
    </div>
  )
}

export default FinancesPage
