import React, { useEffect, useState } from 'react'

import {
  useGetLogisticsLinesByPurchaseIdQuery,
  useUpdateLogisticsLineMutation,
} from '@/entities/deal'
import { LogisticsLineDto } from '@/entities/deal/deal.types'

interface LogisticsLinesProps {
  onTotalChange: (total: number) => void
  purchaseId: number
}

const destinationOptions: { [key: string]: string } = {
  RETURN_FROM_CLIENT: 'Возврат от клиента',
  RETURN_TO_SUPPLIER: 'Возврат поставщику',
  TO_CLIENT: 'До клиента',
  TO_US: 'До нас',
}

const LogisticsLines: React.FC<LogisticsLinesProps> = ({ onTotalChange, purchaseId }) => {
  const { data: logisticsLines = [] } = useGetLogisticsLinesByPurchaseIdQuery(purchaseId)
  const [updateLogisticsLine] = useUpdateLogisticsLineMutation()

  const [localLogisticsLines, setLocalLogisticsLines] = useState<LogisticsLineDto[]>([])

  const totalLogisticsAmount = logisticsLines.reduce((total, line) => total + (line.amount || 0), 0)

  useEffect(() => {
    setLocalLogisticsLines(logisticsLines)
    onTotalChange(totalLogisticsAmount)
  }, [logisticsLines, totalLogisticsAmount, onTotalChange])

  const handleFieldChange = async (
    logisticsLineId: number,
    field: keyof LogisticsLineDto,
    value: any
  ) => {
    try {
      const updatedValue =
        field === 'date' && typeof value === 'string' ? new Date(value).toISOString() : value

      const updatedLines = localLogisticsLines.map(line =>
        line.id === logisticsLineId ? { ...line, [field]: updatedValue } : line
      )

      setLocalLogisticsLines(updatedLines)

      await updateLogisticsLine({
        data: { [field]: updatedValue },
        id: logisticsLineId,
      }).unwrap()
    } catch (error) {
      console.error(`Ошибка обновления поля ${field} для логистики:`, error)
    }
  }

  return (
    <div className={'mb-4'}>
      <h3 className={'font-medium'}>Строки логистики</h3>
      <table className={'table-auto w-full border-collapse'}>
        <thead>
          <tr>
            <th className={'border px-4 py-2'}>№</th>
            <th className={'border px-4 py-2'}>Пункт назначения</th>
            <th className={'border px-4 py-2'}>Перевозчик</th>
            <th className={'border px-4 py-2'}>Дата</th>
            <th className={'border px-4 py-2'}>Сумма</th>
            <th className={'border px-4 py-2'}>Описание</th>
          </tr>
        </thead>
        <tbody>
          {localLogisticsLines.map((line: LogisticsLineDto) => (
            <tr key={line.id}>
              <td className={'border px-4 py-2'}>{line.id}</td>
              <td className={'border px-4 py-2'}>
                <select
                  className={'border p-2 w-full'}
                  defaultValue={line.destination || ''}
                  onChange={e => handleFieldChange(line.id, 'destination', e.target.value)}
                >
                  <option value={''}>Выберите пункт назначения</option>
                  {Object.entries(destinationOptions).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </td>
              <td className={'border px-4 py-2'}>
                <input
                  className={'border p-2 w-full'}
                  defaultValue={line.carrier || ''}
                  onChange={e => handleFieldChange(line.id, 'carrier', e.target.value)}
                  type={'text'}
                />
              </td>
              <td className={'border px-4 py-2'}>
                <input
                  className={'border p-2 w-full'}
                  defaultValue={line.date.substring(0, 10)}
                  onChange={e => handleFieldChange(line.id, 'date', e.target.value)}
                  type={'date'}
                />
              </td>
              <td className={'border px-4 py-2'}>
                <input
                  className={'border p-2 w-full'}
                  defaultValue={line.amount}
                  onChange={e => handleFieldChange(line.id, 'amount', Number(e.target.value))}
                  type={'number'}
                />
              </td>
              <td className={'border px-4 py-2'}>
                <input
                  className={'border p-2 w-full'}
                  defaultValue={line.description || ''}
                  onChange={e => handleFieldChange(line.id, 'description', e.target.value)}
                  type={'text'}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LogisticsLines
