/* eslint-disable max-lines */
import React, { useMemo, useState } from 'react'

import { useMeQuery } from '@/entities/session'

type Sale = {
  date: string
  deliveryStatus: string
  from: string
  id: number
  item: string
  logistics: string
  margin: number
  purchase: string
  revenue: number
  sale: string
  signingStatus: string
  userId: number
}

const salesData: Sale[] = [
  {
    date: '2024-01-01',
    deliveryStatus: 'Закуплено под заказ',
    from: 'Supplier 1',
    id: 1,
    item: 'Item 1',
    logistics: 'Logistics 1',
    margin: 100,
    purchase: 'Purchase 1',
    revenue: 500,
    sale: 'Sale 1',
    signingStatus: 'Подписано в ЭДО',
    userId: 1,
  },
  {
    date: '2024-01-15',
    deliveryStatus: 'На складе',
    from: 'Supplier 2',
    id: 2,
    item: 'Item 2',
    logistics: 'Logistics 2',
    margin: 200,
    purchase: 'Purchase 2',
    revenue: 1000,
    sale: 'Sale 2',
    signingStatus: 'Подписано на бумаге',
    userId: 2,
  },
  {
    date: '2024-02-01',
    deliveryStatus: 'Отправлен товар',
    from: 'Supplier 3',
    id: 3,
    item: 'Item 3',
    logistics: 'Logistics 3',
    margin: 150,
    purchase: 'Purchase 3',
    revenue: 750,
    sale: 'Sale 3',
    signingStatus: 'Подписано в ЭДО',
    userId: 1,
  },
  {
    date: '2024-07-05',
    deliveryStatus: 'Доставлен товар весь',
    from: 'Supplier 4',
    id: 4,
    item: 'Item 4',
    logistics: 'Logistics 4',
    margin: 300,
    purchase: 'Purchase 4',
    revenue: 1500,
    sale: 'Sale 4',
    signingStatus: 'Подписано на бумаге',
    userId: 3,
  },
  {
    date: '2024-07-20',
    deliveryStatus: 'Доставлен товар частично',
    from: 'Supplier 5',
    id: 5,
    item: 'Item 5',
    logistics: 'Logistics 5',
    margin: 250,
    purchase: 'Purchase 5',
    revenue: 1250,
    sale: 'Sale 5',
    signingStatus: 'Подписано в ЭДО',
    userId: 4,
  },
]

const deliveryOptions = [
  'Закуплено под заказ',
  'На складе',
  'Отправлен товар',
  'Доставлен товар весь',
  'Доставлен товар частично',
  'Возврат',
]

const signingOptions = ['Подписано в ЭДО', 'Подписано на бумаге']

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

const employees = [
  { id: 1, name: 'Сотрудник 1', role: 'Логист' },
  { id: 2, name: 'Сотрудник 2', role: 'Логист' },
  { id: 3, name: 'Сотрудник 3', role: 'Бухгалтер' },
  { id: 4, name: 'Сотрудник 4', role: 'Закупщик' },
  { id: 5, name: 'Сотрудник 5', role: 'РОП' },
  { id: 6, name: 'Сотрудник 6', role: 'Директор' },
]

export const SalesListPage = () => {
  const [sales, setSales] = useState<Sale[]>(salesData)
  const { data } = useMeQuery()
  const userRole = data?.roleName || ''
  const userId = data?.id || null
  const percent = 0.1

  const [selectedEmployee, setSelectedEmployee] = useState<null | number>(userId)
  const [selectedStartMonth, setSelectedStartMonth] = useState<string>('7') // Изначально выбран июль
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>('7') // Изначально выбран июль
  const [selectedYear, setSelectedYear] = useState<string>('2024') // Изначально выбран 2024 год

  const handleInputChange = (id: number, field: string, value: string) => {
    setSales(prevSales =>
      prevSales.map(sale => (sale.id === id ? { ...sale, [field]: value } : sale))
    )
  }

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

  const filteredSalesByMonth = useMemo(() => {
    const startMonth = Number(selectedStartMonth)
    const endMonth = Number(selectedEndMonth)
    const year = Number(selectedYear)

    const salesByMonth: Record<string, Sale[]> = {}

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
    const statsByMonth: Record<string, { earned: number; margin: number; revenue: number }> = {}

    Object.entries(filteredSalesByMonth).forEach(([key, sales]) => {
      statsByMonth[key] = sales.reduce(
        (acc, sale) => {
          acc.margin += sale.margin
          acc.revenue += sale.revenue
          acc.earned += sale.margin * percent

          return acc
        },
        { earned: 0, margin: 0, revenue: 0 }
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
            {employees.map(employee => (
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
                    'Что',
                    'От кого',
                    'Логистика',
                    'Закупка',
                    'Продажа',
                    'Зашло',
                    'Маржа',
                    'Стадия доставки',
                    'Стадия подписания',
                  ].map(header => (
                    <th
                      className={
                        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[9.09%]'
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
                      {userRole === 'Директор' ? (
                        <input
                          className={'border border-gray-300 rounded p-1 w-full'}
                          onChange={e => handleInputChange(sale.id, 'date', e.target.value)}
                          type={'date'}
                          value={sale.date}
                        />
                      ) : (
                        sale.date
                      )}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {userRole === 'Директор' ? (
                        <input
                          className={'border border-gray-300 rounded p-1 w-full'}
                          onChange={e => handleInputChange(sale.id, 'item', e.target.value)}
                          type={'text'}
                          value={sale.item}
                        />
                      ) : (
                        sale.item
                      )}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {userRole === 'Директор' ? (
                        <input
                          className={'border border-gray-300 rounded p-1 w-full'}
                          onChange={e => handleInputChange(sale.id, 'from', e.target.value)}
                          type={'text'}
                          value={sale.from}
                        />
                      ) : (
                        sale.from
                      )}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {userRole === 'Директор' ? (
                        <input
                          className={'border border-gray-300 rounded p-1 w-full'}
                          onChange={e => handleInputChange(sale.id, 'logistics', e.target.value)}
                          type={'text'}
                          value={sale.logistics}
                        />
                      ) : (
                        sale.logistics
                      )}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {userRole === 'Директор' ? (
                        <input
                          className={'border border-gray-300 rounded p-1 w-full'}
                          onChange={e => handleInputChange(sale.id, 'purchase', e.target.value)}
                          type={'text'}
                          value={sale.purchase}
                        />
                      ) : (
                        sale.purchase
                      )}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {userRole === 'Директор' ? (
                        <input
                          className={'border border-gray-300 rounded p-1 w-full'}
                          onChange={e => handleInputChange(sale.id, 'sale', e.target.value)}
                          type={'text'}
                          value={sale.sale}
                        />
                      ) : (
                        sale.sale
                      )}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {userRole === 'Директор' ? (
                        <input
                          className={'border border-gray-300 rounded p-1 w-full'}
                          onChange={e => handleInputChange(sale.id, 'revenue', e.target.value)}
                          type={'number'}
                          value={sale.revenue}
                        />
                      ) : (
                        sale.revenue
                      )}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {userRole === 'Директор' ? (
                        <input
                          className={'border border-gray-300 rounded p-1 w-full'}
                          onChange={e => handleInputChange(sale.id, 'margin', e.target.value)}
                          type={'number'}
                          value={sale.margin}
                        />
                      ) : (
                        sale.margin
                      )}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {userRole === 'Директор' || userRole === 'Закупщик' ? (
                        <select
                          className={'border border-gray-300 rounded p-1 w-full'}
                          onChange={e =>
                            handleInputChange(sale.id, 'deliveryStatus', e.target.value)
                          }
                          value={sale.deliveryStatus}
                        >
                          {deliveryOptions.map(option => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        sale.deliveryStatus
                      )}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {userRole === 'Директор' || userRole === 'Бухгалтер' ? (
                        <select
                          className={'border border-gray-300 rounded p-1 w-full'}
                          onChange={e =>
                            handleInputChange(sale.id, 'signingStatus', e.target.value)
                          }
                          value={sale.signingStatus}
                        >
                          {signingOptions.map(option => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        sale.signingStatus
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
                <p>{salesStatsByMonth[key].revenue}</p>
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
