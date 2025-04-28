import React, { useEffect, useState } from 'react'

import { useGetAllUsersMonthlyTurnoverAndMarginQuery } from '@/entities/deal'
import { useGetUsersWithMotivationsQuery } from '@/entities/workers'
import { formatCurrency } from '@/pages/kopeechnik'

type IncomeFlatReport = {
  completionPercent: number
  marginAmount: number
  marginPercent: number
  month: number
  totalMargin: number
  totalTurnover: number
  userId: number
  year: number
  yearlyProfitPlan: number
}
type Employee = {
  name: string
  reports: IncomeFlatReport[]
  surname: string
}

type IncomeTableProps = {
  months: string[]
}

const monthIndexMap: { [key: string]: number } = {
  Август: 8,
  Апрель: 4,
  Декабрь: 12,
  Июль: 7,
  Июнь: 6,
  Май: 5,
  Март: 3,
  Ноябрь: 11,
  Октябрь: 10,
  Сентябрь: 9,
  Февраль: 2,
  Январь: 1,
}

const IncomeTable: React.FC<IncomeTableProps> = ({ months }) => {
  const { data: usersData, isLoading: usersLoading } = useGetUsersWithMotivationsQuery()
  const { data: monthlyData, isLoading: monthlyLoading } =
    useGetAllUsersMonthlyTurnoverAndMarginQuery({ endDate: '2025-12-31', startDate: '2025-01-01' })

  const [employeeData, setEmployeeData] = useState<Employee[]>([])

  useEffect(() => {
    if (!usersLoading && !monthlyLoading && usersData && monthlyData) {
      const monthNumbers = months.map(month => monthIndexMap[month])

      const employees: Employee[] = usersData.map(user => {
        const userMotivations = user.motivations || []
        const maxPlan = Math.max(...userMotivations.map(m => m.threshold), 0)

        const userFromApi = monthlyData.find(m => m.userId === user.id)
        const userTotalMargin = userFromApi?.userTotalMargin || 0

        const reportsFromApi = userFromApi?.monthlyData || []

        const reports: IncomeFlatReport[] = monthNumbers.map(monthNum => {
          const found = reportsFromApi.find((r: IncomeFlatReport) => r.month === monthNum)

          const totalMargin = found?.totalMargin || 0
          const marginPercent = found?.marginPercent || 0
          const marginAmount = found?.marginAmount || 0
          const totalTurnover = found?.totalTurnover || 0
          const completionPercent = maxPlan ? (userTotalMargin / maxPlan) * 100 : 0

          return {
            completionPercent,
            marginAmount,
            marginPercent,
            month: monthNum,
            totalMargin,
            totalTurnover,
            userId: user.id,
            year: 2025,
            yearlyProfitPlan: maxPlan,
          }
        })

        return {
          completionPercent: maxPlan ? (userTotalMargin / maxPlan) * 100 : 0,
          name: user.name,
          reports,
          surname: user.surname,
        }
      })

      setEmployeeData(employees)
    }
  }, [usersLoading, monthlyLoading, usersData, monthlyData, months])

  const calculateTotalMarginForSelectedMonths = (reports: IncomeFlatReport[]) => {
    return reports.reduce((total, report) => total + report.totalMargin, 0)
  }

  const calculateOverallTotalMargin = () => {
    return employeeData.reduce((total, employee) => {
      return total + calculateTotalMarginForSelectedMonths(employee.reports)
    }, 0)
  }

  if (usersLoading || monthlyLoading) {
    return <div>Загрузка...</div>
  }

  const columnWidth = 150
  const monthColumnWidth = 700

  return (
    <div>
      <table
        className={'border'}
        style={{ width: columnWidth + months.length * monthColumnWidth + columnWidth }}
      >
        <thead>
          <tr>
            <th className={'border px-4 py-2 bg-gray-100'} style={{ width: columnWidth }}>
              Сотрудник
            </th>
            {months.map((month, index) => (
              <th
                className={'border px-6 py-3 bg-gray-200 text-right border-b-2 border-black'}
                key={index}
                style={{ width: monthColumnWidth }}
              >
                {month}
              </th>
            ))}
            <th className={'border px-4 py-2 bg-gray-100'} style={{ width: columnWidth }}>
              Доход за период
            </th>
          </tr>
          <tr>
            <th></th>
            {months.map((_, index) => (
              <th key={index}>
                <div className={'grid grid-cols-5 gap-1 text-xs text-center'}>
                  <span>Оборот</span>
                  <span>Маржа</span>
                  <span>План</span>
                  <span>% План</span>
                  <span>% от маржи</span>
                </div>
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map((employee, idx) => (
            <tr key={idx}>
              <td className={'border px-4 py-2'}>{`${employee.name} ${employee.surname}`}</td>
              {employee.reports.map((report, i) => (
                <td className={'border px-6 py-3 text-right'} key={i}>
                  <div className={'grid grid-cols-5 gap-1 text-xs text-center'}>
                    <span>{formatCurrency(report.totalTurnover)}</span>
                    <span>{formatCurrency(report.totalMargin)}</span>
                    <span>{formatCurrency(report.yearlyProfitPlan)}</span>
                    <span>{report.completionPercent.toFixed(5)}%</span>
                    <span>{formatCurrency(report.marginPercent * report.totalMargin)}</span>
                  </div>
                </td>
              ))}
              <td className={'border px-6 py-3 text-right'}>
                {calculateTotalMarginForSelectedMonths(employee.reports).toFixed(2)}
              </td>
            </tr>
          ))}
          <tr>
            <td className={'border px-4 py-2 font-bold text-right'} colSpan={months.length + 1}>
              Общий доход за период
            </td>
            <td className={'border px-4 py-2 font-bold text-right'}>
              {calculateOverallTotalMargin().toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default IncomeTable
