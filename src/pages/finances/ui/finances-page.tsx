/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'

import { useGetAllExpensesQuery } from '@/entities/deal'
import { useGetAllUsersMonthlyTurnoverAndMarginQuery } from '@/entities/deal'
import { useGetMonthlyBonusesQuery } from '@/entities/deal'
import { ExpenseDto } from '@/entities/deal/deal.types'
import { useGetUsersWithMotivationsQuery } from '@/entities/workers'

import ExpenseTable from './ExpenseTable'
import IncomeTable from './IncomeTable'
import IncomesExpenseDiffsTable from './Incomes-Expense-Diffs-Table'

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

const years = [2024, 2025, 2026]

type Employee = {
  monthlyMargin: number
  motivations: any[]
  name: string
  reports: FlatReport[]
}

export type EmployeeExpense = {
  expense: number
  month: string
}

export const FinancesPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const savedYear = localStorage.getItem('financesSelectedYear')

    return savedYear ? Number(savedYear) : new Date().getFullYear()
  })

  const [selectedQuarter, setSelectedQuarter] = useState<'' | number>(() => {
    const savedQuarter = localStorage.getItem('financesSelectedQuarter')

    return savedQuarter ? Number(savedQuarter) : ''
  })

  const [startMonthIndex, setStartMonthIndex] = useState<number>(() => {
    const savedStartMonth = localStorage.getItem('financesStartMonthIndex')

    return savedStartMonth ? Number(savedStartMonth) : 0
  })

  const [endMonthIndex, setEndMonthIndex] = useState<number>(() => {
    const savedEndMonth = localStorage.getItem('financesEndMonthIndex')

    return savedEndMonth ? Number(savedEndMonth) : 11
  })

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value)

    setSelectedYear(value)
    localStorage.setItem('financesSelectedYear', String(value))
  }

  const handleQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? '' : Number(e.target.value)

    setSelectedQuarter(value)
    localStorage.setItem('financesSelectedQuarter', String(value))

    if (value !== '') {
      const quarterStartMap = [0, 3, 6, 9]
      const start = quarterStartMap[value - 1]
      const end = start + 2

      setStartMonthIndex(start)
      setEndMonthIndex(end)

      localStorage.setItem('financesStartMonthIndex', String(start))
      localStorage.setItem('financesEndMonthIndex', String(end))
    }
  }

  const handleStartMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value)

    setStartMonthIndex(value)
    localStorage.setItem('financesStartMonthIndex', String(value))
  }

  const handleEndMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value)

    setEndMonthIndex(value)
    localStorage.setItem('financesEndMonthIndex', String(value))
  }

  const [employeeExpenses, setEmployeeExpenses] = useState<EmployeeExpense[]>([])
  const { data: bonusesData } = useGetMonthlyBonusesQuery()
  // Хук для получения мотиваций
  const { data: motivateds } = useGetUsersWithMotivationsQuery()

  // Хук для получения данных о доходах (оборот и маржа)
  const startDate = '2025-01-01' // Укажи свою начальную дату
  const endDate = '2025-12-31' // Укажи свою конечную дату

  const { data: monthlyTurnoverAndMarginData } = useGetAllUsersMonthlyTurnoverAndMarginQuery({
    endDate,
    startDate,
  })
  // Хук для получения данных о расходах
  const { data: expensesData } = useGetAllExpensesQuery()

  const [incomeData, setIncomeData] = useState<Employee[]>([])

  useEffect(() => {
    if (motivateds && monthlyTurnoverAndMarginData) {
      const employeeData = monthlyTurnoverAndMarginData.map(item => {
        const motivation = motivateds.find(mot => mot.id === item.userId)

        const reports: FlatReport[] = item.monthlyData.map((reportItem: FlatReport) => ({
          completionPercent: (reportItem.totalMargin / (reportItem.yearlyProfitPlan || 1)) * 100,
          marginAmount: reportItem.marginAmount ?? 0,
          marginPercent: reportItem.marginPercent ?? 0,
          month: months[(Number(reportItem.month) || 1) - 1], // Приведение к числу и индекс
          totalMargin: reportItem.totalMargin ?? 0,
          totalTurnover: reportItem.totalTurnover ?? 0,
          userId: reportItem.userId,
          year: reportItem.year,
          yearlyProfitPlan: reportItem.yearlyProfitPlan ?? 0,
        }))

        return {
          monthlyMargin: reports.reduce((sum, r) => sum + r.totalMargin, 0), // Только суммирование по месяцам
          motivations: motivation?.motivations || [],
          name: item.name || `User ${item.userId}`,
          reports,
          userMargin: reports.reduce((sum, r) => sum + r.marginAmount, 0),
        }
      })
      const employeeExpensesByMonth = months.map((month, index) => ({
        expense: employeeData.reduce((sum, employee) => {
          return (
            sum + (employee.reports.find(r => months.indexOf(r.month) === index)?.marginAmount ?? 0)
          )
        }, 0),
        month,
      }))

      setEmployeeExpenses(employeeExpensesByMonth)

      setIncomeData(employeeData)
    }
  }, [motivateds, monthlyTurnoverAndMarginData])

  const calculateIncomeAndExpenses = () => {
    if (!incomeData || !expensesData || !employeeExpenses || !bonusesData) {
      console.log('Нет данных о доходах, расходах, премиях или расходах сотрудников')

      return []
    }

    return months.slice(startMonthIndex, endMonthIndex + 1).map(month => {
      const incomeForMonth = incomeData.reduce((acc, employee) => {
        const reportForMonth = employee.reports.find(report => report.month === month)

        return acc + (reportForMonth?.totalMargin ?? 0)
      }, 0)

      const expensesForMonth = (expensesData as ExpenseDto[]).reduce((acc, expense) => {
        const expenseDate = new Date(expense.date)
        const expenseMonthIndex = expenseDate.getMonth()

        return expenseMonthIndex === months.indexOf(month) ? acc + expense.expense : acc
      }, 0)

      const employeeExpensesForMonth =
        employeeExpenses.find(exp => exp.month === month)?.expense ?? 0

      const bonusForMonth = bonusesData[month] ?? 0

      return {
        expenses: expensesForMonth + employeeExpensesForMonth + bonusForMonth,
        income: incomeForMonth,
        month,
        remaining: incomeForMonth - (expensesForMonth + employeeExpensesForMonth + bonusForMonth),
      }
    })
  }

  const monthlySummary = calculateIncomeAndExpenses()

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
            onChange={handleStartMonthChange}
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
            onChange={handleEndMonthChange}
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
      <IncomeTable months={months.slice(startMonthIndex, endMonthIndex + 1)} />

      <h2 className={'text-xl font-bold mt-4'}>Таблица Доходов-Расходов</h2>
      <IncomesExpenseDiffsTable data={monthlySummary} />

      <h2 className={'text-xl font-bold mt-4'}>Таблица расходов</h2>
      <ExpenseTable
        employeeExpenses={employeeExpenses}
        expenses={expensesData || []}
        months={months.slice(startMonthIndex, endMonthIndex + 1)}
      />
    </div>
  )
}

export default FinancesPage
