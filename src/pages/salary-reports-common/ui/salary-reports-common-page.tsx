import React, { useEffect, useState } from 'react'

import {
  useGetAllPaymentsQuery,
  useGetAllSalesQuery,
  useGetAllUsersMonthlyTurnoverAndMarginQuery,
} from '@/entities/deal'
import { useGetActiveQuery } from '@/entities/workers'
import { useGetDepartmentsQuery } from '@/entities/workers'

import MonthlySalaryTable from './MonthlySalaryTable'

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
  id: number // Добавляем поле id
  middleName: string
  name: string
  reports: Report[]
  surname: string
}

type DepartmentData = {
  department: string
  employees: Employee[]
}

export const SalaryReportsPage: React.FC = () => {
  const { data: users } = useGetActiveQuery()
  const { data: expenses } = useGetAllPaymentsQuery()
  const { data: margins } = useGetAllUsersMonthlyTurnoverAndMarginQuery({
    endDate: '2024-12-31',
    startDate: '2024-01-01',
  })
  const { data: sales } = useGetAllSalesQuery()
  const { data: departments } = useGetDepartmentsQuery()

  const [data, setData] = useState<DepartmentData[]>([])
  const [startMonthIndex, setStartMonthIndex] = useState(0)
  const [endMonthIndex, setEndMonthIndex] = useState(2)
  const [selectedYear, setSelectedYear] = useState<number>(2024)
  const [selectedQuarter, setSelectedQuarter] = useState<null | number>(null)

  useEffect(() => {
    if (!users || !margins || !expenses || !departments || !sales) {
      return
    }

    const departmentData: DepartmentData[] = departments.map(dept => ({
      department: dept.name,
      employees: [],
    }))

    users.forEach(user => {
      const departmentName =
        departments.find(dept => dept.id === user.department_id)?.name || 'Без отдела'

      let department = departmentData.find(d => d.department === departmentName)

      if (!department) {
        department = { department: departmentName, employees: [] }
        departmentData.push(department)
      }

      const employee: Employee = {
        id: user.id,
        middleName: user.middleName,
        name: user.name,
        reports: [],
        surname: user.surname,
      }

      let previousRemaining = 0

      months.forEach((month, index) => {
        const currentYear = selectedYear

        // Определяем первый и последний дни месяца
        const firstDayOfMonth = new Date(currentYear, index, 1)
        const lastDayOfMonth = new Date(currentYear, index + 1, 0) // последний день месяца

        // Проверка на дату приема на работу
        const hireDate = user.hireDate ? new Date(user.hireDate) : null

        let salary = 0

        if (hireDate && hireDate <= lastDayOfMonth) {
          // Если пользователь был принят на работу в текущем месяце или ранее
          const daysInMonth = lastDayOfMonth.getDate()
          const workingDays =
            hireDate > firstDayOfMonth ? daysInMonth - hireDate.getDate() + 1 : daysInMonth

          // Пропорциональный расчет оклада
          salary = (user.salary || 0) * (workingDays / daysInMonth)
        }

        // Данные о заработке (маржа) за месяц
        const marginData = margins.find(m => m.userId === user.id)
        const earnings =
          marginData?.monthlyData.find((m: any) => m.month === index + 1)?.totalMargin || 0

        // Выплаты за месяц
        const paid = expenses
          .filter(
            exp =>
              exp.userId === user.id &&
              new Date(exp.date).getMonth() === index &&
              new Date(exp.date).getFullYear() === currentYear
          )
          .reduce((sum, exp) => sum + exp.amount, 0)

        // Рассчитываем остаток с учетом остатка с прошлого месяца
        const remaining = salary + earnings - paid + previousRemaining

        // Заполняем отчет для текущего месяца
        employee.reports.push({
          earned: earnings,
          month: `${month} ${currentYear}`,
          paid: paid,
          remaining: remaining,
          salary: salary,
        })

        // Обновляем остаток для следующего месяца
        previousRemaining = remaining
      })

      department.employees.push(employee)
    })

    setData(departmentData)
  }, [users, margins, expenses, departments, sales, selectedYear])

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

  const filteredData = data.map(department => ({
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

  const selectedMonths = months.slice(startMonthIndex, endMonthIndex + 1)

  return (
    <div className={'absolute left-[1%] top-[10%] flex flex-col items-start p-4'}>
      <div className={'flex w-full mb-4'}>
        <div className={'ml-[300px] flex flex-col mr-4'}>
          <label htmlFor={'yearSelect'}>Выберите год: </label>
          <select id={'yearSelect'} onChange={handleYearChange} value={selectedYear}>
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
        <MonthlySalaryTable data={filteredData} months={selectedMonths} />
      </div>
    </div>
  )
}

export default SalaryReportsPage
