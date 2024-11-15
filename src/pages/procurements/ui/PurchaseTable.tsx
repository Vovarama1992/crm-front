import React, { useEffect, useState } from 'react'

import { useGetAllSalesQuery } from '@/entities/deal'
import { useGetAllDealsQuery } from '@/entities/deal'
import { useGetSupplierLinesByPurchaseIdQuery } from '@/entities/deal'
import { PurchaseDto, SaleDto } from '@/entities/deal/deal.types'

import EditableForm from './EditableForm'

const formatDate = (date: Date | null | string | undefined) => {
  if (!date) {
    return ''
  }
  const validDate = typeof date === 'string' ? new Date(date) : date

  return validDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

interface PurchaseTableProps {
  data: ({ counterpartyName: string; managerName: string } & PurchaseDto)[]
}

const PurchaseTable: React.FC<PurchaseTableProps> = ({ data }) => {
  const [editingOrder, setEditingOrder] = useState<PurchaseDto | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [pdfPaths, setPdfPaths] = useState<{ [key: number]: null | string }>({})
  const { data: deals } = useGetAllDealsQuery()
  const { data: salesData } = useGetAllSalesQuery()

  const getRequestNumber = (dealId: number) => {
    const sale = salesData?.find((sale: SaleDto) => sale.id === dealId)

    if (!sale) {
      return 'Продажа не найдена'
    }

    const deal = deals?.find(deal => deal.id === sale.dealId)

    return deal ? deal.requestNumber : 'Сделка не найдена'
  }

  const findTotalAmount = (id: number) => {
    const sale = salesData?.find((sale: SaleDto) => sale.id === id)

    return sale?.totalSaleAmount || 0
  }

  const handleEditClick = (purchase: PurchaseDto) => {
    setEditingOrder(purchase)
    setIsFormOpen(true)
  }

  const handleFormSave = () => {
    setIsFormOpen(false)
  }

  const handleFileOpen = (pdfUrl: string) => {
    if (pdfUrl) {
      const link = document.createElement('a')

      link.href = pdfUrl
      link.target = '_blank'
      link.click()
    } else {
      console.error('PDF не найден')
    }
  }

  useEffect(() => {
    const fetchPdfPaths = () => {
      const paths: { [key: number]: null | string } = {}

      data.forEach(purchase => {
        const matchingSale = salesData?.find(sale => sale.id === purchase.dealId)

        paths[purchase.id] = matchingSale?.pdfUrl || null
      })
      setPdfPaths(paths)
    }

    if (salesData) {
      fetchPdfPaths()
    }
  }, [data, salesData])

  return (
    <div className={'overflow-auto'}>
      <table className={'table-auto w-full border-collapse'}>
        <thead>
          <tr>
            <th className={'border px-4 py-2 bg-gray-100'}>Дата создания</th>
            <th className={'border px-4 py-2 bg-gray-100'}>№ сделки</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Номер запроса</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Заказчик</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Счет заказчику</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Менеджер</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Крайняя дата поставки</th>
            <th className={'border px-4 py-2 bg-gray-100'}>PDF</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Общая сумма продажи</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Сумма закупки</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map(purchase => (
            <tr key={purchase.id}>
              <td className={'border px-4 py-2'}>{formatDate(purchase.createdAt)}</td>
              <td
                className={'border px-4 py-2 cursor-pointer text-blue-500'}
                onClick={() => handleFileOpen(pdfPaths[purchase.id]!)}
              >
                {purchase.dealId}
              </td>
              <td className={'border px-4 py-2'}>{getRequestNumber(purchase.dealId)}</td>
              <td className={'border px-4 py-2'}>{purchase.counterpartyName}</td>
              <td className={'border px-4 py-2'}>{purchase.requestNumber}</td>
              <td className={'border px-4 py-2'}>{purchase.managerName}</td>
              <td className={'border px-4 py-2'}>
                {new Date(purchase.deliveryDeadline).toLocaleDateString()}
              </td>
              <td className={'border px-4 py-2'}>
                {pdfPaths[purchase.id] ? (
                  <button
                    className={'text-blue-500'}
                    onClick={() => handleFileOpen(pdfPaths[purchase.id]!)}
                  >
                    {pdfPaths[purchase.id]?.split('/').pop()}
                  </button>
                ) : (
                  'Нет PDF'
                )}
              </td>
              <td className={'border px-4 py-2'}>{findTotalAmount(purchase.dealId)}</td>
              <td className={'border px-4 py-2'}>
                <PurchaseAmount purchaseId={purchase.id} />
              </td>
              <td className={'border px-4 py-2'}>
                <button
                  className={'bg-blue-500 text-white px-2 py-1 rounded'}
                  onClick={() => handleEditClick(purchase)}
                >
                  Редактировать
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormOpen && editingOrder && (
        <EditableForm
          initialValue={editingOrder}
          onCancel={() => setIsFormOpen(false)}
          onSave={handleFormSave}
          pdfUrl={pdfPaths[editingOrder.id] || null}
        />
      )}
    </div>
  )
}

const PurchaseAmount: React.FC<{ purchaseId: number }> = ({ purchaseId }) => {
  const { data: supplierLines } = useGetSupplierLinesByPurchaseIdQuery(purchaseId)

  const totalAmount = supplierLines
    ? supplierLines.reduce(
        (sum, line) => sum + (line.totalPurchaseAmount || 0) * (line.quantity || 0),
        0
      )
    : 0

  return <>{totalAmount}</>
}

export default PurchaseTable
