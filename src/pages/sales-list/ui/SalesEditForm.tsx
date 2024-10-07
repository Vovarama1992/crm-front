import type { SaleDto } from '@/entities/deal/deal.types'

import React, { useState } from 'react'

import { useGetAllCounterpartiesQuery, useUpdateSaleMutation } from '@/entities/deal'
import { useMeQuery } from '@/entities/session'
import { useGetWorkersQuery } from '@/entities/workers' // Получаем информацию о текущем пользователе

interface SalesEditFormProps {
  onClose: () => void
  sale: SaleDto
}

export const SalesEditForm: React.FC<SalesEditFormProps> = ({ onClose, sale }) => {
  const { data: counterparties = [] } = useGetAllCounterpartiesQuery()
  const { data: workers = [] } = useGetWorkersQuery()
  const { data: meData } = useMeQuery() // Получаем текущего пользователя

  const [updateSale] = useUpdateSaleMutation()
  const [isFinalAmount, setIsFinalAmount] = useState(sale.isFinalAmount)
  const [formData, setFormData] = useState<SaleDto>({ ...sale })
  const [additionalAmount, setAdditionalAmount] = useState<number>(0)
  const [refundAmount, setRefundAmount] = useState<number>(0)
  const [selectedFileName, setSelectedFileName] = useState<string | undefined>(sale.pdfPath)

  const handleChange = (field: keyof SaleDto, value: number | string) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }))
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

  const handleSave = () => {
    const newPaidNow = (formData.paidNow || 0) + additionalAmount - refundAmount
    const { counterpartyId, dealId, id, pdfUrl, ...dataWithoutId } = formData

    const updatedFields: Omit<SaleDto, 'counterpartyId' | 'dealId' | 'id' | 'pdfUrl' | 'userId'> = {
      ...dataWithoutId,
      counterparty: { connect: { id: formData.counterpartyId } },
      isFinalAmount,
      paidNow: newPaidNow,
      pdfPath: selectedFileName,
    }

    updateSale({ id: sale.id, sale: updatedFields }).then(() => {
      onClose()
    })
  }

  const handleAdditionalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionalAmount(Number(e.target.value))
  }

  const handleRefundAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRefundAmount(Number(e.target.value))
  }

  const handleCounterpartyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange('counterpartyId', Number(e.target.value))
  }

  const handleManagerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange('userId', Number(e.target.value))
  }

  const handleROPChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange('ropId', Number(e.target.value))
  }

  const handleTotalSaleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('totalSaleAmount', Number(e.target.value))
  }

  // Проверка, может ли пользователь редактировать все поля
  const canEditAllFields = meData?.roleName === 'Директор' || meData?.roleName === 'Бухгалтер'

  return (
    <div className={'flex flex-col space-y-2'}>
      {canEditAllFields && (
        <div>
          <label>Контрагент:</label>
          <select
            className={'border rounded p-2 w-full'}
            onChange={handleCounterpartyChange}
            value={formData.counterpartyId || ''}
          >
            <option disabled value={''}>
              Выберите контрагента
            </option>
            {counterparties.map(counterparty => (
              <option key={counterparty.id} value={counterparty.id}>
                {counterparty.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {canEditAllFields && (
        <div>
          <label>Менеджер:</label>
          <select
            className={'border rounded p-2 w-full'}
            onChange={handleManagerChange}
            value={formData.userId || ''}
          >
            <option disabled value={''}>
              Выберите менеджера
            </option>
            {workers.map(worker => (
              <option key={worker.id} value={worker.id}>
                {worker.name} {worker.surname}
              </option>
            ))}
          </select>
        </div>
      )}

      {canEditAllFields && (
        <div>
          <label>РОП:</label>
          <select
            className={'border rounded p-2 w-full'}
            onChange={handleROPChange}
            value={formData.ropId || ''}
          >
            <option disabled value={''}>
              Выберите РОПа
            </option>
            {workers
              .filter(worker => worker.roleName === 'РОП')
              .map(worker => (
                <option key={worker.id} value={worker.id}>
                  {worker.name} {worker.surname}
                </option>
              ))}
          </select>
        </div>
      )}

      {canEditAllFields && (
        <div>
          <label>Общая сумма продажи:</label>
          <input
            className={'border border-gray-300 rounded p-1 w-full'}
            onChange={handleTotalSaleAmountChange}
            type={'number'}
            value={formData.totalSaleAmount || ''}
          />
        </div>
      )}

      <div>
        <label>Доплата:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={handleAdditionalAmountChange}
          type={'number'}
          value={additionalAmount}
        />
      </div>

      {canEditAllFields && (
        <div>
          <label>Возврат:</label>
          <input
            className={'border border-gray-300 rounded p-1 w-full'}
            onChange={handleRefundAmountChange}
            type={'number'}
            value={refundAmount}
          />
        </div>
      )}

      {canEditAllFields && (
        <div>
          <label>Финальная сумма:</label>
          <label className={'inline-flex items-center'}>
            <input
              checked={isFinalAmount}
              onChange={() => setIsFinalAmount(!isFinalAmount)}
              type={'checkbox'}
            />
            <span className={'ml-2'}>Финальная сумма</span>
          </label>
        </div>
      )}

      {canEditAllFields && (
        <div>
          <label>Загрузить файл</label>
          <input
            className={'border rounded p-2 w-full'}
            onChange={handleFileChange}
            type={'file'}
          />
        </div>
      )}

      <button className={'mt-2 bg-blue-500 text-white p-2 rounded'} onClick={handleSave}>
        Сохранить
      </button>
    </div>
  )
}
