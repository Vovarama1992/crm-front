import React from 'react'

type Report = {
  earned: number
  month: string
  paid: number
  remaining: number
  salary: number
}

type Employee = {
  name: string
  reports: Report[]
}

type DepartmentData = {
  department: string
  employees: Employee[]
}

type MonthlyReportTableProps = {
  data: DepartmentData[]
  months: string[]
  onDataChange: (newData: DepartmentData[]) => void
}

const MonthlyReportTable: React.FC<MonthlyReportTableProps> = ({ data, months, onDataChange }) => {
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
            <th className={'border px-4 py-2 bg-gray-100'} colSpan={4} key={month}>
              {month}
            </th>
          ))}
        </tr>
        <tr>
          <th className={'border px-4 py-2 bg-gray-100'}></th>
          {months.map(month => (
            <React.Fragment key={month}>
              <th className={'border px-4 py-2 bg-gray-100'}>Оклад</th>
              <th className={'border px-4 py-2 bg-gray-100'}>Заработал</th>
              <th className={'border px-4 py-2 bg-gray-100'}>Выплатил</th>
              <th className={'border px-4 py-2 bg-gray-100'}>Осталось</th>
            </React.Fragment>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((department, departmentIndex) => (
          <React.Fragment key={department.department}>
            <tr>
              <td
                className={'bg-gray-200 font-bold border px-4 py-2'}
                colSpan={months.length * 4 + 1}
              >
                {department.department}
              </td>
            </tr>
            {department.employees.map((employee, employeeIndex) => (
              <tr key={employee.name}>
                <td className={'border px-4 py-2'}>{employee.name}</td>
                {months.map(month => {
                  const report = employee.reports.find(r => r.month === month)
                  const keyPrefix = `${departmentIndex}-${employeeIndex}-${month}`

                  return (
                    <React.Fragment key={month}>
                      {['salary', 'earned', 'paid', 'remaining'].map(field => (
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
                                {report ? report[field as keyof Report] : '-'}
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                    </React.Fragment>
                  )
                })}
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  )
}

export default MonthlyReportTable
