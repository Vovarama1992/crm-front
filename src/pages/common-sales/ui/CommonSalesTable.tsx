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
  onDataChange: (newData: DepartmentData[]) => void
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

// Функция для вычисления процента маржи
const calculateMarginPercentage = (margin: number, revenue: number): number => {
  if (!revenue || isNaN(revenue) || isNaN(margin)) {
    return 0
  }

  return (margin / revenue) * 100
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

// Функция для вычисления итогов за год по всем отделам
const calculateYearlyTotal = (data: DepartmentData[], field: keyof Report): number => {
  return data.reduce((total, department) => {
    return (
      total +
      department.employees.reduce((empTotal, employee) => {
        return (
          empTotal +
          employee.reports.reduce((repTotal, report) => {
            return repTotal + Number(report[field])
          }, 0)
        )
      }, 0)
    )
  }, 0)
}

const CommonSalesTable: React.FC<CommonSalesTableProps> = ({ data, months, onDataChange }) => {
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
        {data.map((department, departmentIndex) => (
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
                        {report
                          ? calculateMarginPercentage(report.margin, report.revenue).toFixed(2)
                          : '-'}
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
                    {calculateMarginPercentage(
                      calculateDepartmentTotal(department.employees, 'margin', month),
                      calculateDepartmentTotal(department.employees, 'revenue', month)
                    ).toFixed(2)}
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
