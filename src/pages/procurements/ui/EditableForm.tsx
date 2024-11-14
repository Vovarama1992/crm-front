import React, { useState } from 'react'

import { useGetAllCounterpartiesQuery } from '@/entities/deal'
import { useGetAllSalesQuery } from '@/entities/deal'
import { PurchaseDto } from '@/entities/deal/deal.types'
import { useCreateNotificationMutation } from '@/entities/notifications'
import { useMeQuery } from '@/entities/session'
import { useGetWorkersQuery } from '@/entities/workers'
import { formatCurrency } from '@/pages/kopeechnik'

import InvoiceLines from './InvoiceLines'
import LogisticsLines from './LogisticsLines'
import SupplierLines from './SupplierLines'

interface EditableFormProps {
  initialValue: PurchaseDto
  onCancel: () => void
  onSave: () => void
  pdfUrl: null | string
}

const EditableForm: React.FC<EditableFormProps> = ({ initialValue, onCancel, onSave, pdfUrl }) => {
  const [totalInvoice, setTotalInvoice] = useState<number>(0)
  const [totalSupplier, setTotalSupplier] = useState<number>(0)
  const [totalLogistics, setTotalLogistics] = useState<number>(0)
  const { data: counters } = useGetAllCounterpartiesQuery()
  const { data: workers } = useGetWorkersQuery()
  const { data: salesData } = useGetAllSalesQuery()
  const { data: meData } = useMeQuery()
  const [createNotification] = useCreateNotificationMutation()

  console.log(totalInvoice)
  function findTotalAmount(id: number) {
    const sale = salesData?.find((sale: any) => sale.id === id)

    return sale?.totalSaleAmount || 0
  }

  function findName(id: number) {
    const worker = workers?.find(worker => worker.id === id)

    return worker ? worker.name + ' ' + worker.surname : undefined
  }

  function findCounter(id: number) {
    const counter = counters?.find(counter => counter.id === id)

    return counter ? counter.name : undefined
  }

  const totalProfit = findTotalAmount(initialValue.id) - totalSupplier - totalLogistics

  const handleAllArrived = async () => {
    try {
      const notificationContent = `Дата: ${new Date().toLocaleDateString()}, Номер сделки: ${initialValue.requestNumber}, Заказчик: ${findName(initialValue.counterpartyId)}, Всё поступило на склад.`

      await createNotification({
        content: notificationContent,
        createdBy: meData?.id || 1,
        seenBy: [],
        title: 'Все поступило на склад',
      }).unwrap()

      alert('Уведомление создано')
    } catch (error) {
      alert('Не удалось создать уведомление')
    }
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'}>
      <div className={'bg-white p-6 rounded shadow-lg max-h-[90vh] overflow-auto w-[90vw]'}>
        <form className={'space-y-4'} onSubmit={e => e.preventDefault()}>
          <h3 className={'text-lg font-medium'}>Основная информация</h3>

          <div className={'grid grid-cols-2 gap-4'}>
            <div>
              <label className={'block text-sm font-medium'}>Номер запроса</label>
              <input
                className={'border p-2 w-full'}
                defaultValue={initialValue.invoiceToCustomer}
                name={'invoiceToCustomer'}
                type={'number'}
              />
            </div>

            <div>
              <label className={'block text-sm font-medium'}>PDF</label>
              {pdfUrl ? (
                <a
                  className={'text-blue-500'}
                  href={pdfUrl}
                  rel={'noopener noreferrer'}
                  target={'_blank'}
                >
                  Открыть PDF
                </a>
              ) : (
                'PDF не найден'
              )}
            </div>

            <div>
              <label className={'block text-sm font-medium'}>Заказчик</label>
              <input
                className={'border p-2 w-full'}
                defaultValue={findCounter(initialValue.counterpartyId)}
                readOnly
              />
            </div>

            <div>
              <label className={'block text-sm font-medium'}>Счет заказчику</label>
              <input
                className={'border p-2 w-full'}
                defaultValue={initialValue.requestNumber}
                name={'requestNumber'}
                type={'text'}
              />
            </div>

            <div>
              <label className={'block text-sm font-medium'}>Менеджер</label>
              <input
                className={'border p-2 w-full'}
                defaultValue={findName(initialValue.userId)}
                readOnly
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

          <InvoiceLines onTotalChange={setTotalInvoice} purchaseId={initialValue.id} />
          <SupplierLines onTotalChange={setTotalSupplier} purchaseId={initialValue.id} />
          <LogisticsLines onTotalChange={setTotalLogistics} purchaseId={initialValue.id} />

          <div className={'flex justify-between items-center mt-4'}>
            <div>
              <div className={'mt-4'}>
                <strong>Сумма продажи: {formatCurrency(findTotalAmount(initialValue.id))}</strong>
              </div>
              <div className={'mt-4'}>
                <strong>Закупка общая: {formatCurrency(totalSupplier)}</strong>
              </div>
              <div className={'mt-4'}>
                <strong>Логистика общая: {formatCurrency(totalLogistics)}</strong>
              </div>
              <div className={'mt-4'}>
                <strong>МАРЖА: {formatCurrency(totalProfit)}</strong>
              </div>
            </div>

            <button
              className={'bg-green-500 text-white px-4 py-2 rounded'}
              onClick={handleAllArrived}
              type={'button'}
            >
              Все пришло
            </button>
          </div>

          <div className={'flex justify-end space-x-4 mt-4'}>
            <button className={'bg-gray-300 px-4 py-2 rounded'} onClick={onCancel} type={'button'}>
              Отмена
            </button>
            <button
              className={'bg-blue-500 text-white px-4 py-2 rounded'}
              onClick={onSave}
              type={'button'}
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditableForm
