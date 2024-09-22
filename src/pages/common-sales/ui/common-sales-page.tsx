/* eslint-disable max-lines */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'

import { useGetAllUsersMonthlyTurnoverAndMarginQuery } from '@/entities/deal'
import { WorkerDto } from '@/entities/workers'
import { useGetDepartmentsQuery, useGetWorkersQuery } from '@/entities/workers'

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

type Report = {
  margin: number // маржа
  month: string
  planned_margin: number // план маржа
  revenue: number // оборот
}

type Employee = {
  name: string
  reports: Report[]
  surname: string
}

type DepartmentData = {
  department: string
  employees: Employee[]
}

type MonthlyData = {
  month: string
  totalMargin: number
  totalTurnover: number
  year: number
}

type ReportData = {
  marginPercent: number
  monthlyData: MonthlyData[]
  userId: number
  yearlyProfitPlan: number
}

export const CommonSalesPage: React.FC = () => {
  const [startMonthIndex, setStartMonthIndex] = useState(0)
  const [endMonthIndex, setEndMonthIndex] = useState(months.length - 1)
  const [selectedYear, setSelectedYear] = useState(2024)
  const [selectedQuarter, setSelectedQuarter] = useState<'' | string>('')

  const getStartDate = (year: number, monthIndex: number): string => {
    const startDate = new Date(Number(year), monthIndex, 1)

    return startDate.toISOString().split('T')[0]
  }

  const getEndDate = (year: number, monthIndex: number): string => {
    const endDate = new Date(Number(year), monthIndex + 1, 0)

    return endDate.toISOString().split('T')[0]
  }

  const startDateString = getStartDate(selectedYear, startMonthIndex)
  const endDateString = getEndDate(selectedYear, endMonthIndex)

  const { data: departments } = useGetDepartmentsQuery()

  const { data: workers } = useGetWorkersQuery()

  const { data: reportsData } = useGetAllUsersMonthlyTurnoverAndMarginQuery({
    endDate: endDateString,
    startDate: startDateString,
  })

  console.log('reports: ' + JSON.stringify(reportsData))

  const completed: DepartmentData[] =
    departments?.map(dep => {
      const employees: Employee[] =
        workers
          ?.filter((worker: WorkerDto) => worker.department_id === dep.id)
          .map((worker: WorkerDto) => {
            const reports: Report[] =
              reportsData
                ?.filter((report: ReportData) => report.userId === worker.id)
                .flatMap((report: ReportData) =>
                  report.monthlyData.map(monthlyReport => ({
                    margin: monthlyReport.totalMargin,
                    month: months[parseInt(monthlyReport.month) - 1], // Преобразование месяца в строку
                    planned_margin: worker.margin_percent
                      ? worker.margin_percent * monthlyReport.totalMargin
                      : 0,
                    revenue: monthlyReport.totalTurnover,
                  }))
                ) || []

            return {
              name: worker.name,
              reports: reports,
              surname: worker.surname,
            }
          }) || []

      return {
        department: dep.name,
        employees: employees,
      }
    }) || []

  // Добавляем департамент для сотрудников без мотивации на продажи
  const employeesWithoutDepartment: Employee[] =
    workers
      ?.filter((worker: WorkerDto) => worker.department_id === null)
      .map((worker: WorkerDto) => {
        const reports: Report[] =
          reportsData
            ?.filter((report: ReportData) => report.userId === worker.id)
            .flatMap((report: ReportData) =>
              report.monthlyData.map((monthlyReport: any) => ({
                margin: monthlyReport.totalMargin,
                month: months[parseInt(monthlyReport.month) - 1],
                planned_margin: worker.margin_percent
                  ? worker.margin_percent * monthlyReport.totalMargin
                  : 0,
                revenue: monthlyReport.totalTurnover,
              }))
            ) || []

        return {
          name: worker.name,
          reports: reports,
          surname: worker.surname,
        }
      }) || []

  if (employeesWithoutDepartment.length > 0) {
    completed.push({
      department: 'Сотрудники без мотивации на продажи',
      employees: employeesWithoutDepartment,
    })
  }
  console.log('completed: ' + JSON.stringify(completed))

  const [selectedDepartment, setSelectedDepartment] = useState<string>('Все')
  const [data, _] = useState(completed)

  //const handleDataChange = (newData: DepartmentData[]) => {
  // setData(newData)
  //}

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value))
  }

  const handleQuarterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const quarter = event.target.value

    setSelectedQuarter(quarter)

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
  }

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(event.target.value)
  }

  const selectedMonths = months.slice(startMonthIndex, endMonthIndex + 1)
  const filteredData =
    selectedDepartment === 'Все'
      ? completed
      : completed.filter(dept => dept.department === selectedDepartment)

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
        //onDataChange={handleDataChange}
      />
    </div>
  )
}
