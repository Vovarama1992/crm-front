import React from 'react'

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

const calculateMarginPercentage = (margin: number, revenue: number): string => {
  if (revenue === 0) {
    return '0.00'
  }
  const percentage = (margin / revenue) * 100

  return percentage.toFixed(2)
}

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

const calculateMonthlyTotal = (
  data: DepartmentData[],
  field: keyof Report,
  month: string
): number => {
  return data.reduce((total, department) => {
    return (
      total +
      department.employees.reduce((empTotal, employee) => {
        const report = employee.reports.find(r => r.month === month)

        return empTotal + (report ? Number(report[field]) : 0)
      }, 0)
    )
  }, 0)
}

const CommonSalesTable: React.FC<CommonSalesTableProps> = ({ data, months, onDataChange }) => {
  const [editState, setEditState] = React.useState<{ [key: string]: boolean }>({})

  const toggleEdit = (key: string) => {
    setEditState({ ...editState, [key]: !editState[key] })
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
        ;(report as any)[field] = value
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
                colSpan={months.length * 3 + 3}
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
                  <th className={'border px-4 py-2 bg-gray-100'}>{'% от Маржи'}</th>
                </React.Fragment>
              ))}
              <th className={'border px-4 py-2 bg-gray-100'}></th>
              <th className={'border px-4 py-2 bg-gray-100'}></th>
            </tr>
            {department.employees.map((employee, employeeIndex) => (
              <tr key={employee.surname}>
                <td className={'border px-4 py-2'}>{employee.name + ' ' + employee.surname}</td>
                {months.map(month => {
                  const report = employee.reports.find(r => r.month === month)
                  const keyPrefix = `${departmentIndex}-${employeeIndex}-${month}`

                  return (
                    <React.Fragment key={month}>
                      {[
                        'revenue',
                        'margin',
                        departmentIndex === 0 ? 'planned_margin' : 'margin_percentage',
                      ].map(field => (
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
                                {(() => {
                                  if (!report) {
                                    return <span>-</span>
                                  }
                                  if (field === 'margin_percentage') {
                                    return (
                                      <span>
                                        {calculateMarginPercentage(report.margin, report.revenue) +
                                          '%'}
                                      </span>
                                    )
                                  }

                                  return <span>{report[field as keyof Report]}</span>
                                })()}
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                    </React.Fragment>
                  )
                })}
                <td className={'border px-4 py-2'}>
                  {employee.reports.reduce((total, report) => total + report.revenue, 0)}
                </td>
                <td className={'border px-4 py-2'}>
                  {employee.reports.reduce((total, report) => total + report.margin, 0)}
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
                    {departmentIndex === 0
                      ? calculateMonthlyTotal(data, 'planned_margin', month)
                      : calculateMarginPercentage(
                          calculateMonthlyTotal(data, 'margin', month),
                          calculateMonthlyTotal(data, 'revenue', month)
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
        <tr>
          {/*<td className={'border px-4 py-2 font-bold'}>Общий остаток маржи</td>
          {months.map(month => {
            const totalMargin = calculateMonthlyTotal(data, 'margin', month)
            const totalRevenue = calculateMonthlyTotal(data, 'revenue', month)

            return (
              <td className={'border px-4 py-2 font-bold'} colSpan={3} key={month}>
                {calculateMarginPercentage(totalMargin, totalRevenue) + '%'}
              </td>
            )
          })}
        </tr>
        <tr>
          <td className={'border px-4 py-2 font-bold'}>Маржа минус процент менеджеров</td>
          {months.map(month => {
            const totalMargin = calculateMonthlyTotal(data, 'margin', month)

            return (
              <td className={'border px-4 py-2 font-bold'} colSpan={3} key={month}>
                {(totalMargin * 0.9).toFixed(2)}
              </td>
            )
          })}*/}
        </tr>
      </tbody>
    </table>
  )
}

export default CommonSalesTable
