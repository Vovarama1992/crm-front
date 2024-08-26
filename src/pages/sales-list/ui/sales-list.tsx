/* eslint-disable max-lines */
import type { DeliveryStage, SaleDto, SigningStage } from '@/entities/deal/deal.types'

import React, { useEffect, useState } from 'react'

import { useGetAllCounterpartiesQuery } from '@/entities/deal'
import { useGetAllSalesQuery, useUpdateSaleMutation } from '@/entities/deal'
import { useMeQuery } from '@/entities/session'
import { useGetWorkersQuery } from '@/entities/workers'

import { SalesCreateForm } from './SalesCreateForm'
import { SalesEditForm } from './SalesEditForm'

type Monthes = Array<{ label: string; value: number }>

const months: Monthes = [
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

export const SalesListPage = () => {
  const { data: meData } = useMeQuery()
  const { data: salesData } = useGetAllSalesQuery()
  const { data: workersData } = useGetWorkersQuery()
  const { data: counterpartiesData } = useGetAllCounterpartiesQuery()

  const [updateSale] = useUpdateSaleMutation()

  const userId = meData?.id || null
  const percent = 0.1

  const [selectedEmployee, setSelectedEmployee] = useState<null | number>(userId)
  const [selectedStartMonth, setSelectedStartMonth] = useState<string>('8')
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>('8')
  const [selectedYear, setSelectedYear] = useState<string>('2024')
  const [editingSale, setEditingSale] = useState<SaleDto | null>(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)

  const [sales, setSales] = useState<SaleDto[]>([])
  const [invoiceFiles, setInvoiceFiles] = useState<{
    [key: number]: { name: string; url: string } | undefined
  }>({})

  useEffect(() => {
    if (salesData && Array.isArray(salesData)) {
      const filteredSales = salesData.filter(sale => {
        return selectedEmployee === null || selectedEmployee === sale.userId
      })

      const sortedSales = [...filteredSales] // Создаем копию массива
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setSales(sortedSales)
    }
  }, [salesData, selectedEmployee])

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

  const handleSelectChange = (
    sale: SaleDto,
    field: 'deliveryStage' | 'signingStage',
    value: string
  ) => {
    if (field === 'deliveryStage') {
      // Обновляем стадию доставки без открытия формы
      updateSale({ id: sale.id, sale: { ...sale, deliveryStage: value as DeliveryStage } })
        .then(() => {
          window.location.reload() // Перезагружает страницу после успешного обновления
        })
        .catch(error => {
          console.error('Ошибка при обновлении продажи:', error)
        })
    } else if (field === 'signingStage') {
      if (sale.signingStage === 'SIGNED_ON_PAPER' || sale.signingStage === 'SIGNED_IN_EDO') {
        // Если стадия подписания уже "Конец", просто обновляем
        updateSale({ id: sale.id, sale: { ...sale, signingStage: value as SigningStage } })
          .then(() => {
            window.location.reload() // Перезагружает страницу после успешного обновления
          })
          .catch(error => {
            console.error('Ошибка при обновлении продажи:', error)
          })
      } else {
        // Если стадия подписания "Начало", открываем форму создания новой записи
        setEditingSale({
          ...sale,
          progressed: true,
          signingStage: value as SigningStage,
          statusSetDate: new Date().toISOString(),
        })
        setIsCreateFormOpen(true)
      }
    }
  }

  const getCounterpartyName = (id: number) => {
    const counterparty = counterpartiesData?.find(cp => cp.id === id)

    return counterparty ? counterparty.name : '—'
  }

  const handleFileUpload = (saleId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      const fileUrl = URL.createObjectURL(file)
      const newInvoiceFiles = {
        ...invoiceFiles,
        [saleId]: { name: file.name, url: fileUrl },
      }

      setInvoiceFiles(newInvoiceFiles)
      localStorage.setItem('invoiceFiles', JSON.stringify(newInvoiceFiles))
    }
  }

  useEffect(() => {
    const storedFiles = localStorage.getItem('invoiceFiles')

    if (storedFiles) {
      setInvoiceFiles(JSON.parse(storedFiles))
    }
  }, [])

  const totalMargin = sales.reduce((acc, sale) => acc + (sale.margin || 0), 0)
  const totalTurnover = sales.reduce((acc, sale) => acc + (sale.paidNow || 0), 0)
  const totalEarned = (totalMargin * percent).toFixed(2)

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
      <table className={'min-w-full divide-y divide-gray-200 table-auto'}>
        <thead className={'bg-gray-50'}>
          <tr>
            {[
              'Номер продажи',
              'Дата',
              'Контрагент',
              'Номер счета',
              'Стоимость логистики',
              'Закупочная стоимость',
              'Стоимость продажи',
              'Маржа',
              'Стадия продажи', // <-- Добавьте этот заголовок
              'Стадия доставки',
              'Стадия подписания',
              'Дата проставления статуса',
              'Что',
              'Действия',
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
          {sales.map(sale => {
            const invoice = invoiceFiles[sale.id] // Вынесем переменную за пределы JSX

            return (
              <tr key={sale.id}>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>{sale.id}</td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {sale.date.split('T')[0]}
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {getCounterpartyName(sale.counterpartyId)}
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
                  {sale.paidNow || '—'}
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {sale.margin !== undefined && sale.progressed ? sale.margin : '—'}
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {sale.signingStage ? 'Конец' : 'Начало'}
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer'}>
                  <select
                    className={'border border-gray-300 rounded p-1 w-full'}
                    onChange={e => handleSelectChange(sale, 'deliveryStage', e.target.value)}
                    value={sale.deliveryStage || ''}
                  >
                    <option value={''}>—</option>
                    {Object.entries(translatedDeliveryStage).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer'}>
                  <select
                    className={'border border-gray-300 rounded p-1 w-full'}
                    onChange={e => handleSelectChange(sale, 'signingStage', e.target.value)}
                    value={sale.signingStage || ''}
                  >
                    <option value={''}>—</option>
                    {Object.entries(translatedSigningStage).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {sale.statusSetDate?.split('T')[0] || '—'}
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {invoice ? (
                    <a
                      className={'text-blue-500'}
                      href={invoice.url}
                      rel={'noopener noreferrer'}
                      target={'_blank'}
                    >
                      {invoice.name}
                    </a>
                  ) : (
                    <input
                      className={'mb-2'}
                      onChange={e => handleFileUpload(sale.id, e)}
                      type={'file'}
                    />
                  )}
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  <button
                    className={'bg-blue-500 text-white px-4 py-2 rounded'}
                    onClick={() => {
                      setEditingSale(sale)
                      setIsEditFormOpen(true)
                    }}
                  >
                    Редактировать
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className={'mt-4 flex space-x-4 bg-gray-100 p-4 rounded'}>
        <div className={'flex-1 text-center'}>
          <p className={'font-semibold'}>Общая маржа</p>
          <p>{totalMargin}</p>
        </div>
        <div className={'flex-1 text-center'}>
          <p className={'font-semibold'}>Общий оборот</p>
          <p>{totalTurnover}</p>
        </div>
        <div className={'flex-1 text-center'}>
          <p className={'font-semibold'}>Общий заработок</p>
          <p>{totalEarned}</p>
        </div>
      </div>
      {isEditFormOpen && editingSale && (
        <div className={'fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'}>
          <div className={'bg-white p-4 rounded'}>
            <SalesEditForm
              onClose={() => {
                setIsEditFormOpen(false)
                setEditingSale(null)
              }}
              sale={editingSale}
            />
          </div>
        </div>
      )}
      {isCreateFormOpen && editingSale && (
        <div className={'fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'}>
          <div className={'bg-white p-4 rounded'}>
            <SalesCreateForm
              onClose={() => {
                setIsCreateFormOpen(false)
                setEditingSale(null)
              }}
              sale={editingSale}
            />
          </div>
        </div>
      )}
    </div>
  )
}
