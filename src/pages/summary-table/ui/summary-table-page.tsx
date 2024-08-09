/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/rules-of-hooks */
import type { AuthContext } from '@/app/providers/router/types'

import React, { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  useGetAllDealsQuery,
  useGetDealsByDepartmentQuery,
  useGetDealsByUserIdQuery,
} from '@/entities/deal/deal.api'
import { useMeQuery } from '@/entities/session'
import { EditableTable } from '@/shared/ui/EditableTable'
import { ColumnDef } from '@tanstack/react-table'

export type SummaryDto = {
  closeDate: null | string
  comment: null | string
  counterpartyName: string
  id: number
  marginRub: number
  stage: string
  turnoverRub: number
}

interface CustomColumnMeta {
  type?: 'input' | 'select'
}

interface CustomColumnDef<TData> extends Omit<ColumnDef<TData, unknown>, 'meta'> {
  accessorKey: keyof TData
  meta?: CustomColumnMeta
}

const userPermissions: { [key: string]: 'change' | 'null' | 'see' } = {
  closeDate: 'see',
  comment: 'see',
  counterpartyName: 'see',
  marginRub: 'see',
  stage: 'see',
  turnoverRub: 'see',
}

const stageOptions = {
  DEAL_CLOSED: 'сделка закрыта',
  INVOICE_PAID: 'счет оплачен',
  INVOICE_SENT: 'выставлен счет',
  LOST: 'проигран',
  QUOTE_SENT: 'отправлено КП',
  WORKING_WITH_OBJECTIONS: 'работа с возражениями(бюрократия)',
}

const columns: CustomColumnDef<SummaryDto>[] = [
  {
    accessorKey: 'counterpartyName',
    cell: info => info.getValue(),
    header: 'Контрагент',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'turnoverRub',
    cell: info => info.getValue(),
    header: 'Оборот в рублях',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'marginRub',
    cell: info => info.getValue(),
    header: 'Маржа в рублях',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'stage',
    cell: info => stageOptions[info.getValue() as keyof typeof stageOptions],
    header: 'Стадия сделки',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'closeDate',
    cell: info => info.getValue(),
    header: 'Дата закрытия',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'comment',
    cell: info => info.getValue(),
    header: 'Комментарий',
    meta: { type: 'input' },
  },
]

export const SummaryTablePage = () => {
  const [filterCounterparty, setFilterCounterparty] = useState('')

  const context = useOutletContext<AuthContext>()
  const { permissions } = context

  const { data: userData } = useMeQuery()
  const userId = userData?.id
  const roleName = userData?.roleName
  const departmentId = userData?.department_id

  const { data: deals = [], refetch } =
    roleName === 'РОП' && userId && departmentId
      ? useGetDealsByDepartmentQuery(String(departmentId))
      : roleName === 'Закупщик' || roleName === 'Директор'
        ? useGetAllDealsQuery()
        : useGetDealsByUserIdQuery(String(userId))

  const isCommonViewer = permissions.summary_table

  const handleFilterCounterpartyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCounterparty(e.target.value)
  }

  const filteredData = useMemo(() => {
    return deals
      .filter(
        deal =>
          !filterCounterparty ||
          deal.counterparty.name.toLowerCase().includes(filterCounterparty.toLowerCase())
      )
      .map(deal => ({
        closeDate: deal.closeDate,
        comment: deal.comment,
        counterpartyName: deal.counterparty.name,
        id: deal.id,
        marginRub: deal.marginRub,
        stage: stageOptions[deal.stage],
        turnoverRub: deal.turnoverRub,
      }))
  }, [filterCounterparty, deals])

  const totalDepartmentTurnover = filteredData.reduce((total, item) => total + item.turnoverRub, 0)
  const totalDepartmentProfit = filteredData.reduce((total, item) => total + item.marginRub, 0)

  const updateData = (newData: SummaryDto[]) => {
    console.log('Updated Data:', newData)
    refetch()
  }

  return (
    <div className={'absolute w-[94vw] left-[1%] top-[15%]'}>
      <div className={'mb-4 ml-[10%]'}>
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
        tablename={'сводная таблица'}
        updateData={updateData}
        user_id={userId || 1}
        userPermissions={userPermissions}
      />
      {isCommonViewer && (
        <SummaryFooterTable
          totalDepartmentProfit={totalDepartmentProfit}
          totalDepartmentTurnover={totalDepartmentTurnover}
        />
      )}
    </div>
  )
}

type SummaryFooterData = {
  totalDepartmentProfit: number
  totalDepartmentTurnover: number
}

const SummaryFooterTable: React.FC<SummaryFooterData> = ({
  totalDepartmentProfit,
  totalDepartmentTurnover,
}) => {
  return (
    <table className={'border mt-4 w-full'}>
      <thead>
        <tr>
          <th className={'border px-4 py-2'}>Оборот всего отдела</th>
          <th className={'border px-4 py-2'}>Прибыль всего отдела</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={'border px-4 py-2'}>{totalDepartmentTurnover}</td>
          <td className={'border px-4 py-2'}>{totalDepartmentProfit}</td>
        </tr>
      </tbody>
    </table>
  )
}

export default SummaryTablePage
