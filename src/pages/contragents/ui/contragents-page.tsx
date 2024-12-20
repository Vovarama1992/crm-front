/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react'

import { DealDto } from '@/entities/deal'
import { useGetAllDealsQuery, useUpdateDealMutation } from '@/entities/deal/deal.api'
import { useMeQuery } from '@/entities/session'
import { useGetWorkersQuery } from '@/entities/workers'
import { formatCurrency } from '@/pages/kopeechnik'

import NewCounterpartyForm from './NewCounterpartyForm'
import { stageOptions } from './NewDealForm'
import NewDealForm from './NewDealForm'
import { SaleForm } from './Saleform'

const lossReasonOptions = [
  { label: 'дорого', value: 'EXPENSIVE' },
  { label: 'пустомеля', value: 'EMPTY_TALK' },
  { label: 'нет раппорта', value: 'NO_REPORT' },
  { label: 'недоработал', value: 'DID_NOT_WORK' },
  { label: 'другое', value: 'OTHER' },
]

const stageToPercentageMap: { [key: string]: number } = {
  DEAL_CLOSED: 100,
  INVOICE_PAID: 90,
  INVOICE_SENT: 80,
  LOST: 0,
  QUOTE_SENT: 50,
  WORKING_WITH_OBJECTIONS: 60,
}

const formatDate = (date: Date | null | string) => {
  if (!date) {
    return ''
  }
  const validDate = typeof date === 'string' ? new Date(date) : date

  return validDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const ContragentsPage = () => {
  const { data: userData } = useMeQuery()
  const userId = userData?.id || 1
  const roleName = userData?.roleName

  const { data: deals = [], refetch } = useGetAllDealsQuery()
  const { data: users = [] } = useGetWorkersQuery()
  const [updateDeal] = useUpdateDealMutation()

  const [selectedUserId, setSelectedUserId] = useState<null | number>(
    !localStorage.getItem('selectedUserId')
      ? null
      : Number(localStorage.getItem('selectedUserId')) || userId
  )
  const [filterInn, setFilterInn] = useState<string>(localStorage.getItem('filterInn') || '')
  const [filterCounterparty, setFilterCounterparty] = useState<string>(
    localStorage.getItem('filterCounterparty') || ''
  )

  const [filteredDeals, setFilteredDeals] = useState<DealDto[]>(deals)
  const [isEditingComment, setIsEditingComment] = useState<null | number>(null)
  const [commentValue, setCommentValue] = useState<string>('')
  const [isSaleFormOpen, setIsSaleFormOpen] = useState<boolean>(false)
  const [currentDeal, setCurrentDeal] = useState<DealDto | null>(null)

  const [isDealFormOpen, setIsDealFormOpen] = useState(false)
  const [isCounterpartyFormOpen, setIsCounterpartyFormOpen] = useState(false)

  useEffect(() => {
    let updatedDeals = [...deals]

    if (roleName !== 'Директор') {
      updatedDeals = updatedDeals.filter(deal => deal.userId === userId)
    } else if (selectedUserId !== null) {
      updatedDeals = updatedDeals.filter(deal => deal.userId === selectedUserId)
    }

    if (filterInn) {
      updatedDeals = updatedDeals.filter(deal =>
        deal.counterparty.inn.toString().includes(filterInn)
      )
    }

    if (filterCounterparty) {
      updatedDeals = updatedDeals.filter(deal =>
        deal.counterparty.name.toLowerCase().includes(filterCounterparty.toLowerCase())
      )
    }

    updatedDeals = updatedDeals.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()

      return dateA - dateB
    })

    setFilteredDeals(updatedDeals)
  }, [selectedUserId, filterInn, filterCounterparty, deals, roleName, userId])

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value === 'all' ? null : Number(e.target.value)

    setSelectedUserId(userId)

    if (userId !== null) {
      localStorage.setItem('selectedUserId', String(userId))
    } else {
      localStorage.removeItem('selectedUserId')
    }
  }

  const handleFilterInnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterInn(e.target.value)
    localStorage.setItem('filterInn', e.target.value)
  }

  const handleFilterCounterpartyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCounterparty(e.target.value)
    localStorage.setItem('filterCounterparty', e.target.value)
  }

  const handleFieldChange = async (dealId: number, field: keyof DealDto, value: any) => {
    const deal = deals.find(deal => deal.id === dealId)

    if (deal) {
      const updatedDeal: Partial<DealDto> = { [field]: value }

      try {
        if (field === 'stage' && value === 'INVOICE_PAID') {
          setCurrentDeal(deal)
          setIsSaleFormOpen(true)
        }

        await updateDeal({ deal: updatedDeal, id: dealId }).unwrap()
        refetch()
      } catch (error) {
        console.error('Ошибка при обновлении сделки:', error)
      }
    }
  }

  const handleCommentClick = (dealId: number, currentComment: string) => {
    setIsEditingComment(dealId)
    setCommentValue(currentComment)
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentValue(e.target.value)
  }

  const handleCommentSubmit = (dealId: number) => {
    handleFieldChange(dealId, 'comment', commentValue)
    setIsEditingComment(null)
  }

  const handleSaleFormClose = () => {
    setIsSaleFormOpen(false)
    setCurrentDeal(null)
  }

  return (
    <div className={'absolute left-[1%] w-[94vw] top-[15%]'}>
      <div className={'mb-4 ml-[10%] flex items-center justify-between'}>
        <div className={'flex space-x-2'}>
          <input
            className={'border rounded px-2 py-1'}
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
          {(roleName === 'Директор' || roleName === 'РОП') && (
            <select
              className={'border rounded px-2 py-1'}
              onChange={handleUserChange}
              value={selectedUserId !== null ? selectedUserId : 'all'}
            >
              {roleName == 'Директор' && <option value={'all'}>Все сотрудники</option>}
              {users
                .filter(
                  user =>
                    (roleName === 'Директор' &&
                      ['Логист', 'Менеджер', 'РОП'].includes(user.roleName)) ||
                    (roleName === 'РОП' && user.department_id === userData?.department_id)
                )
                .map(user => (
                  <option key={user.id} value={user.id}>
                    {user.surname}
                  </option>
                ))}
            </select>
          )}
        </div>
        <div>
          <button
            className={'bg-blue-500 text-white px-4 py-2 rounded mr-2'}
            onClick={() => setIsDealFormOpen(true)}
          >
            Создать новую сделку
          </button>
          <button
            className={'bg-green-500 text-white px-4 py-2 rounded'}
            onClick={() => setIsCounterpartyFormOpen(true)}
          >
            Создать нового контрагента
          </button>
        </div>
      </div>
      <table
        className={'table-auto w-full text-sm border-collapse'}
        style={{ fontSize: '0.875rem' }}
      >
        <thead>
          <tr>
            <th className={'px-4 py-2'}>Контрагент</th>
            <th className={'px-4 py-2'}>ИНН</th>
            <th className={'px-4 py-2'}>№ запроса/задачи</th>
            <th className={'px-4 py-2'}>Оборот в рублях</th>
            <th className={'px-4 py-2'}>Маржа в рублях</th>
            <th className={'px-4 py-2'}>Стадия сделки</th>
            <th className={'px-4 py-2'}>Этап</th>
            <th className={'px-4 py-2'}>Дата закрытия</th>
            <th className={'px-4 py-2'}>Причина проигрыша</th>
            <th className={'px-4 py-2'}>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          {filteredDeals.map(deal => (
            <tr key={deal.id}>
              <td className={'border px-4 py-2'}>{deal.counterparty.name}</td>
              <td className={'border px-4 py-2'}>{deal.counterparty.inn}</td>
              <td className={'border px-4 py-2'}>{deal.requestNumber}</td>
              <td className={'border px-4 py-2'}>
                {roleName === 'Директор' ? (
                  <input
                    className={
                      'p-0.5 text-center w-full h-full bg-transparent outline-none focus:border'
                    }
                    defaultValue={deal.turnoverRub?.toString() || ''}
                    onBlur={e =>
                      handleFieldChange(deal.id, 'turnoverRub', parseFloat(e.target.value) || 0)
                    }
                  />
                ) : (
                  formatCurrency(deal.turnoverRub)
                )}
              </td>
              <td className={'border px-4 py-2'}>
                {roleName === 'Директор' ? (
                  <input
                    className={
                      'p-0.5 text-center w-full h-full bg-transparent outline-none focus:border'
                    }
                    defaultValue={deal.marginRub?.toString() || ''}
                    onBlur={e =>
                      handleFieldChange(deal.id, 'marginRub', parseFloat(e.target.value) || 0)
                    }
                  />
                ) : (
                  formatCurrency(deal.marginRub)
                )}
              </td>
              <td className={'border px-4 py-2'}>
                <select
                  onChange={e => handleFieldChange(deal.id, 'stage', e.target.value)}
                  value={deal.stage}
                >
                  {stageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className={'border px-4 py-2'}>{stageToPercentageMap[deal.stage] || 0}%</td>
              <td className={'border px-4 py-2'}>{formatDate(deal.closeDate)}</td>
              <td className={'border px-4 py-2'}>
                <select
                  onChange={e => handleFieldChange(deal.id, 'lossReason', e.target.value)}
                  value={deal.lossReason || ''}
                >
                  <option value={''}>Выберите причину</option>
                  {lossReasonOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className={'border px-4 py-2'} style={{ width: '20%' }}>
                {isEditingComment === deal.id ? (
                  <div>
                    <textarea
                      autoFocus
                      className={'border rounded px-2 py-1 w-full resize-none'}
                      onBlur={() => handleCommentSubmit(deal.id)}
                      onChange={handleCommentChange}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          handleCommentSubmit(deal.id)
                          e.preventDefault()
                        }
                      }}
                      rows={2}
                      value={commentValue}
                    />
                  </div>
                ) : (
                  <span
                    className={'block cursor-pointer p-1'}
                    onClick={() => handleCommentClick(deal.id, deal.comment || '')}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                    style={{
                      backgroundColor: '#f9f9f9',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {deal.comment || 'Добавить комментарий'}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isDealFormOpen && <NewDealForm onClose={() => setIsDealFormOpen(false)} />}
      {isCounterpartyFormOpen && (
        <NewCounterpartyForm onClose={() => setIsCounterpartyFormOpen(false)} />
      )}
      {isSaleFormOpen && currentDeal && (
        <SaleForm
          dealId={currentDeal.id}
          onClose={handleSaleFormClose}
          userId={currentDeal.userId}
        />
      )}
    </div>
  )
}

export default ContragentsPage
