/* eslint-disable max-lines */
import React, { useMemo, useState } from 'react'

import { DealDto } from '@/entities/deal'
import { useMeQuery } from '@/entities/session'
import { EditableTable } from '@/shared/ui/EditableTable'
import { ColumnDef } from '@tanstack/react-table'

import NewDealForm from './NewDealForm'

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
    counterparty: 'ООО "АРомашка"',
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

const employees = [
  { id: 1, name: 'Сотрудник 1', role: 'Логист' },
  { id: 2, name: 'Сотрудник 2', role: 'Логист' },
  { id: 3, name: 'Сотрудник 3', role: 'Бухгалтер' },
  { id: 4, name: 'Сотрудник 4', role: 'Закупщик' },
  { id: 5, name: 'Сотрудник 5', role: 'РОП' },
  { id: 6, name: 'Сотрудник 6', role: 'Директор' },
  { id: 7, name: 'Сотрудник 7', role: 'Логист' },
  { id: 8, name: 'Сотрудник 8', role: 'Логист' },
  { id: 9, name: 'Сотрудник 9', role: 'Бухгалтер' },
  { id: 10, name: 'Сотрудник 10', role: 'Закупщик' },
  { id: 11, name: 'Сотрудник 11', role: 'РОП' },
  { id: 12, name: 'Сотрудник 12', role: 'Директор' },
]

export const ContragentsPage = () => {
  const { data: userData } = useMeQuery()
  const userRole = userData?.roleName || ''
  const userId = userData?.id || 1

  const [deals, setDeals] = useState<DealDto[]>(data)
  const [filterInn, setFilterInn] = useState('')
  const [filterCounterparty, setFilterCounterparty] = useState('')
  const [isDealFormOpen, setIsDealFormOpen] = useState(false)
  const [initialFormData, setInitialFormData] = useState({
    counterparty: '',
    creationDate: '',
    dealNumber: '',
    inn: '',
  })
  const [selectedUserId, setSelectedUserId] = useState<number>(userId)

  const updateData = (newData: DealDto[]) => {
    setDeals(newData)
  }

  const handleFilterInnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterInn(e.target.value)
  }

  const handleFilterCounterpartyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCounterparty(e.target.value)
  }

  const filteredData = useMemo(() => {
    return deals.filter(
      deal =>
        deal.user_id === selectedUserId &&
        (!filterInn || deal.inn.toString().includes(filterInn)) &&
        (!filterCounterparty ||
          deal.counterparty.toLowerCase().includes(filterCounterparty.toLowerCase()))
    )
  }, [filterInn, filterCounterparty, selectedUserId, deals])

  const handleStageChange = (selectedOption: any, rowIndex: number, columnId: keyof DealDto) => {
    const updatedData = [...deals]
    const dealIndex = deals.findIndex(deal => deal.id === filteredData[rowIndex].id)

    if (dealIndex !== -1) {
      updatedData[dealIndex] = {
        ...updatedData[dealIndex],
        [columnId]: selectedOption.value,
      }

      setDeals(updatedData)

      if (selectedOption.value === 'счет оплачен') {
        const selectedDeal = updatedData[dealIndex]

        setInitialFormData({
          counterparty: selectedDeal.counterparty,
          creationDate: new Date().toISOString().split('T')[0], // Текущая дата
          dealNumber: selectedDeal.id.toString(),
          inn: selectedDeal.inn.toString(),
        })
        setIsDealFormOpen(true)
      }
    }
  }

  const availableUsers = useMemo(() => {
    if (userRole === 'Директор') {
      return employees // Предполагаем, что массив employees определен где-то в коде
    } else if (userRole === 'РОП') {
      return employees.filter(employee => employee.role === 'Логист') // Фильтрация по отделу
    } else {
      return employees.filter(employee => employee.id === userId)
    }
  }, [userRole, userId])

  const defaultRowGenerator = () => {
    const maxId = Math.max(0, ...deals.map(deal => deal.id))

    return {
      closingDate: '',
      comment: '',
      counterparty: '',
      dealVolume: 0,
      id: maxId + 1,
      inn: '',
      lossReason: '',
      marginInRubles: 0,
      stage: stageOptions[0].value,
      turnoverInRubles: 0,
      user_id: selectedUserId,
    }
  }

  return (
    <div className={'absolute left-[1%] w-[94vw] top-[15%]'}>
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
        <select
          className={'border rounded px-2 py-1 ml-2'}
          onChange={e => setSelectedUserId(Number(e.target.value))}
          value={selectedUserId}
        >
          {availableUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <EditableTable
        columns={columns}
        data={filteredData}
        defaultRowGenerator={defaultRowGenerator}
        onStageChange={handleStageChange}
        selectOptions={{ lossReason: lossReasonOptions, stage: stageOptions }}
        tablename={'контрагенты'}
        updateData={updateData}
        user_id={userId}
        userPermissions={userPermissions}
      />
      {isDealFormOpen && (
        <NewDealForm initialData={initialFormData} onClose={() => setIsDealFormOpen(false)} />
      )}
    </div>
  )
}
