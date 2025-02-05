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

  const startDate = '2025-01-01'
  const endDate = '2025-12-31'

  const { data: monthlyData, isLoading: monthlyLoading } =
    useGetAllUsersMonthlyTurnoverAndMarginQuery({
      endDate,
      startDate,
    })

  const [employeeData, setEmployeeData] = useState<Employee[]>([])

  useEffect(() => {
    if (!usersLoading && !monthlyLoading && usersData && monthlyData) {
      const monthNumbers = months.map(month => monthIndexMap[month])

      const employees: Employee[] = usersData.map(user => {
        const userMotivations = usersData.find(u => u.id === user.id)?.motivations || []

        const reports = monthlyData
          .filter(monthReport => monthReport.userId === user.id)
          .flatMap(monthReport => monthReport.monthlyData)
          .filter(monthReport => monthNumbers.includes(monthReport.month))

        const formattedReports = reports.map(monthReport => {
          const yearlyProfitPlan = Math.min(
            ...userMotivations
              .filter(motivation => motivation.threshold > user.totalMargin)
              .map(motivation => motivation.threshold)
          )

          return {
            completionPercent: (monthReport.totalMargin / yearlyProfitPlan) * 100,
            marginAmount: monthReport.marginAmount,
            marginPercent: monthReport.marginPercent,
            month: monthReport.month,
            totalMargin: monthReport.totalMargin,
            totalTurnover: monthReport.totalTurnover,
            userId: monthReport.userId,
            year: monthReport.year,
            yearlyProfitPlan: yearlyProfitPlan,
          }
        })

        return {
          name: user.name,
          reports: formattedReports,
        }
      })

      setEmployeeData(employees)
    }
  }, [usersLoading, monthlyLoading, usersData, monthlyData, months])

  const calculateTotalMarginForSelectedMonths = (reports: IncomeFlatReport[], months: string[]) => {
    const monthNumbers = months.map(month => monthIndexMap[month] || 0)
    const filteredReports = reports.filter(report => monthNumbers.includes(report.month))

    return filteredReports.reduce((total, report) => total + report.totalMargin, 0)
  }

  const calculateOverallTotalMargin = () => {
    return employeeData.reduce((total, employee) => {
      return total + calculateTotalMarginForSelectedMonths(employee.reports, months)
    }, 0)
  }

  if (usersLoading || monthlyLoading) {
    return <div>Загрузка...</div>
  }

  const width = months.length * 300

  return (
    <div className={`w-[${width}px]`}>
      <table>
        <thead>
          <tr>
            <th className={'border px-4 py-2 bg-gray-100'} rowSpan={2}>
              Сотрудник
            </th>
            {months.map((month, index) => (
              <th
                className={'border px-4 py-2 bg-gray-200 border-b-2 border-black'}
                colSpan={5}
                key={index}
              >
                {month}
              </th>
            ))}
            <th className={'border px-4 py-2 bg-gray-100'} rowSpan={2}>
              Доход за период
            </th>
          </tr>
          <tr>
            {months.map((_, index) => (
              <React.Fragment key={index}>
                <th className={'border px-4 py-2 bg-gray-100'}>Оборот</th>
                <th className={'border px-4 py-2 bg-gray-100'}>Маржа</th>
                <th className={'border px-4 py-2 bg-gray-100'}>Годовой план</th>
                <th className={'border px-4 py-2 bg-gray-100'}>% Выполнения плана год</th>
                <th className={'border px-4 py-2 bg-gray-100'}>% от Маржи</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {employeeData.map(employee => {
            const totalMarginForSelectedMonths = calculateTotalMarginForSelectedMonths(
              employee.reports,
              months
            )

            return (
              <tr key={employee.name}>
                <td className={'border px-4 py-2'}>{employee.name}</td>
                {months.map((month, index) => {
                  const report = employee.reports.find(r => r.month === monthIndexMap[month])

                  const revenue = report ? report.totalTurnover : 0
                  const margin = report ? report.totalMargin : 0
                  const yearlyProfitPlan = report ? report.yearlyProfitPlan : 0
                  const completion_percent = report ? report.completionPercent : 0
                  const margin_percent = report ? report.marginPercent : 0

                  return (
                    <React.Fragment key={index}>
                      <td className={'border px-4 py-2'}>{formatCurrency(revenue)}</td>
                      <td className={'border px-4 py-2'}>{formatCurrency(margin)}</td>
                      <td className={'border px-4 py-2'}>{formatCurrency(yearlyProfitPlan)}</td>
                      <td className={'border px-4 py-2'}>{completion_percent.toFixed(2)}%</td>
                      <td className={'border px-4 py-2'}>
                        {formatCurrency(margin_percent * margin)}
                      </td>
                    </React.Fragment>
                  )
                })}
                <td className={'border px-4 py-2'}>{totalMarginForSelectedMonths.toFixed(2)}</td>
              </tr>
            )
          })}
          <tr>
            <td className={'border px-4 py-2 font-bold text-right'} colSpan={months.length * 5 + 1}>
              Общий доход за период
            </td>
            <td className={'border px-4 py-2 font-bold'}>
              {calculateOverallTotalMargin().toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default IncomeTable
