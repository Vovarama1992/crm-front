import React, { useMemo, useState } from 'react'

import { DealDto } from '@/entities/deal'
import { EditableTable } from '@/shared/ui/EditableTable'
import { ColumnDef } from '@tanstack/react-table'

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

interface CustomColumnMeta {
  options?: { label: string; value: string }[]
  type?: 'input' | 'select'
}

interface CustomColumnDef<TData> extends Omit<ColumnDef<TData, unknown>, 'meta'> {
  accessorKey: keyof TData
  meta?: CustomColumnMeta
}

const userPermissions: { [key: string]: 'change' | 'null' | 'see' } = {
  closingDate: 'see',
  comment: 'see',
  counterparty: 'see',
  create: 'see',
  dealVolume: 'see',
  id: 'see',
  inn: 'change',
  lossReason: 'change',
  marginInRubles: 'see',
  stage: 'change',
  turnoverInRubles: 'see',
}

const columns: CustomColumnDef<DealDto>[] = [
  {
    accessorKey: 'counterparty',
    cell: info => info.getValue(),
    header: 'Контрагент',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'inn',
    cell: info => info.getValue(),
    header: 'ИНН',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'id',
    cell: info => info.getValue(),
    header: '№ запроса/задачи',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'dealVolume',
    cell: info => info.getValue(),
    header: 'Объём сделки',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'turnoverInRubles',
    cell: info => info.getValue(),
    header: 'Оборот в рублях',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'marginInRubles',
    cell: info => info.getValue(),
    header: 'Маржа в рублях',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'stage',
    cell: info => info.getValue(),
    header: 'Стадия сделки',
    meta: { options: stageOptions, type: 'select' },
  },
  {
    accessorKey: 'closingDate',
    cell: info => info.getValue(),
    header: 'Дата закрытия',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'lossReason',
    cell: info => info.getValue(),
    header: 'Причина проигрыша',
    meta: { options: lossReasonOptions, type: 'select' },
  },
  {
    accessorKey: 'comment',
    cell: info => info.getValue(),
    header: 'Комментарий',
    meta: { type: 'input' },
  },
]

const data: DealDto[] = [
  {
    closingDate: '2024-07-15',
    comment: 'Нет комментариев',
    counterparty: 'ООО "Ромашка"',
    dealVolume: 1000000,
    id: 1,
    inn: 5234567890,
    lossReason: 'дорого',
    marginInRubles: 100000,
    stage: 'отправлено КП',
    turnoverInRubles: 500000,
    user_id: 1,
  },
  {
    closingDate: '2024-07-15',
    comment: 'Нет комментариев',
    counterparty: 'ООО "АРомашшка"',
    dealVolume: 1000000,
    id: 2,
    inn: 2234567890,
    lossReason: 'пустомеля',
    marginInRubles: 100000,
    stage: 'работа с возражениями(бюрократия)',
    turnoverInRubles: 500000,
    user_id: 2,
  },
  {
    closingDate: '2024-07-15',
    comment: 'Нет комментариев',
    counterparty: 'ООО "Ромашко"',
    dealVolume: 1000000,
    id: 3,
    inn: 1234667890,
    lossReason: 'нет раппорта',
    marginInRubles: 100000,
    stage: 'выставлен счет',
    turnoverInRubles: 500000,
    user_id: 1,
  },
]

export const ContragentsPage = () => {
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
    <div className={'absolute left-[1%] top-[15%]'}>
      <div className={'mb-4 ml-[10%]'}>
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
        selectOptions={{ lossReason: lossReasonOptions, stage: stageOptions }}
        updateData={updateData}
        user_id={1}
        userPermissions={userPermissions}
      />
    </div>
  )
}
