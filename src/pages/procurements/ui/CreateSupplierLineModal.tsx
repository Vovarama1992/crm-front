import React, { useState } from 'react'

import { useCreateSupplierLineMutation } from '@/entities/deal'

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
  //supplierId: number
  supplierInvoice: string
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
      paymentDate: '',
      quantity: 1,
      shipmentDate: '',
      //supplierId: 0,
      supplierInvoice: '',
      totalPurchaseAmount: 0,
    },
  ])

  const [createSupplierLine] = useCreateSupplierLineMutation()

  const handleInputChange = (
    index: number,
    field: keyof SupplierLineInput,
    value: boolean | number | string
  ) => {
    const newSupplierLines = [...supplierLines]

    newSupplierLines[index] = { ...newSupplierLines[index], [field]: value }
    setSupplierLines(newSupplierLines)
  }

  const handleAddLine = () => {
    setSupplierLines([
      ...supplierLines,
      {
        articleNumber: '',
        comment: '',
        delivered: false,
        description: '',
        paymentDate: '',
        quantity: 1,
        shipmentDate: '',
        //supplierId: 0,
        supplierInvoice: '',
        totalPurchaseAmount: 0,
      },
    ])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await Promise.all(
        supplierLines.map(async line => {
          const paymentDateISO = line.paymentDate ? new Date(line.paymentDate).toISOString() : ''
          const shipmentDateISO = line.shipmentDate ? new Date(line.shipmentDate).toISOString() : ''

          await createSupplierLine({
            ...line,
            paymentDate: paymentDateISO,
            purchaseId: Number(purchaseId),
            shipmentDate: shipmentDateISO,
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
        <form onSubmit={handleSubmit}>
          {supplierLines.map((line, index) => (
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
                  <label className={'block text-sm font-medium'}>Счет поставщика</label>
                  <input
                    className={'border p-2 w-full'}
                    onChange={e => handleInputChange(index, 'supplierInvoice', e.target.value)}
                    required
                    type={'text'}
                    value={line.supplierInvoice}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Сумма закупки</label>
                  <input
                    className={'border p-2 w-full'}
                    onChange={e =>
                      handleInputChange(index, 'totalPurchaseAmount', Number(e.target.value))
                    }
                    required
                    type={'number'}
                    value={line.totalPurchaseAmount}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Дата оплаты</label>
                  <input
                    className={'border p-2 w-full'}
                    onChange={e => handleInputChange(index, 'paymentDate', e.target.value)}
                    required
                    type={'date'}
                    value={line.paymentDate}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Дата отгрузки</label>
                  <input
                    className={'border p-2 w-full'}
                    onChange={e => handleInputChange(index, 'shipmentDate', e.target.value)}
                    required
                    type={'date'}
                    value={line.shipmentDate}
                  />
                </div>
                <div>
                  <label className={'block text-sm font-medium'}>Доставлено</label>
                  <input
                    checked={line.delivered}
                    className={'border p-2'}
                    onChange={e => handleInputChange(index, 'delivered', e.target.checked)}
                    type={'checkbox'}
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
            <button
              className={'bg-gray-300 text-black px-4 py-2 rounded'}
              onClick={handleAddLine}
              type={'button'}
            >
              Добавить строку
            </button>
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

export default CreateSupplierLineModal
