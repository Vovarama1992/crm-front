import React from 'react'

type Report = {
  margin: number // маржа
  month: string
  planned_margin_q1: number // план по марже 1 квартал
  planned_margin_year: number // годовой план
  revenue: number // оборот
}

type Employee = {
  name: string
  reports: Report[]
}

type IncomeTableProps = {
  data: Employee[]
  months: string[]
  onDataChange: (newData: Employee[]) => void
}

const calculateMarginPercentage = (margin: number, revenue: number): string => {
  if (revenue === 0) {
    return '0.00'
  }
  const percentage = (margin / revenue) * 100

  return percentage.toFixed(2)
}

const calculatePlanPercentage = (actual: number, plan: number): string => {
  if (plan === 0) {
    return '0.00'
  }
  const percentage = (actual / plan) * 100

  return percentage.toFixed(2)
}

const IncomeTable: React.FC<IncomeTableProps> = ({ data, months, onDataChange }) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    employeeIndex: number,
    month: string,
    field: keyof Report
  ) => {
    const newData = [...data]
    const employee = newData[employeeIndex]
    const report = employee.reports.find(r => r.month === month)

    if (report) {
      const value = parseFloat(e.target.value)

      if (!isNaN(value)) {
        ;(report as any)[field] = value
        onDataChange(newData)
      }
    }
  }

  const calculateTotals = (field: keyof Report) => {
    return data.reduce((total, employee) => {
      return (
        total +
        employee.reports.reduce((monthTotal, report) => {
          return monthTotal + (report[field] as number)
        }, 0)
      )
    }, 0)
  }

  const calculateMonthlyTotals = (field: keyof Report, month: string) => {
    return data.reduce((total, employee) => {
      const report = employee.reports.find(r => r.month === month)

      return total + (report ? (report[field] as number) : 0)
    }, 0)
  }

  return (
    <table className={'table-auto w-full border-collapse'}>
      <thead>
        <tr>
          <th className={'border px-4 py-2 bg-gray-100'} rowSpan={2}>
            Фамилия
          </th>
          {months.map((month, index) => (
            <th className={'border px-4 py-2 bg-gray-200'} colSpan={3} key={index}>
              {month}
            </th>
          ))}
          <th className={'border px-4 py-2 bg-gray-100'} rowSpan={2}>
            План по марже 1 квартал
          </th>
          <th className={'border px-4 py-2 bg-gray-100'} rowSpan={2}>
            % Выполнения плана 1 квартал
          </th>
          <th className={'border px-4 py-2 bg-gray-100'} rowSpan={2}>
            Годовой план
          </th>
          <th className={'border px-4 py-2 bg-gray-100'} rowSpan={2}>
            % Выполнения плана год
          </th>
        </tr>
        <tr>
          {months.map(index => (
            <React.Fragment key={index}>
              <th className={'border px-4 py-2 bg-gray-100'}>Оборот</th>
              <th className={'border px-4 py-2 bg-gray-100'}>Маржа</th>
              <th className={'border px-4 py-2 bg-gray-100'}>% Маржа</th>
            </React.Fragment>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((employee, employeeIndex) => (
          <tr key={employee.name}>
            <td className={'border px-4 py-2'}>{employee.name}</td>
            {months.map((month, index) => {
              const report = employee.reports.find(r => r.month === month)
              const revenue = report ? report.revenue : 0
              const margin = report ? report.margin : 0

              return (
                <React.Fragment key={index}>
                  <td className={'border px-4 py-2'}>
                    <input
                      className={'w-full'}
                      onChange={e => handleInputChange(e, employeeIndex, month, 'revenue')}
                      type={'number'}
                      value={revenue}
                    />
                  </td>
                  <td className={'border px-4 py-2'}>
                    <input
                      className={'w-full'}
                      onChange={e => handleInputChange(e, employeeIndex, month, 'margin')}
                      type={'number'}
                      value={margin}
                    />
                  </td>
                  <td className={'border px-4 py-2'}>
                    {calculateMarginPercentage(margin, revenue)}%
                  </td>
                </React.Fragment>
              )
            })}
            <td className={'border px-4 py-2'}>{employee.reports[0].planned_margin_q1}</td>
            <td className={'border px-4 py-2'}>
              {calculatePlanPercentage(
                employee.reports.reduce((total, report) => total + report.margin, 0),
                employee.reports[0].planned_margin_q1
              )}
              %
            </td>
            <td className={'border px-4 py-2'}>{employee.reports[0].planned_margin_year}</td>
            <td className={'border px-4 py-2'}>
              {calculatePlanPercentage(
                employee.reports.reduce((total, report) => total + report.margin, 0),
                employee.reports[0].planned_margin_year
              )}
              %
            </td>
          </tr>
        ))}
        <tr>
          <td className={'border px-4 py-2 font-bold'}>Итого</td>
          {months.map((month, index) => (
            <React.Fragment key={index}>
              <td className={'border px-4 py-2 font-bold'}>
                {calculateMonthlyTotals('revenue', month)}
              </td>
              <td className={'border px-4 py-2 font-bold'}>
                {calculateMonthlyTotals('margin', month)}
              </td>
              <td className={'border px-4 py-2 font-bold'}>
                {calculateMarginPercentage(
                  calculateMonthlyTotals('margin', month),
                  calculateMonthlyTotals('revenue', month)
                )}
                %
              </td>
            </React.Fragment>
          ))}
          <td className={'border px-4 py-2 font-bold'}>{calculateTotals('planned_margin_q1')}</td>
          <td className={'border px-4 py-2 font-bold'}>
            {calculatePlanPercentage(
              calculateTotals('margin'),
              calculateTotals('planned_margin_q1')
            )}
            %
          </td>
          <td className={'border px-4 py-2 font-bold'}>{calculateTotals('planned_margin_year')}</td>
          <td className={'border px-4 py-2 font-bold'}>
            {calculatePlanPercentage(
              calculateTotals('margin'),
              calculateTotals('planned_margin_year')
            )}
            %
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default IncomeTable
