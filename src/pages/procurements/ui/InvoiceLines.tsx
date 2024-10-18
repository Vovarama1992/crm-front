import React, { useEffect, useState } from 'react'

import { useGetInvoiceLinesByPurchaseIdQuery } from '@/entities/deal'
import { InvoiceLineDto } from '@/entities/deal/deal.types'

import CreateInvoiceLineModal from './CreateInvoiceLineModal'

interface InvoiceLinesProps {
  onTotalChange: (total: number) => void // Добавляем функцию обратного вызова
  purchaseId: number
}

const InvoiceLines: React.FC<InvoiceLinesProps> = ({ onTotalChange, purchaseId }) => {
  const { data: fetchedLines = [] } = useGetInvoiceLinesByPurchaseIdQuery(purchaseId)
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLineDto[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (fetchedLines.length > 0) {
      setInvoiceLines(prevLines => {
        const mergedLines = [...fetchedLines, ...prevLines]

        return mergedLines
      })

      // Вычисляем общую сумму и поднимаем её в родительский компонент
      const total = fetchedLines.reduce((sum, line) => sum + (line.totalPrice || 0), 0)

      onTotalChange(total) // Передаем сумму в родительский компонент
    }
  }, [fetchedLines, onTotalChange])

  const handleAddLine = (newLine: any) => {
    setInvoiceLines(prev => [...prev, newLine])

    // Обновляем общую сумму при добавлении новой строки
    const newTotal =
      newLine.totalPrice + invoiceLines.reduce((sum, line) => sum + (line.totalPrice || 0), 0)

    onTotalChange(newTotal)
  }

  return (
    <div className={'mb-4'}>
      <h3 className={'font-medium'}>Строки счета</h3>

      <table className={'table-auto w-full border-collapse'}>
        <thead>
          <tr>
            <th className={'border px-4 py-2'}>Артикул</th>
            <th className={'border px-4 py-2'}>Описание</th>
            <th className={'border px-4 py-2'}>Кол-во</th>
            <th className={'border px-4 py-2'}>Цена за единицу</th>
            <th className={'border px-4 py-2'}>Общая сумма</th>
            <th className={'border px-4 py-2'}>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          {invoiceLines.map((line, index) => (
            <tr key={index}>
              <td className={'border px-4 py-2'}>{line.articleNumber}</td>
              <td className={'border px-4 py-2'}>{line.description}</td>
              <td className={'border px-4 py-2'}>{line.quantity}</td>
              <td className={'border px-4 py-2'}>{line.unitPrice}</td>
              <td className={'border px-4 py-2'}>{line.totalPrice}</td>
              <td className={'border px-4 py-2'}>{line.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className={'bg-green-500 ml-[300px] text-white px-4 py-2 rounded mt-4'}
        onClick={() => setIsModalOpen(true)}
      >
        Добавить строку счета
      </button>

      {isModalOpen && (
        <CreateInvoiceLineModal
          onCancel={() => setIsModalOpen(false)}
          onSuccess={handleAddLine}
          purchaseId={purchaseId}
        />
      )}
    </div>
  )
}

export default InvoiceLines
