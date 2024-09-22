import React from 'react'

import { formatCurrency } from '@/pages/kopeechnik'

type Report = {
  margin: number // строго число
  month: string
  planned_margin: number // строго число
  revenue: number // строго число
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

// Преобразование в проценты, но данные остаются числами
const calculateMarginPercentage = (margin: number, revenue: number): string => {
  if (!revenue || isNaN(revenue) || isNaN(margin)) {
    return '0.00 рублей 0 копеек' // Возвращаем 0, если данных недостаточно
  }

  const percentage = (margin / revenue) * 100

  return formatCurrency(percentage.toFixed(2)) // Форматируем для отображения
}

// Функция для вычисления общей суммы за год (возвращаем число)

// Функция для вычисления суммы за месяц (числовое значение)
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

        return Number(empTotal) + (report ? Number(report[field]) : 0) // Числовые данные
      }, 0)
    )
  }, 0)

  return formatCurrency(total) // Отображение через форматирование
}

// Компонент таблицы
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
      const value = parseFloat(e.target.value) // Оставляем как число

      if (!isNaN(value)) {
        // Явно приводим тип, чтобы TypeScript понимал, что поле имеет числовой тип
        ;(report[field as keyof Report] as number) = value // Присваиваем числовое значение
        onDataChange(newData)
      }
    }
  }

  // Функция для вычисления итогов по отделу
  const calculateDepartmentTotal = (department: DepartmentData, field: keyof Report): number => {
    return department.employees.reduce((total, employee) => {
      return (
        total +
        employee.reports.reduce((reportTotal, report) => reportTotal + Number(report[field]), 0)
      )
    }, 0)
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
            {/* Итоги по отделу */}
            <tr>
              <td className={'border px-4 py-2 font-bold'}>Итого по отделу</td>
              {months.map(month => (
                <React.Fragment key={month}>
                  <td className={'border px-4 py-2 font-bold'}>
                    {formatCurrency(calculateDepartmentTotal(department, 'revenue'))}
                  </td>
                  <td className={'border px-4 py-2 font-bold'}>
                    {formatCurrency(calculateDepartmentTotal(department, 'margin'))}
                  </td>
                  <td className={'border px-4 py-2 font-bold'}>
                    {calculateMarginPercentage(
                      calculateDepartmentTotal(department, 'margin'),
                      calculateDepartmentTotal(department, 'revenue')
                    ) + '%'}
                  </td>
                </React.Fragment>
              ))}
              <td className={'border px-4 py-2 font-bold'}>
                {formatCurrency(calculateDepartmentTotal(department, 'revenue'))}
              </td>
              <td className={'border px-4 py-2 font-bold'}>
                {formatCurrency(calculateDepartmentTotal(department, 'margin'))}
              </td>
            </tr>
          </React.Fragment>
        ))}
        {/* Общая маржа по всем отделам */}
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
