import React from 'react'

import { formatCurrency } from '@/pages/kopeechnik'

type Report = {
  margin: number
  month: string
  planned_margin: number
  revenue: number
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

// Функция для вычисления процентной маржи
const calculateMarginPercentage = (margin: number, revenue: number): string => {
  if (!revenue || isNaN(revenue) || isNaN(margin)) {
    return '0.00' // Возвращаем "0.00%", если данные недействительны
  }
  const percentage = (margin / revenue) * 100

  return percentage.toFixed(2) // Возвращаем процент без форматирования
}

// Функция для вычисления суммы за год (возвращает число)
const calculateYearlyTotalValue = (data: DepartmentData[], field: keyof Report): number => {
  return data.reduce((total, department) => {
    return (
      total +
      department.employees.reduce((empTotal, employee) => {
        return (
          empTotal +
          employee.reports.reduce((repTotal, report) => {
            const value = report[field]

            return repTotal + (isNaN(Number(value)) ? 0 : Number(value))
          }, 0)
        )
      }, 0)
    )
  }, 0)
}

// Функция для форматирования суммы за год
const calculateYearlyTotal = (data: DepartmentData[], field: keyof Report): string => {
  return formatCurrency(calculateYearlyTotalValue(data, field))
}

// Функция для вычисления суммы за месяц (возвращает число)
const calculateMonthlyTotalValue = (
  data: DepartmentData[],
  field: keyof Report,
  month: string
): number => {
  return data.reduce((total, department) => {
    return (
      total +
      department.employees.reduce((empTotal, employee) => {
        const report = employee.reports.find(r => r.month === month)
        const value = report ? report[field] : 0

        return empTotal + (isNaN(Number(value)) ? 0 : Number(value))
      }, 0)
    )
  }, 0)
}

// Функция для форматирования суммы за месяц
const calculateMonthlyTotal = (
  data: DepartmentData[],
  field: keyof Report,
  month: string
): string => {
  return formatCurrency(calculateMonthlyTotalValue(data, field, month))
}

const CommonSalesTable: React.FC<CommonSalesTableProps> = ({ data, months, onDataChange }) => {
  const [editState, setEditState] = React.useState<{ [key: string]: boolean }>({})

  const toggleEdit = (key: string) => {
    setEditState(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    departmentIndex: number,
    employeeIndex: number,
    month: string,
    field: keyof Report
  ) => {
    const newData = [...data]
    const employee = newData[departmentIndex].employees[employeeIndex]
    const report = employee.reports.find(r => r.month === month)

    if (report) {
      const value = parseFloat(e.target.value)

      if (!isNaN(value)) {
        // Явно приводим тип, чтобы TypeScript понял, что поле является числом
        ;(report[field] as number) = value
        onDataChange(newData)
      }
    }
  }

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
            {department.employees.map((employee, employeeIndex) => (
              <tr key={employee.surname}>
                <td className={'border px-4 py-2'}>
                  {employee.name} {employee.surname}
                </td>
                {months.map(month => {
                  const report = employee.reports.find(r => r.month === month)
                  const keyPrefix = `${departmentIndex}-${employeeIndex}-${month}`

                  return (
                    <React.Fragment key={month}>
                      {['revenue', 'margin'].map(field => (
                        <td className={'border px-4 py-2'} key={`${keyPrefix}-${field}`}>
                          <div className={'w-full h-full'} style={{ minWidth: '100px' }}>
                            {editState[`${keyPrefix}-${field}`] ? (
                              <input
                                className={'w-full px-1 py-1 border-none'}
                                onBlur={() => toggleEdit(`${keyPrefix}-${field}`)}
                                onChange={e =>
                                  handleInputChange(
                                    e,
                                    departmentIndex,
                                    employeeIndex,
                                    month,
                                    field as keyof Report
                                  )
                                }
                                style={{ width: '100%' }}
                                type={'number'}
                                value={report ? report[field as keyof Report] : ''}
                              />
                            ) : (
                              <span
                                className={'block w-full h-full px-2 py-1 text-sm cursor-pointer'}
                                onClick={() => toggleEdit(`${keyPrefix}-${field}`)}
                                style={{ display: 'block', width: '100%' }}
                              >
                                {report
                                  ? formatCurrency(report[field as keyof Report] as number)
                                  : '-'}
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                      <td className={'border px-4 py-2'}>
                        {report
                          ? calculateMarginPercentage(report.margin, report.revenue) + '%'
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
              <td className={'border px-4 py-2 font-bold'}>Итого</td>
              {months.map(month => (
                <React.Fragment key={month}>
                  <td className={'border px-4 py-2 font-bold'}>
                    {calculateMonthlyTotal(data, 'revenue', month)}
                  </td>
                  <td className={'border px-4 py-2 font-bold'}>
                    {calculateMonthlyTotal(data, 'margin', month)}
                  </td>
                  <td className={'border px-4 py-2 font-bold'}>
                    {calculateMarginPercentage(
                      calculateMonthlyTotalValue(data, 'margin', month),
                      calculateMonthlyTotalValue(data, 'revenue', month)
                    ) + '%'}
                  </td>
                </React.Fragment>
              ))}
              <td className={'border px-4 py-2 font-bold'}>
                {calculateYearlyTotal(data, 'revenue')}
              </td>
              <td className={'border px-4 py-2 font-bold'}>
                {calculateYearlyTotal(data, 'margin')}
              </td>
            </tr>
          </React.Fragment>
        ))}
        <tr>
          <td className={'border px-4 py-2 font-bold'}>Общая маржа</td>
          {months.map(month => (
            <td className={'border px-4 py-2 font-bold'} colSpan={3} key={month}>
              {calculateMonthlyTotal(data, 'margin', month)}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

export default CommonSalesTable
