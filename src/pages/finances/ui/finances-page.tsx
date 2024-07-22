/* eslint-disable max-lines */
import React, { useState } from 'react'

import ExpenseTable from './ExpenseTable'
import IncomeTable from './IncomeTable'
import Modal from './Modal'

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
  month: string
  planned_margin_q1: number
  planned_margin_year: number
  revenue: number
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
      month: month,
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
          month: month,
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
  const [selectedYear, setSelectedYear] = useState<'' | number>('')
  const [selectedQuarter, setSelectedQuarter] = useState<'' | number>('')
  const [startMonthIndex, setStartMonthIndex] = useState<number>(0)
  const [endMonthIndex, setEndMonthIndex] = useState<number>(11)
  const [newExpense, setNewExpense] = useState<ExpenseReport>({
    expense: 0,
    month: months[0],
    name: '',
  })
  const [newCategoryName, setNewCategoryName] = useState<string>('')
  const [newExpenseCategory, setNewExpenseCategory] = useState<string>(categories[0].category)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNewCategory, setIsNewCategory] = useState(false)

  const handleIncomeDataChange = (newData: Employee[]) => {
    setIncomeData(newData)
  }

  const handleExpenseDataChange = (newData: ExpenseCategory[]) => {
    setExpenseData(newData)
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

  const handleAddExpense = () => {
    const categoryIndex = isNewCategory
      ? -1
      : expenseData.findIndex(category => category.category === newExpenseCategory)

    if (categoryIndex !== -1) {
      const updatedReports = [...expenseData[categoryIndex].reports, newExpense]
      const updatedCategory = { ...expenseData[categoryIndex], reports: updatedReports }
      const updatedExpenseData = [
        ...expenseData.slice(0, categoryIndex),
        updatedCategory,
        ...expenseData.slice(categoryIndex + 1),
      ]

      setExpenseData(updatedExpenseData)
    } else {
      const newCategory = {
        category: newCategoryName,
        reports: [newExpense],
      }

      setExpenseData([...expenseData, newCategory])
    }

    setIsModalOpen(false)
  }

  const handleNewExpenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'category') {
      setNewExpenseCategory(value)
      setIsNewCategory(false)
    } else if (name === 'newCategoryName') {
      setNewCategoryName(value)
      setIsNewCategory(true)
    } else {
      setNewExpense(prev => ({
        ...prev,
        [name]: name === 'expense' ? Number(value) : value,
      }))
    }
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

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

      <button className={'mt-4 p-2 bg-blue-500 text-white rounded'} onClick={openModal}>
        Добавить расход
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} onSave={handleAddExpense}>
        <h2 className={'text-xl mb-4'}>Добавить новый расход</h2>
        <div className={'flex flex-col space-y-4'}>
          <div>
            <label className={'block'}>Выбрать существующую категорию</label>
            <select
              className={'border p-2 w-full'}
              disabled={isNewCategory}
              name={'category'}
              onChange={handleNewExpenseChange}
              value={newExpenseCategory}
            >
              {categories.map((category, index) => (
                <option key={index} value={category.category}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
          <div className={'flex items-center space-x-2'}>
            <input
              checked={isNewCategory}
              id={'isNewCategory'}
              name={'isNewCategory'}
              onChange={() => setIsNewCategory(!isNewCategory)}
              type={'checkbox'}
            />
            <label htmlFor={'isNewCategory'}>Добавить новую категорию</label>
          </div>
          {isNewCategory && (
            <div>
              <label className={'block'}>Название новой категории</label>
              <input
                className={'border p-2 w-full'}
                name={'newCategoryName'}
                onChange={handleNewExpenseChange}
                type={'text'}
                value={newCategoryName}
              />
            </div>
          )}
          <div>
            <label className={'block'}>Название расхода</label>
            <input
              className={'border p-2 w-full'}
              name={'name'}
              onChange={handleNewExpenseChange}
              type={'text'}
              value={newExpense.name}
            />
          </div>
          <div>
            <label className={'block'}>Месяц</label>
            <select
              className={'border p-2 w-full'}
              name={'month'}
              onChange={handleNewExpenseChange}
              value={newExpense.month}
            >
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={'block'}>Сумма</label>
            <input
              className={'border p-2 w-full'}
              name={'expense'}
              onChange={handleNewExpenseChange}
              type={'number'}
              value={newExpense.expense}
            />
          </div>
        </div>
      </Modal>

      <h2 className={'text-xl font-bold mt-4'}>Таблица расходов</h2>
      <div>
        <ExpenseTable
          data={expenseData}
          months={selectedMonths}
          onDataChange={handleExpenseDataChange}
        />
      </div>
    </div>
  )
}
