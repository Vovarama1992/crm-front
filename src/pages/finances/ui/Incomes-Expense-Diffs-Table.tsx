import React from 'react'

type DiffTableProps = {
  data: { expenses: number; income: number; month: string; remaining: number }[]
}

const columnWidth = 150
const monthColWidth = 500

const IncomesExpenseDiffsTable: React.FC<DiffTableProps> = ({ data }) => {
  const months = data.map(d => d.month)
  const incomeRow = data.map(d => d.income)
  const expenseRow = data.map(d => d.expenses)
  const remainingRow = data.map(d => d.remaining)

  const fromStartRow = []
  let cumulative = 0

  for (const val of remainingRow) {
    cumulative += val
    fromStartRow.push(cumulative)
  }

  return (
    <table className={'border'} style={{ width: columnWidth + months.length * monthColWidth }}>
      <thead>
        <tr>
          <th className={'border px-4 py-2 text-left bg-white'} style={{ width: columnWidth }}>
            {/* Отступ вместо названия столбца */}
          </th>
          {months.map((month, i) => (
            <th className={'border px-4 py-2 bg-gray-100'} key={i} style={{ width: monthColWidth }}>
              {month}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={'border px-4 py-2 font-bold'}>Доходы</td>
          {incomeRow.map((val, i) => (
            <td className={'border px-4 py-2'} key={i}>
              {val.toFixed(2)}
            </td>
          ))}
        </tr>
        <tr>
          <td className={'border px-4 py-2 font-bold'}>Расходы</td>
          {expenseRow.map((val, i) => (
            <td className={'border px-4 py-2'} key={i}>
              {val.toFixed(2)}
            </td>
          ))}
        </tr>
        <tr>
          <td className={'border px-4 py-2 font-bold'}>Осталось</td>
          {remainingRow.map((val, i) => (
            <td className={'border px-4 py-2'} key={i}>
              {val.toFixed(2)}
            </td>
          ))}
        </tr>
        <tr>
          <td className={'border px-4 py-2 font-bold'}>С начала года</td>
          {fromStartRow.map((val, i) => (
            <td className={'border px-4 py-2'} key={i}>
              {val.toFixed(2)}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

export default IncomesExpenseDiffsTable
