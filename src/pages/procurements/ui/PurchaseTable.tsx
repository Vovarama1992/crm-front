import React from 'react'

import { PurchaseOrder } from './EditableForm'

type PurchaseTableProps = {
  data: PurchaseOrder[]
  onEditRecord: (record: PurchaseOrder, index: number) => void
}

const PurchaseTable: React.FC<PurchaseTableProps> = ({ data, onEditRecord }) => {
  return (
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
          <th className={'border px-4 py-2 bg-gray-100'}>Действия</th>
        </tr>
      </thead>
      <tbody>
        {data.map((order, index) => (
          <tr key={index}>
            <td className={'border px-4 py-2'}>{order.creationDate}</td>
            <td className={'border px-4 py-2'}>{order.dealNumber}</td>
            <td className={'border px-4 py-2'}>{order.requestNumber}</td>
            <td className={'border px-4 py-2'}>{order.customer}</td>
            <td className={'border px-4 py-2'}>{order.customerInvoice}</td>
            <td className={'border px-4 py-2'}>{order.manager}</td>
            <td className={'border px-4 py-2'}>{order.deliveryDeadline}</td>
            <td className={'border px-4 py-2'}>
              <button
                className={'bg-blue-500 text-white px-2 py-1 rounded'}
                onClick={() => onEditRecord(order, index)}
              >
                Редактировать
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default PurchaseTable
