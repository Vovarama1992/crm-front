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

type MonthlySalaryTableProps = {
  data: DepartmentData[]
  months: string[]
}

const MonthlySalaryTable: React.FC<MonthlySalaryTableProps> = ({ data, months }) => {
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
        {data.map(department => (
          <React.Fragment key={department.department}>
            <tr>
              <td
                className={'bg-gray-200 font-bold border px-4 py-2'}
                colSpan={months.length * 4 + 1}
              >
                {department.department}
              </td>
            </tr>
            {department.employees.map(employee => (
              <tr key={employee.name}>
                <td className={'border px-4 py-2'}>{employee.name}</td>
                {months.map(month => {
                  const report = employee.reports.find(r => r.month === month)

                  return (
                    <React.Fragment key={month}>
                      {['salary', 'earned', 'paid', 'remaining'].map(field => (
                        <td
                          className={'border px-4 py-2'}
                          key={`${employee.name}-${month}-${field}`}
                        >
                          <div className={'w-full h-full'} style={{ minWidth: '100px' }}>
                            <span className={'block w-full h-full px-2 py-1 text-sm'}>
                              {report ? report[field as keyof Report] : '-'}
                            </span>
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

export default MonthlySalaryTable
