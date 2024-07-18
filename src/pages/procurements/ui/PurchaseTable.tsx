/* eslint-disable max-lines */
/* eslint-disable no-nested-ternary */
import React from 'react'

export type PurchaseOrder = {
  creationDate: string
  customer: string
  customerInvoice: string
  dealNumber: string
  deliveryDeadline: string
  invoiceLines: InvoiceLine[]
  logisticsLines: LogisticsLine[]
  manager: string
  requestNumber: string
  supplierLines: SupplierLine[]
}

type InvoiceLine = {
  article: string
  comment: string
  description: string
  quantity: number
  totalPrice: number
  unitPrice: number
}

type SupplierLine = {
  article: string
  comment: string
  daysToDeliver: number
  delivered: boolean
  description: string
  paymentDate: string
  purchaseAmount: number
  quantity: number
  shipmentDate: string
  supplier: string
  supplierInvoice: string
}

type LogisticsLine = {
  amount: number
  carrier: string
  date: string
  description: string
}

type PurchaseTableProps = {
  data: PurchaseOrder[]
}

const PurchaseTable: React.FC<PurchaseTableProps> = ({ data }) => {
  return (
    <table className={'table-auto w-full border-collapse'}>
      <thead>
        <tr>
          <th className={'border h-[100px] px-4 py-2 bg-gray-100'}>Дата создания</th>
          <th className={'border px-4 py-2 bg-gray-100'}>№ сделки</th>
          <th className={'border px-4 py-2 bg-gray-100'}>Номер запроса</th>
          <th className={'border px-4 py-2 bg-gray-100'}>Заказчик</th>
          <th className={'border px-4 py-2 bg-gray-100'}>Счет заказчику</th>
          <th className={'border px-4 py-2 bg-gray-100'}>Менеджер</th>
          <th className={'border px-4 py-2 bg-gray-100'}>Крайняя дата поставки</th>
        </tr>
      </thead>
      <tbody>
        {data.map((order, index) => (
          <React.Fragment key={index}>
            <tr>
              <td className={'border h-[200px] px-4 py-2'}>{order.creationDate}</td>
              <td className={'border px-4 py-2'}>{order.dealNumber}</td>
              <td className={'border px-4 py-2'}>{order.requestNumber}</td>
              <td className={'border px-4 py-2'}>{order.customer}</td>
              <td className={'border px-4 py-2'}>{order.customerInvoice}</td>
              <td className={'border px-4 py-2'}>{order.manager}</td>
              <td className={'border px-4 py-2'}>{order.deliveryDeadline}</td>
            </tr>
            <tr>
              <td className={'border px-4 py-2'} colSpan={7}>
                <table className={'table-auto w-full border-collapse'}>
                  <thead>
                    <tr>
                      <th className={'border px-4 py-2 bg-gray-200'}>Артикул</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Описание</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Кол-во</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Стоимость продажи единицы</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Сумма продажи (RUB)</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Комментарий</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.invoiceLines.map((line, index) => (
                      <tr key={index}>
                        <td className={'border px-4 py-2'}>{line.article}</td>
                        <td className={'border px-4 py-2'}>{line.description}</td>
                        <td className={'border px-4 py-2'}>{line.quantity}</td>
                        <td className={'border px-4 py-2'}>{line.unitPrice}</td>
                        <td className={'border px-4 py-2'}>{line.totalPrice}</td>
                        <td className={'border px-4 py-2'}>{line.comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td className={'border px-4 py-2'} colSpan={7}>
                <table className={'table-auto w-full border-collapse'}>
                  <thead>
                    <tr>
                      <th className={'border px-4 py-2 bg-gray-200'}>Артикул</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Описание</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Кол-во</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Поставщик</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Счет от поставщика</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Сумма закупки (RUB)</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>
                        Дата оплаты счета поставщику
                      </th>
                      <th className={'border px-4 py-2 bg-gray-200'}>
                        Дата отгрузки по счету от поставщика
                      </th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Доставлено</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Дней до</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Комментарий</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.supplierLines.map((line, index) => (
                      <tr key={index}>
                        <td className={'border px-4 py-2'}>{line.article}</td>
                        <td className={'border px-4 py-2'}>{line.description}</td>
                        <td className={'border px-4 py-2'}>{line.quantity}</td>
                        <td className={'border px-4 py-2'}>{line.supplier}</td>
                        <td className={'border px-4 py-2'}>{line.supplierInvoice}</td>
                        <td className={'border px-4 py-2'}>{line.purchaseAmount}</td>
                        <td className={'border px-4 py-2'}>{line.paymentDate}</td>
                        <td className={'border px-4 py-2'}>{line.shipmentDate}</td>
                        <td className={'border px-4 py-2'}>{line.delivered ? 'да' : 'нет'}</td>
                        <td className={'border px-4 py-2'}>{line.daysToDeliver}</td>
                        <td className={'border px-4 py-2'}>{line.comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td className={'border px-4 py-2'} colSpan={7}>
                <table className={'table-auto w-full border-collapse'}>
                  <thead>
                    <tr>
                      <th className={'border px-4 py-2 bg-gray-200'}>№</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Дата</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Описание</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Перевозчик</th>
                      <th className={'border px-4 py-2 bg-gray-200'}>Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.logisticsLines.map((line, index) => (
                      <tr key={index}>
                        <td className={'border px-4 py-2'}>{index + 1}</td>
                        <td className={'border px-4 py-2'}>{line.date}</td>
                        <td className={'border px-4 py-2'}>{line.description}</td>
                        <td className={'border px-4 py-2'}>{line.carrier}</td>
                        <td className={'border px-4 py-2'}>{line.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  )
}

export default PurchaseTable
