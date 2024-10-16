/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react'

import {
  useGetAllPaymentsQuery,
  useGetAllSalesQuery,
  useGetAllUsersMonthlyTurnoverAndMarginQuery,
} from '@/entities/deal'
import { useMeQuery } from '@/entities/session'
import { useGetActiveQuery } from '@/entities/workers'
import { useGetDepartmentsQuery } from '@/entities/workers'
import { WorkerDto } from '@/entities/workers'

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
  const { data: meData } = useMeQuery()
  const { data: margins } = useGetAllUsersMonthlyTurnoverAndMarginQuery({
    endDate: '2024-12-31',
    startDate: '2024-01-01',
  })
  const { data: sales } = useGetAllSalesQuery()
  const { data: departments } = useGetDepartmentsQuery()

  const [data, setData] = useState<DepartmentData[]>([])

  // Инициализация фильтров из localStorage
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const storedYear = localStorage.getItem('salaryReportsSelectedYear')

    return storedYear ? Number(storedYear) : 2024
  })
  const [selectedQuarter, setSelectedQuarter] = useState<null | number>(() => {
    const storedQuarter = localStorage.getItem('salaryReportsSelectedQuarter')

    return storedQuarter ? Number(storedQuarter) : null
  })
  const [startMonthIndex, setStartMonthIndex] = useState<number>(() => {
    const storedStartMonthIndex = localStorage.getItem('salaryReportsStartMonthIndex')

    return storedStartMonthIndex ? Number(storedStartMonthIndex) : 0
  })
  const [endMonthIndex, setEndMonthIndex] = useState<number>(() => {
    const storedEndMonthIndex = localStorage.getItem('salaryReportsEndMonthIndex')

    return storedEndMonthIndex ? Number(storedEndMonthIndex) : 2
  })

  useEffect(() => {
    if (!users || !margins || !expenses || !departments || !sales) {
      return
    }

    const departmentData: DepartmentData[] = departments.map(dept => ({
      department: dept.name,
      employees: [],
    }))

    const filtered =
      meData?.roleName == 'Директор' || meData?.roleName == 'Бухгалтер'
        ? users
        : users.filter((user: WorkerDto) => user.department_id === meData?.department_id)

    filtered.forEach(user => {
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
        const margin = user?.margin_percent || 0.1
        const earnings =
          marginData?.monthlyData.find((m: any) => m.month === index + 1)?.totalMargin * margin || 0

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
    const year = Number(event.target.value)

    setSelectedYear(year)
    localStorage.setItem('salaryReportsSelectedYear', String(year))
    setSelectedQuarter(null)
    localStorage.removeItem('salaryReportsSelectedQuarter')
  }

  const handleQuarterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const quarter = Number(event.target.value)

    setSelectedQuarter(quarter)
    localStorage.setItem('salaryReportsSelectedQuarter', String(quarter))

    const newStartMonthIndex = (quarter - 1) * 3
    const newEndMonthIndex = quarter * 3 - 1

    setStartMonthIndex(newStartMonthIndex)
    setEndMonthIndex(newEndMonthIndex)

    localStorage.setItem('salaryReportsStartMonthIndex', String(newStartMonthIndex))
    localStorage.setItem('salaryReportsEndMonthIndex', String(newEndMonthIndex))
  }

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>, isStart: boolean) => {
    const value = Number(event.target.value)

    if (isStart) {
      setStartMonthIndex(value)
      localStorage.setItem('salaryReportsStartMonthIndex', String(value))
      if (value > endMonthIndex) {
        setEndMonthIndex(value)
        localStorage.setItem('salaryReportsEndMonthIndex', String(value))
      }
    } else {
      setEndMonthIndex(value)
      localStorage.setItem('salaryReportsEndMonthIndex', String(value))
      if (value < startMonthIndex) {
        setStartMonthIndex(value)
        localStorage.setItem('salaryReportsStartMonthIndex', String(value))
      }
    }
    setSelectedQuarter(null)
    localStorage.removeItem('salaryReportsSelectedQuarter')
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
