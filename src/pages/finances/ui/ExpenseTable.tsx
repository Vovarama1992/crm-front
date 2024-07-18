import React, { useState } from 'react'

type ExpenseReport = {
  expense: number
  month: string
  name: string
}

type ExpenseCategory = {
  category: string
  reports: ExpenseReport[]
}

type ExpenseTableProps = {
  data: ExpenseCategory[]
  months: string[]
  onDataChange: (newData: ExpenseCategory[]) => void
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ data, months, onDataChange }) => {
  const [editState, setEditState] = useState<{ [key: string]: boolean }>({})

  const toggleEdit = (key: string) => {
    setEditState({ ...editState, [key]: !editState[key] })
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    categoryIndex: number,
    reportIndex: number,
    month: string,
    field: keyof ExpenseReport
  ) => {
    const newData = [...data]
    const report = newData[categoryIndex].reports.find(
      r => r.month === month && r.name === newData[categoryIndex].reports[reportIndex].name
    )

    if (report) {
      const value = parseFloat(e.target.value)

      if (!isNaN(value)) {
        ;(report as any)[field] = value
        onDataChange(newData)
      }
    }
  }

  const calculateTotals = (categoryIndex: number, month: string) => {
    return data[categoryIndex].reports
      .filter(report => report.month === month)
      .reduce((total, report) => total + (report.expense || 0), 0)
  }

  return (
    <table className={'table-auto w-full border-collapse'}>
      <thead>
        <tr>
          <th className={'border px-4 py-2 bg-gray-100'}>Название</th>
          {months.map(month => (
            <th className={'border px-4 py-2 bg-gray-100'} key={month}>
              {month}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((category, categoryIndex) => (
          <React.Fragment key={category.category}>
            <tr>
              <td className={'bg-gray-200 font-bold border px-4 py-2'} colSpan={months.length + 1}>
                {category.category}
              </td>
            </tr>
            {category.reports
              .filter(
                (report, index, self) => self.findIndex(t => t.name === report.name) === index
              )
              .map((report, reportIndex) => (
                <tr key={report.name}>
                  <td className={'border px-4 py-2'}>{report.name}</td>
                  {months.map(month => {
                    const reportForMonth = category.reports.find(
                      r => r.month === month && r.name === report.name
                    )
                    const expenseValue = reportForMonth ? reportForMonth.expense : 0
                    const keyPrefix = `${categoryIndex}-${reportIndex}-${month}`

                    return (
                      <td className={'border px-4 py-2'} key={keyPrefix}>
                        <div className={'w-full h-full'} style={{ minWidth: '100px' }}>
                          {editState[`${keyPrefix}`] ? (
                            <input
                              className={'w-full px-1 py-1 border-none'}
                              onBlur={() => toggleEdit(`${keyPrefix}`)}
                              onChange={e =>
                                handleInputChange(e, categoryIndex, reportIndex, month, 'expense')
                              }
                              style={{ width: '100%' }}
                              type={'number'}
                              value={expenseValue}
                            />
                          ) : (
                            <span
                              className={'block w-full h-full px-2 py-1 text-sm cursor-pointer'}
                              onClick={() => toggleEdit(`${keyPrefix}`)}
                              style={{ display: 'block', width: '100%' }}
                            >
                              {expenseValue}
                            </span>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            <tr>
              <td className={'border px-4 py-2 font-bold'}>Итого</td>
              {months.map(month => (
                <td className={'border px-4 py-2 font-bold'} key={month}>
                  {calculateTotals(categoryIndex, month)}
                </td>
              ))}
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  )
}

export default ExpenseTable
