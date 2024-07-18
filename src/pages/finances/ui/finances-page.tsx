import React, { useState } from 'react'

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

type Report = {
  margin: number // маржа
  month: string
  planned_margin_q1: number // план по марже 1 квартал
  planned_margin_year: number // годовой план
  revenue: number // оборот
}

type Employee = {
  name: string
  reports: Report[]
}

type ExpenseReport = {
  expense: number
  month: string
  name: string
}

type ExpenseCategory = {
  category: string
  reports: ExpenseReport[]
}

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const generateRandomIncomeReports = (): Report[] => {
  return months.map(month => {
    const revenue = getRandomNumber(50000, 100000)
    const margin = getRandomNumber(10000, 50000)
    const planned_margin_q1 = getRandomNumber(30000, 70000)
    const planned_margin_year = getRandomNumber(100000, 300000)

    return {
      margin,
      month,
      planned_margin_q1,
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

const generateRandomExpenseReports = (category: string, reports: string[]): ExpenseCategory => {
  return {
    category,
    reports: reports
      .map(name => {
        return months.map(month => ({
          expense: getRandomNumber(1000, 10000),
          month,
          name,
        }))
      })
      .flat(),
  }
}

const categories = [
  {
    category: 'Рента Офис',
    reports: ['Рента Офис'],
  },
  {
    category: 'Заработная плата ФОТ',
    reports: ['Основные сотрудники', 'Внештатные сотрудники', 'Оплата HR'],
  },
  {
    category: 'Налоговая нагрузка',
    reports: ['Налоговая нагрузка'],
  },
  {
    category: 'Офисные расходы',
    reports: [
      'Вода',
      'Канцелярия',
      'Уборщица',
      'Чай кофе',
      'Закупка оборудования и мебели',
      'Прочие офисные расходы',
    ],
  },
  {
    category: 'Расходы на iT',
    reports: [
      'Интернет',
      'Телефония',
      'Оплата хостинга',
      'Оплата CRM',
      'Привлечённые специалисты',
      'Прочие iT расходы',
    ],
  },
  {
    category: 'Командировки',
    reports: ['Командировки'],
  },
  {
    category: 'Прочие расходы',
    reports: ['Прочие расходы'],
  },
]

const generateRandomExpenseData = () => {
  return categories.map(category =>
    generateRandomExpenseReports(category.category, category.reports)
  )
}

const initialEmployeeData: Employee[] = generateRandomEmployees(10)
const initialExpenseData: ExpenseCategory[] = generateRandomExpenseData()

export const FinancesPage: React.FC = () => {
  const [incomeData, setIncomeData] = useState(initialEmployeeData)
  const [expenseData, setExpenseData] = useState(initialExpenseData)
  const [startMonthIndex, setStartMonthIndex] = useState(0) // Индекс начального месяца

  const handleIncomeDataChange = (newData: Employee[]) => {
    setIncomeData(newData)
  }

  const handleExpenseDataChange = (newData: ExpenseCategory[]) => {
    setExpenseData(newData)
  }

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStartMonthIndex(Number(event.target.value))
  }

  const selectedMonths = months.slice(startMonthIndex, startMonthIndex + 3)

  return (
    <div>
      <label htmlFor={'monthSelect'}>Выберите начальный месяц: </label>
      <select id={'monthSelect'} onChange={handleMonthChange} value={startMonthIndex}>
        {months.slice(0, months.length - 2).map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>
      <h2 className={'text-xl font-bold mt-4'}>Таблица доходов</h2>
      <IncomeTable
        data={incomeData}
        months={selectedMonths}
        onDataChange={handleIncomeDataChange}
      />
      <h2 className={'text-xl font-bold mt-4'}>Таблица расходов</h2>
      <ExpenseTable
        data={expenseData}
        months={selectedMonths}
        onDataChange={handleExpenseDataChange}
      />
    </div>
  )
}
