import React, { useEffect, useState } from 'react'

import { useGetAllSalesQuery } from '@/entities/deal'
import { useGetAllDealsQuery } from '@/entities/deal'
import { PurchaseDto, SaleDto } from '@/entities/deal/deal.types'

import EditableForm from './EditableForm'

interface PurchaseTableProps {
  data: ({ counterpartyName: string; managerName: string } & PurchaseDto)[]
}

const PurchaseTable: React.FC<PurchaseTableProps> = ({ data }) => {
  const [editingOrder, setEditingOrder] = useState<PurchaseDto | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [pdfPaths, setPdfPaths] = useState<{ [key: number]: null | string }>({})
  const {data: deals} = useGetAllDealsQuery()
  const { data: sales } = useGetAllSalesQuery();
  const getRequestNumber = (dealId: number) => {
    console.log(`Поиск продажи для dealId: ${dealId}`);
  
    // Находим продажу по dealId
    const sale = sales?.find((sale: any) => sale.id === dealId);
    if (!sale) {
      console.log(`Продажа для dealId: ${dealId} не найдена`);
      return 'Продажа не найдена';
    }
  
    console.log(`Найдена продажа: ${JSON.stringify(sale)}`);
  
    // Находим сделку по dealId из найденной продажи
    const deal = deals?.find((deal: any) => deal.id === sale.dealId);
    if (!deal) {
      console.log(`Сделка для dealId: ${sale.dealId} не найдена`);
      return 'Сделка не найдена';
    }
  
    console.log(`Найдена сделка: ${JSON.stringify(deal)}`);
    return deal.requestNumber;
  };

  console.log('isFormOpen: ' + isFormOpen)
  const { data: salesData } = useGetAllSalesQuery()

  function findTotalAmount(id: number) {
    const sale = salesData?.find((sale: SaleDto) => sale.id === id)

    return sale?.totalSaleAmount || 0
  }

  const handleEditClick = (purchase: PurchaseDto) => {
    setEditingOrder(purchase)
    setIsFormOpen(true)
  }

  const handleFormSave = () => {
    setIsFormOpen(false)
    //window.location.reload()
    //setEditingOrder(null)
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
        const matchingSale = salesData?.find((sale: SaleDto) => sale.id === purchase.dealId)

        if (matchingSale && matchingSale.pdfUrl) {
          paths[purchase.id] = matchingSale.pdfUrl
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
            <th className={'border px-4 py-2 bg-gray-100'}>PDF</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Общая сумма продажи</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map(purchase => (
            <tr key={purchase.id}>
              <td className={'border px-4 py-2'}>{purchase.createdAt?.toString().split('T')[0]}</td>
              <td
                className={'border px-4 py-2 cursor-pointer text-blue-500'}
                onClick={() => handleFileOpen(pdfPaths[purchase.id]!)}
              >
                {purchase.dealId}
              </td>
              <td className={'border px-4 py-2'}>
            {/* Извлекаем requestNumber по dealId и отображаем */}
            {getRequestNumber(purchase.dealId)}
          </td>
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
          pdfUrl={pdfPaths[editingOrder.id] || null} // Передаем путь к PDF-файлу
        />
      )}
    </div>
  )
}

export default PurchaseTable
