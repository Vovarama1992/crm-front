import type { AuthContext } from '@/app/providers/router/types'

import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import { useGetAllDealsQuery } from '@/entities/deal'
import { useMeQuery } from '@/entities/session'
import { useGetDepartmentsQuery } from '@/entities/workers'
import { formatCurrency } from '@/pages/kopeechnik'
import { CustomColumnDef, EditableTable } from '@/shared/ui/EditableTable'
const formatDate = (date: Date | null | string) => {
  if (!date) {
    return ''
  }
  const validDate = typeof date === 'string' ? new Date(date) : date

  return validDate.toISOString().split('T')[0]
}

export type SummaryDto = {
  closeDate: null | string
  comment: null | string
  counterpartyName: string
  departmentId: number
  id: number
  marginRub: number
  specialistName: string
  stage: string
  turnoverRub: number
  userId: number
}

const stageOptions: { [key: string]: string } = {
  DEAL_CLOSED: 'сделка закрыта',
  INVOICE_PAID: 'счет оплачен',
  INVOICE_SENT: 'выставлен счет',
  LOST: 'проигран',
  QUOTE_SENT: 'отправлено КП',
  WORKING_WITH_OBJECTIONS: 'работа с возражениями(бюрократия)',
}

const userPermissions: { [key: string]: 'change' | 'null' | 'see' } = {
  closeDate: 'see',
  comment: 'see',
  counterpartyName: 'see',
  marginRub: 'see',
  stage: 'see',
  turnoverRub: 'see',
}

export const SummaryTablePage = () => {
  const [filterCounterparty, setFilterCounterparty] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<null | number>(null)

  const context = useOutletContext<AuthContext>()
  const { permissions } = context

  const { data: userData } = useMeQuery()
  const { data: deals = [] } = useGetAllDealsQuery()
  const { data: departments = [] } = useGetDepartmentsQuery()

  const filteredData: any[] = deals
    .filter(deal => {
      if (userData?.roleName === 'РОП' && userData.department_id !== deal.user.department_id) {
        return false
      }
      if (
        userData?.roleName !== 'Директор' &&
        userData?.roleName !== 'Закупщик' &&
        deal.userId !== userData?.id
      ) {
        return false
      }
      if (selectedDepartment && deal.user.department_id !== selectedDepartment) {
        return false
      }
      if (
        filterCounterparty &&
        !deal.counterparty.name.toLowerCase().includes(filterCounterparty.toLowerCase())
      ) {
        return false
      }

      return true
    })
    .map(deal => ({
      closeDate: formatDate(deal.closeDate),
      comment: deal.comment,
      counterpartyName: deal.counterparty.name,
      departmentId: deal.user.department_id,
      id: deal.id,
      marginRub: formatCurrency(deal.marginRub),
      specialistName: deal.user.name,
      stage: stageOptions[deal.stage],
      turnoverRub: formatCurrency(deal.turnoverRub),
      userId: deal.userId,
    }))

  const handleFilterCounterpartyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCounterparty(e.target.value)
  }

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(Number(e.target.value))
  }

  const totalDepartmentTurnover = filteredData.reduce((total, item) => total + item.turnoverRub, 0)
  const totalDepartmentProfit = filteredData.reduce((total, item) => total + item.marginRub, 0)

  const updateData = (newData: SummaryDto[]) => {
    console.log('Updated Data:', newData)
  }

  const columns: CustomColumnDef<SummaryDto>[] = [
    {
      accessorKey: 'specialistName',
      cell: info => info.getValue(),
      header: 'Имя специалиста',
      meta: { type: 'input' },
    },
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
        {(userData?.roleName === 'Закупщик' || userData?.roleName === 'Директор') && (
          <select
            className={'border rounded px-2 py-1 ml-4'}
            onChange={handleDepartmentChange}
            value={selectedDepartment || ''}
          >
            <option value={''}>Все отделы</option>
            {departments.map((department: any) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <EditableTable
        columns={columns}
        data={filteredData}
        tablename={'сводная таблица'}
        updateData={updateData}
        user_id={userData?.id || 1}
        userPermissions={userPermissions}
      />
      {permissions.summary_table && (
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
