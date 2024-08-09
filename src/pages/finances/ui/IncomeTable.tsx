import React from 'react'

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
  return (
    <table className={'table-auto w-full border-collapse'}>
      <thead>
        <tr>
          <th className={'border px-4 py-2 bg-gray-100'} rowSpan={2}>
            Фамилия
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
        {data.map(employee => (
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
                  <td className={'border px-4 py-2'}>{revenue}</td>
                  <td className={'border px-4 py-2'}>{margin}</td>
                  <td className={'border px-4 py-2'}>{planned_margin_year}</td>
                  <td className={'border px-4 py-2'}>{completion_percent}</td>
                  <td className={'border px-4 py-2'}>{margin_percent}</td>
                </React.Fragment>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default IncomeTable
