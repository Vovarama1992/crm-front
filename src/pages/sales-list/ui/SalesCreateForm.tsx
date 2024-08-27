import type { SaleDto } from '@/entities/deal/deal.types'

import React, { useState } from 'react'

import { useCreateSaleMutation } from '@/entities/deal'

interface SalesCreateFormProps {
  onClose: () => void
  sale: Omit<SaleDto, 'id'>
}

export const SalesCreateForm: React.FC<SalesCreateFormProps> = ({ onClose, sale }) => {
  const [createSale] = useCreateSaleMutation()
  const [isFinalAmount, setIsFinalAmount] = useState(false)
  const [formData, setFormData] = useState<SaleDto>({ ...sale } as SaleDto)
  const [error, setError] = useState<null | string>(null)

  const handleChange = (field: keyof SaleDto, value: number | string) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const saleAmount = sale.paidNow + sale.prepaymentAmount

  const handleSave = () => {
    if (!formData.saleAmount) {
      setError('Пожалуйста, заполните все обязательные поля: "Стоимость продажи"')

      return
    }

    const { id, pdfUrl, ...newFormData } = formData

    const newSale: Omit<SaleDto, 'id' | 'pdfUrl'> = {
      ...newFormData,
      isFinalAmount,
      progressed: true,
      statusSetDate: new Date().toISOString(),
    }

    createSale(newSale)
      .unwrap()
      .then(() => {
        onClose()
        if (saleAmount !== newSale.totalSaleAmount) {
          alert('Общая сумма продажи не совпадает с оплачено сейчас')
        }
      })
      .catch(error => {
        console.error('Error creating sale:', error)
        alert('Произошла ошибка при создании продажи.')
      })
  }

  return (
    <div className={'flex flex-col space-y-2'}>
      {error && <div className={'text-red-500'}>{error}</div>}
      <div>
        <label>Номер счета:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('invoiceNumber', e.target.value)}
          type={'text'}
          value={formData.invoiceNumber || ''}
        />
      </div>

      <div>
        <label>Общая сумма продажи:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('saleAmount', Number(e.target.value))}
          type={'number'}
          value={formData.saleAmount || ''}
        />
      </div>
      <div className={'ml-[200px] mb-4'}>
        <label className={'inline-flex items-center'}>
          <input
            checked={isFinalAmount}
            onChange={() => setIsFinalAmount(!isFinalAmount)}
            type={'checkbox'}
          />
          <span className={'ml-2'}>Финальная сумма</span>
        </label>
      </div>
      <button className={'mt-2 bg-blue-500 text-white p-2 rounded'} onClick={handleSave}>
        Создать
      </button>
    </div>
  )
}
