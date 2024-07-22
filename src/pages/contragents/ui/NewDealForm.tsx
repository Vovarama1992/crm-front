import React, { useState } from 'react'

import { useMeQuery } from '@/entities/session'

type NewDealFormProps = {
  initialData: {
    counterparty: string
    creationDate: string
    dealNumber: string
    inn: string
  }
  onClose: () => void
}

const NewDealForm: React.FC<NewDealFormProps> = ({ initialData, onClose }) => {
  const [dealNumber, setDealNumber] = useState(initialData.dealNumber)
  const [creationDate, setCreationDate] = useState(initialData.creationDate)
  const [deadline, setDeadline] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('')
  const [prepaymentAmount, setPrepaymentAmount] = useState('')
  const [paidNow, setPaidNow] = useState('')
  const [isFinalAmount, setIsFinalAmount] = useState(false)
  const [totalSaleAmount, setTotalSaleAmount] = useState('')
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null)
  const [requestNumber, setRequestNumber] = useState('')
  const [isIndependentDeal, setIsIndependentDeal] = useState(false)

  const { data: userData } = useMeQuery()
  const { name, surname } = userData || {}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newDeal = {
      counterparty: initialData.counterparty,
      createdBy: `${name} ${surname}`,
      creationDate,
      deadline,
      dealNumber,
      inn: initialData.inn,
      invoiceFile,
      isFinalAmount,
      isIndependentDeal,
      paidNow,
      paymentTerms,
      prepaymentAmount,
      requestNumber,
      totalSaleAmount,
    }

    // Логика для сохранения данных сделки
    console.log('Saving new deal:', newDeal)

    // Создание уведомления
    const newNotification = {
      content: `${name} ${surname} создал(а) новую сделку. 
                Номер сделки: ${dealNumber}, 
                Контрагент: ${initialData.counterparty}, 
                Сумма: ${totalSaleAmount}`,
      readBy: [],
      title: 'Создание новой сделки',
    }

    const currentNotifications = JSON.parse(
      localStorage.getItem('notifications') || '[]'
    ) as Notification[]
    const updatedNotifications = [...currentNotifications, newNotification]

    localStorage.setItem('notifications', JSON.stringify(updatedNotifications))

    // Здесь можно добавить логику для отправки данных на сервер

    onClose()
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'}>
      <div className={'bg-white w-[80%] max-w-4xl p-6 rounded shadow-lg'}>
        <h2 className={'text-xl font-bold mb-4'}>Создание новой сделки</h2>
        <form onSubmit={handleSubmit}>
          <div className={'grid grid-cols-2 gap-4'}>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Номер сделки</label>
              <input
                className={'w-full border p-2 rounded'}
                onChange={e => setDealNumber(e.target.value)}
                required
                type={'text'}
                value={dealNumber}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Дата создания</label>
              <input
                className={'w-full border p-2 rounded'}
                onChange={e => setCreationDate(e.target.value)}
                required
                type={'date'}
                value={creationDate}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Крайняя дата поставки</label>
              <input
                className={'w-full border p-2 rounded'}
                onChange={e => setDeadline(e.target.value)}
                required
                type={'date'}
                value={deadline}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>ИНН контрагента</label>
              <input
                className={'w-full border p-2 rounded'}
                readOnly
                type={'text'}
                value={initialData.inn}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Название контрагента</label>
              <input
                className={'w-full border p-2 rounded'}
                readOnly
                type={'text'}
                value={initialData.counterparty}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Формы и условия оплаты</label>
              <input
                className={'w-full border p-2 rounded'}
                onChange={e => setPaymentTerms(e.target.value)}
                required
                type={'text'}
                value={paymentTerms}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Сумма предоплаты</label>
              <input
                className={'w-full border p-2 rounded'}
                onChange={e => setPrepaymentAmount(e.target.value)}
                required
                type={'number'}
                value={prepaymentAmount}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Оплачено сейчас (в рублях)</label>
              <input
                className={'w-full border p-2 rounded'}
                onChange={e => setPaidNow(e.target.value)}
                required
                type={'number'}
                value={paidNow}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Финальная сумма</label>
              <input
                checked={isFinalAmount}
                className={'ml-2'}
                onChange={e => setIsFinalAmount(e.target.checked)}
                type={'checkbox'}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Общая сумма продажи</label>
              <input
                className={'w-full border p-2 rounded'}
                onChange={e => setTotalSaleAmount(e.target.value)}
                required
                type={'number'}
                value={totalSaleAmount}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Файл счета или спецификации</label>
              <input
                className={'w-full border p-2 rounded'}
                onChange={e => setInvoiceFile(e.target.files ? e.target.files[0] : null)}
                required
                type={'file'}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Номер запроса</label>
              <input
                className={'w-full border p-2 rounded'}
                onChange={e => setRequestNumber(e.target.value)}
                required
                type={'text'}
                value={requestNumber}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Самостоятельная сделка</label>
              <input
                checked={isIndependentDeal}
                className={'ml-2'}
                onChange={e => setIsIndependentDeal(e.target.checked)}
                type={'checkbox'}
              />
            </div>
          </div>
          <div className={'flex justify-end'}>
            <button className={'bg-blue-500 text-white px-4 py-2 rounded mr-2'} type={'submit'}>
              Сохранить
            </button>
            <button
              className={'bg-gray-500 text-white px-4 py-2 rounded'}
              onClick={onClose}
              type={'button'}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewDealForm
