import React, { useState } from 'react'

import { useCreateSaleMutation } from '@/entities/deal/deal.api'
import { DeliveryStage, SigningStage } from '@/entities/deal/deal.types'

export type SaleFormProps = {
  counterpartyId: number
  dealId: number
  onClose: () => void
  saleAmount: number // Наследуем значение оборота из сделки
  userId: number
}

// Отображение русских версий стадий
const deliveryStageOptions = {
  [DeliveryStage.IN_STOCK]: 'На складе',
  [DeliveryStage.ITEM_DELIVERED_FULL]: 'Товар доставлен полностью',
  [DeliveryStage.ITEM_DELIVERED_PARTIAL]: 'Товар доставлен частично',
  [DeliveryStage.ITEM_SENT]: 'Товар отправлен',
  [DeliveryStage.PURCHASED_FOR_ORDER]: 'Закуплено для заказа',
  [DeliveryStage.RETURN]: 'Возврат',
}

const signingStageOptions = {
  [SigningStage.SIGNED_IN_EDO]: 'Подписано в ЭДО',
  [SigningStage.SIGNED_ON_PAPER]: 'Подписано на бумаге',
}

export const SaleForm: React.FC<SaleFormProps> = ({
  counterpartyId,
  dealId,
  onClose,
  saleAmount, // Получаем значение из сделки
  userId,
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [logisticsCost, setLogisticsCost] = useState<number | undefined>(undefined)
  const [purchaseCost, setPurchaseCost] = useState<number | undefined>(undefined)
  const [margin, setMargin] = useState<number | undefined>(undefined)
  const [deliveryStage, setDeliveryStage] = useState<DeliveryStage>(
    DeliveryStage.PURCHASED_FOR_ORDER
  )
  const [signingStage, setSigningStage] = useState<SigningStage>(SigningStage.SIGNED_IN_EDO)

  console.log('conterparty: ' + counterpartyId)
  const [createSale] = useCreateSaleMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const saleData = {
      counterpartyId,
      date: new Date().toISOString(),
      dealId,
      deliveryStage,
      invoiceNumber,
      logisticsCost,
      margin,
      purchaseCost,
      saleAmount, // Наследуемое значение оборота
      signingStage,
      userId,
    }

    try {
      await createSale(saleData).unwrap()
      alert('Продажа успешно создана!')
      onClose()
    } catch (error) {
      console.error('Error creating sale:', error)
      alert('Произошла ошибка при создании продажи.')
    }
  }

  return (
    <form className={'p-4 border rounded shadow'} onSubmit={handleSubmit}>
      <h2 className={'text-lg font-bold mb-4'}>Создание продажи</h2>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Номер счёта</label>
        <input
          className={'border rounded p-2 w-full'}
          onChange={e => setInvoiceNumber(e.target.value)}
          type={'text'}
          value={invoiceNumber}
        />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Стоимость логистики</label>
        <input
          className={'border rounded p-2 w-full'}
          onChange={e => setLogisticsCost(Number(e.target.value))}
          type={'number'}
          value={logisticsCost || ''}
        />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Стоимость закупки</label>
        <input
          className={'border rounded p-2 w-full'}
          onChange={e => setPurchaseCost(Number(e.target.value))}
          type={'number'}
          value={purchaseCost || ''}
        />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Маржа</label>
        <input
          className={'border rounded p-2 w-full'}
          onChange={e => setMargin(Number(e.target.value))}
          type={'number'}
          value={margin || ''}
        />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Стадия доставки</label>
        <select
          className={'border rounded p-2 w-full'}
          onChange={e => setDeliveryStage(e.target.value as DeliveryStage)}
          value={deliveryStage}
        >
          {Object.entries(deliveryStageOptions).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Стадия подписания</label>
        <select
          className={'border rounded p-2 w-full'}
          onChange={e => setSigningStage(e.target.value as SigningStage)}
          value={signingStage}
        >
          {Object.entries(signingStageOptions).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button className={'bg-blue-500 ml-[300px] text-white px-4 py-2 rounded'} type={'submit'}>
        Создать продажу
      </button>
    </form>
  )
}
