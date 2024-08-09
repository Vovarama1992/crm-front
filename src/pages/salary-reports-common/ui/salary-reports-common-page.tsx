/* eslint-disable max-lines */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useMemo, useState } from 'react'

import { useCreateSalaryMutation, useGetUserSalariesQuery } from '@/entities/salary'
import { useMeQuery } from '@/entities/session'

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
  name: string
  reports: Report[]
}

type DepartmentData = {
  department: string
  employees: Employee[]
}

export const SalaryReportsPage: React.FC = () => {
  const { data: userdata } = useMeQuery()
  const { data: salaries } = useGetUserSalariesQuery(userdata?.id || 0)
  const [createSalary] = useCreateSalaryMutation()
  const [data, setData] = useState<DepartmentData[]>([])
  const [startMonthIndex, setStartMonthIndex] = useState(0)
  const [endMonthIndex, setEndMonthIndex] = useState(2)
  const [selectedYear, setSelectedYear] = useState<null | number>(null)
  const [selectedQuarter, setSelectedQuarter] = useState<null | number>(null)
  const [newSalary, setNewSalary] = useState({
    earned: 0,
    month: 1,
    paid: 0,
    salary: 0,
    userId: 0,
    year: new Date().getFullYear(),
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateSalary = async () => {
    try {
      await createSalary(newSalary).unwrap()
      alert('Salary created successfully!')
      setIsModalOpen(false) // Close the modal on success
    } catch (error) {
      console.error('Failed to create salary:', error)
    }
  }

  useEffect(() => {
    if (!salaries) {
      return
    }

    const departmentData: DepartmentData[] = []

    salaries.forEach(salary => {
      const departmentName = salary.user.department.name
      const employeeName = salary.user.name

      let department = departmentData.find(d => d.department === departmentName)

      if (!department) {
        department = { department: departmentName, employees: [] }
        departmentData.push(department)
      }

      let employee = department.employees.find(e => e.name === employeeName)

      if (!employee) {
        employee = { name: employeeName, reports: [] }
        department.employees.push(employee)
      }

      employee.reports.push({
        earned: salary.earned,
        month: `${months[salary.month - 1]} ${salary.year}`,
        paid: salary.paid,
        remaining: salary.earned - salary.paid,
        salary: salary.salary,
      })
    })

    setData(departmentData)
  }, [salaries])

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
        <MonthlySalaryTable data={filteredData} months={selectedMonths} />
      </div>
      {userdata?.roleName === 'Директор' && (
        <div className={'w-full mt-4'}>
          <button
            className={'ml-[150px] bg-blue-500 text-white px-4 py-2 rounded'}
            onClick={() => setIsModalOpen(true)}
          >
            Создать зарплату
          </button>
        </div>
      )}
      {isModalOpen && (
        <div className={'fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'}>
          <div className={'bg-white p-6 rounded shadow-lg'}>
            <h2 className={'text-lg font-bold mb-4'}>Создать новую зарплату</h2>
            <form
              onSubmit={e => {
                e.preventDefault()
                handleCreateSalary()
              }}
            >
              <div className={'flex mb-2'}>
                <label className={'mr-2'} htmlFor={'userId'}>
                  ID пользователя:
                </label>
                <input
                  id={'userId'}
                  onChange={e => setNewSalary({ ...newSalary, userId: Number(e.target.value) })}
                  required
                  type={'number'}
                  value={newSalary.userId}
                />
              </div>
              <div className={'flex mb-2'}>
                <label className={'mr-2'} htmlFor={'month'}>
                  Месяц:
                </label>
                <select
                  id={'month'}
                  onChange={e => setNewSalary({ ...newSalary, month: Number(e.target.value) })}
                  required
                  value={newSalary.month}
                >
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className={'flex mb-2'}>
                <label className={'mr-2'} htmlFor={'year'}>
                  Год:
                </label>
                <select
                  id={'year'}
                  onChange={e => setNewSalary({ ...newSalary, year: Number(e.target.value) })}
                  required
                  value={newSalary.year}
                >
                  {years.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className={'flex mb-2'}>
                <label className={'mr-2'} htmlFor={'salary'}>
                  Зарплата:
                </label>
                <input
                  id={'salary'}
                  onChange={e => setNewSalary({ ...newSalary, salary: Number(e.target.value) })}
                  required
                  type={'number'}
                  value={newSalary.salary}
                />
              </div>
              <div className={'flex mb-2'}>
                <label className={'mr-2'} htmlFor={'earned'}>
                  Заработано:
                </label>
                <input
                  id={'earned'}
                  onChange={e => setNewSalary({ ...newSalary, earned: Number(e.target.value) })}
                  required
                  type={'number'}
                  value={newSalary.earned}
                />
              </div>
              <div className={'flex mb-2'}>
                <label className={'mr-2'} htmlFor={'paid'}>
                  Выплачено:
                </label>
                <input
                  id={'paid'}
                  onChange={e => setNewSalary({ ...newSalary, paid: Number(e.target.value) })}
                  required
                  type={'number'}
                  value={newSalary.paid}
                />
              </div>
              <div className={'flex justify-end'}>
                <button
                  className={'bg-gray-500 text-white px-4 py-2 rounded mr-2'}
                  onClick={() => setIsModalOpen(false)}
                  type={'button'}
                >
                  Отмена
                </button>
                <button className={'bg-blue-500 text-white px-4 py-2 rounded'} type={'submit'}>
                  Создать зарплату
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalaryReportsPage
