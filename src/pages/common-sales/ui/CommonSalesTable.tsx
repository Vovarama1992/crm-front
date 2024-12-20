import React from 'react'

import { formatCurrency } from '@/pages/kopeechnik'

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

type CommonSalesTableProps = {
  data: DepartmentData[]
  months: string[]
}

// Функция для расчета итогов по отделу
const calculateDepartmentTotal = (
  employees: Employee[],
  field: keyof Report,
  month: string
): number => {
  return employees.reduce((empTotal, employee) => {
    const report = employee.reports.find(r => r.month === month)

    return empTotal + (report ? Number(report[field]) : 0)
  }, 0)
}

// Функция для вычисления итогов за месяц по всем отделам
const calculateMonthlyTotal = (
  data: DepartmentData[],
  field: keyof Report,
  month: string
): number => {
  return data.reduce((total, department) => {
    return total + calculateDepartmentTotal(department.employees, field, month)
  }, 0)
}

const CommonSalesTable: React.FC<CommonSalesTableProps> = ({ data, months }) => {
  return (
    <table className={'table-auto w-full border-collapse'}>
      <thead>
        <tr>
          <th className={'border px-4 py-2 bg-gray-100'}>Фамилия</th>
          {months.map(month => (
            <th className={'border px-4 py-2 bg-gray-100'} colSpan={3} key={month}>
              {month}
            </th>
          ))}
          <th className={'border px-4 py-2 bg-gray-100'}>Итоговый оборот за год</th>
          <th className={'border px-4 py-2 bg-gray-100'}>Итоговая маржа за год</th>
        </tr>
      </thead>
      <tbody>
        {data.map((department, _) => (
          <React.Fragment key={department.department}>
            <tr>
              <td
                className={'bg-gray-200 font-bold border px-4 py-2'}
                colSpan={months.length * 3 + 2}
              >
                {department.department}
              </td>
            </tr>
            <tr>
              <td className={'border px-4 py-2 bg-gray-100'}></td>
              {months.map(month => (
                <React.Fragment key={month}>
                  <th className={'border px-4 py-2 bg-gray-100'}>Оборот</th>
                  <th className={'border px-4 py-2 bg-gray-100'}>Маржа</th>
                  <th className={'border px-4 py-2 bg-gray-100'}>% от Маржи</th>
                </React.Fragment>
              ))}
            </tr>
            {department.employees.map(employee => (
              <tr key={employee.surname}>
                <td className={'border px-4 py-2'}>
                  {employee.name} {employee.surname}
                </td>
                {months.map(month => {
                  const report = employee.reports.find(r => r.month === month)

                  return (
                    <React.Fragment key={month}>
                      <td className={'border px-4 py-2'}>
                        {report ? formatCurrency(report.revenue) : '-'}
                      </td>
                      <td className={'border px-4 py-2'}>
                        {report ? formatCurrency(report.margin) : '-'}
                      </td>
                      <td className={'border px-4 py-2'}>
                        {report ? formatCurrency(report.planned_margin) : '-'}
                      </td>
                    </React.Fragment>
                  )
                })}
                <td className={'border px-4 py-2'}>
                  {formatCurrency(
                    employee.reports.reduce((total, report) => total + report.revenue, 0)
                  )}
                </td>
                <td className={'border px-4 py-2'}>
                  {formatCurrency(
                    employee.reports.reduce((total, report) => total + report.margin, 0)
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td className={'border px-4 py-2 font-bold'}>Итого по отделу</td>
              {months.map(month => (
                <React.Fragment key={month}>
                  <td className={'border px-4 py-2 font-bold'}>
                    {formatCurrency(
                      calculateDepartmentTotal(department.employees, 'revenue', month)
                    )}
                  </td>
                  <td className={'border px-4 py-2 font-bold'}>
                    {formatCurrency(
                      calculateDepartmentTotal(department.employees, 'margin', month)
                    )}
                  </td>
                  <td className={'border px-4 py-2 font-bold'}>
                    {formatCurrency(
                      calculateDepartmentTotal(department.employees, 'planned_margin', month)
                    )}
                  </td>
                </React.Fragment>
              ))}
              <td className={'border px-4 py-2 font-bold'}>
                {formatCurrency(
                  department.employees.reduce(
                    (total, employee) =>
                      total +
                      employee.reports.reduce((empTotal, report) => empTotal + report.revenue, 0),
                    0
                  )
                )}
              </td>
              <td className={'border px-4 py-2 font-bold'}>
                {formatCurrency(
                  department.employees.reduce(
                    (total, employee) =>
                      total +
                      employee.reports.reduce((empTotal, report) => empTotal + report.margin, 0),
                    0
                  )
                )}
              </td>
            </tr>
          </React.Fragment>
        ))}
        <tr>
          <td className={'border px-4 py-2 font-bold'}>Общий оборот</td>
          {months.map(month => (
            <td className={'border px-4 py-2 font-bold'} colSpan={3} key={month}>
              {formatCurrency(calculateMonthlyTotal(data, 'revenue', month))}
            </td>
          ))}
        </tr>
        <tr>
          <td className={'border px-4 py-2 font-bold'}>Общая маржа</td>
          {months.map(month => (
            <td className={'border px-4 py-2 font-bold'} colSpan={3} key={month}>
              {formatCurrency(calculateMonthlyTotal(data, 'margin', month))}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

export default CommonSalesTable
