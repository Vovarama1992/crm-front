import React, { useState } from 'react'

import { useGetAllCounterpartiesQuery } from '@/entities/deal'
import { useGetAllSalesQuery } from '@/entities/deal'
import { PurchaseDto } from '@/entities/deal/deal.types'

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
  const [totalInvoice, setTotalInvoice] = useState<number>(0) // Сумма из InvoiceLines
  const [totalSupplier, setTotalSupplier] = useState<number>(0) // Сумма из SupplierLines
  const [totalLogistics, setTotalLogistics] = useState<number>(0) // Сумма из LogisticsLines
  const { data: counters } = useGetAllCounterpartiesQuery()

  console.log(totalInvoice)
  const { data: salesData } = useGetAllSalesQuery()

  function findTotalAmount(id: number) {
    const sale = salesData?.find((sale: any) => sale.id === id)

    return sale?.totalSaleAmount || 0
  }

  function findName(id: number) {
    const counter = counters?.find(counter => counter.id === id)

    return counter ? counter.name : undefined
  }

  // Рассчитываем прибыль/маржу/итого
  const totalProfit = findTotalAmount(initialValue.id) - totalSupplier - totalLogistics

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
                defaultValue={initialValue.requestNumber}
                name={'requestNumber'}
                type={'text'}
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
              <label className={'block text-sm font-medium'}>Контрагент</label>
              <input
                className={'border p-2 w-full'}
                defaultValue={findName(initialValue.counterpartyId)}
                readOnly
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
          </div>

          {/* Подключаем дочерние компоненты и передаём функции для подъёма значений */}
          <InvoiceLines onTotalChange={setTotalInvoice} purchaseId={initialValue.id} />
          <SupplierLines onTotalChange={setTotalSupplier} purchaseId={initialValue.id} />
          <LogisticsLines onTotalChange={setTotalLogistics} purchaseId={initialValue.id} />

          {/* Отображаем итоговые суммы */}
          <div className={'mt-4'}>
            <strong>Закупка общая: {totalSupplier}</strong>
          </div>
          <div className={'mt-4'}>
            <strong>Логистика общая: {totalLogistics}</strong>
          </div>
          <div className={'mt-4'}>
            <strong>ПРИБЫЛЬ/МАРЖА/ИТОГО: {totalProfit}</strong>
          </div>

          <div className={'flex justify-end space-x-4 mt-4'}>
            <button
              className={'bg-gray-300 px-4 py-2 rounded'}
              onClick={onCancel}
              type={'button'} // Указываем, что это не сабмитовая кнопка
            >
              Отмена
            </button>
            <button
              className={'bg-blue-500 text-white px-4 py-2 rounded'}
              onClick={onSave} // Вызываем onSave напрямую
              type={'button'} // Указываем, что это не сабмитовая кнопка
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
