import React, { useState } from 'react'

import MonthlyReportTable from './MonthlySalaryTable'

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

type Report = {
  earned: number
  month: string
  paid: number
  remaining: number
  salary: number
}

type Employee = {
  name: string
  reports: Report[]
}

type DepartmentData = {
  department: string
  employees: Employee[]
}

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const generateRandomReports = (): Report[] => {
  return months.map(month => {
    const salary = getRandomNumber(50000, 70000)
    const earned = salary + getRandomNumber(-5000, 5000)
    const paid = salary
    const remaining = earned - paid

    return {
      earned,
      month,
      paid,
      remaining,
      salary,
    }
  })
}

const generateRandomEmployees = (numEmployees: number): Employee[] => {
  const employees: Employee[] = []

  for (let i = 0; i < numEmployees; i++) {
    employees.push({
      name: `Сотрудник ${i + 1}`,
      reports: generateRandomReports(),
    })
  }

  return employees
}

const generateRandomDepartments = (numDepartments: number): DepartmentData[] => {
  const departments: DepartmentData[] = []

  for (let i = 0; i < numDepartments; i++) {
    departments.push({
      department: `Отдел ${i + 1}`,
      employees: generateRandomEmployees(getRandomNumber(5, 10)),
    })
  }

  return departments
}

const reportData: DepartmentData[] = generateRandomDepartments(10)

export const SalaryReportsPage: React.FC = () => {
  const [data, setData] = useState(reportData)
  const [startMonthIndex, setStartMonthIndex] = useState(0) // Индекс начального месяца

  const handleDataChange = (newData: DepartmentData[]) => {
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
      <MonthlyReportTable data={data} months={selectedMonths} onDataChange={handleDataChange} />
    </div>
  )
}

export default SalaryReportsPage
