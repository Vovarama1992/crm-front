import type { SaleDto } from '@/entities/deal/deal.types'

import React, { useState } from 'react'

import { useCreateSaleMutation } from '@/entities/deal'

interface SalesCreateFormProps {
  onClose: () => void
  sale: Omit<SaleDto, 'id'>
}

export const SalesCreateForm: React.FC<SalesCreateFormProps> = ({ onClose, sale }) => {
  const [createSale] = useCreateSaleMutation()
  const [formData, setFormData] = useState<SaleDto>({ ...sale } as SaleDto)
  const [error, setError] = useState<null | string>(null)

  const handleChange = (field: keyof SaleDto, value: number | string) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const handleSave = () => {
    if (!formData.saleAmount) {
      setError('Пожалуйста, заполните все обязательные поля: "Стоимость продажи"')

      return
    }

    const { id, ...newFormData } = formData

    const newSale: Omit<SaleDto, 'id'> = {
      ...newFormData,
      progressed: true,
      statusSetDate: new Date().toISOString(),
    }

    createSale(newSale).then(() => {
      onClose()
      //window.location.reload()
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
      <button className={'mt-2 bg-blue-500 text-white p-2 rounded'} onClick={handleSave}>
        Создать
      </button>
    </div>
  )
}
