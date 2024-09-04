import React, { useState } from 'react'

import { useUpdateSaleWithRemainingMutation } from '@/entities/deal'
import { SaleDto } from '@/entities/deal/deal.types'
import { useCreateNotificationMutation } from '@/entities/notifications'
import { useMeQuery } from '@/entities/session'

interface SalesCreateFormProps {
  onClose: () => void
  sale: SaleDto
}

export const SalesCreateForm: React.FC<SalesCreateFormProps> = ({ onClose, sale }) => {
  const [updateSaleWithRemaining] = useUpdateSaleWithRemainingMutation() // Используем правильный хук для обновления продажи с созданием ремейнинга
  const [createNotification] = useCreateNotificationMutation()
  const [isFinalAmount, setIsFinalAmount] = useState(false)
  const [formData, setFormData] = useState<SaleDto>({ ...sale } as SaleDto)
  const [error, setError] = useState<null | string>(null)
  const { data: meData } = useMeQuery()

  const handleChange = (field: keyof SaleDto, value: number | string) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const saleAmount = sale.paidNow + sale.prepaymentAmount

  const handleSave = () => {
    if (!formData.saleAmount) {
      setError('Пожалуйста, заполните все обязательные поля: "Стоимость продажи"')

      return
    }

    const { id, pdfUrl, ...newFormData } = formData

    const updatedSale: Omit<SaleDto, 'id' | 'pdfUrl'> = {
      ...newFormData,
      isFinalAmount,
      progressed: true,
      statusSetDate: new Date().toISOString(),
    }

    updateSaleWithRemaining({ id: sale.id, sale: updatedSale }) // Используем обновление с созданием RemainingSale
      .unwrap()
      .then(() => {
        onClose()
        if (saleAmount !== updatedSale.totalSaleAmount) {
          createNotification({
            content: `Общая сумма продажи (${updatedSale.totalSaleAmount}) не совпадает с оплаченной суммой (${saleAmount}). 
                      Продавец: ${meData?.surname || 'неизвестен'}`,
            createdBy: meData?.id || 1,
            seenBy: [],
            title: `Разница в суммах продажи для счета #${formData.invoiceNumber}`,
          })
        }
      })
      .catch(error => {
        console.error('Ошибка при обновлении продажи:', error)
        createNotification({
          content: 'Произошла ошибка при обновлении продажи.',
          createdBy: meData?.id || 1,
          seenBy: [],
          title: 'Ошибка обновления продажи',
        })
      })
  }

  return (
    <div className={'flex flex-col space-y-2'}>
      {error && <div className={'text-red-500'}>{error}</div>}
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
        <label>Общая сумма продажи:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('saleAmount', Number(e.target.value))}
          type={'number'}
          value={formData.saleAmount || ''}
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
      <button className={'mt-2 bg-blue-500 text-white p-2 rounded'} onClick={handleSave}>
        Сохранить
      </button>
    </div>
  )
}
