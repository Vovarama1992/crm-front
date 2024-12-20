import React, { useState } from 'react'

import { useCreateCounterpartyMutation } from '@/entities/deal'

const NewCounterpartyForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [createCounterparty] = useCreateCounterpartyMutation()
  const [formData, setFormData] = useState({
    inn: '', // ИНН как строковое поле
    name: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const dataToSend = {
        ...formData,
        inn: formData.inn,
      }

      await createCounterparty(dataToSend).unwrap()
      setFormData({
        inn: '',
        name: '',
      })
      onClose()
    } catch (error) {
      console.error('Error creating counterparty:', error)
    }
  }

  return (
    <div
      className={'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'} // Используем fixed и z-индекс
      style={{ zIndex: 1000 }} // Задаем высокий z-index
    >
      <div className={'bg-white w-[20%] max-w-4xl p-6 rounded shadow-lg'}>
        <h2 className={'text-xl font-bold mb-4'}>Создание нового контрагента</h2>
        <form onSubmit={handleSubmit}>
          <div className={'mb-4'}>
            <label className={'block text-sm font-bold mb-1'}>Название контрагента</label>
            <input
              className={'w-full border p-2 rounded'}
              name={'name'}
              onChange={handleChange}
              required
              type={'text'}
              value={formData.name}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-sm font-bold mb-1'}>ИНН контрагента</label>
            <input
              className={'w-full border p-2 rounded'}
              inputMode={'numeric'} // Отключаем прокрутку стрелочками
              name={'inn'}
              onChange={handleChange}
              required
              type={'text'}
              value={formData.inn} // Оставляем ИНН строковым
            />
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

export default NewCounterpartyForm
