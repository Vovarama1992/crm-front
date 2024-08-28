import React from 'react'

import { useGetAllCounterpartiesQuery, useGetAllSalesQuery } from '@/entities/deal/deal.api'
import { useCreateDepartureMutation } from '@/entities/departure/departure.api'
import { useGetWorkersQuery } from '@/entities/workers'

const destinationOptions = [
  { label: 'До клиента', value: 'TO_CLIENT' },
  { label: 'До нас', value: 'TO_US' },
  { label: 'Возврат от клиента', value: 'RETURN_FROM_CLIENT' },
  { label: 'Возврат поставщику', value: 'RETURN_TO_SUPPLIER' },
]

const specificDestinationOptions = [
  { label: 'до терминала', value: 'TO_TERMINAL' },
  { label: 'до двери', value: 'TO_DOOR' },
]

export const CreateDepartureForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data: counterparties = [] } = useGetAllCounterpartiesQuery()
  const { data: workers = [] } = useGetWorkersQuery()
  const { data: sales } = useGetAllSalesQuery()
  const [createDeparture] = useCreateDepartureMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const arrivalDate = formData.get('arrivalDate') as null | string
    const dispatchDate = formData.get('dispatchDate') as string
    const expectedArrivalDate = formData.get('expectedArrivalDate') as null | string

    try {
      await createDeparture({
        arrivalDate: arrivalDate ? new Date(arrivalDate) : null,
        comments: formData.get('comments') as null | string,
        counterpartyId: Number(formData.get('counterpartyId')), // Выбираем ID контрагента
        dealId: Number(formData.get('dealId')), // Должно быть предусмотрено получение dealId
        destination: formData.get('destination') as
          | 'RETURN_FROM_CLIENT'
          | 'RETURN_TO_SUPPLIER'
          | 'TO_CLIENT'
          | 'TO_US',
        dispatchDate: new Date(dispatchDate),
        expectedArrivalDate: expectedArrivalDate ? new Date(expectedArrivalDate) : null,
        finalAmount: formData.get('finalAmount') ? Number(formData.get('finalAmount')) : null,
        specificDestination: formData.get('specificDestination') as 'TO_DOOR' | 'TO_TERMINAL',
        status: 'SENT_ALL', // Или сделать выбор статуса в форме
        trackingNumber: formData.get('trackingNumber') as null | string,
        transportCompany: formData.get('transportCompany') as string,
        userId: Number(formData.get('userId')),
      }).unwrap()

      alert('Отправление успешно создано!')
      onClose()
    } catch (error) {
      console.error('Ошибка при создании отправления:', error)
      alert('Произошла ошибка при создании отправления.')
    }
  }

  return (
    <form className={'p-4 border rounded shadow'} onSubmit={handleSubmit}>
      <h2 className={'text-lg font-bold mb-4'}>Создание отправления</h2>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Контрагент</label>
        <select className={'border rounded p-2 w-full'} name={'counterpartyId'} required>
          <option disabled value={''}>
            Выберите контрагента
          </option>
          {counterparties.map(counterparty => (
            <option key={counterparty.id} value={counterparty.id}>
              {counterparty.name} {/* Отображаем название контрагента */}
            </option>
          ))}
        </select>
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Продажа</label>
        <select className={'border rounded p-2 w-full'} name={'dealId'} required>
          <option disabled value={''}>
            Выберите продажу
          </option>
          {sales?.map((sale: any) => (
            <option key={sale.id} value={sale.id}>
              {sale.id} {/* Отображаем название контрагента */}
            </option>
          ))}
        </select>
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Куда</label>
        <select className={'border rounded p-2 w-full'} name={'destination'} required>
          <option disabled value={''}>
            Выберите направление
          </option>
          {destinationOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Транспортная компания</label>
        <input
          className={'border rounded p-2 w-full'}
          name={'transportCompany'}
          required
          type={'text'}
        />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Дата отправки</label>
        <input
          className={'border rounded p-2 w-full'}
          name={'dispatchDate'}
          required
          type={'date'}
        />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Куда конкретно</label>
        <select className={'border rounded p-2 w-full'} name={'specificDestination'} required>
          <option disabled value={''}>
            Выберите точное место
          </option>
          {specificDestinationOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Трек номер</label>
        <input className={'border rounded p-2 w-full'} name={'trackingNumber'} type={'text'} />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Финальная сумма</label>
        <input className={'border rounded p-2 w-full'} name={'finalAmount'} type={'number'} />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Ожидаемая дата поступления</label>
        <input className={'border rounded p-2 w-full'} name={'expectedArrivalDate'} type={'date'} />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Дата поступления</label>
        <input className={'border rounded p-2 w-full'} name={'arrivalDate'} type={'date'} />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Комментарий</label>
        <input className={'border rounded p-2 w-full'} name={'comments'} type={'text'} />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Имя менеджера</label>
        <select className={'border rounded p-2 w-full'} name={'userId'} required>
          <option disabled value={''}>
            Выберите менеджера
          </option>
          {workers.map(worker => (
            <option key={worker.id} value={worker.id}>
              {worker.name}
            </option>
          ))}
        </select>
      </div>

      <button className={'bg-blue-500 text-white px-4 py-2 rounded'} type={'submit'}>
        Создать отправление
      </button>
    </form>
  )
}
