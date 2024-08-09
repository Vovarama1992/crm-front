import React, { useMemo, useState } from 'react'

import { DealDto } from '@/entities/deal'
import { useGetAllDealsQuery, useUpdateDealMutation } from '@/entities/deal/deal.api'
import { useMeQuery } from '@/entities/session'

import NewCounterpartyForm from './NewCounterpartyForm'
import NewDealForm from './NewDealForm'

const stageOptions = [
  { label: 'выставлен счет', value: 'INVOICE_SENT' },
  { label: 'отправлено КП', value: 'QUOTE_SENT' },
  { label: 'проигран', value: 'LOST' },
  { label: 'работа с возражениями(бюрократия)', value: 'WORKING_WITH_OBJECTIONS' },
  { label: 'сделка закрыта', value: 'DEAL_CLOSED' },
  { label: 'счет оплачен', value: 'INVOICE_PAID' },
]

const lossReasonOptions = [
  { label: 'дорого', value: 'EXPENSIVE' },
  { label: 'пустомеля', value: 'EMPTY_TALK' },
  { label: 'нет раппорта', value: 'NO_REPORT' },
  { label: 'недоработал', value: 'DID_NOT_WORK' },
  { label: 'другое', value: 'OTHER' },
]

export const ContragentsPage = () => {
  const { data: userData } = useMeQuery()
  const userId = userData?.id || 1

  const { data: deals = [], refetch } = useGetAllDealsQuery()
  const [updateDeal] = useUpdateDealMutation()

  const [filterInn, setFilterInn] = useState('')
  const [filterCounterparty, setFilterCounterparty] = useState('')
  const [isDealFormOpen, setIsDealFormOpen] = useState(false)
  const [isCounterpartyFormOpen, setIsCounterpartyFormOpen] = useState(false)

  const handleFilterInnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterInn(e.target.value)
  }

  const handleFilterCounterpartyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCounterparty(e.target.value)
  }

  const filteredData = useMemo(() => {
    return deals.filter(
      deal =>
        deal.userId === userId &&
        (!filterInn || deal.counterparty.inn.toString().includes(filterInn)) &&
        (!filterCounterparty ||
          deal.counterparty.name.toLowerCase().includes(filterCounterparty.toLowerCase()))
    )
  }, [filterInn, filterCounterparty, userId, deals])

  const handleFieldChange = async (dealId: number, field: keyof DealDto, value: any) => {
    const deal = deals.find(deal => deal.id === dealId)

    if (deal) {
      const updatedDeal: Partial<DealDto> = {
        [field]: value,
      }

      try {
        await updateDeal({
          deal: updatedDeal,
          id: dealId,
        }).unwrap()
        refetch()
      } catch (error) {
        console.error('Error updating deal:', error)
      }
    }
  }

  return (
    <div className={'absolute left-[1%] w-[94vw] top-[15%]'}>
      <div className={'mb-4 ml-[10%] flex items-center justify-between'}>
        <div>
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
      <table className={'table-auto w-full'}>
        <thead>
          <tr>
            <th className={'px-4 py-2'}>Контрагент</th>
            <th className={'px-4 py-2'}>ИНН</th>
            <th className={'px-4 py-2'}>№ запроса/задачи</th>
            <th className={'px-4 py-2'}>Оборот в рублях</th>
            <th className={'px-4 py-2'}>Маржа в рублях</th>
            <th className={'px-4 py-2'}>Стадия сделки</th>
            <th className={'px-4 py-2'}>Дата закрытия</th>
            <th className={'px-4 py-2'}>Причина проигрыша</th>
            <th className={'px-4 py-2'}>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((deal, rowIndex) => (
            <tr key={deal.id}>
              <td className={'border px-4 py-2'}>{deal.counterparty.name}</td>
              <td className={'border px-4 py-2'}>{deal.counterparty.inn}</td>
              <td className={'border px-4 py-2'}>{deal.id}</td>
              <td className={'border px-4 py-2'}>{deal.turnoverRub}</td>
              <td className={'border px-4 py-2'}>{deal.marginRub}</td>
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
              <td className={'border px-4 py-2'}>{deal.closeDate}</td>
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
              <td className={'border px-4 py-2'}>{deal.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isDealFormOpen && <NewDealForm onClose={() => setIsDealFormOpen(false)} />}
      {isCounterpartyFormOpen && (
        <NewCounterpartyForm onClose={() => setIsCounterpartyFormOpen(false)} />
      )}
    </div>
  )
}

export default ContragentsPage
