import React from 'react'

type DiffTableProps = {
  data: { expenses: number; income: number; month: string; remaining: number }[]
}

const IncomesExpenseDiffsTable: React.FC<DiffTableProps> = ({ data }) => {
  return (
    <div className={'w-[1770px] '}>
      <table className={'w-[1770px]'}>
        <thead>
          <tr>
            <th className={'border px-4 py-2'}>Месяц</th>
            <th className={'border px-4 py-2'}>Доходы</th>
            <th className={'border px-4 py-2'}>Расходы</th>
            <th className={'border px-4 py-2'}>Осталось</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className={'border px-4 py-2'}>{row.month}</td>
              <td className={'border px-4 py-2'}>{row.income}</td>
              <td className={'border px-4 py-2'}>{row.expenses}</td>
              <td className={'border px-4 py-2'}>{row.remaining}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default IncomesExpenseDiffsTable
