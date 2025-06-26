/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react'

import {
  useGetAllExpensesQuery,
  useGetAllUsersMonthlyTurnoverAndMarginQuery,
} from '@/entities/deal'
import { useGetPremiiByYearQuery } from '@/entities/salary'
import { useGetAllSalesQuery } from '@/entities/sale'
import { useMeQuery } from '@/entities/session'
import { useGetActiveQuery, useGetDepartmentsQuery } from '@/entities/workers'
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
  premia?: number
  remaining: number
  salary: number
}

type Employee = {
  id: number
  middleName: string
  name: string
  reports: Report[]
  surname: string
}

type DepartmentData = {
  department: string
  employees: Employee[]
  id: number
}

export const SalaryReportsPage: React.FC = () => {
  const { data: users } = useGetActiveQuery()
  const { data: expenses } = useGetAllExpensesQuery()
  const { data: meData } = useMeQuery()
  const { data: margins } = useGetAllUsersMonthlyTurnoverAndMarginQuery({
    endDate: '2025-12-31',
    startDate: '2025-01-01',
  })
  const { data: sales } = useGetAllSalesQuery()
  const { data: departments } = useGetDepartmentsQuery()
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const storedYear = localStorage.getItem('salaryReportsSelectedYear')

    return storedYear ? Number(storedYear) : 2025
  })
  const { data: allPremii } = useGetPremiiByYearQuery(selectedYear)

  const [data, setData] = useState<DepartmentData[]>([])

  const [selectedQuarter, setSelectedQuarter] = useState<null | number>(() => {
    const storedQuarter = localStorage.getItem('salaryReportsSelectedQuarter')

    return storedQuarter ? Number(storedQuarter) : null
  })

  const [startMonthIndex, setStartMonthIndex] = useState<number>(() => {
    const stored = localStorage.getItem('salaryReportsStartMonthIndex')

    return stored ? Number(stored) : 0
  })

  const [endMonthIndex, setEndMonthIndex] = useState<number>(() => {
    const stored = localStorage.getItem('salaryReportsEndMonthIndex')

    return stored ? Number(stored) : 2
  })

  useEffect(() => {
    if (!users || !margins || !expenses || !departments || !sales || !allPremii) {
      return
    }

    const departmentData: DepartmentData[] = departments.map(d => ({
      department: d.name,
      employees: [],
      id: d.id,
    }))

    const visibleUsers = (() => {
      if (['Бухгалтер', 'Директор'].includes(meData?.roleName ?? '')) {
        return users
      }
      if (meData?.roleName === 'РОП') {
        return users.filter((u: WorkerDto) => u.department_id === meData?.department_id)
      }

      return users.filter((u: WorkerDto) => u.id === meData?.id)
    })()

    visibleUsers.forEach(user => {
      const dept = departments.find(d => d.id === user.department_id)
      const departmentName = dept?.name || 'Без отдела'
      const departmentId = dept?.id ?? -1

      let department = departmentData.find(d => d.id === departmentId)

      if (!department) {
        department = { department: departmentName, employees: [], id: departmentId }
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

      months.forEach((month, idx) => {
        const year = selectedYear

        const salary = expenses
          .filter(
            e =>
              e.workerId === user.id &&
              e.subcategory === 'Оклад' &&
              new Date(e.date).getMonth() === idx &&
              new Date(e.date).getFullYear() === year
          )
          .reduce((s, e) => s + e.expense, 0)

        const mData = margins.find(m => m.userId === user.id)
        const percent = user.margin_percent ?? 0
        const earnings =
          (mData?.monthlyData.find((m: any) => m.month === idx + 1)?.totalMargin ?? 0) * percent

        const paid = expenses
          .filter(
            e =>
              e.userId === user.id &&
              new Date(e.date).getMonth() === idx &&
              new Date(e.date).getFullYear() === year
          )
          .reduce((s, e) => s + e.expense, 0)

        const premia =
          allPremii.find(p => p.userId === user.id && p.month === month && p.year === year)
            ?.amount ?? 0

        const remaining = salary + earnings - paid + previousRemaining

        previousRemaining = remaining

        employee.reports.push({
          earned: earnings,
          month: `${month} ${year}`,
          paid,
          premia,
          remaining,
          salary,
        })
      })

      department.employees.push(employee)
    })

    setData(departmentData)
  }, [
    users,
    margins,
    expenses,
    departments,
    sales,
    allPremii,
    selectedYear,
    meData?.roleName,
    meData?.department_id,
    meData?.id,
  ])

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number(e.target.value)

    setSelectedYear(year)
    localStorage.setItem('salaryReportsSelectedYear', String(year))
    setSelectedQuarter(null)
    localStorage.removeItem('salaryReportsSelectedQuarter')
  }

  const handleQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const quarter = Number(e.target.value)

    setSelectedQuarter(quarter)
    localStorage.setItem('salaryReportsSelectedQuarter', String(quarter))
    const newStart = (quarter - 1) * 3
    const newEnd = quarter * 3 - 1

    setStartMonthIndex(newStart)
    setEndMonthIndex(newEnd)
    localStorage.setItem('salaryReportsStartMonthIndex', String(newStart))
    localStorage.setItem('salaryReportsEndMonthIndex', String(newEnd))
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>, isStart: boolean) => {
    const value = Number(e.target.value)

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
    department: department.department,
    employees: department.employees.map(employee => ({
      ...employee,
      reports: employee.reports.filter(report => {
        const [reportMonth, reportYear] = report.month.split(' ')
        const monthIndex = months.indexOf(reportMonth)
        const yearMatch = Number(reportYear) === selectedYear
        const intervalMatch = monthIndex >= startMonthIndex && monthIndex <= endMonthIndex

        return yearMatch && intervalMatch
      }),
    })),
    id: department.id,
  }))

  const selectedMonths = months.slice(startMonthIndex, endMonthIndex + 1)

  return (
    <div className={'absolute left-[1%] top-[10%] flex flex-col items-start p-4'}>
      <div className={'flex w-full mb-4'}>
        <div className={'ml-[300px] flex flex-col mr-4'}>
          <label htmlFor={'yearSelect'}>Выберите год: </label>
          <select id={'yearSelect'} onChange={handleYearChange} value={selectedYear}>
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className={'flex flex-col mr-4'}>
          <label htmlFor={'quarterSelect'}>Выберите квартал: </label>
          <select id={'quarterSelect'} onChange={handleQuarterChange} value={selectedQuarter || ''}>
            <option value={''}>Все</option>
            {[1, 2, 3, 4].map(quarter => (
              <option key={quarter} value={quarter}>
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
