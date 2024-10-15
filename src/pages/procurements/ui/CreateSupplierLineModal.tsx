import React, { useState } from 'react'

import { useCreateSupplierLineMutation } from '@/entities/deal'
import { useGetSuppliersQuery } from '@/entities/departure/departure.api'
import { useUploadSupplierPdfMutation } from '@/entities/session'

interface CreateSupplierLineModalProps {
  onCancel: () => void
  onSuccess: (newLines: SupplierLineInput[]) => void
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
  const [bulkInput, setBulkInput] = useState('')
  const [linesToAdd, setLinesToAdd] = useState(1)
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null)
  const [selectedPaymentDate, setSelectedPaymentDate] = useState(new Date().toISOString())
  const [selectedShipmentDate, setSelectedShipmentDate] = useState(new Date().toISOString())

  const { data: suppliers, isLoading: isSuppliersLoading } = useGetSuppliersQuery()
  const [createSupplierLine] = useCreateSupplierLineMutation()
  const [uploadSupplierPdf] = useUploadSupplierPdfMutation()

  // Изменение значений в строках
  const handleInputChange = (
    index: number,
    field: keyof SupplierLineInput,
    value: boolean | number | string
  ) => {
    const newSupplierLines = [...supplierLines]

    newSupplierLines[index] = { ...newSupplierLines[index], [field]: value }
    setSupplierLines(newSupplierLines)
  }

  // Обработка текстового ввода для парсинга
  const handleBulkInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBulkInput(e.target.value)
  }

  // Парсинг строк из текстового поля
  const handleParseBulkInput = () => {
    const lines = bulkInput.trim().split('\n')
    const parsedLines = lines.reduce<SupplierLineInput[]>((acc, line) => {
      const parts = line.split('\t').map(part => part.trim())

      if (parts.length >= 4) {
        const [articleNumber, description, quantity, totalPurchaseAmount, comment = ''] = parts

        acc.push({
          articleNumber,
          comment,
          delivered: false,
          description,
          paymentDate: selectedPaymentDate,
          quantity: Number(quantity),
          shipmentDate: selectedShipmentDate,
          supplierInvoice: '',
          totalPurchaseAmount: Number(totalPurchaseAmount),
        })
      }

      return acc
    }, [])

    setSupplierLines(prev => [...prev, ...parsedLines])
  }

  // Добавление нескольких строк вручную
  const handleAddMultipleLines = () => {
    const newLines = Array.from({ length: linesToAdd }, () => ({
      articleNumber: '',
      comment: '',
      delivered: false,
      description: '',
      paymentDate: selectedPaymentDate,
      quantity: 1,
      shipmentDate: selectedShipmentDate,
      supplierInvoice: '',
      totalPurchaseAmount: 0,
    }))

    setSupplierLines(prev => [...prev, ...newLines])
  }

  // Обработка загрузки файла PDF
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    setInvoiceFile(file)
  }

  // Отправка данных на сервер
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSupplierId) {
      return alert('Пожалуйста, выберите поставщика.')
    }
    if (!invoiceFile) {
      return alert('Пожалуйста, загрузите счет.')
    }

    try {
      for (const line of supplierLines) {
        const createdLine = await createSupplierLine({
          ...line,
          purchaseId,
          supplierId: selectedSupplierId,
          supplierInvoice: '',
        }).unwrap()

        if (invoiceFile) {
          await uploadSupplierPdf({
            file: invoiceFile,
            supplierLineId: String(createdLine.id),
          }).unwrap()
        }
      }
      onSuccess(supplierLines)
    } catch (error) {
      console.error('Ошибка при создании строк поставщика и загрузке файла:', error)
    }
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'}>
      <div className={'bg-white p-4 rounded shadow-lg w-[700px] max-h-[90vh] overflow-auto'}>
        <h2 className={'text-sm font-semibold mb-2'}>Создать строки поставщика</h2>
        {isSuppliersLoading ? (
          <p>Загрузка поставщиков...</p>
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
            placeholder={'Введите строки: Артикул, Описание, Количество, Сумма, Комментарий'}
            rows={5}
            value={bulkInput}
          />
          <button
            className={'bg-gray-300 px-2 py-1 text-xs'}
            onClick={handleParseBulkInput}
            type={'button'}
          >
            Парсить строки
          </button>
          <div className={'flex mt-2'}>
            <input
              className={'border p-1 text-xs w-12 mr-2'}
              min={1}
              onChange={e => setLinesToAdd(Number(e.target.value))}
              type={'number'}
              value={linesToAdd}
            />
            <button
              className={'bg-gray-300 px-2 py-1 text-xs'}
              onClick={handleAddMultipleLines}
              type={'button'}
            >
              Добавить {linesToAdd} строк(и)
            </button>
          </div>
          <div className={'mt-4'}>
            <label className={'block text-xs'}>Загрузить счет:</label>
            <input className={'text-xs'} onChange={handleFileUpload} type={'file'} />
          </div>
          <div className={'mt-2 flex justify-between'}>
            <button className={'bg-blue-500 text-white px-2 py-1 text-xs'} type={'submit'}>
              Создать
            </button>
            <button className={'bg-gray-300 px-2 py-1 text-xs'} onClick={onCancel} type={'button'}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateSupplierLineModal
