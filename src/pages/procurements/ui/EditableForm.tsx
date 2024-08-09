/* eslint-disable max-lines */
import React from 'react'

import {
  useGetInvoiceLinesByPurchaseIdQuery,
  useGetLogisticsLinesByPurchaseIdQuery,
  useGetSupplierLinesByPurchaseIdQuery,
  useUpdateInvoiceLineMutation,
  useUpdateLogisticsLineMutation,
  useUpdatePurchaseMutation,
  useUpdateSupplierLineMutation,
} from '@/entities/deal'
import { PurchaseDto } from '@/entities/deal/deal.types'

interface EditableFormProps {
  initialValue: PurchaseDto
  onCancel: () => void
  onSave: () => void
}

const EditableForm: React.FC<EditableFormProps> = ({ initialValue, onCancel, onSave }) => {
  const { data: invoiceLines = [] } = useGetInvoiceLinesByPurchaseIdQuery(initialValue.id)
  const { data: supplierLines = [] } = useGetSupplierLinesByPurchaseIdQuery(initialValue.id)
  const { data: logisticsLines = [] } = useGetLogisticsLinesByPurchaseIdQuery(initialValue.id)

  const [updatePurchase] = useUpdatePurchaseMutation()
  const [updateInvoiceLine] = useUpdateInvoiceLineMutation()
  const [updateSupplierLine] = useUpdateSupplierLineMutation()
  const [updateLogisticsLine] = useUpdateLogisticsLineMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)

    const purchaseData = {
      counterpartyId: initialValue.counterpartyId, // Наследуется
      dealId: initialValue.dealId, // Наследуется
      deliveryDeadline: formData.get('deliveryDeadline')
        ? new Date(formData.get('deliveryDeadline') as string).toISOString()
        : initialValue.deliveryDeadline, // Обновляем, если было изменено
      id: initialValue.id, // Наследуется
      invoiceToCustomer:
        Number(formData.get('invoiceToCustomer')) || initialValue.invoiceToCustomer, // Обновляем, если было изменено
      requestNumber: (formData.get('requestNumber') as string) || initialValue.requestNumber, // Преобразуем в строку и обновляем, если было изменено
      userId: initialValue.userId, // Наследуется
    }

    try {
      // Обновляем основную сущность Purchase
      await updatePurchase({ data: purchaseData, id: purchaseData.id }).unwrap()

      // Обновляем связанные сущности
      await Promise.all(
        invoiceLines.map(line =>
          updateInvoiceLine({
            data: {
              ...line,
              articleNumber: formData.get(`invoiceLine_articleNumber_${line.id}`) as string,
              comment: formData.get(`invoiceLine_comment_${line.id}`) as string,
              description: formData.get(`invoiceLine_description_${line.id}`) as string,
              quantity: Number(formData.get(`invoiceLine_quantity_${line.id}`)),
              totalPrice: Number(formData.get(`invoiceLine_totalPrice_${line.id}`)),
              unitPrice: Number(formData.get(`invoiceLine_unitPrice_${line.id}`)),
            },
            id: line.id,
          }).unwrap()
        )
      )

      await Promise.all(
        supplierLines.map(line =>
          updateSupplierLine({
            data: {
              ...line,
              articleNumber: formData.get(`supplierLine_articleNumber_${line.id}`) as string,
              comment: formData.get(`supplierLine_comment_${line.id}`) as string,
              delivered: formData.get(`supplierLine_delivered_${line.id}`) === 'on',
              description: formData.get(`supplierLine_description_${line.id}`) as string,
              paymentDate: line.paymentDate ? new Date(line.paymentDate).toISOString() : '',
              quantity: Number(formData.get(`supplierLine_quantity_${line.id}`)),
              shipmentDate: line.shipmentDate ? new Date(line.shipmentDate).toISOString() : '',
              supplierId: Number(formData.get(`supplierLine_supplierId_${line.id}`)),
              supplierInvoice: formData.get(`supplierLine_supplierInvoice_${line.id}`) as string,
              totalPurchaseAmount: Number(
                formData.get(`supplierLine_totalPurchaseAmount_${line.id}`)
              ),
            },
            id: line.id,
          }).unwrap()
        )
      )

      await Promise.all(
        logisticsLines.map(line =>
          updateLogisticsLine({
            data: {
              ...line,
              amount: Number(formData.get(`logisticsLine_amount_${line.id}`)),
              carrier: formData.get(`logisticsLine_carrier_${line.id}`) as string,
              date: line.date
                ? new Date(formData.get(`logisticsLine_date_${line.id}`) as string).toISOString()
                : '',
              description: formData.get(`logisticsLine_description_${line.id}`) as string,
            },
            id: line.id,
          }).unwrap()
        )
      )

      onSave()
    } catch (error) {
      console.error('Error updating purchase order:', error)
    }
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'}>
      <div className={'bg-white p-6 rounded shadow-lg max-h-[90vh] overflow-auto w-[90vw]'}>
        <form className={'space-y-4'} onSubmit={handleSubmit}>
          <h3 className={'text-lg font-medium'}>Основная информация</h3>
          <div className={'grid grid-cols-2 gap-4'}>
            <div>
              <label className={'block text-sm font-medium'}>Номер запроса</label>
              <input
                className={'border p-2 w-full'}
                defaultValue={initialValue.requestNumber}
                name={'requestNumber'}
                type={'text'}
              />
            </div>
            <div>
              <label className={'block text-sm font-medium'}>Заказчик (ID)</label>
              <input
                className={'border p-2 w-full'}
                defaultValue={initialValue.counterpartyId}
                name={'counterpartyId'}
                type={'number'}
              />
            </div>
            <div>
              <label className={'block text-sm font-medium'}>Счет заказчику</label>
              <input
                className={'border p-2 w-full'}
                defaultValue={initialValue.invoiceToCustomer}
                name={'invoiceToCustomer'}
                type={'number'}
              />
            </div>
            <div>
              <label className={'block text-sm font-medium'}>Менеджер (ID)</label>
              <input
                className={'border p-2 w-full'}
                defaultValue={initialValue.userId}
                name={'userId'}
                type={'number'}
              />
            </div>
            <div>
              <label className={'block text-sm font-medium'}>Крайняя дата поставки</label>
              <input
                className={'border p-2 w-full'}
                defaultValue={
                  initialValue.deliveryDeadline
                    ? new Date(initialValue.deliveryDeadline).toISOString().substring(0, 10)
                    : ''
                }
                name={'deliveryDeadline'}
                type={'date'}
              />
            </div>
          </div>

          <h3 className={'text-lg font-medium'}>Строки счета</h3>
          <div className={'space-y-2'}>
            {invoiceLines.map((line, index) => (
              <div className={'grid grid-cols-6 gap-4'} key={line.id}>
                <div>
                  <label className={'block text-sm font-medium'}>Артикул</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.articleNumber}
                    name={`invoiceLine_articleNumber_${line.id}`}
                    type={'text'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Описание</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.description}
                    name={`invoiceLine_description_${line.id}`}
                    type={'text'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Кол-во</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.quantity}
                    name={`invoiceLine_quantity_${line.id}`}
                    type={'number'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Цена за ед.</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.unitPrice}
                    name={`invoiceLine_unitPrice_${line.id}`}
                    type={'number'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Общая сумма</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.totalPrice}
                    name={`invoiceLine_totalPrice_${line.id}`}
                    type={'number'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Комментарий</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.comment || ''}
                    name={`invoiceLine_comment_${line.id}`}
                    type={'text'}
                  />
                </div>
              </div>
            ))}
          </div>

          <h3 className={'text-lg font-medium'}>Строки поставщика</h3>
          <div className={'space-y-2'}>
            {supplierLines.map((line, index) => (
              <div className={'grid grid-cols-6 gap-4'} key={line.id}>
                <div>
                  <label className={'block text-sm font-medium'}>Артикул</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.articleNumber}
                    name={`supplierLine_articleNumber_${line.id}`}
                    type={'text'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Описание</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.description}
                    name={`supplierLine_description_${line.id}`}
                    type={'text'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Кол-во</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.quantity}
                    name={`supplierLine_quantity_${line.id}`}
                    type={'number'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>ID поставщика</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.supplierId}
                    name={`supplierLine_supplierId_${line.id}`}
                    type={'number'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Счет поставщика</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.supplierInvoice}
                    name={`supplierLine_supplierInvoice_${line.id}`}
                    type={'text'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Сумма закупки</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.totalPurchaseAmount}
                    name={`supplierLine_totalPurchaseAmount_${line.id}`}
                    type={'number'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Дата оплаты</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.paymentDate.substring(0, 10)}
                    name={`supplierLine_paymentDate_${line.id}`}
                    type={'date'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Дата отгрузки</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.shipmentDate.substring(0, 10)}
                    name={`supplierLine_shipmentDate_${line.id}`}
                    type={'date'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Доставлено</label>
                  <input
                    className={'border p-2'}
                    defaultChecked={line.delivered}
                    name={`supplierLine_delivered_${line.id}`}
                    type={'checkbox'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Комментарий</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.comment || ''}
                    name={`supplierLine_comment_${line.id}`}
                    type={'text'}
                  />
                </div>
              </div>
            ))}
          </div>

          <h3 className={'text-lg font-medium'}>Строки логистики</h3>
          <div className={'space-y-2'}>
            {logisticsLines.map((line, index) => (
              <div className={'grid grid-cols-3 gap-4'} key={line.id}>
                <div>
                  <label className={'block text-sm font-medium'}>Дата</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={new Date(line.date).toISOString().substring(0, 10)}
                    name={`logisticsLine_date_${line.id}`}
                    type={'date'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Описание</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.description}
                    name={`logisticsLine_description_${line.id}`}
                    type={'text'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Перевозчик</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.carrier}
                    name={`logisticsLine_carrier_${line.id}`}
                    type={'text'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Сумма</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.amount}
                    name={`logisticsLine_amount_${line.id}`}
                    type={'number'}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={'mt-4 flex justify-end space-x-4'}>
            <button className={'bg-blue-500 text-white px-4 py-2 rounded'} type={'submit'}>
              Сохранить
            </button>
            <button
              className={'bg-gray-300 text-black px-4 py-2 rounded'}
              onClick={onCancel}
              type={'button'}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditableForm
