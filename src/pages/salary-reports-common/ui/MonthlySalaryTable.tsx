/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'

import CreatePaymentForm from './CreatePaymentForm' // Импорт формы создания выплаты
import PaymentsListForm from './PaymentsListForm' // Импорт формы списка всех выплат

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
  const [showCreatePaymentForm, setShowCreatePaymentForm] = useState(false)
  const [showPaymentsListForm, setShowPaymentsListForm] = useState(false) // Новый стейт для списка всех выплат

  const handleCreatePaymentClick = () => {
    setShowCreatePaymentForm(true)
  }

  const handleShowPaymentsListClick = () => {
    setShowPaymentsListForm(true)
  }

  return (
    <div>
      <table className={'table-auto w-full border-collapse'}>
        <thead>
          <tr>
            <th className={'border px-4 py-2 bg-gray-100'}>Фамилия</th>
            {months.map(month => (
              <th className={'border px-4 py-2 bg-gray-100'} colSpan={4} key={month}>
                {month} 2024
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
                    const report = employee.reports.find(r => r.month === `${month} 2024`)

                    return (
                      <React.Fragment key={month}>
                        {['salary', 'earned', 'paid', 'remaining'].map(field => (
                          <td
                            className={'border px-4 py-2'}
                            key={`${employee.name}-${month}-${field}`}
                          >
                            <div className={'w-full h-full'} style={{ minWidth: '100px' }}>
                              <span className={'block w-full h-full px-2 py-1 text-sm'}>
                                {report
                                  ? typeof report[field as keyof Report] === 'number'
                                    ? Math.round(report[field as keyof Report] as number)
                                    : report[field as keyof Report]
                                  : '-'}
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
      <div className={'mt-4 flex justify-end'}>
        <button
          className={'bg-blue-500 text-white px-4 py-2 rounded mr-2'}
          onClick={handleCreatePaymentClick}
        >
          Создать выплату
        </button>
        <button
          className={'bg-green-500 text-white px-4 py-2 rounded'}
          onClick={handleShowPaymentsListClick}
        >
          Показать все выплаты
        </button>
      </div>
      {showCreatePaymentForm && (
        <CreatePaymentForm onClose={() => setShowCreatePaymentForm(false)} />
      )}
      {showPaymentsListForm && <PaymentsListForm onClose={() => setShowPaymentsListForm(false)} />}
    </div>
  )
}

export default MonthlySalaryTable
