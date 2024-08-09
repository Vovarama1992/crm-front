/* eslint-disable max-lines */
import type { DeliveryStage, SaleDto, SigningStage } from '@/entities/deal/deal.types'

import React, { useEffect, useMemo, useState } from 'react'

import { useGetAllSalesQuery, useUpdateSaleMutation } from '@/entities/deal'
import { useMeQuery } from '@/entities/session'
import { useGetWorkersQuery } from '@/entities/workers'

const translatedDeliveryStage: Record<DeliveryStage, string> = {
  IN_STOCK: 'На складе',
  ITEM_DELIVERED_FULL: 'Доставлен товар весь',
  ITEM_DELIVERED_PARTIAL: 'Доставлен товар частично',
  ITEM_SENT: 'Отправлен товар',
  PURCHASED_FOR_ORDER: 'Закуплено под заказ',
  RETURN: 'Возврат',
}

const translatedSigningStage: Record<SigningStage, string> = {
  SIGNED_IN_EDO: 'Подписано в ЭДО',
  SIGNED_ON_PAPER: 'Подписано на бумаге',
}

const months = [
  { label: 'Январь', value: 1 },
  { label: 'Февраль', value: 2 },
  { label: 'Март', value: 3 },
  { label: 'Апрель', value: 4 },
  { label: 'Май', value: 5 },
  { label: 'Июнь', value: 6 },
  { label: 'Июль', value: 7 },
  { label: 'Август', value: 8 },
  { label: 'Сентябрь', value: 9 },
  { label: 'Октябрь', value: 10 },
  { label: 'Ноябрь', value: 11 },
  { label: 'Декабрь', value: 12 },
]

export const SalesListPage = () => {
  const { data: meData } = useMeQuery()
  const { data: salesData } = useGetAllSalesQuery()
  const { data: workersData } = useGetWorkersQuery()
  const [updateSale] = useUpdateSaleMutation()
  const userRole = meData?.roleName || ''
  const userId = meData?.id || null
  const percent = 0.1

  const [selectedEmployee, setSelectedEmployee] = useState<null | number>(userId)
  const [selectedStartMonth, setSelectedStartMonth] = useState<string>('8') // Изначально выбран июль
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>('8') // Изначально выбран июль
  const [selectedYear, setSelectedYear] = useState<string>('2024') // Изначально выбран 2024 год

  const [sales, setSales] = useState<SaleDto[]>([])

  useEffect(() => {
    if (salesData) {
      setSales(salesData)
    }
  }, [salesData])

  const handleEmployeeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value

    setSelectedEmployee(value === 'self' ? userId : Number(value))
  }

  const handleStartMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStartMonth(event.target.value)
  }

  const handleEndMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEndMonth(event.target.value)
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value)
  }

  const handleUpdateSale = (id: number, field: string, value: string) => {
    updateSale({ id, sale: { [field]: value } }).then(() => {
      setSales(prevSales =>
        prevSales.map(sale => (sale.id === id ? { ...sale, [field]: value } : sale))
      )
    })
  }

  const filteredSalesByMonth = useMemo(() => {
    const startMonth = Number(selectedStartMonth)
    const endMonth = Number(selectedEndMonth)
    const year = Number(selectedYear)

    const salesByMonth: Record<string, SaleDto[]> = {}

    sales.forEach(sale => {
      const saleDate = new Date(sale.date)
      const saleMonth = saleDate.getMonth() + 1
      const saleYear = saleDate.getFullYear()

      if (saleYear === year && saleMonth >= startMonth && saleMonth <= endMonth) {
        const key = `${saleMonth}-${saleYear}`

        if (!salesByMonth[key]) {
          salesByMonth[key] = []
        }

        if (!selectedEmployee || sale.userId === selectedEmployee) {
          salesByMonth[key].push(sale)
        }
      }
    })

    return salesByMonth
  }, [sales, selectedStartMonth, selectedEndMonth, selectedYear, selectedEmployee])

  const salesStatsByMonth = useMemo(() => {
    const statsByMonth: Record<string, { earned: number; margin: number; saleAmount: number }> = {}

    Object.entries(filteredSalesByMonth).forEach(([key, sales]) => {
      statsByMonth[key] = sales.reduce(
        (acc, sale) => {
          acc.margin += sale.margin || 0
          acc.saleAmount += sale.saleAmount || 0
          acc.earned += (sale.margin || 0) * percent

          return acc
        },
        { earned: 0, margin: 0, saleAmount: 0 }
      )
    })

    return statsByMonth
  }, [filteredSalesByMonth, percent])

  return (
    <div className={'absolute top-[15%] left-[15%] w-[70%] h-[70%] overflow-auto'}>
      <div className={'mb-4 flex justify-between'}>
        <div>
          <label className={'mr-2'}>Выберите начальный месяц:</label>
          <select onChange={handleStartMonthChange} value={selectedStartMonth}>
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <label className={'mr-2 ml-4'}>Выберите конечный месяц:</label>
          <select onChange={handleEndMonthChange} value={selectedEndMonth}>
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <label className={'mr-2 ml-4'}>Выберите год:</label>
          <select onChange={handleYearChange} value={selectedYear}>
            {[...Array(5)].map((_, i) => (
              <option key={2020 + i} value={2020 + i}>
                {2020 + i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={'mr-2'}>Выберите сотрудника:</label>
          <select onChange={handleEmployeeChange} value={selectedEmployee || ''}>
            <option value={'self'}>Я сам</option>
            <option value={''}>Все</option>
            {workersData?.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {Object.entries(filteredSalesByMonth).map(([key, sales]) => {
        const [month, year] = key.split('-')

        return (
          <div key={key}>
            <h2>{`${months[Number(month) - 1].label} ${year}`}</h2>
            <table className={'min-w-full divide-y divide-gray-200 table-auto'}>
              <thead className={'bg-gray-50'}>
                <tr>
                  {[
                    'Номер продажи',
                    'Дата',
                    'ID контрагента',
                    'ID сделки',
                    'Номер счета',
                    'Стоимость логистики',
                    'Закупочная стоимость',
                    'Стоимость продажи',
                    'Маржа',
                    'ID пользователя',
                    'Стадия доставки',
                    'Стадия подписания',
                  ].map(header => (
                    <th
                      className={
                        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      }
                      key={header}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={'bg-white divide-y divide-gray-200'}>
                {sales.map(sale => (
                  <tr key={sale.id}>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {sale.id}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {sale.date}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {sale.counterpartyId}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {sale.dealId}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {sale.invoiceNumber || '—'}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {sale.logisticsCost || '—'}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {sale.purchaseCost || '—'}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {sale.saleAmount || '—'}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {sale.margin || '—'}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {sale.userId}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {userRole === 'Директор' || userRole === 'Закупщик' ? (
                        <select
                          className={'border border-gray-300 rounded p-1 w-full'}
                          onChange={e => handleUpdateSale(sale.id, 'deliveryStage', e.target.value)}
                          value={sale.deliveryStage || ''}
                        >
                          {Object.entries(translatedDeliveryStage).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        translatedDeliveryStage[sale.deliveryStage as DeliveryStage] || '—'
                      )}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {userRole === 'Директор' || userRole === 'Бухгалтер' ? (
                        <select
                          className={'border border-gray-300 rounded p-1 w-full'}
                          onChange={e => handleUpdateSale(sale.id, 'signingStage', e.target.value)}
                          value={sale.signingStage || ''}
                        >
                          {Object.entries(translatedSigningStage).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        translatedSigningStage[sale.signingStage as SigningStage] || '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={'mt-4 flex space-x-4 bg-gray-100 p-2 rounded'}>
              <div className={'flex-1 text-center'}>
                <p className={'font-semibold'}>Маржа</p>
                <p>{salesStatsByMonth[key].margin}</p>
              </div>
              <div className={'flex-1 text-center'}>
                <p className={'font-semibold'}>Оборот</p>
                <p>{salesStatsByMonth[key].saleAmount}</p>
              </div>
              <div className={'flex-1 text-center'}>
                <p className={'font-semibold'}>Заработал</p>
                <p>{salesStatsByMonth[key].earned}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
