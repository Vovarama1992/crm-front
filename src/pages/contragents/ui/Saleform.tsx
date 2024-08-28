import React, { useState } from 'react'

import { useGetAllCounterpartiesQuery } from '@/entities/deal/deal.api'
import { useCreateSaleMutation } from '@/entities/deal/deal.api'
import { useGetWorkerByIdQuery } from '@/entities/workers'

export type SaleFormProps = {
  dealId: number
  onClose: () => void
  userId: number
}

export const SaleForm: React.FC<SaleFormProps> = ({ dealId, onClose, userId }) => {
  const [selectedCounterpartyId, setSelectedCounterpartyId] = useState<null | number>(null)
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [inn, setInn] = useState('')
  const [deliveryDeadline, setDeliveryDeadline] = useState('')
  const [prepaymentAmount, setPrepaymentAmount] = useState(0)
  const [isFinalAmount, setIsFinalAmount] = useState(false)
  const [isIndependentDeal, setIsIndependentDeal] = useState(false)
  const [totalSaleAmount, setTotalSaleAmount] = useState(0) // Добавлено состояние для общей суммы продажи
  const [selectedFileName, setSelectedFileName] = useState<string | undefined>(undefined)

  const { data: counterparties = [] } = useGetAllCounterpartiesQuery()
  const { data: worker } = useGetWorkerByIdQuery(userId)
  const [createSale] = useCreateSaleMutation()
  const ropId = worker?.managed_by

  const handleCounterpartyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value)

    setSelectedCounterpartyId(selectedId)

    const selectedCounterparty = counterparties.find((cp: any) => cp.id === selectedId)

    setInn(selectedCounterparty?.inn || '')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = function () {
        const base64String = reader.result as string

        localStorage.setItem(file.name, base64String)
        setSelectedFileName(file.name)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedCounterpartyId === null) {
      alert('Выберите контрагента!')

      return
    }

    const saleData = {
      counterpartyId: selectedCounterpartyId,
      date: new Date().toISOString(),
      dealId,
      invoiceNumber,
      isFinalAmount,
      isIndependentDeal,
      lastDeliveryDate: deliveryDeadline ? new Date(deliveryDeadline).toISOString() : undefined,
      logisticsCost: 0,
      margin: 0,
      paidNow: 0,
      pdfPath: selectedFileName, // Отправляем имя файла на сервер
      prepaymentAmount,
      purchaseCost: 0,
      ropId,
      totalSaleAmount, // Добавляем общую сумму продажи в данные
      userId,
    }

    console.log('file name: ' + selectedFileName)

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
          onChange={e => setPrepaymentAmount(Number(e.target.value))}
          type={'number'}
          value={prepaymentAmount}
        />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Общая сумма продажи</label>
        <input
          className={'border rounded p-2 w-full'}
          onChange={e => setTotalSaleAmount(Number(e.target.value))}
          type={'number'}
          value={totalSaleAmount}
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

      <div className={'ml-[200px] mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Загрузить файл</label>
        <input className={'border rounded p-2 w-full'} onChange={handleFileChange} type={'file'} />
      </div>

      <button className={'bg-blue-500 ml-[300px] text-white px-4 py-2 rounded'} type={'submit'}>
        Создать продажу
      </button>
    </form>
  )
}

export default SaleForm
