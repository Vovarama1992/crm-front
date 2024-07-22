import React, { useMemo, useState } from 'react'

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
  'Ноябрь',
  'Декабрь',
]

const years = [2023, 2024, 2025]

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

const generateRandomReports = (year: number): Report[] => {
  return months.map(month => {
    const salary = getRandomNumber(50000, 70000)
    const earned = salary + getRandomNumber(-5000, 5000)
    const paid = salary
    const remaining = earned - paid

    return {
      earned,
      month: `${month} ${year}`,
      paid,
      remaining,
      salary,
    }
  })
}

const generateRandomEmployees = (numEmployees: number, year: number): Employee[] => {
  const employees: Employee[] = []

  for (let i = 0; i < numEmployees; i++) {
    employees.push({
      name: `Сотрудник ${i + 1}`,
      reports: generateRandomReports(year),
    })
  }

  return employees
}

const generateRandomDepartments = (numDepartments: number, year: number): DepartmentData[] => {
  const departments: DepartmentData[] = []

  for (let i = 0; i < numDepartments; i++) {
    departments.push({
      department: `Отдел ${i + 1}`,
      employees: generateRandomEmployees(getRandomNumber(5, 10), year),
    })
  }

  return departments
}

const reportData: DepartmentData[] = [
  ...generateRandomDepartments(5, 2023),
  ...generateRandomDepartments(5, 2024),
  ...generateRandomDepartments(5, 2025),
]

export const SalaryReportsPage: React.FC = () => {
  const [data, setData] = useState(reportData)
  const [startMonthIndex, setStartMonthIndex] = useState(0)
  const [endMonthIndex, setEndMonthIndex] = useState(2)
  const [selectedYear, setSelectedYear] = useState<null | number>(null)
  const [selectedQuarter, setSelectedQuarter] = useState<null | number>(null)

  const handleDataChange = (newData: DepartmentData[]) => {
    setData(newData)
  }

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>, isStart: boolean) => {
    const value = Number(event.target.value)

    if (isStart) {
      setStartMonthIndex(value)
      if (value > endMonthIndex) {
        setEndMonthIndex(value)
      }
    } else {
      setEndMonthIndex(value)
      if (value < startMonthIndex) {
        setStartMonthIndex(value)
      }
    }
    setSelectedQuarter(null)
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value))
    setSelectedQuarter(null)
  }

  const handleQuarterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const quarter = Number(event.target.value)

    setSelectedQuarter(quarter)
    setStartMonthIndex((quarter - 1) * 3)
    setEndMonthIndex(quarter * 3 - 1)
  }

  const filteredData = useMemo(() => {
    return data.map(department => ({
      ...department,
      employees: department.employees.map(employee => ({
        ...employee,
        reports: employee.reports.filter(report => {
          const [reportMonth, reportYear] = report.month.split(' ')
          const monthIndex = months.indexOf(reportMonth)
          const yearMatch = selectedYear ? Number(reportYear) === selectedYear : true
          const intervalMatch = monthIndex >= startMonthIndex && monthIndex <= endMonthIndex

          return yearMatch && intervalMatch
        }),
      })),
    }))
  }, [data, selectedYear, startMonthIndex, endMonthIndex])

  const selectedMonths = months.slice(startMonthIndex, endMonthIndex + 1)

  return (
    <div className={'absolute left-[1%] top-[10%] flex flex-col items-start p-4'}>
      <div className={'flex w-full mb-4'}>
        <div className={'ml-[300px] flex flex-col mr-4'}>
          <label htmlFor={'yearSelect'}>Выберите год: </label>
          <select id={'yearSelect'} onChange={handleYearChange} value={selectedYear || ''}>
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
          <select id={'quarterSelect'} onChange={handleQuarterChange} value={selectedQuarter || ''}>
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
      <div className={'w-full'}>
        <MonthlyReportTable
          data={filteredData}
          months={selectedMonths}
          onDataChange={handleDataChange}
          tablename={'отчеты по зарплате'}
        />
      </div>
    </div>
  )
}

export default SalaryReportsPage
