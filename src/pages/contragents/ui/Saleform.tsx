import React, { useState } from 'react'

import { useGetAllCounterpartiesQuery } from '@/entities/deal/deal.api'
import { useGetAllDealsQuery } from '@/entities/deal/deal.api'
import { useCreateSaleMutation } from '@/entities/deal/deal.api'
import { useUpdateSaleMutation } from '@/entities/deal/deal.api'
import { useUploadPdfMutation } from '@/entities/session' // Хук для обновления продажи
import { useMeQuery } from '@/entities/session'

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
  const [prepaymentAmount, setPrepaymentAmount] = useState<string>('')
  const [isFinalAmount, setIsFinalAmount] = useState(false)
  const [isIndependentDeal, setIsIndependentDeal] = useState(false)
  const [totalSaleAmount, setTotalSaleAmount] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null) // Хранение файла
  const { data: deals } = useGetAllDealsQuery()

  const deal = deals?.find(deal => deal.id === dealId) // Найти сделку по dealId

  const requestNumber = deal ? deal.requestNumber : null

  const { data: counterparties = [] } = useGetAllCounterpartiesQuery()
  const { data: worker } = useMeQuery()
  const [createSale] = useCreateSaleMutation()
  const [uploadPdf] = useUploadPdfMutation() // Хук для загрузки PDF
  const [updateSale] = useUpdateSaleMutation() // Хук для обновления продажи
  const ropId = worker?.managed_by

  const handleCounterpartyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value)

    setSelectedCounterpartyId(selectedId)

    const selectedCounterparty = counterparties.find((cp: any) => cp.id === selectedId)

    setInn(selectedCounterparty?.inn || '')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]) // Сохраняем файл в состоянии
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('ropid: ' + ropId)

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
      pdfPath: '', // Изначально оставляем пустым
      prepaymentAmount: parseFloat(prepaymentAmount.replace(',', '.')) || 0,
      purchaseCost: 0,
      requestNumber: String(requestNumber),
      ropId,
      totalSaleAmount: parseFloat(totalSaleAmount.replace(',', '.')) || 0,

      userId,
    }

    try {
      const saleResponse = await createSale(saleData).unwrap()
      const saleId = saleResponse.id // Предполагается, что сервер возвращает созданный saleId

      // Если файл выбран, загружаем его на сервер
      if (selectedFile && saleId) {
        uploadPdf({
          file: selectedFile,
          saleId: String(saleId),
        })
          .then((uploadResponse: any) => {
            // Логируем ответ от бэкенда после загрузки файла
            console.log('Upload Response:', uploadResponse)

            // Обновляем продажу с новым pdfUrl
            if (uploadResponse.data?.sale?.pdfUrl) {
              return updateSale({
                id: saleId,
                sale: {
                  pdfUrl: uploadResponse.data?.sale.pdfUrl,
                },
              }).unwrap()
            } else {
              throw new Error('Ошибка: Продажа не обновлена корректно.')
            }
          })
          .then((updateResponse: any) => {
            console.log('Updated Sale after updating pdfUrl:', updateResponse)
            alert('Продажа и файл успешно загружены!')
          })
          .catch((error: any) => {
            console.error('Ошибка при загрузке PDF или обновлении продажи:', error)
            alert('Продажа создана, но произошла ошибка при загрузке файла.')
          })
      } else {
        alert('Продажа успешно создана!')
      }

      onClose()
    } catch (error) {
      console.error('Ошибка при создании продажи:', error)
      alert('Произошла ошибка при создании продажи.')
    }
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'}>
      <form className={'bg-white p-6 rounded shadow-lg w-[90%] max-w-3xl'} onSubmit={handleSubmit}>
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
            type={'text'} // изменено на текст
            value={prepaymentAmount}
          />
        </div>

        <div className={'mb-4'}>
          <label className={'block text-sm font-bold mb-1'}>Общая сумма продажи</label>
          <input
            className={'border rounded p-2 w-full'}
            onChange={e => setTotalSaleAmount(e.target.value)}
            type={'text'} // изменено на текст
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
          <input
            className={'border rounded p-2 w-full'}
            onChange={handleFileChange}
            type={'file'}
          />
        </div>

        <button className={'bg-blue-500 ml-[300px] text-white px-4 py-2 rounded'} type={'submit'}>
          Создать продажу
        </button>
      </form>
    </div>
  )
}

export default SaleForm
