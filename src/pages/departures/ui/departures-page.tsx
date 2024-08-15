/* eslint-disable max-lines */
import React, { useMemo, useState } from 'react'

import { DepartureDto } from '@/entities/departure'
import {
  useGetDeparturesQuery,
  useUpdateDepartureMutation,
} from '@/entities/departure/departure.api'
import { useMeQuery } from '@/entities/session'
import { EditableTable } from '@/shared/ui/EditableTable'
import { ColumnDef } from '@tanstack/react-table'

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

const statusOptions = [
  { label: 'Отправлено все', value: 'SENT_ALL' },
  { label: 'Отправлено частично', value: 'SENT_PARTIALLY' },
  { label: 'Доставлено все', value: 'DELIVERED_ALL' },
  { label: 'Доставлено частично', value: 'DELIVERED_PARTIALLY' },
  { label: 'Проблема', value: 'PROBLEM' },
]

interface CustomColumnMeta {
  options?: { label: string; value: string }[]
  type?: 'input' | 'select'
}

interface CustomColumnDef<TData> extends Omit<ColumnDef<TData, unknown>, 'meta'> {
  accessorKey: keyof TData
  meta?: CustomColumnMeta
}

const columns: CustomColumnDef<DepartureDto>[] = [
  {
    accessorKey: 'dealId',
    cell: info => info.getValue(),
    header: 'Номер',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'counterpartyId',
    cell: info => info.getValue(),
    header: 'Контрагент ID',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'destination',
    cell: info => {
      const value = info.getValue() as string
      const option = destinationOptions.find(opt => opt.value === value)

      return option ? option.label : value
    },
    header: 'Куда',
    meta: { options: destinationOptions, type: 'select' },
  },
  {
    accessorKey: 'transportCompany',
    cell: info => info.getValue(),
    header: 'Транспортная компания',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'trackingNumber',
    cell: info => info.getValue(),
    header: 'Трек номер',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'finalAmount',
    cell: info => info.getValue(),
    header: 'Финальная сумма',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'dispatchDate',
    cell: info => info.getValue(),
    header: 'Дата отправки',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'arrivalDate',
    cell: info => info.getValue(),
    header: 'Дата поступления',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'specificDestination',
    cell: info => {
      const value = info.getValue() as string
      const option = specificDestinationOptions.find(opt => opt.value === value)

      return option ? option.label : value
    },
    header: 'Куда конкретно',
    meta: { options: specificDestinationOptions, type: 'select' },
  },
  {
    accessorKey: 'userId',
    cell: info => info.getValue(),
    header: 'Менеджер',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'comments',
    cell: info => info.getValue(),
    header: 'Комментарий',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'status',
    cell: info => {
      const value = info.getValue() as string
      const option = statusOptions.find(opt => opt.value === value)

      return option ? option.label : value
    },
    header: 'Статус',
    meta: { options: statusOptions, type: 'select' },
  },
]

export const DeparturesPage = () => {
  const [filterNumber, setFilterNumber] = useState('')
  const [filterCounterparty, setFilterCounterparty] = useState('')
  const { data: departuresData } = useGetDeparturesQuery()
  const [updateDeparture] = useUpdateDepartureMutation() // Хук для обновления
  const { data } = useMeQuery()
  const activeId = data?.id || 9999

  const handleFilterNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterNumber(e.target.value)
  }

  const handleFilterCounterpartyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCounterparty(e.target.value)
  }

  const updateData = async (newData: DepartureDto[]) => {
    try {
      for (const departure of newData) {
        await updateDeparture({ data: departure, id: departure.id }).unwrap()
      }
      alert('Отправление успешно обновлено!')
    } catch (error) {
      console.error('Ошибка при обновлении отправления:', error)
    }
  }

  const filteredData = useMemo(() => {
    if (!departuresData) {
      return []
    }

    return departuresData.filter(
      departure =>
        (!filterNumber || departure.dealId.toString().includes(filterNumber)) &&
        (!filterCounterparty || departure.counterpartyId.toString().includes(filterCounterparty))
    )
  }, [filterNumber, filterCounterparty, departuresData])

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
      </div>
      <EditableTable
        columns={columns}
        data={filteredData}
        selectOptions={{
          destination: destinationOptions,
          specificDestination: specificDestinationOptions,
          status: statusOptions,
        }}
        tablename={'отправления'}
        updateData={updateData} // Используем обработчик обновления
        user_id={activeId}
        userPermissions={{
          arrivalDate: 'see',
          comments: 'change',
          counterpartyId: 'see',
          dealId: 'see',
          destination: 'change',
          dispatchDate: 'see',
          finalAmount: 'see',
          specificDestination: 'change',
          status: 'change',
          trackingNumber: 'change',
          transportCompany: 'change',
          userId: 'see',
        }}
      />
    </div>
  )
}

export default DeparturesPage
