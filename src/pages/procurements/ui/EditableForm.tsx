/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react'

export type InvoiceLine = {
  article: string
  comment: string
  description: string
  quantity: number
  totalPrice: number
  unitPrice: number
}

export type SupplierLine = {
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

export type LogisticsLine = {
  amount: number
  carrier: string
  date: string
  description: string
}

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

interface EditableFormProps {
  index: number // Добавлен index
  initialValue: PurchaseOrder
  onCancel: () => void
  onSave: (value: PurchaseOrder, index: number) => void // Добавлен index
}

const EditableForm: React.FC<EditableFormProps> = ({ index, initialValue, onCancel, onSave }) => {
  const [formData, setFormData] = useState<PurchaseOrder>(initialValue)

  useEffect(() => {
    setFormData(initialValue)
  }, [initialValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleInvoiceLineChange = (lineIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newInvoiceLines = [...formData.invoiceLines]

    newInvoiceLines[lineIndex] = {
      ...newInvoiceLines[lineIndex],
      [name]: value,
    }
    setFormData({
      ...formData,
      invoiceLines: newInvoiceLines,
    })
  }

  const handleSupplierLineChange = (lineIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newSupplierLines = [...formData.supplierLines]

    newSupplierLines[lineIndex] = {
      ...newSupplierLines[lineIndex],
      [name]: value,
    }
    setFormData({
      ...formData,
      supplierLines: newSupplierLines,
    })
  }

  const handleLogisticsLineChange = (lineIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newLogisticsLines = [...formData.logisticsLines]

    newLogisticsLines[lineIndex] = {
      ...newLogisticsLines[lineIndex],
      [name]: value,
    }
    setFormData({
      ...formData,
      logisticsLines: newLogisticsLines,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData, index) // Передаем index в onSave
    onCancel()
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'}>
      <div className={'bg-white p-6 rounded shadow-lg max-h-[90vh] overflow-auto w-[90vw]'}>
        <form className={'space-y-4'} onSubmit={handleSubmit}>
          <div>
            <label className={'block text-sm font-medium'}>Дата создания</label>
            <input
              className={'border p-2 w-full'}
              name={'creationDate'}
              onChange={handleChange}
              type={'date'}
              value={formData.creationDate}
            />
          </div>
          <div>
            <label className={'block text-sm font-medium'}>№ сделки</label>
            <input
              className={'border p-2 w-full'}
              name={'dealNumber'}
              onChange={handleChange}
              type={'text'}
              value={formData.dealNumber}
            />
          </div>
          <div>
            <label className={'block text-sm font-medium'}>Номер запроса</label>
            <input
              className={'border p-2 w-full'}
              name={'requestNumber'}
              onChange={handleChange}
              type={'text'}
              value={formData.requestNumber}
            />
          </div>
          <div>
            <label className={'block text-sm font-medium'}>Заказчик</label>
            <input
              className={'border p-2 w-full'}
              name={'customer'}
              onChange={handleChange}
              type={'text'}
              value={formData.customer}
            />
          </div>
          <div>
            <label className={'block text-sm font-medium'}>Счет заказчику</label>
            <input
              className={'border p-2 w-full'}
              name={'customerInvoice'}
              onChange={handleChange}
              type={'text'}
              value={formData.customerInvoice}
            />
          </div>
          <div>
            <label className={'block text-sm font-medium'}>Менеджер</label>
            <input
              className={'border p-2 w-full'}
              name={'manager'}
              onChange={handleChange}
              type={'text'}
              value={formData.manager}
            />
          </div>
          <div>
            <label className={'block text-sm font-medium'}>Крайняя дата поставки</label>
            <input
              className={'border p-2 w-full'}
              name={'deliveryDeadline'}
              onChange={handleChange}
              type={'date'}
              value={formData.deliveryDeadline}
            />
          </div>
          <h3 className={'text-lg font-medium'}>Строки счета</h3>
          {formData.invoiceLines.map((line, lineIndex) => (
            <div className={'space-y-2'} key={lineIndex}>
              <div>
                <label className={'block text-sm font-medium'}>Артикул</label>
                <input
                  className={'border p-2 w-full'}
                  name={'article'}
                  onChange={e => handleInvoiceLineChange(lineIndex, e)}
                  type={'text'}
                  value={line.article}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Описание</label>
                <input
                  className={'border p-2 w-full'}
                  name={'description'}
                  onChange={e => handleInvoiceLineChange(lineIndex, e)}
                  type={'text'}
                  value={line.description}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Кол-во</label>
                <input
                  className={'border p-2 w-full'}
                  name={'quantity'}
                  onChange={e => handleInvoiceLineChange(lineIndex, e)}
                  type={'number'}
                  value={line.quantity}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Стоимость продажи единицы</label>
                <input
                  className={'border p-2 w-full'}
                  name={'unitPrice'}
                  onChange={e => handleInvoiceLineChange(lineIndex, e)}
                  type={'number'}
                  value={line.unitPrice}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Сумма продажи (RUB)</label>
                <input
                  className={'border p-2 w-full'}
                  name={'totalPrice'}
                  onChange={e => handleInvoiceLineChange(lineIndex, e)}
                  type={'number'}
                  value={line.totalPrice}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Комментарий</label>
                <input
                  className={'border p-2 w-full'}
                  name={'comment'}
                  onChange={e => handleInvoiceLineChange(lineIndex, e)}
                  type={'text'}
                  value={line.comment}
                />
              </div>
            </div>
          ))}
          <h3 className={'text-lg font-medium'}>Строки поставщика</h3>
          {formData.supplierLines.map((line, lineIndex) => (
            <div className={'space-y-2'} key={lineIndex}>
              <div>
                <label className={'block text-sm font-medium'}>Артикул</label>
                <input
                  className={'border p-2 w-full'}
                  name={'article'}
                  onChange={e => handleSupplierLineChange(lineIndex, e)}
                  type={'text'}
                  value={line.article}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Описание</label>
                <input
                  className={'border p-2 w-full'}
                  name={'description'}
                  onChange={e => handleSupplierLineChange(lineIndex, e)}
                  type={'text'}
                  value={line.description}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Кол-во</label>
                <input
                  className={'border p-2 w-full'}
                  name={'quantity'}
                  onChange={e => handleSupplierLineChange(lineIndex, e)}
                  type={'number'}
                  value={line.quantity}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Поставщик</label>
                <input
                  className={'border p-2 w-full'}
                  name={'supplier'}
                  onChange={e => handleSupplierLineChange(lineIndex, e)}
                  type={'text'}
                  value={line.supplier}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Счет от поставщика</label>
                <input
                  className={'border p-2 w-full'}
                  name={'supplierInvoice'}
                  onChange={e => handleSupplierLineChange(lineIndex, e)}
                  type={'text'}
                  value={line.supplierInvoice}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Сумма закупки (RUB)</label>
                <input
                  className={'border p-2 w-full'}
                  name={'purchaseAmount'}
                  onChange={e => handleSupplierLineChange(lineIndex, e)}
                  type={'number'}
                  value={line.purchaseAmount}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Дата оплаты счета поставщику</label>
                <input
                  className={'border p-2 w-full'}
                  name={'paymentDate'}
                  onChange={e => handleSupplierLineChange(lineIndex, e)}
                  type={'date'}
                  value={line.paymentDate}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>
                  Дата отгрузки по счету от поставщика
                </label>
                <input
                  className={'border p-2 w-full'}
                  name={'shipmentDate'}
                  onChange={e => handleSupplierLineChange(lineIndex, e)}
                  type={'date'}
                  value={line.shipmentDate}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Доставлено</label>
                <input
                  className={'border p-2 w-full'}
                  name={'delivered'}
                  onChange={e => handleSupplierLineChange(lineIndex, e)}
                  type={'text'}
                  value={line.delivered ? 'да' : 'нет'}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Дней до</label>
                <input
                  className={'border p-2 w-full'}
                  name={'daysToDeliver'}
                  onChange={e => handleSupplierLineChange(lineIndex, e)}
                  type={'number'}
                  value={line.daysToDeliver}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Комментарий</label>
                <input
                  className={'border p-2 w-full'}
                  name={'comment'}
                  onChange={e => handleSupplierLineChange(lineIndex, e)}
                  type={'text'}
                  value={line.comment}
                />
              </div>
            </div>
          ))}
          <h3 className={'text-lg font-medium'}>Строки логистики</h3>
          {formData.logisticsLines.map((line, lineIndex) => (
            <div className={'space-y-2'} key={lineIndex}>
              <div>
                <label className={'block text-sm font-medium'}>Дата</label>
                <input
                  className={'border p-2 w-full'}
                  name={'date'}
                  onChange={e => handleLogisticsLineChange(lineIndex, e)}
                  type={'date'}
                  value={line.date}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Описание</label>
                <input
                  className={'border p-2 w-full'}
                  name={'description'}
                  onChange={e => handleLogisticsLineChange(lineIndex, e)}
                  type={'text'}
                  value={line.description}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Перевозчик</label>
                <input
                  className={'border p-2 w-full'}
                  name={'carrier'}
                  onChange={e => handleLogisticsLineChange(lineIndex, e)}
                  type={'text'}
                  value={line.carrier}
                />
              </div>
              <div>
                <label className={'block text-sm font-medium'}>Сумма</label>
                <input
                  className={'border p-2 w-full'}
                  name={'amount'}
                  onChange={e => handleLogisticsLineChange(lineIndex, e)}
                  type={'number'}
                  value={line.amount}
                />
              </div>
            </div>
          ))}
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
