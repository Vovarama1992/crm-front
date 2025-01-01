import React, { useState } from 'react'

import {
  useGetDeletedDeparturesQuery,
  useRestoreDepartureMutation,
} from '@/entities/departure/departure.api'

const destinationOptions = {
  RETURN_FROM_CLIENT: 'Возврат от клиента',
  RETURN_TO_SUPPLIER: 'Возврат поставщику',
  TO_CLIENT: 'До клиента',
  TO_US: 'До нас',
}

interface DeletedDeparturesProps {
  onClose: () => void
}

export const DeletedDepartures: React.FC<DeletedDeparturesProps> = ({ onClose }) => {
  const { data: deletedDepartures, isLoading } = useGetDeletedDeparturesQuery()
  const [restoreDeparture] = useRestoreDepartureMutation()

  const [filterNumber, setFilterNumber] = useState('')
  const [filterCounterparty, setFilterCounterparty] = useState('')
  const [filterDestination, setFilterDestination] = useState('')
  const [filterTransportCompany, setFilterTransportCompany] = useState('')
  const [filterSalesManager, setFilterSalesManager] = useState('') // Новый фильтр
  const [filterStatus, setFilterStatus] = useState('') // Новый фильтр

  const handleFilterNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterNumber(e.target.value)
  }

  const handleFilterCounterpartyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCounterparty(e.target.value)
  }

  const handleFilterDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterDestination(e.target.value)
  }

  const handleFilterTransportCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTransportCompany(e.target.value)
  }

  const handleFilterSalesManagerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Новый обработчик
    setFilterSalesManager(e.target.value)
  }

  const handleFilterStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Новый обработчик
    setFilterStatus(e.target.value)
  }

  const filteredDeletedDepartures =
    deletedDepartures?.filter(
      departure =>
        (!filterNumber || departure.dealId.toString().includes(filterNumber)) &&
        (!filterCounterparty ||
          departure?.counterparty?.name
            ?.toLowerCase()
            .includes(filterCounterparty.toLowerCase())) &&
        (!filterDestination || departure.destination === filterDestination) &&
        (!filterTransportCompany ||
          departure.transportCompany
            ?.toLowerCase()
            .includes(filterTransportCompany.toLowerCase())) &&
        (!filterSalesManager ||
          `${departure.user.name} ${departure.user.surname}`
            .toLowerCase()
            .includes(filterSalesManager.toLowerCase())) &&
        (!filterStatus || departure.status === filterStatus)
    ) || []

  const handleRestore = (id: number) => {
    restoreDeparture({ id })
      .unwrap()
      .then(() => {
        onClose()
      })
      .catch(() => {
        alert('Не удалось восстановить отправление')
      })
  }

  if (isLoading) {
    return (
      <div
        className={
          'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-[500px]'
        }
      >
        <div className={'bg-white p-4 rounded shadow-lg'}>
          <div className={'text-center'}>Загрузка...</div>
          <button className={'bg-red-500 text-white px-4 py-2 rounded mt-4'} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    )
  }

  if (!deletedDepartures || deletedDepartures.length === 0) {
    return (
      <div className={'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'}>
        <div className={'bg-white p-4 rounded shadow-lg'}>
          <div className={'text-center'}>Нет удаленных отправлений</div>
          <button className={'bg-red-500 text-white px-4 py-2 rounded mt-4'} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'}>
      <div className={'bg-white p-4 rounded shadow-lg w-[800px] max-w-full'}>
        <h2 className={'text-lg font-bold mb-4'}>Удаленные отправления</h2>

        <div className={'mb-4'}>
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
          <select
            className={'border rounded px-2 py-1 mr-2'}
            onChange={handleFilterDestinationChange}
            value={filterDestination}
          >
            <option value={''}>Все направления</option>
            {Object.entries(destinationOptions).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <input
            className={'border rounded px-2 py-1 mr-2'}
            onChange={handleFilterTransportCompanyChange}
            placeholder={'Фильтр по транспортной компании'}
            type={'text'}
            value={filterTransportCompany}
          />
          <input
            className={'border rounded px-2 py-1 mr-2'}
            onChange={handleFilterSalesManagerChange} // Новый фильтр
            placeholder={'Фильтр по менеджеру продаж'}
            type={'text'}
            value={filterSalesManager} // Новый фильтр
          />
          <select
            className={'border rounded px-2 py-1 mr-2'}
            onChange={handleFilterStatusChange} // Новый фильтр
            value={filterStatus} // Новый фильтр
          >
            <option value={''}>Все статусы</option>
            <option value={'ACTIVE'}>Активно</option>
            <option value={'INACTIVE'}>Неактивно</option>
          </select>
        </div>

        <table className={'table-auto w-full border-collapse border'}>
          <thead>
            <tr>
              <th className={'border px-4 py-2'}>Номер</th>
              <th className={'border px-4 py-2'}>Контрагент</th>
              <th className={'border px-4 py-2'}>Куда</th>
              <th className={'border px-4 py-2'}>Транспортная компания</th>
              <th className={'border px-4 py-2'}>Комментарий</th>
              <th className={'border px-4 py-2'}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeletedDepartures.map(departure => (
              <tr key={departure.id}>
                <td className={'border px-4 py-2'}>{departure.dealId}</td>
                <td className={'border px-4 py-2'}>{departure?.counterparty?.name}</td>
                <td className={'border px-4 py-2'}>
                  {destinationOptions[departure.destination] || 'Неизвестно'}
                </td>
                <td className={'border px-4 py-2'}>{departure.transportCompany}</td>
                <td className={'border px-4 py-2'}>{departure.comments}</td>
                <td className={'border px-4 py-2'}>
                  <button
                    className={'bg-green-500 text-white px-4 py-2 rounded'}
                    onClick={() => handleRestore(departure.id)}
                  >
                    Восстановить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className={'bg-red-500 text-white px-4 py-2 rounded mt-4'} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  )
}
