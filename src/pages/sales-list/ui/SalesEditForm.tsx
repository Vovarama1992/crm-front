import type { SaleDto } from '@/entities/deal/deal.types'

import React, { useState } from 'react'

import { useUpdateSaleMutation } from '@/entities/deal'

interface SalesEditFormProps {
  onClose: () => void
  sale: SaleDto
}

export const SalesEditForm: React.FC<SalesEditFormProps> = ({ onClose, sale }) => {
  const [updateSale] = useUpdateSaleMutation()
  const [formData, setFormData] = useState<SaleDto>({ ...sale })
  const [additionalAmount, setAdditionalAmount] = useState<number>(0)
  const [refundAmount, setRefundAmount] = useState<number>(0)

  const handleChange = (field: keyof SaleDto, value: number | string) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Рассчитать новое значение paidNow
    const newPaidNow = (formData.paidNow || 0) + additionalAmount - refundAmount

    // Обновить объект с новыми значениями
    const updatedFields: SaleDto = {
      ...formData,
      paidNow: newPaidNow,
    }

    // Проверка на изменение стадии подписания с null на установленное значение

    // Обновление существующей продажи в других случаях
    updateSale({ id: sale.id, sale: updatedFields }).then(() => {
      onClose()
      //window.location.reload()
    })
  }

  const handleAdditionalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionalAmount(Number(e.target.value))
  }

  const handleRefundAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRefundAmount(Number(e.target.value))
  }

  return (
    <div className={'flex flex-col space-y-2'}>
      <div>
        <label>Номер счета:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('invoiceNumber', e.target.value)}
          type={'text'}
          value={formData.invoiceNumber || ''}
        />
      </div>

      {/*<div>
        <label>Общая сумма продажи:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('saleAmount', Number(e.target.value))}
          type={'number'}
          value={formData.saleAmount || ''}
        />
      </div>*/}
      <div>
        <label>Оплачено сейчас:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          readOnly
          type={'number'}
          value={formData.paidNow || ''}
        />
      </div>
      <div>
        <label>Доплата:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={handleAdditionalAmountChange}
          type={'number'}
          value={additionalAmount}
        />
      </div>
      <div>
        <label>Возврат:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={handleRefundAmountChange}
          type={'number'}
          value={refundAmount}
        />
      </div>
      <button className={'mt-2 bg-blue-500 text-white p-2 rounded'} onClick={handleSave}>
        Сохранить
      </button>
    </div>
  )
}
