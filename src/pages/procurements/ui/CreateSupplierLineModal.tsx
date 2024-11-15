import React, { useState } from 'react'

import { useCreateSupplierLineMutation, useUpdateSupplierLineMutation } from '@/entities/deal'
import { SupplierLineDto } from '@/entities/deal/deal.types'
import { useGetSuppliersQuery } from '@/entities/departure/departure.api'
import { useUploadSupplierPdfMutation } from '@/entities/session'

interface CreateSupplierLineModalProps {
  onCancel: () => void
  onSuccess: (newLines: SupplierLineDto[]) => void // Изменяем на массив
  purchaseId: number
}

const apiUrl = import.meta.env.VITE_APP_API_URL || 'https://oldkns.webtm.ru/api'

const CreateSupplierLineModal: React.FC<CreateSupplierLineModalProps> = ({
  onCancel,
  onSuccess,
  purchaseId,
}) => {
  const [supplierLines, setSupplierLines] = useState<any>([])
  const [selectedSupplierId, setSelectedSupplierId] = useState<null | number>(null)
  const [bulkInput, setBulkInput] = useState('')
  const [linesToAdd, setLinesToAdd] = useState('1')
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [shipmentDate, setShipmentDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [updateSupplierLine] = useUpdateSupplierLineMutation()
  const [uploadPdf] = useUploadSupplierPdfMutation()

  console.log('apiurk: ' + apiUrl)

  const { data: suppliers, isLoading: isSuppliersLoading } = useGetSuppliersQuery()
  const [createSupplierLine] = useCreateSupplierLineMutation()

  const handleInputChange = (
    index: number,
    field: keyof SupplierLineDto,
    value: boolean | number | string
  ) => {
    const newSupplierLines = [...supplierLines]

    newSupplierLines[index] = { ...newSupplierLines[index], [field]: value }
    setSupplierLines(newSupplierLines)
  }

  const handleParseBulkInput = () => {
    const lines = bulkInput.trim().split('\n')
    const parsedLines = lines.reduce<any>((acc, line) => {
      const parts = line.split('\t').map(part => part.trim())

      if (parts.length >= 4) {
        const [articleNumber, description, quantity, totalPurchaseAmount, comment = ''] = parts

        acc.push({
          articleNumber,
          comment,
          delivered: false,
          description,
          paymentDate: new Date().toISOString(), // Значение по умолчанию
          quantity: Number(quantity),
          shipmentDate: new Date().toISOString(), // Значение по умолчанию
          supplierInvoice: '',
          totalPurchaseAmount: Number(totalPurchaseAmount),
        })
      }

      return acc
    }, [])

    setSupplierLines((prev: any) => [...prev, ...parsedLines])
  }

  const handleAddMultipleLines = () => {
    const newLines = Array.from({ length: Number(linesToAdd) }, () => ({
      articleNumber: '',
      comment: '',
      delivered: false,
      description: '',
      paymentDate: new Date().toISOString(), // Значение по умолчанию
      quantity: 1,
      shipmentDate: new Date().toISOString(), // Значение по умолчанию
      supplierInvoice: '',
      totalPurchaseAmount: 0,
    }))

    setSupplierLines((prev: any) => [...prev, ...newLines])
  }

  const handleSubmit = async () => {
    if (!selectedSupplierId) {
      return alert('Пожалуйста, выберите поставщика.')
    }

    const createdLines: SupplierLineDto[] = [] // Массив для хранения созданных строк

    try {
      for (const line of supplierLines) {
        const newLine = await createSupplierLine({
          ...line,
          paymentDate: new Date(paymentDate).toISOString(), // Преобразование даты оплаты в ISO
          purchaseId,
          quantity: Number(line.quantity),
          shipmentDate: new Date(shipmentDate).toISOString(),
          supplierId: selectedSupplierId, // Добавляем supplierId
          supplierInvoice: '',
          totalPurchaseAmount: Number(line.totalPurchaseAmount),
        }).unwrap()

        createdLines.push(newLine) // Добавляем созданную строку в массив

        // Отправка файла на бэкенд
        if (pdfFile) {
          const formData = new FormData()

          formData.append('file', pdfFile)

          await uploadPdf({
            file: pdfFile,
            supplierLineId: String(newLine.id), // Используем ID созданной строки
          }).unwrap()
        }

        await updateSupplierLine({
          data: {
            pdfUrl: `${apiUrl}/files/download/supplier-pdf/supplier_${newLine.id}.pdf`,
          },
          id: newLine.id,
        }).unwrap()
      }
      onSuccess(createdLines) // Возвращаем массив созданных строк
      onCancel() // Закрываем модалку
    } catch (error) {
      console.error('Ошибка при создании строки поставщика:', error)
    }
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'}>
      <div className={'bg-white p-6 rounded shadow-lg w-[800px] max-h-[90vh] overflow-auto'}>
        <h2 className={'text-lg font-semibold mb-4'}>Создать строки поставщика</h2>

        {isSuppliersLoading ? (
          <p>Загрузка поставщиков...</p>
        ) : (
          <>
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
            <div className={'mb-4'}>
              <label className={'block text-sm font-medium'}>Дата оплаты:</label>
              <input
                className={'border p-2 w-full'}
                onChange={e => setPaymentDate(e.target.value)}
                type={'date'}
                value={paymentDate}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-medium'}>Дата доставки:</label>
              <input
                className={'border p-2 w-full'}
                onChange={e => setShipmentDate(e.target.value)}
                type={'date'}
                value={shipmentDate}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-medium'}>Загрузите файл:</label>
              <input
                className={'border p-2 w-full'}
                onChange={e => {
                  const file = e.target.files?.[0]

                  if (file) {
                    if (file.type !== 'application/pdf') {
                      alert('Пожалуйста, загрузите файл в формате PDF.')

                      return
                    }
                    setPdfFile(file)
                  }
                }}
                type={'file'}
              />
            </div>
          </>
        )}

        <textarea
          className={'border p-2 w-full mb-4'}
          onChange={e => setBulkInput(e.target.value)}
          placeholder={'Введите строки'}
          rows={5}
          value={bulkInput}
        />
        <button
          className={'bg-gray-300 px-4 py-2 rounded mb-4'}
          onClick={handleParseBulkInput}
          type={'button'}
        >
          Парсить строки
        </button>

        <div className={'mb-4'}>
          <input
            className={'border p-2 w-20 mr-2'}
            min={1}
            onChange={e => setLinesToAdd(e.target.value)}
            type={'text'}
            value={linesToAdd}
          />
          <button
            className={'bg-gray-300 px-4 py-2 rounded'}
            onClick={handleAddMultipleLines}
            type={'button'}
          >
            Добавить {linesToAdd} строк(и)
          </button>
        </div>

        {supplierLines.map((line: any, index: any) => (
          <div className={'grid grid-cols-2 gap-4 mb-4'} key={index}>
            <div>
              <label className={'block text-sm font-medium'}>Артикул</label>
              <input
                className={'border p-2 w-full'}
                onChange={e => handleInputChange(index, 'articleNumber', e.target.value)}
                value={line.articleNumber}
              />
            </div>
            <div>
              <label className={'block text-sm font-medium'}>Описание</label>
              <input
                className={'border p-2 w-full'}
                onChange={e => handleInputChange(index, 'description', e.target.value)}
                value={line.description}
              />
            </div>
            <div>
              <label className={'block text-sm font-medium'}>Количество</label>
              <input
                className={'border p-2 w-full'}
                onChange={e => handleInputChange(index, 'quantity', e.target.value)}
                type={'text'}
                value={line.quantity}
              />
            </div>
            <div>
              <label className={'block text-sm font-medium'}>Сумма</label>
              <input
                className={'border p-2 w-full'}
                onChange={e => handleInputChange(index, 'totalPurchaseAmount', e.target.value)}
                type={'text'}
                value={line.totalPurchaseAmount}
              />
            </div>
            <div>
              <label className={'block text-sm font-medium'}>Комментарий</label>
              <textarea
                className={'border p-2 w-full'}
                onChange={e => handleInputChange(index, 'comment', e.target.value)}
                value={line.comment}
              />
            </div>
          </div>
        ))}

        <div className={'mt-4 flex justify-between'}>
          <button
            className={'bg-blue-500 text-white px-4 py-2 rounded'}
            onClick={handleSubmit}
            type={'button'}
          >
            Создать
          </button>
          <button className={'bg-gray-300 px-4 py-2 rounded'} onClick={onCancel} type={'button'}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateSupplierLineModal
