import type { DepartureDto } from '@/entities/departure/departure.types'

import React, { useState } from 'react'

import { useUpdateDepartureMutation } from '@/entities/departure/departure.api'

interface EditDepartureFormProps {
  departure: DepartureDto
  onClose: () => void
}

export const EditDepartureForm: React.FC<EditDepartureFormProps> = ({ departure, onClose }) => {
  const [updateDeparture] = useUpdateDepartureMutation()
  const [formData, setFormData] = useState<DepartureDto>({ ...departure })

  const formatDate = (date: Date | null | string) => {
    if (!date) {
      return ''
    } // Проверка на null или undefined
    const validDate = typeof date === 'string' ? new Date(date) : date

    return validDate.toISOString().split('T')[0]
  }

  const handleChange = (field: keyof DepartureDto, value: any) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const handleSave = () => {
    updateDeparture({ data: formData, id: departure.id }).then(() => {
      onClose()
    })
  }

  return (
    <div className={'flex flex-col space-y-2 p-4'}>
      <div>
        <label>Трек номер:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('trackingNumber', e.target.value)}
          type={'text'}
          value={formData.trackingNumber || ''}
        />
      </div>
      <div>
        <label>Дата отправки:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('dispatchDate', e.target.value)}
          type={'date'}
          value={formatDate(departure.dispatchDate)}
        />
      </div>
      <div>
        <label>Дата поступления:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('arrivalDate', e.target.value)}
          type={'date'}
          value={formatDate(departure.arrivalDate)}
        />
      </div>
      <div>
        <label>Комментарий:</label>
        <textarea
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('comments', e.target.value)}
          value={formData.comments || ''}
        />
      </div>
      <button className={'mt-2 bg-blue-500 text-white p-2 rounded'} onClick={handleSave}>
        Сохранить
      </button>
    </div>
  )
}
