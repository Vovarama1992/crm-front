/* eslint-disable max-lines */
import React, { useState } from 'react'

import {
  useGetAllCounterpartiesQuery,
  useGetInvoiceLinesByPurchaseIdQuery,
  useGetLogisticsLinesByPurchaseIdQuery,
  useGetSupplierLinesByPurchaseIdQuery,
  useUpdateInvoiceLineMutation,
  useUpdateLogisticsLineMutation,
  useUpdatePurchaseMutation,
  useUpdateSupplierLineMutation,
} from '@/entities/deal'
import { Destination } from '@/entities/deal/deal.types'
import { PurchaseDto } from '@/entities/deal/deal.types'
import { useGetSuppliersQuery } from '@/entities/departure/departure.api'
import { useCreateNotificationMutation } from '@/entities/notifications'
import { useLazyDownloadSupplierPdfQuery, useUploadSupplierPdfMutation } from '@/entities/session'
import { useMeQuery } from '@/entities/session'
import { useGetWorkersQuery } from '@/entities/workers'

import CreateInvoiceLineModal from './CreateInvoiceLineModal'
import CreateSupplierLineModal from './CreateSupplierLineModal'

interface EditableFormProps {
  initialValue: PurchaseDto
  onCancel: () => void
  onSave: () => void
  pdfUrl: null | string
  totalSaleAmount: number
}

const destinationOptions: { [key in Destination]: string } = {
  RETURN_FROM_CLIENT: 'Возврат от клиента',
  RETURN_TO_SUPPLIER: 'Возврат поставщику',
  TO_CLIENT: 'До клиента',
  TO_US: 'До нас',
}

const EditableForm: React.FC<EditableFormProps> = ({
  initialValue,
  onCancel,
  onSave,
  pdfUrl, // Получаем путь к PDF-файлу
  totalSaleAmount,
}) => {
  const { data: invoiceLines = [] } = useGetInvoiceLinesByPurchaseIdQuery(initialValue.id)
  const { data: supplierLines = [] } = useGetSupplierLinesByPurchaseIdQuery(initialValue.id)
  const { data: logisticsLines = [] } = useGetLogisticsLinesByPurchaseIdQuery(initialValue.id)
  const { data: user } = useMeQuery()

  const [updatePurchase] = useUpdatePurchaseMutation()
  const [updateInvoiceLine] = useUpdateInvoiceLineMutation()
  const [updateSupplierLine] = useUpdateSupplierLineMutation()
  const [updateLogisticsLine] = useUpdateLogisticsLineMutation()
  const [createNotification] = useCreateNotificationMutation()

  const { data: counterparties = [] } = useGetAllCounterpartiesQuery()
  const { data: workers = [] } = useGetWorkersQuery()
  const { data: suppliers = [] } = useGetSuppliersQuery()

  const [isAddingInvoiceLine, setIsAddingInvoiceLine] = useState(false)
  const [isAddingSupplierLine, setIsAddingSupplierLine] = useState(false)

  const [uploadSupplierPdf] = useUploadSupplierPdfMutation()
  const [downloadSupplierPdf] = useLazyDownloadSupplierPdfQuery()

  const handleAllArrivedClick = async () => {
    try {
      await createNotification({
        content: 'Все товары были доставлены.',
        createdBy: user?.id || 9999,
        seenBy: [],
        title: 'Все пришло',
      }).unwrap()
      alert('Уведомление создано')
    } catch (error) {
      console.error('Ошибка при создании уведомления:', error)
      alert('Не удалось создать уведомление')
    }
  }

  const handleFileOpen = () => {
    if (pdfUrl) {
      const link = document.createElement('a')

      link.href = pdfUrl
      link.target = '_blank'
      link.click()
    } else {
      console.error('PDF не найден')
    }
  }

  const handleLogisticsFileUpload = (
    logisticsLineId: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = function (e) {
        if (e.target && typeof e.target.result === 'string') {
          localStorage.setItem(`logisticsPdf_${logisticsLineId}`, e.target.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogisticsFileDownload = (logisticsLineId: number) => {
    const fileData = localStorage.getItem(`logisticsPdf_${logisticsLineId}`)

    if (fileData) {
      const link = document.createElement('a')

      link.href = fileData
      link.setAttribute('download', `logistics_${logisticsLineId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } else {
      console.error('PDF файл не найден')
    }
  }

  const calculateTotalPrice = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice
  }

  const getCounterpartyName = (id: number) => {
    const counterparty = counterparties.find(c => c.id === id)

    return counterparty ? counterparty.name : 'Неизвестный контрагент'
  }

  const getWorkerName = (id: number) => {
    const worker = workers.find(w => w.id === id)

    return worker ? worker.name : 'Неизвестный сотрудник'
  }

  const handleFileUpload = async (
    supplierLineId: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (file) {
      try {
        const uploadResponse = await uploadSupplierPdf({
          file,
          supplierLineId: String(supplierLineId),
        }).unwrap()

        console.log('PDF успешно загружен:', uploadResponse)
      } catch (error) {
        console.error('Ошибка при загрузке PDF:', error)
      }
    }
  }

  const handleFileDownload = async (pdfUrl: string) => {
    try {
      const fileName = pdfUrl.split('/').pop()

      if (fileName) {
        const result = await downloadSupplierPdf({ filename: fileName }).unwrap()

        if (result) {
          const url = window.URL.createObjectURL(new Blob([result]))
          const link = document.createElement('a')

          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          link.remove()
        }
      }
    } catch (error) {
      console.error('Ошибка при скачивании PDF:', error)
    }
  }

  const calculateTotalLogistics = () => {
    return logisticsLines.reduce((acc, line) => acc + line.amount, 0)
  }

  const calculateTotalPurchase = () => {
    const supplierTotal = supplierLines.reduce((acc, line) => acc + line.totalPurchaseAmount, 0)

    return supplierTotal
  }

  const calculateProfit = () => {
    return totalSaleAmount - calculateTotalLogistics() - calculateTotalPurchase()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const purchaseData = {
      counterpartyId: initialValue.counterpartyId,
      dealId: initialValue.dealId,
      deliveryDeadline: formData.get('deliveryDeadline')
        ? new Date(formData.get('deliveryDeadline') as string).toISOString()
        : initialValue.deliveryDeadline,
      id: initialValue.id,
      invoiceToCustomer:
        Number(formData.get('invoiceToCustomer')) || initialValue.invoiceToCustomer,
      requestNumber: (formData.get('requestNumber') as string) || initialValue.requestNumber,
      userId: initialValue.userId,
    }

    try {
      // Перед отправкой очищаем данные от вложенных объектов и проверяем на null
      await updatePurchase({ data: purchaseData, id: purchaseData.id }).unwrap()

      await Promise.all(
        invoiceLines.map(line => {
          const lineData = {
            articleNumber:
              (formData.get(`invoiceLine_articleNumber_${line.id}`) as string) ||
              line.articleNumber ||
              '',
            comment: (formData.get(`invoiceLine_comment_${line.id}`) as string) || '',
            description: (formData.get(`invoiceLine_description_${line.id}`) as string) || '',
            quantity: Number(formData.get(`invoiceLine_quantity_${line.id}`)) || line.quantity || 0,
            totalPrice:
              Number(formData.get(`invoiceLine_unitPrice_${line.id}`)) *
              Number(formData.get(`invoiceLine_quantity_${line.id}`)),
            unitPrice:
              Number(formData.get(`invoiceLine_unitPrice_${line.id}`)) || line.unitPrice || 0,
          }

          return updateInvoiceLine({
            data: lineData,
            id: line.id,
          }).unwrap()
        })
      )

      await Promise.all(
        supplierLines.map(line => {
          const lineData = {
            articleNumber:
              (formData.get(`supplierLine_articleNumber_${line.id}`) as string) ||
              line.articleNumber ||
              '',
            comment: (formData.get(`supplierLine_comment_${line.id}`) as string) || '',
            delivered: formData.get(`supplierLine_delivered_${line.id}`) === 'on',
            description: (formData.get(`supplierLine_description_${line.id}`) as string) || '',
            paymentDate: line.paymentDate ? new Date(line.paymentDate).toISOString() : '',
            quantity:
              Number(formData.get(`supplierLine_quantity_${line.id}`)) || line.quantity || 0,
            shipmentDate: line.shipmentDate ? new Date(line.shipmentDate).toISOString() : '',
            supplierId:
              Number(formData.get(`supplierLine_supplierId_${line.id}`)) || line.supplierId,
            supplierInvoice:
              (formData.get(`supplierLine_supplierInvoice_${line.id}`) as string) || '',
            totalPurchaseAmount:
              Number(formData.get(`supplierLine_totalPurchaseAmount_${line.id}`)) ||
              line.totalPurchaseAmount ||
              0,
          }

          return updateSupplierLine({
            data: lineData,
            id: line.id,
          }).unwrap()
        })
      )

      await Promise.all(
        logisticsLines.map(line => {
          const lineData = {
            amount: line.amount || 0,
            carrier: line.carrier || '',
            date: line.date || '',
            description: line.description || '',
          }

          return updateLogisticsLine({
            data: lineData,
            id: line.id,
          }).unwrap()
        })
      )

      onSave()
    } catch (error) {
      console.error('Ошибка при обновлении заказа:', error)
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
              <label className={'block text-sm font-medium'}>Загружженный в продаже PDF</label>
              {pdfUrl ? (
                <button
                  className={'text-blue-500 underline'}
                  onClick={handleFileOpen}
                  type={'button'}
                >
                  Открыть PDF
                </button>
              ) : (
                'PDF не найден'
              )}
            </div>

            <div>
              <label className={'block text-sm font-medium'}>Заказчик</label>
              <input
                className={'border p-2 w-full'}
                defaultValue={getCounterpartyName(initialValue.counterpartyId)}
                readOnly
                type={'text'}
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
              <label className={'block text-sm font-medium'}>Менеджер</label>
              <input
                className={'border p-2 w-full'}
                defaultValue={getWorkerName(initialValue.userId)}
                readOnly
                type={'text'}
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
            {invoiceLines.map(line => (
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
                    name={`invoiceLine_totalPrice_${line.id}`}
                    readOnly
                    type={'number'}
                    value={calculateTotalPrice(line.quantity, line.unitPrice)}
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

          <button
            className={'bg-green-500 ml-[200px] text-white px-4 py-2 rounded mt-4'}
            onClick={() => setIsAddingInvoiceLine(true)}
            type={'button'}
          >
            Добавить строку счета
          </button>

          <h3 className={'text-lg font-medium'}>Строки поставщика</h3>
          <div className={'space-y-2'}>
            {supplierLines.map(line => {
              const today = new Date()
              const paymentDate = new Date(line.paymentDate)
              const shipmentDate = new Date(line.shipmentDate)

              // Рассчитываем количество дней до оплаты и отгрузки
              const daysToPayment = Math.floor(
                (paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              )
              const daysToShipment = Math.floor(
                (shipmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              )

              return (
                <div className={'grid grid-cols-6 gap-4'} key={line.id}>
                  <div>
                    <label className={'block text-sm font-medium'}>№</label>
                    <input className={'border p-2 w-full'} readOnly type={'text'} value={line.id} />
                  </div>
                  <div>
                    <label className={'block text-sm font-medium'}>артикул</label>
                    <input
                      className={'border p-2 w-full'}
                      readOnly
                      type={'text'}
                      value={line.articleNumber}
                    />
                  </div>
                  <div>
                    <label className={'block text-sm font-medium'}>Поставщик</label>
                    <select
                      className={'border p-2 w-full'}
                      defaultValue={line.supplierId}
                      name={`supplierLine_supplierId_${line.id}`}
                    >
                      <option value={''}>Выберите поставщика</option>
                      {suppliers.map((supplier: any) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={'block text-sm font-medium'}>Счет поставщика</label>
                    <input
                      className={'border p-2 w-full'}
                      onChange={e => handleFileUpload(line.id, e)}
                      type={'file'}
                    />
                    {line.pdfUrl && (
                      <button
                        className={'text-blue-500 underline'}
                        onClick={() => handleFileDownload(line.pdfUrl as string)}
                        type={'button'}
                      >
                        Скачать PDF
                      </button>
                    )}
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
                    <label className={'block text-sm font-medium mt-2'}>Дней до оплаты</label>
                    <input
                      className={'border p-2 w-full'}
                      readOnly
                      type={'text'}
                      value={daysToPayment >= 0 ? `${daysToPayment} дней` : 'Срок истек'}
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
                    <label className={'block text-sm font-medium mt-2'}>Дней до отгрузки</label>
                    <input
                      className={'border p-2 w-full'}
                      readOnly
                      type={'text'}
                      value={daysToShipment >= 0 ? `${daysToShipment} дней` : 'Срок истек'}
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
              )
            })}
          </div>

          <button
            className={'bg-green-500 ml-[200px] text-white px-4 py-2 rounded mt-4'}
            onClick={() => setIsAddingSupplierLine(true)}
            type={'button'}
          >
            Добавить строку поставщика
          </button>

          <h3 className={'text-lg font-medium'}>Строки логистики</h3>
          <div className={'space-y-2'}>
            {logisticsLines.map(line => (
              <div className={'grid grid-cols-6 gap-4'} key={line.id}>
                <div>
                  <label className={'block text-sm font-medium'}>№</label>
                  <input className={'border p-2 w-full'} readOnly type={'text'} value={line.id} />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Пункт назначения</label>
                  <select
                    className={'border p-2 w-full'}
                    defaultValue={line.destination}
                    name={`logisticsLine_destination_${line.id}`}
                  >
                    <option value={''}>Выберите пункт назначения</option>
                    {Object.entries(destinationOptions).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Перевозчик</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.carrier || ''}
                    name={`logisticsLine_carrier_${line.id}`}
                    type={'text'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Дата</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.date.substring(0, 10)}
                    name={`logisticsLine_date_${line.id}`}
                    type={'date'}
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
                <div>
                  <label className={'block text-sm font-medium'}>Описание</label>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.description || ''}
                    name={`logisticsLine_description_${line.id}`}
                    type={'text'}
                  />
                </div>
                <div className={'ml-[100px]'}>
                  <label className={'block text-sm font-medium'}>Загрузить накладную</label>
                  <input
                    className={'border p-2 w-full'}
                    onChange={e => handleLogisticsFileUpload(line.id, e)}
                    type={'file'}
                  />
                </div>
                {localStorage.getItem(`logisticsPdf_${line.id}`) && (
                  <div>
                    <button
                      className={'text-blue-500 underline'}
                      onClick={() => handleLogisticsFileDownload(line.id)}
                      type={'button'}
                    >
                      Скачать накладную
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            className={'bg-green-500 ml-[200px] text-white px-4 py-2 rounded mt-4'}
            onClick={handleAllArrivedClick}
            type={'button'}
          >
            Все пришло
          </button>

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

          <div className={'mt-6'}>
            <h4 className={'text-lg font-medium'}>Расчетные данные</h4>
            <p>
              <strong>Общая логистика: </strong>
              {calculateTotalLogistics()}
            </p>
            <p>
              <strong>Общая закупка: </strong>
              {calculateTotalPurchase()}
            </p>
            <p>
              <strong>Прибыль: </strong>
              {calculateProfit()}
            </p>
          </div>

          {isAddingInvoiceLine && (
            <CreateInvoiceLineModal
              onCancel={() => setIsAddingInvoiceLine(false)}
              onSuccess={() => {
                setIsAddingInvoiceLine(false)
                onSave()
              }}
              purchaseId={initialValue.id}
            />
          )}

          {isAddingSupplierLine && (
            <CreateSupplierLineModal
              onCancel={() => setIsAddingSupplierLine(false)}
              onSuccess={() => {
                setIsAddingSupplierLine(false)
                onSave()
              }}
              purchaseId={initialValue.id}
            />
          )}
        </form>
      </div>
    </div>
  )
}

export default EditableForm
