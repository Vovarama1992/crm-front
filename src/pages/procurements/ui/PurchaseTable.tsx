import React, { useState } from 'react'

import { PurchaseDto } from '@/entities/deal/deal.types'

import EditableForm from './EditableForm'

interface PurchaseTableProps {
  data: PurchaseDto[]
}

const PurchaseTable: React.FC<PurchaseTableProps> = ({ data }) => {
  const [editingOrder, setEditingOrder] = useState<PurchaseDto | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleEditClick = (purchase: PurchaseDto) => {
    setEditingOrder(purchase)
    setIsFormOpen(true)
  }

  const handleFormSave = () => {
    setIsFormOpen(false)
    setEditingOrder(null)
  }

  return (
    <div className={'overflow-auto'}>
      <table className={'table-auto w-full border-collapse'}>
        <thead>
          <tr>
            <th className={'border px-4 py-2 bg-gray-100'}>№ сделки</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Номер запроса</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Заказчик (ID)</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Счет заказчику</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Менеджер (ID)</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Крайняя дата поставки</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map(purchase => (
            <tr key={purchase.id}>
              <td className={'border px-4 py-2'}>{purchase.dealId}</td>
              <td className={'border px-4 py-2'}>{purchase.requestNumber}</td>
              <td className={'border px-4 py-2'}>{purchase.counterpartyId}</td>
              <td className={'border px-4 py-2'}>{purchase.invoiceToCustomer}</td>
              <td className={'border px-4 py-2'}>{purchase.userId}</td>
              <td className={'border px-4 py-2'}>
                {new Date(purchase.deliveryDeadline).toLocaleDateString()}
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
