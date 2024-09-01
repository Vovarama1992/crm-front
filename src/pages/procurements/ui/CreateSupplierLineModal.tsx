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

    const parsedLines = lines.map(line => {
      const parts = line.trim().split(/\s+/)
      let articleNumber = ''
      let description = ''
      let quantity = 0
      let totalPurchaseAmount = 0
      let supplierInvoice = ''
      let comment = ''
      let numberFound = false
      let articleSkipped = false

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]

        if (!isNaN(Number(part))) {
          // Если часть - это число, назначаем количество, далее ищем сумму закупки и счет поставщика
          if (!numberFound) {
            quantity = Number(part.trim())
            numberFound = true
          } else if (totalPurchaseAmount === 0) {
            totalPurchaseAmount = Number(part.trim())
          } else if (!supplierInvoice) {
            supplierInvoice = part.trim()
          }
        } else {
          // Логика для нечисловых значений
          if (!articleSkipped && (i + 1 >= parts.length || !isNaN(Number(parts[i + 1])))) {
            // Если только одно нечисловое значение или следующее значение число, пропускаем артикул и записываем в описание
            description += part.trim() + ' '
            articleSkipped = true // Помечаем, что артикул пропущен
          } else if (!articleSkipped) {
            // Если артикул еще не назначен и он не был пропущен, назначаем его
            articleNumber = part.trim()
            articleSkipped = true
          } else if (!numberFound) {
            // Если артикул был пропущен и еще нет числового значения, продолжаем заполнять описание
            description += part.trim() + ' '
          } else {
            // Все нечисловые значения после чисел попадают в комментарий, включая ссылки
            comment += part.trim() + ' '
          }
        }
      }

      return {
        articleNumber: articleNumber.trim() || '', // Если пусто, возвращаем пустую строку
        comment: comment.trim() || '', // Если пусто, возвращаем пустую строку
        delivered: false,
        description: description.trim() || '', // Если пусто, возвращаем пустую строку
        paymentDate: new Date().toISOString(), // Устанавливаем текущую дату в формате ISO-8601
        quantity: quantity || 1, // Если quantity = 0 или null, возвращаем 1
        shipmentDate: new Date().toISOString(), // Устанавливаем текущую дату в формате ISO-8601
        supplierInvoice: supplierInvoice.trim() || '', // Если пусто, возвращаем пустую строку
        totalPurchaseAmount: totalPurchaseAmount || 0, // Если totalPurchaseAmount = 0 или null, возвращаем 0
      }
    })

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
