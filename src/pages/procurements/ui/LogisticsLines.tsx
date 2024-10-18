import React, { useEffect } from 'react'

import { useGetLogisticsLinesByPurchaseIdQuery } from '@/entities/deal'
import { LogisticsLineDto } from '@/entities/deal/deal.types'

interface LogisticsLinesProps {
  onTotalChange: (total: number) => void // Добавляем функцию обратного вызова
  purchaseId: number
}

const LogisticsLines: React.FC<LogisticsLinesProps> = ({ onTotalChange, purchaseId }) => {
  const { data: logisticsLines = [] } = useGetLogisticsLinesByPurchaseIdQuery(purchaseId)

  // Вычисляем общую сумму логистики
  const totalLogisticsAmount = logisticsLines.reduce((total, line) => {
    return total + (line.amount || 0) // Учитываем, что значение может быть undefined
  }, 0)

  // Передаём общую сумму в родительский компонент
  useEffect(() => {
    onTotalChange(totalLogisticsAmount)
  }, [totalLogisticsAmount, onTotalChange])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)

    return date.toLocaleDateString() // Например, форматирует в виде DD/MM/YYYY или MM/DD/YYYY в зависимости от локали
  }

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
              <td className={'border px-4 py-2'}>{formatDate(line.date)}</td>
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
