import React, { useState } from 'react'

import { useGetAllCounterpartiesQuery } from '@/entities/deal'
import { useCreateDealMutation } from '@/entities/deal/deal.api'
import { CreateDealDto } from '@/entities/deal/deal.types'
import { useMeQuery } from '@/entities/session'

export const stageOptions = [
  { label: 'отправлено КП', value: 'QUOTE_SENT' },
  { label: 'работа с возражениями/Бюрократия', value: 'WORKING_WITH_OBJECTIONS' },
  { label: 'выставлен счёт', value: 'INVOICE_SENT' },
  { label: 'счёт оплачен/подписана спецификация', value: 'INVOICE_PAID' },
  { label: 'сделка закрыта', value: 'DEAL_CLOSED' },
  { label: 'проигран', value: 'LOST' },
]

const NewDealForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data: userData } = useMeQuery()
  const userId = userData?.id || 1
  const { data: counterparties = [] } = useGetAllCounterpartiesQuery()

  const [createDeal] = useCreateDealMutation()
  const [formData, setFormData] = useState<CreateDealDto>({
    closeDate: null,
    comment: '',
    counterpartyName: '',
    dealType: 'REQUEST',
    marginRub: '',
    requestNumber: '',
    stage: 'QUOTE_SENT',
    turnoverRub: '',
    userId,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const dataToSend = {
        ...formData,
        closeDate: formData.closeDate ? new Date(formData.closeDate).toISOString() : null,
        marginRub: formData.marginRub ? Number(formData.marginRub) : 0,
        requestNumber: formData.requestNumber ? Number(formData.requestNumber) : 0,
        turnoverRub: formData.turnoverRub ? Number(formData.turnoverRub) : 0,
      }

      await createDeal(dataToSend).unwrap()
      setFormData({
        closeDate: null,
        comment: '',
        counterpartyName: '',
        dealType: 'TASK',
        marginRub: '',
        requestNumber: '',
        stage: 'QUOTE_SENT',
        turnoverRub: '',
        userId,
      })
      onClose()
      window.location.reload()
    } catch (error) {
      console.error('Error creating deal:', error)
    }
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'}>
      <div className={'bg-white w-full max-w-4xl p-6 rounded shadow-lg'}>
        <h2 className={'text-xl font-bold mb-4'}>Создание новой сделки</h2>
        <form onSubmit={handleSubmit}>
          <div className={'grid grid-cols-2 gap-4'}>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Контрагент</label>
              <select
                className={'w-full border p-2 rounded'}
                name={'counterpartyName'}
                onChange={handleChange}
                required
                value={formData.counterpartyName}
              >
                <option value={''}>Выберите контрагента</option>
                {counterparties.map(counterparty => (
                  <option key={counterparty.id} value={counterparty.name}>
                    {counterparty.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Оборот в рублях</label>
              <input
                className={'w-full border p-2 rounded'}
                inputMode={'numeric'}
                name={'turnoverRub'}
                onChange={handleChange}
                required
                type={'text'}
                value={formData.turnoverRub}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Маржа в рублях</label>
              <input
                className={'w-full border p-2 rounded'}
                inputMode={'numeric'}
                name={'marginRub'}
                onChange={handleChange}
                required
                type={'text'}
                value={formData.marginRub}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Стадия сделки</label>
              <select
                className={'w-full border p-2 rounded'}
                name={'stage'}
                onChange={handleChange}
                required
                value={formData.stage}
              >
                {stageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Тип сделки</label>
              <select
                className={'w-full border p-2 rounded'}
                name={'dealType'}
                onChange={handleChange}
                required
                value={formData.dealType}
              >
                <option value={'REQUEST'}>Запрос</option>
                <option value={'TASK'}>Задача</option>
              </select>
            </div>
            <div className={'mb-4 col-span-2'}>
              <label className={'block text-sm font-bold mb-1'}>Комментарий</label>
              <input
                className={'w-full border p-2 rounded'}
                name={'comment'}
                onChange={handleChange}
                type={'text'}
                value={formData.comment || ''}
              />
            </div>
            <div className={'mb-4 col-span-2'}>
              <label className={'block text-sm font-bold mb-1'}>Дата закрытия</label>
              <input
                className={'w-full border p-2 rounded'}
                name={'closeDate'}
                onChange={handleChange}
                type={'date'}
                value={formData.closeDate || ''}
              />
            </div>
            <div className={'mb-4 col-span-2'}>
              <label className={'block text-sm font-bold mb-1'}>Номер запроса/задачи</label>
              <input
                className={'w-full border p-2 rounded'}
                inputMode={'numeric'}
                name={'requestNumber'}
                onChange={handleChange}
                type={'text'}
                value={formData.requestNumber}
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
