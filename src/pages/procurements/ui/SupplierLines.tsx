import React, { useEffect, useState } from 'react'

import { useGetSupplierLinesByPurchaseIdQuery } from '@/entities/deal'
import { SupplierLineDto } from '@/entities/deal/deal.types'

import CreateSupplierLineModal from './CreateSupplierLineModal'

interface SupplierLinesProps {
  purchaseId: number
}

const SupplierLines: React.FC<SupplierLinesProps> = ({ purchaseId }) => {
  const { data: fetchedLines = [] } = useGetSupplierLinesByPurchaseIdQuery(purchaseId)
  const [supplierLines, setSupplierLines] = useState<SupplierLineDto[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Объединение загруженных строк с текущими строками
  useEffect(() => {
    setSupplierLines(fetchedLines)
  }, [fetchedLines])

  const handleAddLines = (newLines: SupplierLineDto[]) => {
    setSupplierLines(prev => [...prev, ...newLines])
    console.log('Added lines:', newLines)
  }

  return (
    <div className={'mb-4'}>
      <h3 className={'font-medium'}>Строки поставщиков</h3>

      <table className={'table-auto w-full border-collapse'}>
        <thead>
          <tr>
            <th className={'border px-4 py-2'}>Артикул</th>
            <th className={'border px-4 py-2'}>Описание</th>
            <th className={'border px-4 py-2'}>Кол-во</th>
            <th className={'border px-4 py-2'}>Сумма</th>
            <th className={'border px-4 py-2'}>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          {supplierLines.map((line: SupplierLineDto) => (
            <tr key={line.id}>
              <td className={'border px-4 py-2'}>{line.articleNumber}</td>
              <td className={'border px-4 py-2'}>{line.description}</td>
              <td className={'border px-4 py-2'}>{line.quantity}</td>
              <td className={'border px-4 py-2'}>{line.totalPurchaseAmount}</td>
              <td className={'border px-4 py-2'}>{line.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className={'bg-green-500 ml-[300px] text-white px-4 py-2 rounded mt-4'}
        onClick={() => setIsModalOpen(true)}
      >
        Добавить строку поставщика
      </button>

      {isModalOpen && (
        <CreateSupplierLineModal
          onCancel={() => setIsModalOpen(false)}
          onSuccess={handleAddLines} // Изменяем здесь
          purchaseId={purchaseId}
        />
      )}
    </div>
  )
}

export default SupplierLines
