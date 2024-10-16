// components/LogisticsLines.tsx
import React from 'react'

import { useGetLogisticsLinesByPurchaseIdQuery } from '@/entities/deal'
import { LogisticsLineDto } from '@/entities/deal/deal.types'

interface LogisticsLinesProps {
  purchaseId: number
}

const LogisticsLines: React.FC<LogisticsLinesProps> = ({ purchaseId }) => {
  const { data: logisticsLines = [] } = useGetLogisticsLinesByPurchaseIdQuery(purchaseId)

  return (
    <div className={'mb-4'}>
      <h3 className={'font-medium'}>Строки логистики</h3>

      <table className={'table-auto w-full border-collapse'}>
        <thead>
          <tr>
            <th className={'border px-4 py-2'}>Дата</th>
            <th className={'border px-4 py-2'}>Перевозчик</th>
            <th className={'border px-4 py-2'}>Сумма</th>
            <th className={'border px-4 py-2'}>Описание</th>
          </tr>
        </thead>
        <tbody>
          {logisticsLines.map((line: LogisticsLineDto) => (
            <tr key={line.id}>
              <td className={'border px-4 py-2'}>{line.date}</td>
              <td className={'border px-4 py-2'}>{line.carrier}</td>
              <td className={'border px-4 py-2'}>{line.amount}</td>
              <td className={'border px-4 py-2'}>{line.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LogisticsLines
