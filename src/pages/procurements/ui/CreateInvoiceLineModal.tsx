import React, { useState } from 'react'

import { useCreateInvoiceLineMutation } from '@/entities/deal'

interface CreateInvoiceLineModalProps {
  onCancel: () => void
  onSuccess: () => void
  purchaseId: number
}

interface InvoiceLineInput {
  articleNumber: string
  comment: string
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
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLineInput[]>([
    {
      articleNumber: '',
      comment: '',
      description: '',
      quantity: 1,
      totalPrice: 0,
      unitPrice: 0,
    },
  ])

  const [createInvoiceLine] = useCreateInvoiceLineMutation()

  const [linesToAdd, setLinesToAdd] = useState(1) // Состояние для хранения количества строк

  const handleInputChange = (
    index: number,
    field: keyof InvoiceLineInput,
    value: number | string
  ) => {
    const newInvoiceLines = [...invoiceLines]

    newInvoiceLines[index] = { ...newInvoiceLines[index], [field]: value }
    setInvoiceLines(newInvoiceLines)
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

    setInvoiceLines([...invoiceLines, ...newLines])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await Promise.all(
        invoiceLines.map(async line => {
          await createInvoiceLine({
            ...line,
            purchaseId: Number(purchaseId),
          }).unwrap()
        })
      )

      onSuccess()
    } catch (error) {
      console.error('Ошибка при создании строк счета:', error)
    }
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'}>
      <div className={'bg-white p-6 rounded shadow-lg w-[800px] max-h-[90vh] overflow-auto'}>
        <h2 className={'text-lg font-semibold mb-4'}>Создать строки счета</h2>
        <form onSubmit={handleSubmit}>
          {invoiceLines.map((line, index) => (
            <div className={'grid grid-cols-2 gap-4 mb-4'} key={index}>
              <div className={'space-y-2'}>
                <div>
                  <label className={'block text-sm font-medium'}>Артикул</label>
                  <input
                    className={'border p-2 w-full'}
                    onChange={e => handleInputChange(index, 'articleNumber', e.target.value)}
                    required
                    type={'text'}
                    value={line.articleNumber}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Описание</label>
                  <input
                    className={'border p-2 w-full'}
                    onChange={e => handleInputChange(index, 'description', e.target.value)}
                    required
                    type={'text'}
                    value={line.description}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Количество</label>
                  <input
                    className={'border p-2 w-full'}
                    onChange={e => handleInputChange(index, 'quantity', Number(e.target.value))}
                    required
                    type={'number'}
                    value={line.quantity}
                  />
                </div>
              </div>
              <div className={'space-y-2'}>
                <div>
                  <label className={'block text-sm font-medium'}>Цена за единицу</label>
                  <input
                    className={'border p-2 w-full'}
                    onChange={e => handleInputChange(index, 'unitPrice', Number(e.target.value))}
                    required
                    type={'number'}
                    value={line.unitPrice}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Общая сумма</label>
                  <input
                    className={'border p-2 w-full'}
                    onChange={e => handleInputChange(index, 'totalPrice', Number(e.target.value))}
                    required
                    type={'number'}
                    value={line.totalPrice}
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
            </div>
          ))}
          <div className={'mt-4 flex justify-between'}>
            <div>
              <input
                className={'border p-2 w-20 mr-2'}
                min={1}
                onChange={e => setLinesToAdd(Number(e.target.value))}
                type={'number'}
                value={linesToAdd}
              />
              <button
                className={'bg-gray-300 text-black px-4 py-2 rounded'}
                onClick={handleAddMultipleLines}
                type={'button'}
              >
                Добавить {linesToAdd} строк(и)
              </button>
            </div>
            <div>
              <button className={'bg-blue-500 text-white px-4 py-2 rounded'} type={'submit'}>
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
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateInvoiceLineModal
