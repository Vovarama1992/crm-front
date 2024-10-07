/* eslint-disable max-lines */
import React, { useState } from 'react'

import { DepartureDto } from '@/entities/departure'
import {
  useGetDeparturesQuery,
  useUpdateDepartureMutation,
} from '@/entities/departure/departure.api'
import { useMeQuery } from '@/entities/session'
import { WorkerDto } from '@/entities/workers'
import { useGetWorkersQuery } from '@/entities/workers'
import { formatCurrency } from '@/pages/kopeechnik'

import { CreateDepartureForm } from './CreateDepartureForm'
import { EditDepartureForm } from './EditDepartureForm'

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

const formatDate = (date: Date | null | string) => {
  if (!date) {
    return ''
  }
  const validDate = typeof date === 'string' ? new Date(date) : date

  return validDate.toISOString().split('T')[0]
}

export const DeparturesPage = () => {
  const { data: userData } = useMeQuery() // Получаем данные текущего пользователя
  const [filterNumber, setFilterNumber] = useState('')
  const [filterCounterparty, setFilterCounterparty] = useState('')
  const [filterDestination, setFilterDestination] = useState('')
  const [filterTransportCompany, setFilterTransportCompany] = useState('')
  const [filterSalesManager, setFilterSalesManager] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedDeparture, setSelectedDeparture] = useState<DepartureDto | null>(null)

  const { data: departuresData } = useGetDeparturesQuery()
  const [updateDeparture] = useUpdateDepartureMutation()

  const { data: workers } = useGetWorkersQuery()

  function findCreator(id: number) {
    const defaultWorker = { name: '', surname: '' }
    const worker = workers?.find((worker: WorkerDto) => worker.id === id)

    return worker ? worker.name + ' ' + worker.surname : defaultWorker.name
  }

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
    setFilterSalesManager(e.target.value)
  }

  const handleFilterStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value)
  }

  const handleSelectChange = (id: number, field: keyof DepartureDto, value: number | string) => {
    updateDeparture({
      data: { [field]: value },
      id,
    })
  }

  const handleEditClick = (departure: DepartureDto) => {
    setSelectedDeparture(departure)
    setIsEditing(true)
  }

  // Функция проверки роли
  const hasEditPermission = (departure: DepartureDto) => {
    if (!userData?.roleName) {
      return false
    }
    const allowedRoles = ['Директор', 'Закупщик', 'Логист'] // роли, которые могут редактировать

    return allowedRoles.includes(userData.roleName) || userData.id === departure.userId
  }

  const hasCreatePermission = ['Директор', 'Закупщик', 'Логист'].includes(userData?.roleName || '')

  const filteredData =
    departuresData?.filter(
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
          onChange={handleFilterSalesManagerChange}
          placeholder={'Фильтр по менеджеру продажи'}
          type={'text'}
          value={filterSalesManager}
        />
        <select
          className={'border rounded px-2 py-1 mr-2'}
          onChange={handleFilterStatusChange}
          value={filterStatus}
        >
          <option value={''}>Все статусы</option>
          {Object.entries(statusOptions).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        {hasCreatePermission && (
          <button
            className={'bg-green-500 text-white px-4 py-2 rounded'}
            onClick={() => setIsCreating(true)}
          >
            Добавить отправление
          </button>
        )}
      </div>

      {isCreating && <CreateDepartureForm onClose={() => setIsCreating(false)} />}

      {isEditing && selectedDeparture && (
        <EditDepartureForm departure={selectedDeparture} onClose={() => setIsEditing(false)} />
      )}

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
            <th className={'border px-4 py-2'}>Менеджер продажи</th>
            <th className={'border px-4 py-2'}>Менеджер отправления</th>
            <th className={'border px-4 py-2'}>Комментарий</th>
            <th className={'border px-4 py-2'}>Статус</th>
            <th className={'border px-4 py-2'}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(departure => (
            <tr key={departure.id}>
              <td className={'border px-4 py-2'}>{departure.dealId}</td>
              <td className={'border px-4 py-2'}>{departure?.counterparty?.name}</td>
              <td className={'border px-4 py-2'}>
                {hasEditPermission(departure) ? (
                  <select
                    className={'border rounded p-1'}
                    onChange={e => handleSelectChange(departure.id, 'destination', e.target.value)}
                    value={departure.destination}
                  >
                    {Object.entries(destinationOptions).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{destinationOptions[departure.destination]}</span> // Отображаем текущее значение
                )}
              </td>
              <td className={'border px-4 py-2'}>{departure.transportCompany}</td>
              <td className={'border px-4 py-2'}>{departure.trackingNumber}</td>
              <td className={'border px-4 py-2'}>
                {departure.finalAmount ? formatCurrency(departure.finalAmount) : null}
              </td>
              <td className={'border px-4 py-2'}>{formatDate(departure.dispatchDate)}</td>
              <td className={'border px-4 py-2'}>{formatDate(departure.arrivalDate)}</td>
              <td className={'border px-4 py-2'}>
                {hasEditPermission(departure) ? (
                  <select
                    className={'border rounded p-1'}
                    onChange={e =>
                      handleSelectChange(departure.id, 'specificDestination', e.target.value)
                    }
                    value={departure.specificDestination}
                  >
                    {Object.entries(specificDestinationOptions).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{specificDestinationOptions[departure.specificDestination]}</span> // Отображаем текущее значение
                )}
              </td>
              <td className={'border px-4 py-2'}>
                {departure.user.name} {departure.user.surname}
              </td>
              <td className={'border px-4 py-2'}>{findCreator(departure.departureCreator)}</td>
              <td className={'border px-4 py-2'}>{departure.comments}</td>
              <td className={'border px-4 py-2'}>
                {hasEditPermission(departure) ? (
                  <select
                    className={'border rounded p-1'}
                    onChange={e => handleSelectChange(departure.id, 'status', e.target.value)}
                    value={departure.status}
                  >
                    {Object.entries(statusOptions).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{statusOptions[departure.status]}</span> // Отображаем текущее значение статуса
                )}
              </td>
              <td className={'border px-4 py-2'}>
                {hasEditPermission(departure) && (
                  <button
                    className={'bg-blue-500 text-white px-2 py-1 rounded'}
                    onClick={() => handleEditClick(departure)}
                  >
                    Редактировать
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DeparturesPage
