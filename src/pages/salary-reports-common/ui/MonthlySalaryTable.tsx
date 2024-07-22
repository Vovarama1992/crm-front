import React from 'react'

import { useMeQuery } from '@/entities/session'

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
  tablename: string
}

const MonthlyReportTable: React.FC<MonthlyReportTableProps> = ({ data, months, onDataChange }) => {
  const [editState, setEditState] = React.useState<{ [key: string]: boolean }>({})

  const { data: userdata } = useMeQuery()

  const toggleEdit = (
    fieldKey: string,
    departmentIndex: number,
    employeeIndex: number,
    month: string
  ) => {
    setEditState(prevState => {
      const newState = { ...prevState, [fieldKey]: !prevState[fieldKey] }

      // Если переключаемся из режима редактирования в не-редактируемый
      if (prevState[fieldKey] && !newState[fieldKey]) {
        const employee = data[departmentIndex].employees[employeeIndex]
        const report = employee.reports.find(r => r.month === month)

        if (report) {
          const oldValue = report[fieldKey as keyof Report]
          const newValue = report[fieldKey as keyof Report] // Это значение уже обновлено через handleInputChange

          // Создаем уведомление
          const newNotification = {
            content: `${userdata?.name || 'Неизвестный'} ${userdata?.surname || 'пользователь'} изменил(а) отчет сотрудника "${employee.name || 'Неизвестный сотрудник'}" за месяц "${month}". Поле "${fieldKey}" изменено с "${oldValue}" на "${newValue}".`,
            title: `Изменение в отчете ${month}`,
          }

          // Обновляем уведомления в localStorage
          const currentNotifications = JSON.parse(
            localStorage.getItem('notifications') || '[]'
          ) as Notification[]
          const updatedNotifications = [...currentNotifications, newNotification]

          localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
        }
      }

      return newState
    })
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
        onDataChange(newData) // Обновляем данные в состоянии
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
                                onBlur={() =>
                                  toggleEdit(
                                    `${keyPrefix}-${field}`,
                                    departmentIndex,
                                    employeeIndex,
                                    month
                                  )
                                }
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
                                onClick={() =>
                                  toggleEdit(
                                    `${keyPrefix}-${field}`,
                                    departmentIndex,
                                    employeeIndex,
                                    month
                                  )
                                }
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
