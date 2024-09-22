import React from 'react'

import { formatCurrency } from '@/pages/kopeechnik'

type FlatReport = {
  completionPercent: number
  marginAmount: number
  marginPercent: number
  month: string
  totalMargin: number
  totalTurnover: number
  userId: number
  year: number
  yearlyProfitPlan: number
}

type Employee = {
  name: string
  reports: FlatReport[]
}

type IncomeTableProps = {
  data: Employee[]
  months: string[]
}

const IncomeTable: React.FC<IncomeTableProps> = ({ data, months }) => {
  // Функция для вычисления суммарной маржи за выбранные месяцы
  const calculateTotalMarginForSelectedMonths = (reports: FlatReport[], months: string[]) => {
    const filteredReports = reports.filter(report => months.includes(report.month))

    return filteredReports.reduce((total, report) => total + report.totalMargin, 0)
  }

  // Функция для вычисления общего дохода за период
  const calculateOverallTotalMargin = () => {
    return data.reduce((total, employee) => {
      return total + calculateTotalMarginForSelectedMonths(employee.reports, months)
    }, 0)
  }

  return (
    <div>
      <table className={'table-auto w-full border-collapse'}>
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
          {data.map(employee => {
            // Вычисляем суммарную маржу за выбранные месяцы
            const totalMarginForSelectedMonths = calculateTotalMarginForSelectedMonths(
              employee.reports,
              months
            )

            return (
              <tr key={employee.name}>
                <td className={'border px-4 py-2'}>{employee.name}</td>
                {months.map((month, index) => {
                  const report = employee.reports.find(r => r.month === month)
                  const revenue = report ? report.totalTurnover : 0
                  const margin = report ? report.totalMargin : 0
                  const planned_margin_year = report ? report.yearlyProfitPlan : 0
                  const completion_percent = report ? report.completionPercent : 0
                  const margin_percent = report ? report.marginPercent : 0

                  return (
                    <React.Fragment key={index}>
                      <td className={'border px-4 py-2'}>{formatCurrency(revenue)}</td>
                      <td className={'border px-4 py-2'}>{formatCurrency(margin)}</td>
                      <td className={'border px-4 py-2'}>{formatCurrency(planned_margin_year)}</td>
                      <td className={'border px-4 py-2'}>{completion_percent}</td>
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
          {/* Строка общего дохода */}
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
