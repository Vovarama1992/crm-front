import React, { useState } from 'react'

import { useGetDeparturesQuery } from '@/entities/departure/departure.api'

import { CreateDepartureForm } from './CreateDepartureForm' // Импортируем форму создания

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

export const DeparturesPage = () => {
  const [filterNumber, setFilterNumber] = useState('')
  const [filterCounterparty, setFilterCounterparty] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const { data: departuresData } = useGetDeparturesQuery()

  const handleFilterNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterNumber(e.target.value)
  }

  const handleFilterCounterpartyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCounterparty(e.target.value)
  }

  const filteredData =
    departuresData?.filter(
      departure =>
        (!filterNumber || departure.dealId.toString().includes(filterNumber)) &&
        (!filterCounterparty ||
          departure?.counterparty?.name.toLowerCase().includes(filterCounterparty.toLowerCase()))
    ) || []

  return (
    <div className={'absolute w-[94vw] left-[1%] top-[15%]'}>
      <div className={'mb-4 ml-[10%] flex items-center'}>
        <input
          className={'border rounded px-2 py-1 mr-2'}
          onChange={handleFilterNumberChange}
          placeholder={'Фильтр по номеру'}
          type={'text'}
          value={filterNumber}
        />
        <input
          className={'border rounded px-2 py-1 mr-2'}
          onChange={handleFilterCounterpartyChange}
          placeholder={'Фильтр по контрагенту'}
          type={'text'}
          value={filterCounterparty}
        />
        <button
          className={'bg-green-500 text-white px-4 py-2 rounded'}
          onClick={() => setIsCreating(true)}
        >
          Добавить отправление
        </button>
      </div>

      {isCreating && <CreateDepartureForm onClose={() => setIsCreating(false)} />}

      <table className={'table-auto w-full border-collapse border'}>
        <thead>
          <tr>
            <th className={'border px-4 py-2'}>Номер</th>
            <th className={'border px-4 py-2'}>Контрагент</th>
            <th className={'border px-4 py-2'}>Куда</th>
            <th className={'border px-4 py-2'}>Транспортная компания</th>
            <th className={'border px-4 py-2'}>Трек номер</th>
            <th className={'border px-4 py-2'}>Финальная сумма</th>
            <th className={'border px-4 py-2'}>Дата отправки</th>
            <th className={'border px-4 py-2'}>Дата поступления</th>
            <th className={'border px-4 py-2'}>Куда конкретно</th>
            <th className={'border px-4 py-2'}>Менеджер</th>
            <th className={'border px-4 py-2'}>Комментарий</th>
            <th className={'border px-4 py-2'}>Статус</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(departure => (
            <tr key={departure.id}>
              <td className={'border px-4 py-2'}>{departure.dealId}</td>
              <td className={'border px-4 py-2'}>{departure?.counterparty?.name}</td>
              <td className={'border px-4 py-2'}>
                {destinationOptions[departure.destination] || departure.destination}
              </td>
              <td className={'border px-4 py-2'}>{departure.transportCompany}</td>
              <td className={'border px-4 py-2'}>{departure.trackingNumber}</td>
              <td className={'border px-4 py-2'}>{departure.finalAmount}</td>
              <td className={'border px-4 py-2'}>{String(departure.dispatchDate)}</td>
              <td className={'border px-4 py-2'}>{String(departure.arrivalDate)}</td>
              <td className={'border px-4 py-2'}>
                {specificDestinationOptions[departure.specificDestination] ||
                  departure.specificDestination}
              </td>
              <td className={'border px-4 py-2'}>{departure.user.name}</td>
              <td className={'border px-4 py-2'}>{departure.comments}</td>
              <td className={'border px-4 py-2'}>{statusOptions[departure.status]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DeparturesPage
