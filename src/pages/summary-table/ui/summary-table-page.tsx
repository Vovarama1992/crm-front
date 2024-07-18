import type { AuthContext } from '@/app/providers/router/types'

import React, { useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'

import { EditableTable } from '@/shared/ui/EditableTable'
import { ColumnDef } from '@tanstack/react-table'

export type SummaryDto = {
  account: number
  company: string
  departmentProfitPlan: number
  departmentTurnoverPlan: number
  logistics: number
  moneyReceived: number
  profit: number
  quarterlyProfitPlan: number
  quarterlyTurnoverPlan: number
  specialist: string
  totalProfit: number
  totalTurnover: number
}

interface CustomColumnMeta {
  type?: 'input' | 'select'
}

interface CustomColumnDef<TData> extends Omit<ColumnDef<TData, unknown>, 'meta'> {
  accessorKey: keyof TData
  meta?: CustomColumnMeta
}

const userPermissions: { [key: string]: 'change' | 'null' | 'see' } = {
  account: 'see',
  company: 'see',
  departmentProfitPlan: 'see',
  departmentTurnoverPlan: 'see',
  logistics: 'see',
  moneyReceived: 'see',
  profit: 'see',
  quarterlyProfitPlan: 'see',
  quarterlyTurnoverPlan: 'see',
  specialist: 'see',
  totalProfit: 'see',
  totalTurnover: 'see',
}

const columns: CustomColumnDef<SummaryDto>[] = [
  {
    accessorKey: 'account',
    cell: info => info.getValue(),
    header: 'Счет',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'company',
    cell: info => info.getValue(),
    header: 'Компания',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'departmentProfitPlan',
    cell: info => info.getValue(),
    header: 'План прибыли департамента',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'departmentTurnoverPlan',
    cell: info => info.getValue(),
    header: 'План оборота департамента',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'logistics',
    cell: info => info.getValue(),
    header: 'Логистика',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'moneyReceived',
    cell: info => info.getValue(),
    header: 'Получено денег',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'profit',
    cell: info => info.getValue(),
    header: 'Прибыль',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'quarterlyProfitPlan',
    cell: info => info.getValue(),
    header: 'Квартальный план прибыли',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'quarterlyTurnoverPlan',
    cell: info => info.getValue(),
    header: 'Квартальный план оборота',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'specialist',
    cell: info => info.getValue(),
    header: 'Специалист',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'totalProfit',
    cell: info => info.getValue(),
    header: 'Общая прибыль',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'totalTurnover',
    cell: info => info.getValue(),
    header: 'Общий оборот',
    meta: { type: 'input' },
  },
]

const data: SummaryDto[] = [
  {
    account: 123456,
    company: 'Компания 1',
    departmentProfitPlan: 1000000,
    departmentTurnoverPlan: 2000000,
    logistics: 150000,
    moneyReceived: 1200000,
    profit: 300000,
    quarterlyProfitPlan: 250000,
    quarterlyTurnoverPlan: 500000,
    specialist: 'Специалист 1',
    totalProfit: 500000,
    totalTurnover: 1000000,
  },
  {
    account: 789012,
    company: 'Компания 2',
    departmentProfitPlan: 2000000,
    departmentTurnoverPlan: 4000000,
    logistics: 300000,
    moneyReceived: 2400000,
    profit: 600000,
    quarterlyProfitPlan: 500000,
    quarterlyTurnoverPlan: 1000000,
    specialist: 'Специалист 2',
    totalProfit: 1000000,
    totalTurnover: 2000000,
  },
]

export const SummaryTablePage = () => {
  const [filterAccount, setFilterAccount] = useState('')
  const [filterCompany, setFilterCompany] = useState('')

  const context = useOutletContext<AuthContext>()
  const { permissions } = context

  const isCommonViwer = permissions.summary_table


  const updateData = (newData: SummaryDto[]) => {
    console.log('Updated Data:', newData)
  }

  const handleFilterAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterAccount(e.target.value)
  }

  const handleFilterCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCompany(e.target.value)
  }

  const filteredData = useMemo(() => {
    return data.filter(
      summary =>
        (!filterAccount || summary.account.toString().startsWith(filterAccount)) &&
        (!filterCompany || summary.company.toLowerCase().startsWith(filterCompany.toLowerCase()))
    )
  }, [filterAccount, filterCompany])

  const totalDepartmentTurnover = filteredData.reduce(
    (total, item) => total + item.totalTurnover,
    0
  )
  const totalDepartmentProfit = filteredData.reduce((total, item) => total + item.totalProfit, 0)

  console.log('filtered: ' + filteredData.length)

  return (
    <div className={'absolute left-[1%] top-[15%]'}>
      <div className={'mb-4 ml-[10%]'}>
        <input
          className={'border rounded px-2 py-1 mr-2'}
          onChange={handleFilterAccountChange}
          placeholder={'Фильтр по счету'}
          type={'text'}
          value={filterAccount}
        />
        <input
          className={'border rounded px-2 py-1'}
          onChange={handleFilterCompanyChange}
          placeholder={'Фильтр по компании'}
          type={'text'}
          value={filterCompany}
        />
      </div>
      <EditableTable
        columns={columns}
        data={filteredData}
        updateData={updateData}
        user_id={1}
        userPermissions={userPermissions}
      />
      {isCommonViwer && (
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
