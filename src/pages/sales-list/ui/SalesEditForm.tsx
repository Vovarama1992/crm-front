/* eslint-disable max-lines */
import type { SaleDto } from '@/entities/deal/deal.types'

import React, { useState } from 'react'

import { useGetAllCounterpartiesQuery } from '@/entities/deal'
import { useSoftDeleteSaleMutation, useUpdateSaleMutation } from '@/entities/sale'
import { useGetSaleChangesQuery } from '@/entities/sale'
import { useMeQuery } from '@/entities/session'
import { useGetWorkersQuery } from '@/entities/workers'

import { AdditionalPaymentModal } from './AdditionalPaymentModal'
import { ChangeHistoryModal } from './ChangeHistoryModal'
import { PaymentHistoryModal } from './PaymentHistoryModal'
import { RefundModal } from './RefundModal'

interface SalesEditFormProps {
  onCancel: () => void
  onClose: () => void
  sale: SaleDto
}

export const SalesEditForm: React.FC<SalesEditFormProps> = ({ onCancel, onClose, sale }) => {
  const { data: counterparties = [] } = useGetAllCounterpartiesQuery()
  const { data: workers = [] } = useGetWorkersQuery()
  const { data: meData } = useMeQuery()

  const { data: changes } = useGetSaleChangesQuery({
    entityId: sale.id,
    entityType: 'SALE',
  })

  const [updateSale] = useUpdateSaleMutation()
  const [softDeleteSale] = useSoftDeleteSaleMutation()
  const [isFinalAmount, setIsFinalAmount] = useState(sale.isFinalAmount)
  const [formData, setFormData] = useState<SaleDto>({ ...sale })
  const [isIndependentDeal, setIsIndependentDeal] = useState(sale.isIndependentDeal)
  const [selectedFileName, setSelectedFileName] = useState<string | undefined>(sale.pdfPath)
  const [isHistoryVisible, setIsHistoryVisible] = useState(false)
  const [isAdditionalPaymentModalVisible, setIsAdditionalPaymentModalVisible] = useState(false)
  const [isRefundModalVisible, setIsRefundModalVisible] = useState(false)
  const [isPaymentListModalVisible, setIsPaymentListModalVisible] = useState(false)

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
    const { counterpartyId, dealId, id, pdfUrl, ...dataWithoutId } = formData

    const updatedFields: Omit<SaleDto, 'counterpartyId' | 'dealId' | 'id' | 'pdfUrl' | 'userId'> = {
      ...dataWithoutId,
      counterparty: { connect: { id: formData.counterpartyId } },
      isFinalAmount,
      isIndependentDeal,

      pdfPath: selectedFileName,
    }

    updateSale({ id: sale.id, sale: updatedFields }).then(() => {
      onClose()
    })
  }

  const handleIndependentDealChange = () => {
    setIsIndependentDeal(!isIndependentDeal)
    setFormData(prevState => ({
      ...prevState,
      isIndependentDeal: !isIndependentDeal,
    }))
  }

  const handleDelete = () => {
    softDeleteSale(sale.id).then(() => {
      onClose()
    })
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

  const handleShowHistory = () => {
    setIsHistoryVisible(true)
  }

  const handleCloseHistory = () => {
    setIsHistoryVisible(false)
  }

  const handleShowAdditionalPaymentModal = () => {
    setIsAdditionalPaymentModalVisible(true)
  }

  const handleCloseAdditionalPaymentModal = () => {
    setIsAdditionalPaymentModalVisible(false)
  }

  const handleShowRefundModal = () => {
    setIsRefundModalVisible(true)
  }

  const handleCloseRefundModal = () => {
    setIsRefundModalVisible(false)
  }

  const handleShowPaymentListModal = () => {
    setIsPaymentListModalVisible(true)
  }

  const handleClosePaymentListModal = () => {
    setIsPaymentListModalVisible(false)
  }

  const canEditAllFields = meData?.roleName === 'Директор' || meData?.roleName === 'Бухгалтер'

  return (
    <div className={'flex flex-col space-y-1'}>
      {canEditAllFields && (
        <div>
          <label>Контрагент:</label>
          <select
            className={'border rounded p-1 w-full'}
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
            className={'border rounded p-1 w-full'}
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
            className={'border rounded p-1 w-full'}
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
        <label>Оплачено сейчас</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          type={'number'}
          value={sale.paidNow}
        />
      </div>

      {canEditAllFields && (
        <div>
          <label className={'inline-flex items-center'}>
            <input
              checked={isFinalAmount}
              onChange={() => setIsFinalAmount(!isFinalAmount)}
              type={'checkbox'}
            />
            <span className={'ml-1'}>Финальная сумма</span>
          </label>
        </div>
      )}

      {meData?.roleName === 'Директор' && (
        <div>
          <label className={'inline-flex items-center'}>
            <input
              checked={isIndependentDeal}
              onChange={handleIndependentDealChange}
              type={'checkbox'}
            />
            <span className={'ml-1'}>Самостоятельная сделка</span>
          </label>
        </div>
      )}

      {canEditAllFields && (
        <div>
          <label>Загрузить файл</label>
          <input
            className={'border rounded p-1 w-full'}
            onChange={handleFileChange}
            type={'file'}
          />
        </div>
      )}

      <div className={'mt-1 flex space-x-2'}>
        <button
          className={'bg-gray-500 text-white p-1 rounded text-sm'}
          onClick={handleShowHistory}
        >
          История изменений
        </button>

        <button
          className={'bg-green-500 text-white p-1 rounded text-sm'}
          onClick={handleShowAdditionalPaymentModal}
        >
          Доплата
        </button>

        <button
          className={'bg-red-500 text-white p-1 rounded text-sm'}
          onClick={handleShowRefundModal}
        >
          Возврат
        </button>

        <button
          className={'bg-blue-500 text-white p-1 rounded text-sm'}
          onClick={handleShowPaymentListModal}
        >
          Список платежей
        </button>
      </div>

      {isHistoryVisible && changes && (
        <ChangeHistoryModal changes={changes} onClose={handleCloseHistory} />
      )}

      {isAdditionalPaymentModalVisible && (
        <AdditionalPaymentModal
          onClose={handleCloseAdditionalPaymentModal}
          sale={sale}
          userId={meData?.id as number}
        />
      )}
      {isRefundModalVisible && (
        <RefundModal onClose={handleCloseRefundModal} sale={sale} userId={meData?.id as number} />
      )}
      {isPaymentListModalVisible && (
        <PaymentHistoryModal onClose={handleClosePaymentListModal} saleId={sale.id} />
      )}

      {meData?.roleName === 'Директор' && (
        <button className={'bg-red-500 text-white p-1 rounded text-sm'} onClick={handleDelete}>
          Удалить
        </button>
      )}

      <div className={'mt-1 flex space-x-2'}>
        <button className={'bg-blue-500 text-white p-1 rounded text-sm'} onClick={handleSave}>
          Сохранить
        </button>
        <button className={'bg-red-500 text-white p-1 rounded text-sm'} onClick={onCancel}>
          Отмена
        </button>
      </div>
    </div>
  )
}
