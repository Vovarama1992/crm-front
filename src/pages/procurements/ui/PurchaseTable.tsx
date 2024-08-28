import React, { useEffect, useState } from 'react'

import { useGetAllSalesQuery } from '@/entities/deal'
import { PurchaseDto, SaleDto } from '@/entities/deal/deal.types' // Хук для получения всех продаж

import EditableForm from './EditableForm'

interface PurchaseTableProps {
  data: ({ counterpartyName: string; managerName: string } & PurchaseDto)[]
}

const PurchaseTable: React.FC<PurchaseTableProps> = ({ data }) => {
  const [editingOrder, setEditingOrder] = useState<PurchaseDto | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [pdfPaths, setPdfPaths] = useState<{ [key: number]: null | string }>({})

  const { data: salesData } = useGetAllSalesQuery()

  const handleEditClick = (purchase: PurchaseDto) => {
    setEditingOrder(purchase)
    setIsFormOpen(true)
  }

  const handleFormSave = () => {
    setIsFormOpen(false)
    setEditingOrder(null)
  }

  const handleFileOpen = (fileName: string) => {
    const fileData = localStorage.getItem(fileName)

    if (fileData) {
      const link = document.createElement('a')

      link.href = fileData
      link.target = '_blank'
      link.click()
    } else {
      console.error('Файл не найден в localStorage')
    }
  }

  useEffect(() => {
    const fetchPdfPaths = () => {
      const paths: { [key: number]: null | string } = {}

      data.forEach(purchase => {
        const matchingSale = salesData?.find((sale: SaleDto) => sale.id === purchase.dealId)

        if (matchingSale && matchingSale.pdfPath) {
          paths[purchase.id] = matchingSale.pdfPath
        } else {
          paths[purchase.id] = null
        }
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
            <th className={'border px-4 py-2 bg-gray-100'}>PDF</th> {/* Новый столбец */}
            <th className={'border px-4 py-2 bg-gray-100'}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map(purchase => (
            <tr key={purchase.id}>
              <td className={'border px-4 py-2'}>{purchase.createdAt?.toString().split('T')[0]}</td>
              <td className={'border px-4 py-2'}>{purchase.dealId}</td>
              <td className={'border px-4 py-2'}>{purchase.requestNumber}</td>
              <td className={'border px-4 py-2'}>{purchase.counterpartyName}</td>
              <td className={'border px-4 py-2'}>{purchase.invoiceToCustomer}</td>
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
        />
      )}
    </div>
  )
}

export default PurchaseTable
