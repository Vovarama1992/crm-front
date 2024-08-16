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

    const saleData: any = {
      counterpartyId: selectedCounterpartyId,
      date: new Date().toISOString(),
      dealId, // Используем переданный dealId
      invoiceNumber,
      logisticsCost: 0, // Дефолтное значение
      margin: 0, // Дефолтное значение
      purchaseCost: 0, // Дефолтное значение
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

      <button className={'bg-blue-500 ml-[300px] text-white px-4 py-2 rounded'} type={'submit'}>
        Создать продажу
      </button>
    </form>
  )
}