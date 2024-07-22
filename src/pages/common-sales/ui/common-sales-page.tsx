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
  'Ноябрь',
  'Декабрь',
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
  const [endMonthIndex, setEndMonthIndex] = useState(months.length - 1)
  const [selectedYear, setSelectedYear] = useState<'' | string>('')
  const [selectedQuarter, setSelectedQuarter] = useState<'' | string>('')

  const [selectedDepartment, setSelectedDepartment] = useState<string>('Все')

  const handleDataChange = (newData: SalesDepartmentData[]) => {
    setData(newData)
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value)
    setSelectedQuarter('')
    setStartMonthIndex(0)
    setEndMonthIndex(months.length - 1)
  }

  const handleQuarterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const quarter = event.target.value

    setSelectedQuarter(quarter)
    setSelectedYear('')
    if (quarter === '1') {
      setStartMonthIndex(0)
      setEndMonthIndex(2)
    } else if (quarter === '2') {
      setStartMonthIndex(3)
      setEndMonthIndex(5)
    } else if (quarter === '3') {
      setStartMonthIndex(6)
      setEndMonthIndex(8)
    } else if (quarter === '4') {
      setStartMonthIndex(9)
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
    setSelectedYear('')
    setSelectedQuarter('')
  }

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(event.target.value)
  }

  const selectedMonths = months.slice(startMonthIndex, endMonthIndex + 1)
  const filteredData =
    selectedDepartment === 'Все'
      ? data
      : data.filter(dept => dept.department === selectedDepartment)

  return (
    <div className={'absolute left-[5%] top-[9%]'}>
      <div className={'flex mb-4'}>
        <div className={'mr-4'}>
          <label htmlFor={'yearSelect'}>Выберите год: </label>
          <select
            className={'border p-2'}
            id={'yearSelect'}
            onChange={handleYearChange}
            value={selectedYear}
          >
            <option value={''}>Все</option>
            {['2020', '2021', '2022', '2023', '2024'].map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className={'mr-4'}>
          <label htmlFor={'quarterSelect'}>Выберите квартал: </label>
          <select
            className={'border p-2'}
            id={'quarterSelect'}
            onChange={handleQuarterChange}
            value={selectedQuarter}
          >
            <option value={''}>Все</option>
            <option value={'1'}>Первый квартал</option>
            <option value={'2'}>Второй квартал</option>
            <option value={'3'}>Третий квартал</option>
            <option value={'4'}>Четвертый квартал</option>
          </select>
        </div>
        <div className={'mr-4'}>
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
        <div className={'mr-4'}>
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
        <div>
          <label htmlFor={'departmentSelect'}>Выберите отдел: </label>
          <select
            className={'border p-2'}
            id={'departmentSelect'}
            onChange={handleDepartmentChange}
            value={selectedDepartment}
          >
            <option value={'Все'}>Все</option>
            {data.map((dept, index) => (
              <option key={index} value={dept.department}>
                {dept.department}
              </option>
            ))}
          </select>
        </div>
      </div>
      <CommonSalesTable
        data={filteredData}
        months={selectedMonths}
        onDataChange={handleDataChange}
      />
    </div>
  )
}
