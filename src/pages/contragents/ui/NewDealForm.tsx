import React, { useState } from 'react'

import { useCreateDealMutation } from '@/entities/deal/deal.api'
import { CreateDealDto } from '@/entities/deal/deal.types'
import { useMeQuery } from '@/entities/session'

const stageOptions = [
  { label: 'выставлен счет', value: 'INVOICE_SENT' },
  { label: 'отправлено КП', value: 'QUOTE_SENT' },
  { label: 'проигран', value: 'LOST' },
  { label: 'работа с возражениями(бюрократия)', value: 'WORKING_WITH_OBJECTIONS' },
  { label: 'сделка закрыта', value: 'DEAL_CLOSED' },
  { label: 'счет оплачен', value: 'INVOICE_PAID' },
]

const lossReasonOptions = [
  { label: 'дорого', value: 'EXPENSIVE' },
  { label: 'пустомеля', value: 'EMPTY_TALK' },
  { label: 'нет раппорта', value: 'NO_REPORT' },
  { label: 'недоработал', value: 'DID_NOT_WORK' },
  { label: 'другое', value: 'OTHER' },
]

const NewDealForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data: userData } = useMeQuery()
  const userId = userData?.id || 1

  const [createDeal] = useCreateDealMutation()
  const [formData, setFormData] = useState<CreateDealDto>({
    closeDate: null,
    comment: '',
    counterpartyName: '',
    dealType: 'PURCHASE',
    lossReason: 'EXPENSIVE',
    marginRub: 0,
    stage: 'INVOICE_SENT',
    turnoverRub: 0,
    userId,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'marginRub' || name === 'turnoverRub' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const dataToSend = {
        ...formData,
        closeDate: formData.closeDate ? new Date(formData.closeDate).toISOString() : null,
      }

      await createDeal(dataToSend).unwrap()
      setFormData({
        closeDate: null,
        comment: '',
        counterpartyName: '',
        dealType: 'PURCHASE',
        lossReason: 'EXPENSIVE',
        marginRub: 0,
        stage: 'INVOICE_SENT',
        turnoverRub: 0,
        userId,
      })
      onClose()
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
              <input
                className={'w-full border p-2 rounded'}
                name={'counterpartyName'}
                onChange={handleChange}
                required
                type={'text'}
                value={formData.counterpartyName}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Оборот в рублях</label>
              <input
                className={'w-full border p-2 rounded'}
                name={'turnoverRub'}
                onChange={handleChange}
                required
                type={'number'}
                value={formData.turnoverRub}
              />
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Маржа в рублях</label>
              <input
                className={'w-full border p-2 rounded'}
                name={'marginRub'}
                onChange={handleChange}
                required
                type={'number'}
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
                <option value={'PURCHASE'}>Закупка</option>
                <option value={'SALE'}>Продажа</option>
              </select>
            </div>
            <div className={'mb-4'}>
              <label className={'block text-sm font-bold mb-1'}>Причина проигрыша</label>
              <select
                className={'w-full border p-2 rounded'}
                name={'lossReason'}
                onChange={handleChange}
                value={formData.lossReason || ''}
              >
                <option value={''}>Выберите причину</option>
                {lossReasonOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
