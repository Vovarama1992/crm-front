import React, { useMemo, useState } from 'react'

import { DealDto } from '@/entities/deal'
import { EditableTable } from '@/shared/ui/EditableTable'
import { ColumnDef } from '@tanstack/react-table'

export const SeeSelfPage = () => {
  const [filterInn, setFilterInn] = useState('')
  const [filterCounterparty, setFilterCounterparty] = useState('')

  const updateData = (newData: DealDto[]) => {
    console.log('Updated Data:', newData)
  }

  const handleFilterInnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterInn(e.target.value)
  }

  const handleFilterCounterpartyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCounterparty(e.target.value)
  }

  const filteredData = useMemo(() => {
    return data.filter(
      deal =>
        (!filterInn || deal.inn.toString().startsWith(filterInn)) &&
        (!filterCounterparty ||
          deal.counterparty.toLowerCase().startsWith(filterCounterparty.toLowerCase()))
    )
  }, [filterInn, filterCounterparty])

  console.log('filtered: ' + filteredData.length)

  return (
    <div className={'absolute left-[20%] top-[30%]'}>
      <div className={'mb-4'}>
        <input
          className={'border rounded px-2 py-1 mr-2'}
          onChange={handleFilterInnChange}
          placeholder={'Фильтр по ИНН'}
          type={'text'}
          value={filterInn}
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
        lossReasonOptions={lossReasonOptions}
        stageOptions={stageOptions}
        updateData={updateData}
      />
    </div>
  )
}

const columns: ColumnDef<DealDto>[] = [
  {
    accessorKey: 'counterparty',
    cell: info => info.getValue(),
    header: 'Контрагент',
  },
  {
    accessorKey: 'inn',
    cell: info => info.getValue(),
    header: 'ИНН',
  },
  {
    accessorKey: 'requestNumber',
    cell: info => info.getValue(),
    header: '№ запроса/задачи',
  },
  {
    accessorKey: 'dealVolume',
    cell: info => info.getValue(),
    header: 'Объём сделки',
  },
  {
    accessorKey: 'turnoverInRubles',
    cell: info => info.getValue(),
    header: 'Оборот в рублях',
  },
  {
    accessorKey: 'marginInRubles',
    cell: info => info.getValue(),
    header: 'Маржа в рублях',
  },
  {
    accessorKey: 'stage',
    cell: info => info.getValue(),
    header: 'Стадия сделки',
  },
  {
    accessorKey: 'closingDate',
    cell: info => info.getValue(),
    header: 'Дата закрытия',
  },
  {
    accessorKey: 'lossReason',
    cell: info => info.getValue(),
    header: 'Причина проигрыша',
  },
  {
    accessorKey: 'comment',
    cell: info => info.getValue(),
    header: 'Комментарий',
  },
]

const data: DealDto[] = [
  {
    closingDate: '2024-07-15',
    comment: 'Нет комментариев',
    counterparty: 'ООО "Ромашка"',
    dealVolume: 1000000,
    inn: 5234567890,
    lossReason: 'дорого',
    marginInRubles: 100000,
    requestNumber: 1,
    stage: 'отправлено КП',
    turnoverInRubles: 500000,
  },
  {
    closingDate: '2024-07-15',
    comment: 'Нет комментариев',
    counterparty: 'ООО "АРомашшка"',
    dealVolume: 1000000,
    inn: 2234567890,
    lossReason: 'пустомеля',
    marginInRubles: 100000,
    requestNumber: 2,
    stage: 'работа с возражениями(бюрократия)',
    turnoverInRubles: 500000,
  },
  {
    closingDate: '2024-07-15',
    comment: 'Нет комментариев',
    counterparty: 'ООО "Ромашко"',
    dealVolume: 1000000,
    inn: 1234667890,
    lossReason: 'нет раппорта',
    marginInRubles: 100000,
    requestNumber: 3,
    stage: 'выставлен счет',
    turnoverInRubles: 500000,
  },
]

const stageOptions = [
  { label: 'отправлено КП', value: 'отправлено КП' },
  { label: 'работа с возражениями(бюрократия)', value: 'работа с возражениями(бюрократия)' },
  { label: 'выставлен счет', value: 'выставлен счет' },
  { label: 'счет оплачен', value: 'счет оплачен' },
  { label: 'сделка закрыта', value: 'сделка закрыта' },
  { label: 'проигран', value: 'проигран' },
]

const lossReasonOptions = [
  { label: 'дорого', value: 'дорого' },
  { label: 'пустомеля', value: 'пустомеля' },
  { label: 'нет раппорта', value: 'нет раппорта' },
  { label: 'недоработал', value: 'недоработал' },
  { label: 'другое', value: 'другое' },
]
