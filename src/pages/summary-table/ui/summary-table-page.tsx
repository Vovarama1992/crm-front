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
  // Используем localStorage для сохранения фильтров
  const [filterCounterparty, setFilterCounterparty] = useState(
    localStorage.getItem('summaryTableFilterCounterparty') || ''
  )
  const [selectedDepartment, setSelectedDepartment] = useState<null | number>(
    Number(localStorage.getItem('summaryTableSelectedDepartment')) || null
  )

  const context = useOutletContext<AuthContext>()
  const { permissions } = context

  const { data: userData } = useMeQuery()
  const { data: deals = [] } = useGetAllDealsQuery()
  const { data: departments = [] } = useGetDepartmentsQuery()

  // Фильтрация данных
  const filteredData: any[] = deals
    .filter(deal => {
      if (userData?.roleName === 'РОП') {
        if (userData.department_id !== deal.user.department_id) {
          return false
        }
      }

      if (
        userData?.roleName !== 'Директор' &&
        userData?.roleName !== 'Закупщик' &&
        userData?.roleName !== 'РОП' &&
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
      marginRub: deal.marginRub,
      specialistName: deal.user.name,
      stage: stageOptions[deal.stage],
      turnoverRub: deal.turnoverRub,
      userId: deal.userId,
    }))

  // Обновление фильтра по контрагенту с сохранением в localStorage
  const handleFilterCounterpartyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCounterparty(e.target.value)
    localStorage.setItem('summaryTableFilterCounterparty', e.target.value)
  }

  // Обновление выбранного отдела с сохранением в localStorage
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const department = Number(e.target.value)

    setSelectedDepartment(department)
    localStorage.setItem('summaryTableSelectedDepartment', String(department))
  }

  // Корректный подсчет оборота и прибыли по отображенным данным
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
      cell: info => formatCurrency(info.getValue() as number), // Явное приведение к числу
      header: 'Оборот в рублях',
      meta: { type: 'input' },
    },
    {
      accessorKey: 'marginRub',
      cell: info => formatCurrency(info.getValue() as number), // Явное приведение к числу
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
      cell: info => (
        <div className={'break-words whitespace-pre-wrap'}>{String(info.getValue())}</div>
      ),
      header: 'Комментарий',
      meta: { type: 'input' },
    },
  ]

  return (
    <div className={'max-w-[95%] mx-auto'}>
      <div className={'mb-4 flex flex-wrap items-center'}>
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
          <td className={'border px-4 py-2'}>{formatCurrency(totalDepartmentTurnover)}</td>
          <td className={'border px-4 py-2'}>{formatCurrency(totalDepartmentProfit)}</td>
        </tr>
      </tbody>
    </table>
  )
}

export default SummaryTablePage
