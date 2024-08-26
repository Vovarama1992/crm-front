import React, { useState } from 'react'

import { useGetAllCounterpartiesQuery } from '@/entities/deal/deal.api'
import { useCreateSaleMutation } from '@/entities/deal/deal.api'

export type SaleFormProps = {
  dealId: number // Пропс для dealId
  onClose: () => void // Функция закрытия формы
  saleAmount: number // Пропс для saleAmount
  userId: number // Пропс для userId
}

export const SaleForm: React.FC<SaleFormProps> = ({ dealId, onClose, saleAmount, userId }) => {
  const [selectedCounterpartyId, setSelectedCounterpartyId] = useState<null | number>(null)
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [inn, setInn] = useState('') // Состояние для ИНН
  const [deliveryDeadline, setDeliveryDeadline] = useState('') // Крайняя дата поставки
  const [prepaymentAmount, setPrepaymentAmount] = useState('') // Сумма предоплаты
  const [isFinalAmount, setIsFinalAmount] = useState(false) // Финальная сумма (чекбокс)
  const [isIndependentDeal, setIsIndependentDeal] = useState(false) // Самостоятельная сделка (чекбокс)

  const { data: counterparties = [] } = useGetAllCounterpartiesQuery()
  const [createSale] = useCreateSaleMutation()

  const handleCounterpartyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value)

    setSelectedCounterpartyId(selectedId)

    const selectedCounterparty = counterparties.find((cp: any) => cp.id === selectedId)

    setInn(selectedCounterparty?.inn || '') // Автоматически заполняем ИНН
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedCounterpartyId === null) {
      alert('Выберите контрагента!')

      return
    }

    // Преобразование дат в формат ISO для DateTime
    const currentDateTime = new Date().toISOString()
    const deliveryDateTime = deliveryDeadline ? new Date(deliveryDeadline).toISOString() : null

    // Данные, которые будут отправлены с учетом новых полей
    const saleData: any = {
      counterpartyId: selectedCounterpartyId,
      date: currentDateTime, // Текущая дата и время
      dealId, // Используем переданный dealId
      invoiceNumber,
      isFinalAmount, // Финальная сумма
      isIndependentDeal, // Самостоятельная сделка
      lastDeliveryDate: deliveryDateTime, // Крайняя дата поставки в формате DateTime
      logisticsCost: 0, // Стоимость логистики
      margin: 0, // Дефолтное значение
      paidNow: 0, // Оплачено сейчас
      prepaymentAmount: parseFloat(prepaymentAmount) || 0, // Сумма предоплаты
      purchaseCost: 0, // Стоимость закупки
      saleAmount, // Используем переданный saleAmount
      userId, // Используем переданный userId
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
        <label className={'block text-sm font-bold mb-1'}>Контрагент</label>
        <select
          className={'border rounded p-2 w-full'}
          onChange={handleCounterpartyChange}
          required
          value={selectedCounterpartyId || ''}
        >
          <option disabled value={''}>
            Выберите контрагента
          </option>
          {counterparties.map((counterparty: any) => (
            <option key={counterparty.id} value={counterparty.id}>
              {counterparty.name}
            </option>
          ))}
        </select>
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>ИНН</label>
        <input className={'border rounded p-2 w-full'} readOnly type={'text'} value={inn} />
      </div>

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
        <label className={'block text-sm font-bold mb-1'}>Крайняя дата поставки</label>
        <input
          className={'border rounded p-2 w-full'}
          onChange={e => setDeliveryDeadline(e.target.value)}
          type={'date'}
          value={deliveryDeadline}
        />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Сумма предоплаты</label>
        <input
          className={'border rounded p-2 w-full'}
          onChange={e => setPrepaymentAmount(e.target.value)}
          type={'number'}
          value={prepaymentAmount}
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

      <div className={'ml-[200px] mb-4'}>
        <label className={'inline-flex items-center'}>
          <input
            checked={isIndependentDeal}
            onChange={() => setIsIndependentDeal(!isIndependentDeal)}
            type={'checkbox'}
          />
          <span className={'ml-2'}>Самостоятельная сделка</span>
        </label>
      </div>

      <button className={'bg-blue-500 ml-[300px] text-white px-4 py-2 rounded'} type={'submit'}>
        Создать продажу
      </button>
    </form>
  )
}

export default SaleForm
