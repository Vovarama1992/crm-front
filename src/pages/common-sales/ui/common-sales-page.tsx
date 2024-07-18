/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'

import CommonSalesTable from './CommonSalesTable'

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
]

type SalesReport = {
  margin: number // маржа
  month: string
  planned_margin: number // план маржа
  revenue: number // оборот
}

type SalesEmployee = {
  name: string
  reports: SalesReport[]
}

type SalesDepartmentData = {
  department: string
  employees: SalesEmployee[]
}

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const generateRandomSalesReports = (): SalesReport[] => {
  return months.map(month => {
    const revenue = getRandomNumber(50000, 100000)
    const margin = getRandomNumber(10000, 50000)
    const planned_margin = getRandomNumber(15000, 60000)

    return {
      margin,
      month,
      planned_margin,
      revenue,
    }
  })
}

const generateRandomSalesEmployees = (numEmployees: number): SalesEmployee[] => {
  const employees: SalesEmployee[] = []

  for (let i = 0; i < numEmployees; i++) {
    employees.push({
      name: `Сотрудник ${i + 1}`,
      reports: generateRandomSalesReports(),
    })
  }

  return employees
}

const generateRandomSalesDepartments = (numDepartments: number): SalesDepartmentData[] => {
  const departments: SalesDepartmentData[] = []

  for (let i = 0; i < numDepartments; i++) {
    departments.push({
      department:
        i === 0
          ? 'Сотрудники без мотивации на продажи'
          : i === numDepartments - 1
            ? 'Продажи не относящиеся к отделу продаж'
            : `Отдел ${i + 1}`,
      employees: generateRandomSalesEmployees(getRandomNumber(5, 10)),
    })
  }

  return departments
}

const salesData: SalesDepartmentData[] = generateRandomSalesDepartments(10)

export const CommonSalesPage: React.FC = () => {
  const [data, setData] = useState(salesData)
  const [startMonthIndex, setStartMonthIndex] = useState(0)

  const handleDataChange = (newData: SalesDepartmentData[]) => {
    setData(newData)
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
      <CommonSalesTable data={data} months={selectedMonths} onDataChange={handleDataChange} />
    </div>
  )
}
