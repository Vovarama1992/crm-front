/* eslint-disable max-lines */
import React, { useState } from 'react'

import { useCreateSupplierLineMutation } from '@/entities/deal'
import { useGetSuppliersQuery } from '@/entities/departure/departure.api'
import { useUploadSupplierPdfMutation } from '@/entities/session' // Импортируем нужный хук

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
  supplierInvoice: string // Поле для имени файла счета поставщика
  totalPurchaseAmount: number
}

const CreateSupplierLineModal: React.FC<CreateSupplierLineModalProps> = ({
  onCancel,
  onSuccess,
  purchaseId,
}) => {
  const [supplierLines, setSupplierLines] = useState<SupplierLineInput[]>([
    {
      articleNumber: '',
      comment: '',
      delivered: false,
      description: '',
      paymentDate: new Date().toISOString(),
      quantity: 1,
      shipmentDate: new Date().toISOString(),
      supplierInvoice: '', // Начальное пустое значение
      totalPurchaseAmount: 0,
    },
  ]) // Начальные данные с пустой строкой

  const [selectedSupplierId, setSelectedSupplierId] = useState<null | number>(null)
  const [bulkInput, setBulkInput] = useState('') // Состояние для текстового ввода
  const [linesToAdd, setLinesToAdd] = useState(1) // Состояние для количества строк
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null) // Один файл для всех строк

  const { data: suppliers, isLoading: isSuppliersLoading } = useGetSuppliersQuery()
  const [createSupplierLine] = useCreateSupplierLineMutation()
  const [uploadSupplierPdf] = useUploadSupplierPdfMutation() // Используем хук для загрузки файла

  // Обработка изменения полей ввода вручную
  const handleInputChange = (
    index: number,
    field: keyof SupplierLineInput,
    value: boolean | number | string
  ) => {
    const newSupplierLines = [...supplierLines]

    newSupplierLines[index] = { ...newSupplierLines[index], [field]: value }
    setSupplierLines(newSupplierLines)
  }

  // Обработка изменения текстового ввода для парсера
  const handleBulkInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBulkInput(e.target.value)
  }

  // Парсинг строк из текстового ввода
  const handleParseBulkInput = () => {
    const lines = bulkInput.trim().split('\n')

    const parsedLines = lines
      .map(line => {
        const parts = line.split('\t') // Разделение по табуляции (копирование из Excel)

        if (parts.length < 5) {
          return null // Пропуск строк, где меньше 5 столбцов
        }

        const [articleNumber, description, quantity, totalPurchaseAmount, comment] = parts

        return {
          articleNumber: articleNumber.trim(),
          comment: comment.trim(),
          delivered: false,
          description: description.trim(),
          paymentDate: new Date().toISOString(),
          quantity: Number(quantity.trim()),
          shipmentDate: new Date().toISOString(),
          supplierInvoice: '', // Пока пустое, файл будет загружен позже
          totalPurchaseAmount: Number(totalPurchaseAmount.trim()),
        }
      })
      .filter(item => item !== null) as SupplierLineInput[]

    setSupplierLines([...supplierLines, ...parsedLines]) // Добавляем распарсенные строки к существующим
  }

  // Добавление нескольких строк вручную
  const handleAddMultipleLines = () => {
    const newLines = Array.from({ length: linesToAdd }, () => ({
      articleNumber: '',
      comment: '',
      delivered: false,
      description: '',
      paymentDate: new Date().toISOString(),
      quantity: 1,
      shipmentDate: new Date().toISOString(),
      supplierInvoice: '', // Пустое поле для файла счета
      totalPurchaseAmount: 0,
    }))

    setSupplierLines([...supplierLines, ...newLines])
  }

  // Обработка загрузки одного файла для всех строк
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      setInvoiceFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSupplierId) {
      alert('Пожалуйста, выберите поставщика.')

      return
    }

    if (!invoiceFile) {
      alert('Пожалуйста, загрузите счет.')

      return
    }

    try {
      // Шаг 1: Создаем строки поставщика и загружаем файл для каждой строки сразу после её создания
      await Promise.all(
        supplierLines.map(async line => {
          // Создаем строку
          const createdLine = await createSupplierLine({
            ...line,
            purchaseId: Number(purchaseId),
            supplierId: selectedSupplierId,
            supplierInvoice: '', // Пустое значение для PDF
          }).unwrap()

          // После создания строки получаем её уникальный ID и загружаем файл
          if (invoiceFile) {
            await uploadSupplierPdf({
              file: invoiceFile,
              supplierLineId: String(createdLine.id), // Используем уникальный ID созданной строки
            }).unwrap()
          }
        })
      )

      onSuccess() // Уведомляем о успешной операции
    } catch (error) {
      console.error('Ошибка при создании строк поставщика и загрузке файлов:', error)
    }
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'}>
      <div className={'bg-white p-4 rounded shadow-lg w-[700px] max-h-[90vh] overflow-auto'}>
        <h2 className={'text-sm font-semibold mb-2'}>Создать строки поставщика</h2>
        {isSuppliersLoading ? (
          <p className={'text-sm'}>Загрузка поставщиков...</p>
        ) : (
          <div className={'mb-2'}>
            <label className={'block text-xs font-medium'}>Выберите поставщика:</label>
            <select
              className={'border p-1 w-full text-xs'}
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
            className={'border p-1 w-full mb-2 text-xs'}
            onChange={handleBulkInputChange}
            placeholder={
              'Введите строки в формате: Артикул, Описание, Количество, Общая сумма закупки, Комментарий'
            }
            rows={5}
            value={bulkInput}
          />
          <button
            className={'bg-gray-300 text-black px-2 py-1 rounded mb-2 text-xs'}
            onClick={handleParseBulkInput}
            type={'button'}
          >
            Парсить строки
          </button>
          <div className={'mb-2 flex items-center'}>
            <input
              className={'border p-1 w-12 text-xs mr-2'}
              min={1}
              onChange={e => setLinesToAdd(Number(e.target.value))}
              type={'number'}
              value={linesToAdd}
            />
            <button
              className={'bg-gray-300 text-black px-2 py-1 rounded text-xs'}
              onClick={handleAddMultipleLines}
              type={'button'}
            >
              Добавить {linesToAdd} строк(и)
            </button>
          </div>

          <div className={'mb-4'}>
            <label className={'block text-xs font-medium'}>Загрузить счет для всех строк:</label>
            <input
              className={'border p-1 w-full text-xs'}
              onChange={handleFileUpload}
              type={'file'}
            />
          </div>

          {supplierLines.map((line, index) => (
            <div className={'grid grid-cols-2 gap-2 mb-2'} key={index}>
              <div className={'space-y-1'}>
                <div>
                  <label className={'block text-xs font-medium'}>Артикул</label>
                  <input
                    className={'border p-1 w-full text-xs'}
                    onChange={e => handleInputChange(index, 'articleNumber', e.target.value)}
                    type={'text'}
                    value={line.articleNumber}
                  />
                </div>
                <div>
                  <label className={'block text-xs font-medium'}>Описание</label>
                  <input
                    className={'border p-1 w-full text-xs'}
                    onChange={e => handleInputChange(index, 'description', e.target.value)}
                    type={'text'}
                    value={line.description}
                  />
                </div>
                <div>
                  <label className={'block text-xs font-medium'}>Количество</label>
                  <input
                    className={'border p-1 w-full text-xs'}
                    onChange={e => handleInputChange(index, 'quantity', Number(e.target.value))}
                    type={'number'}
                  />
                </div>
              </div>
              <div className={'space-y-1'}>
                <div>
                  <label className={'block text-xs font-medium'}>Сумма закупки</label>
                  <input
                    className={'border p-1 w-full text-xs'}
                    onChange={e =>
                      handleInputChange(index, 'totalPurchaseAmount', Number(e.target.value))
                    }
                    type={'number'}
                    value={line.totalPurchaseAmount}
                  />
                </div>
                <div>
                  <label className={'block text-xs font-medium'}>Дата оплаты</label>
                  <input
                    className={'border p-1 w-full text-xs'}
                    onChange={e => handleInputChange(index, 'paymentDate', e.target.value)}
                    type={'date'}
                    value={line.paymentDate.substring(0, 10)}
                  />
                </div>
                <div>
                  <label className={'block text-xs font-medium'}>Дата отгрузки</label>
                  <input
                    className={'border p-1 w-full text-xs'}
                    onChange={e => handleInputChange(index, 'shipmentDate', e.target.value)}
                    type={'date'}
                    value={line.shipmentDate.substring(0, 10)}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className={'mt-2 flex justify-between'}>
            <button
              className={'bg-blue-500 ml-[150px] text-white px-2 py-1 rounded text-xs'}
              onClick={e => {
                e.preventDefault()
                handleSubmit(e)
              }}
              type={'submit'}
            >
              Создать
            </button>
            <button
              className={'bg-gray-300 text-black px-2 py-1 rounded ml-2 text-xs'}
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
