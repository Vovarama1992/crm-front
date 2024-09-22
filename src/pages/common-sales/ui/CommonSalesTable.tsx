import React from 'react'

import { formatCurrency } from '@/pages/kopeechnik'

type Report = {
  margin: number | string // маржа
  month: string
  planned_margin: number | string // план маржа
  revenue: number | string // оборот
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

// Преобразуем строковые значения в числа для вычислений
const parseCurrency = (value: number | string): number => {
  if (typeof value === 'string') {
    // Извлекаем рубли из строки в формате "X рублей Y копеек"
    const [rubles] = value.split(' рублей').map(part => part.trim())

    return parseFloat(rubles) || 0
  }

  return value
}

// Функция для расчета процента маржи
const calculateMarginPercentage = (margin: number | string, revenue: number | string): string => {
  const parsedMargin = parseCurrency(margin)
  const parsedRevenue = parseCurrency(revenue)

  if (!parsedRevenue || parsedMargin === 0) {
    return '0.00 рублей 0 копеек' // Возвращаем 0, если данных недостаточно
  }

  const percentage = (parsedMargin / parsedRevenue) * 100

  return formatCurrency(percentage.toFixed(2))
}

// Функция для вычисления суммы за год с преобразованием результата через `formatCurrency`
const calculateYearlyTotal = (data: DepartmentData[], field: keyof Report): string => {
  const total = data.reduce((total, department) => {
    return (
      total +
      department.employees.reduce((empTotal, employee) => {
        return (
          empTotal +
          employee.reports.reduce((repTotal, report) => {
            return repTotal + parseCurrency(report[field])
          }, 0)
        )
      }, 0)
    )
  }, 0)

  return formatCurrency(total)
}

// Функция для вычисления суммы за месяц с преобразованием через `formatCurrency`
const calculateMonthlyTotal = (
  data: DepartmentData[],
  field: keyof Report,
  month: string
): string => {
  const total = data.reduce((total, department) => {
    return (
      total +
      department.employees.reduce((empTotal, employee) => {
        const report = employee.reports.find(r => r.month === month)

        return empTotal + (report ? parseCurrency(report[field]) : 0)
      }, 0)
    )
  }, 0)

  return formatCurrency(total)
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
      const value = e.target.value

      // Преобразуем значение в формат для дальнейших расчетов
      ;(report as any)[field] = formatCurrency(value)
      onDataChange(newData)
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
                                type={'text'}
                                value={report ? formatCurrency(report[field as keyof Report]) : ''}
                              />
                            ) : (
                              <span
                                className={'block w-full h-full px-2 py-1 text-sm cursor-pointer'}
                                onClick={() => toggleEdit(`${keyPrefix}-${field}`)}
                                style={{ display: 'block', width: '100%' }}
                              >
                                {report ? formatCurrency(report[field as keyof Report]) : '-'}
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
                    employee.reports.reduce(
                      (total, report) => total + parseCurrency(report.revenue),
                      0
                    )
                  )}
                </td>
                <td className={'border px-4 py-2'}>
                  {formatCurrency(
                    employee.reports.reduce(
                      (total, report) => total + parseCurrency(report.margin),
                      0
                    )
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
                      parseCurrency(calculateMonthlyTotal(data, 'margin', month)),
                      parseCurrency(calculateMonthlyTotal(data, 'revenue', month))
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
