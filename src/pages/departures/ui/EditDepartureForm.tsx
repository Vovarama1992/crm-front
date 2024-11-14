import type { DepartureDto } from '@/entities/departure/departure.types'

import React, { useState } from 'react'

import { useUpdateDepartureMutation } from '@/entities/departure/departure.api'

const destinationOptions = {
  RETURN_FROM_CLIENT: 'Возврат от клиента',
  RETURN_TO_SUPPLIER: 'Возврат поставщику',
  TO_CLIENT: 'До клиента',
  TO_US: 'До нас',
}

const specificDestinationOptions = {
  TO_DOOR: 'до двери',
  TO_TERMINAL: 'до терминала',
}

const statusOptions = {
  DELIVERED_ALL: 'Доставлено все',
  DELIVERED_PARTIALLY: 'Доставлено частично',
  PROBLEM: 'Проблема',
  SENT_ALL: 'Отправлено все',
  SENT_PARTIALLY: 'Отправлено частично',
}

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
    }
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
    const { counterparty, id, user, ...dataToSubmit } = formData

    const finalAmount = dataToSubmit.finalAmount

    if (typeof finalAmount === 'string') {
      dataToSubmit.finalAmount = parseFloat(finalAmount) || 0
    } else {
      dataToSubmit.finalAmount = finalAmount || 0
    }

    updateDeparture({ data: dataToSubmit, id: departure.id }).then(() => {
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
          value={formatDate(formData.dispatchDate)}
        />
      </div>
      <div>
        <label>Дата поступления:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('arrivalDate', e.target.value)}
          type={'date'}
          value={formatDate(formData.arrivalDate)}
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
      <div>
        <label>Куда:</label>
        <select
          className={'border rounded p-1 w-full'}
          onChange={e => handleChange('destination', e.target.value)}
          value={formData.destination}
        >
          {Object.entries(destinationOptions).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Куда конкретно:</label>
        <select
          className={'border rounded p-1 w-full'}
          onChange={e => handleChange('specificDestination', e.target.value)}
          value={formData.specificDestination}
        >
          {Object.entries(specificDestinationOptions).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Статус:</label>
        <select
          className={'border rounded p-1 w-full'}
          onChange={e => handleChange('status', e.target.value)}
          value={formData.status}
        >
          {Object.entries(statusOptions).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Финальная сумма:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('finalAmount', parseFloat(e.target.value))}
          step={'0.01'}
          type={'text'}
          value={formData.finalAmount || ''}
        />
      </div>
      <div>
        <label>Транспортная компания:</label>
        <input
          className={'border border-gray-300 rounded p-1 w-full'}
          onChange={e => handleChange('transportCompany', e.target.value)}
          type={'text'}
          value={formData.transportCompany || ''}
        />
      </div>
      <button className={'mt-2 bg-blue-500 text-white p-2 rounded'} onClick={handleSave}>
        Сохранить
      </button>
    </div>
  )
}
