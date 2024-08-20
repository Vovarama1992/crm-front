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
  const [error, setError] = useState<null | string>(null)

  const handleChange = (field: keyof SaleDto, value: number | string) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const handleSave = () => {
    const updatedFields: SaleDto = { ...formData }

    // Проверка на стадию подписания
    if (formData.signingStage && !sale.signingStage) {
      if (!formData.margin) {
        setError('Пожалуйста, заполните поле "Маржа".')

        return
      }

      updatedFields.statusSetDate = new Date().toISOString()
    }

    // Всегда обновляем существующую продажу
    updateSale({ id: sale.id, sale: updatedFields }).then(() => {
      onClose()
      window.location.reload()
    })
  }

  return (
    <div className={'flex flex-col space-y-2'}>
      {error && <div className={'text-red-500'}>{error}</div>}
      <div>
        <label>Стадия доставки:</label>
        <select
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('deliveryStage', e.target.value)}
          value={formData.deliveryStage || ''}
        >
          <option value={''}>—</option>
          <option value={'IN_STOCK'}>На складе</option>
          <option value={'ITEM_DELIVERED_FULL'}>Доставлен товар весь</option>
          <option value={'ITEM_DELIVERED_PARTIAL'}>Доставлен товар частично</option>
          <option value={'ITEM_SENT'}>Отправлен товар</option>
          <option value={'PURCHASED_FOR_ORDER'}>Закуплено под заказ</option>
          <option value={'RETURN'}>Возврат</option>
        </select>
      </div>
      <div>
        <label>Стадия подписания:</label>
        <select
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('signingStage', e.target.value)}
          value={formData.signingStage || ''}
        >
          <option value={''}>—</option>
          <option value={'SIGNED_IN_EDO'}>Подписано в ЭДО</option>
          <option value={'SIGNED_ON_PAPER'}>Подписано на бумаге</option>
        </select>
      </div>
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
        <label>Стоимость логистики:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('logisticsCost', Number(e.target.value))}
          type={'number'}
          value={formData.logisticsCost || ''}
        />
      </div>
      <div>
        <label>Закупочная стоимость:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('purchaseCost', Number(e.target.value))}
          type={'number'}
          value={formData.purchaseCost || ''}
        />
      </div>
      <div>
        <label>Стоимость продажи:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('saleAmount', Number(e.target.value))}
          type={'number'}
          value={formData.saleAmount || ''}
        />
      </div>
      <div>
        <label>Маржа:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('margin', Number(e.target.value))}
          type={'number'}
          value={formData.margin || ''}
        />
      </div>
      <button className={'mt-2 bg-blue-500 text-white p-2 rounded'} onClick={handleSave}>
        Сохранить
      </button>
    </div>
  )
}
