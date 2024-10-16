import React, { useState } from 'react'

import { useCreateInvoiceLineMutation } from '@/entities/deal' // Импортируем хук

interface CreateInvoiceLineModalProps {
  onCancel: () => void
  onSuccess: (newLine: InvoiceLineDto) => void
  purchaseId: number
}

interface InvoiceLineDto {
  articleNumber: string
  comment?: string
  description: string
  quantity: number
  totalPrice: number
  unitPrice: number
}

const CreateInvoiceLineModal: React.FC<CreateInvoiceLineModalProps> = ({
  onCancel,
  onSuccess,
  purchaseId,
}) => {
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLineDto[]>([])
  const [bulkInput, setBulkInput] = useState('')
  const [linesToAdd, setLinesToAdd] = useState(1)

  const [createInvoiceLine] = useCreateInvoiceLineMutation() // Вызов хука здесь

  const handleInputChange = (
    index: number,
    field: keyof InvoiceLineDto,
    value: number | string
  ) => {
    const newLines = [...invoiceLines]

    newLines[index] = { ...newLines[index], [field]: value }
    setInvoiceLines(newLines)
  }

  const handleParseBulkInput = () => {
    const lines = bulkInput
      .trim()
      .split('\n')
      .map(line => line.split('\t'))
    const parsedLines = lines.map(([articleNumber, description, quantity, unitPrice, comment]) => ({
      articleNumber,
      comment: comment || '',
      description,
      quantity: Number(quantity),
      totalPrice: Number(quantity) * Number(unitPrice),
      unitPrice: Number(unitPrice),
    }))

    setInvoiceLines([...invoiceLines, ...parsedLines])
  }

  const handleAddMultipleLines = () => {
    const newLines = Array.from({ length: linesToAdd }, () => ({
      articleNumber: '',
      comment: '',
      description: '',
      quantity: 1,
      totalPrice: 0,
      unitPrice: 0,
    }))

    setInvoiceLines(prev => [...prev, ...newLines])
  }

  const handleSubmit = async () => {
    try {
      for (const line of invoiceLines) {
        const newLine = await createInvoiceLine({
          ...line,
          purchaseId,
        }).unwrap()

        onSuccess(newLine) // Добавляем новую строку в стейт родительского компонента
      }
      onCancel() // Закрываем модалку
    } catch (error) {
      console.error('Ошибка при создании строки счета:', error)
    }
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'}>
      <div className={'bg-white p-6 rounded shadow-lg w-[800px] max-h-[90vh] overflow-auto'}>
        <h2 className={'text-lg font-semibold mb-4'}>Создать строки счета</h2>
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
            onChange={e => setLinesToAdd(Number(e.target.value))}
            type={'number'}
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

        {invoiceLines.map((line, index) => (
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
                onChange={e => handleInputChange(index, 'quantity', Number(e.target.value))}
                type={'number'}
                value={line.quantity}
              />
            </div>
            <div>
              <label className={'block text-sm font-medium'}>Цена за единицу</label>
              <input
                className={'border p-2 w-full'}
                onChange={e => handleInputChange(index, 'unitPrice', Number(e.target.value))}
                type={'number'}
                value={line.unitPrice}
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
            onClick={handleSubmit} // Обработчик для кнопки создания
            type={'button'} // Изменил тип кнопки на обычную
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

export default CreateInvoiceLineModal
