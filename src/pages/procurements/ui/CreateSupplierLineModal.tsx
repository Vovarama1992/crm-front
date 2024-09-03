/* eslint-disable max-lines */
import React, { useState } from 'react'

import { useCreateSupplierLineMutation } from '@/entities/deal'
import { useGetSuppliersQuery } from '@/entities/departure/departure.api'

interface CreateSupplierLineModalProps {
  onCancel: () => void
  onSuccess: () => void
  purchaseId: number
}

interface SupplierLineInput {
  articleNumber: string
  comment: string
  delivered: boolean
  description: string
  paymentDate: string
  quantity: number
  shipmentDate: string
  supplierInvoice: string
  totalPurchaseAmount: number
}

const CreateSupplierLineModal: React.FC<CreateSupplierLineModalProps> = ({
  onCancel,
  onSuccess,
  purchaseId,
}) => {
  const [supplierLines, setSupplierLines] = useState<SupplierLineInput[]>([])

  const [selectedSupplierId, setSelectedSupplierId] = useState<null | number>(null)
  const [bulkInput, setBulkInput] = useState('') // Состояние для текстового ввода

  const { data: suppliers, isLoading: isSuppliersLoading } = useGetSuppliersQuery()
  const [createSupplierLine] = useCreateSupplierLineMutation()

  const handleBulkInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBulkInput(e.target.value)
  }

  const handleParseBulkInput = () => {
    const lines = bulkInput.trim().split('\n')

    const parsedLines = lines
      .map(line => {
        const parts = line.split('\t') // Разделение по табуляции (копирование из Excel)

        if (parts.length < 6) {
          return null // Пропуск строк, где меньше 6 столбцов
        }

        const [
          articleNumber,
          description,
          quantity,
          totalPurchaseAmount,
          supplierInvoice,
          comment,
        ] = parts

        return {
          articleNumber: articleNumber.trim(),
          comment: comment.trim(),
          delivered: false,
          description: description.trim(),
          paymentDate: new Date().toISOString(), // Устанавливаем текущую дату в формате ISO-8601
          quantity: Number(quantity.trim()),
          shipmentDate: new Date().toISOString(), // Устанавливаем текущую дату в формате ISO-8601
          supplierInvoice: supplierInvoice.trim(),
          totalPurchaseAmount: Number(totalPurchaseAmount.trim()),
        }
      })
      .filter(item => item !== null) as SupplierLineInput[]

    setSupplierLines(parsedLines) // Устанавливаем только распарсенные строки
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSupplierId) {
      alert('Пожалуйста, выберите поставщика.')

      return
    }

    try {
      await Promise.all(
        supplierLines.map(async line => {
          await createSupplierLine({
            ...line,
            purchaseId: Number(purchaseId),
            supplierId: selectedSupplierId, // Передаем выбранный supplierId
          }).unwrap()
        })
      )

      onSuccess()
    } catch (error) {
      console.error('Ошибка при создании строк поставщика:', error)
    }
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'}>
      <div className={'bg-white p-6 rounded shadow-lg w-[800px] max-h-[90vh] overflow-auto'}>
        <h2 className={'text-lg font-semibold mb-4'}>Создать строки поставщика</h2>
        {isSuppliersLoading ? (
          <p>Загрузка поставщиков...</p>
        ) : (
          <div className={'mb-4'}>
            <label className={'block text-sm font-medium'}>Выберите поставщика:</label>
            <select
              className={'border p-2 w-full'}
              onChange={e => setSelectedSupplierId(Number(e.target.value))}
              value={selectedSupplierId ?? ''}
            >
              <option disabled value={''}>
                Выберите поставщика
              </option>
              {suppliers?.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <textarea
            className={'border p-2 w-full mb-4'}
            onChange={handleBulkInputChange}
            placeholder={
              'Введите строки в формате: Артикул, Описание, Количество, Общая сумма закупки, Счет поставщика, Комментарий'
            }
            rows={10}
            value={bulkInput}
          />
          <button
            className={'bg-gray-300 text-black px-4 py-2 rounded mb-4'}
            onClick={handleParseBulkInput}
            type={'button'}
          >
            Парсить строки
          </button>
          {supplierLines.map((line, index) => (
            <div className={'grid grid-cols-2 gap-4 mb-4'} key={index}>
              <div className={'space-y-2'}>
                <div>
                  <label className={'block text-sm font-medium'}>Артикул</label>
                  <input
                    className={'border p-2 w-full'}
                    readOnly
                    type={'text'}
                    value={line.articleNumber}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Описание</label>
                  <input
                    className={'border p-2 w-full'}
                    readOnly
                    type={'text'}
                    value={line.description}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Количество</label>
                  <input
                    className={'border p-2 w-full'}
                    readOnly
                    type={'number'}
                    value={line.quantity}
                  />
                </div>
              </div>
              <div className={'space-y-2'}>
                <div>
                  <label className={'block text-sm font-medium'}>Счет поставщика</label>
                  <input
                    className={'border p-2 w-full'}
                    readOnly
                    type={'text'}
                    value={line.supplierInvoice}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Сумма закупки</label>
                  <input
                    className={'border p-2 w-full'}
                    readOnly
                    type={'number'}
                    value={line.totalPurchaseAmount}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Дата оплаты</label>
                  <input
                    className={'border p-2 w-full'}
                    readOnly
                    type={'date'}
                    value={line.paymentDate.substring(0, 10)}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Дата отгрузки</label>
                  <input
                    className={'border p-2 w-full'}
                    readOnly
                    type={'date'}
                    value={line.shipmentDate.substring(0, 10)}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Доставлено</label>
                  <input
                    checked={line.delivered}
                    className={'border p-2'}
                    readOnly
                    type={'checkbox'}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Комментарий</label>
                  <textarea className={'border p-2 w-full'} readOnly value={line.comment} />
                </div>
              </div>
            </div>
          ))}
          <div className={'mt-4 flex justify-between'}>
            <button
              className={'bg-blue-500 text-white px-4 py-2 rounded'}
              onClick={e => {
                e.preventDefault()
                handleSubmit(e)
              }}
              type={'submit'}
            >
              Создать
            </button>
            <button
              className={'bg-gray-300 text-black px-4 py-2 rounded ml-2'}
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

export default CreateSupplierLineModal
