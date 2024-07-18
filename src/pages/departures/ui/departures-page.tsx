import React, { useMemo, useState } from 'react'
import Select from 'react-select'

import { DepartureDto } from '@/entities/departure'
import { EditableTable } from '@/shared/ui/EditableTable'
import { ColumnDef } from '@tanstack/react-table'

const destinationOptions = [
  { label: 'До клиента', value: 'До клиента' },
  { label: 'До нас', value: 'До нас' },
  { label: 'Возврат от клиента', value: 'Возврат от клиента' },
  { label: 'Возврат поставщику', value: 'Возврат поставщику' },
]

const specificDestinationOptions = [
  { label: 'до терминала', value: 'до терминала' },
  { label: 'до двери', value: 'до двери' },
]

interface CustomColumnMeta {
  options?: { label: string; value: string }[]
  type?: 'input' | 'select'
}

interface CustomColumnDef<TData> extends Omit<ColumnDef<TData, unknown>, 'meta'> {
  accessorKey: keyof TData
  meta?: CustomColumnMeta
}

const userPermissions: { [key: string]: 'change' | 'null' | 'see' } = {
  arrival_date: 'see',
  comment: 'change',
  counterparty_name: 'change',
  create: 'see',
  departure_date: 'see',
  destination: 'change',
  final_amount: 'change',
  manager: 'see',
  number: 'see',
  specific_destination: 'change',
  tracking_number: 'change',
  transport_company: 'change',
}

const columns: CustomColumnDef<DepartureDto>[] = [
  {
    accessorKey: 'number',
    cell: info => info.getValue(),
    header: 'Номер',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'counterparty_name',
    cell: info => info.getValue(),
    header: 'Контрагент',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'destination',
    cell: info => info.getValue(),
    header: 'Куда',
    meta: { options: destinationOptions, type: 'select' },
  },
  {
    accessorKey: 'transport_company',
    cell: info => info.getValue(),
    header: 'Транспортная компания',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'tracking_number',
    cell: info => info.getValue(),
    header: 'Трек номер',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'final_amount',
    cell: info => info.getValue(),
    header: 'Финальная сумма',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'departure_date',
    cell: info => info.getValue(),
    header: 'Дата отправки',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'arrival_date',
    cell: info => info.getValue(),
    header: 'Дата поступления',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'specific_destination',
    cell: info => info.getValue(),
    header: 'Куда конкретно',
    meta: { options: specificDestinationOptions, type: 'select' },
  },
  {
    accessorKey: 'manager',
    cell: info => info.getValue(),
    header: 'Менеджер',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'comment',
    cell: info => info.getValue(),
    header: 'Комментарий',
    meta: { type: 'input' },
  },
]

const data: DepartureDto[] = [
  {
    arrival_date: '2024-07-12',
    comment: 'Комментарий 1',
    counterparty_name: 'ООО Ромашка',
    departure_date: '2024-07-10',
    destination: 'До клиента',
    final_amount: 5000,
    manager: 'Иван Иванов',
    number: 1,
    specific_destination: 'до двери',
    tracking_number: 123456789,
    transport_company: 'Деловые Линии',
  },
  {
    arrival_date: '2024-07-13',
    comment: 'Комментарий 2',
    counterparty_name: 'АО Ландыш',
    departure_date: '2024-07-11',
    destination: '',
    final_amount: null,
    manager: 'Петр Петров',
    number: 2,
    specific_destination: 'до терминала',
    tracking_number: null,
    transport_company: 'ПЭК',
  },
]

export const DeparturesPage = () => {
  const [filterNumber, setFilterNumber] = useState('')
  const [filterCounterparty, setFilterCounterparty] = useState('')

  const updateData = (newData: DepartureDto[]) => {
    console.log('Updated Data:', newData)
  }

  const handleFilterNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterNumber(e.target.value)
  }

  const handleFilterCounterpartyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCounterparty(e.target.value)
  }

  const filteredData = useMemo(() => {
    return data.filter(
      departure =>
        (!filterNumber || departure.number.toString().startsWith(filterNumber)) &&
        (!filterCounterparty ||
          departure.counterparty_name.toLowerCase().startsWith(filterCounterparty.toLowerCase()))
    )
  }, [filterNumber, filterCounterparty])

  console.log('filtered: ' + filteredData.length)

  return (
    <div className={'absolute left-[1%] top-[15%]'}>
      <div className={'mb-4 ml-[10%]'}>
        <input
          className={'border rounded px-2 py-1 mr-2'}
          onChange={handleFilterNumberChange}
          placeholder={'Фильтр по номеру'}
          type={'text'}
          value={filterNumber}
        />
        <input
          className={'border rounded px-2 py-1'}
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
          specific_destination: specificDestinationOptions,
        }}
        updateData={updateData}
        user_id={1}
        userPermissions={userPermissions}
      />
    </div>
  )
}
