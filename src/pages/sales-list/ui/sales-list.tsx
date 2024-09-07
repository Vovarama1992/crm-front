/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react'

import { useGetAllCounterpartiesQuery } from '@/entities/deal'
import {
  useGetAllRemainingSalesQuery,
  useGetAllSalesQuery,
  useUpdateSaleMutation,
} from '@/entities/deal'
import { DeliveryStage, SaleDto, SigningStage } from '@/entities/deal/deal.types'
import { useMeQuery, useUploadPdfMutation } from '@/entities/session'
import { useGetWorkersQuery } from '@/entities/workers'

import { SalesCreateForm } from './SalesCreateForm'
import { SalesEditForm } from './SalesEditForm'

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

const translatedDeliveryStage = {
  IN_STOCK: 'На складе',
  ITEM_DELIVERED_FULL: 'Доставлен товар весь',
  ITEM_DELIVERED_PARTIAL: 'Доставлен товар частично',
  ITEM_SENT: 'Отправлен товар',
  PURCHASED_FOR_ORDER: 'Закуплено под заказ',
  RETURN: 'Возврат',
}

const translatedSigningStage = {
  SIGNED_IN_EDO: 'Подписано в ЭДО',
  SIGNED_ON_PAPER: 'Подписано на бумаге',
}

const getSaleStage = (signingStage: SigningStage | undefined): string => {
  return signingStage ? 'Конец' : 'Начало'
}

export const SalesListPage = () => {
  const { data: meData } = useMeQuery()
  const { data: salesData } = useGetAllSalesQuery()
  const { data: remainingSalesData } = useGetAllRemainingSalesQuery() // Получаем данные о ремейнингах
  const { data: workersData } = useGetWorkersQuery()
  const { data: counterpartiesData } = useGetAllCounterpartiesQuery()

  const [updateSale] = useUpdateSaleMutation()
  const [uploadPdf] = useUploadPdfMutation()

  const userId = meData?.id || null
  const isDirector = meData?.roleName === 'Директор'
  const percent = 0.1

  const [selectedEmployee, setSelectedEmployee] = useState<null | number>(userId)
  const [selectedStartMonth, setSelectedStartMonth] = useState<string>('8')
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>('8')
  const [selectedYear, setSelectedYear] = useState<string>('2024')
  const [editingSale, setEditingSale] = useState<SaleDto | null>(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)

  const [sales, setSales] = useState<any[]>([])

  // Добавляем ремейнинги после соответствующих продаж
  useEffect(() => {
    if (salesData && remainingSalesData) {
      const combinedSalesWithRem: any = []

      salesData.forEach(sale => {
        // Добавляем продажу
        combinedSalesWithRem.push(sale)

        // Добавляем ремейнинг, если он есть
        const rem = remainingSalesData.find(r => r.saleId === sale.id)

        if (rem) {
          combinedSalesWithRem.push({ ...rem, isRemaining: true }) // Метка, что это ремейнинг
        }
      })

      const filteredSales = combinedSalesWithRem.filter((sale: any) => {
        return selectedEmployee === null || selectedEmployee === sale.userId
      })

      const sortedSales = [...filteredSales].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )

      setSales(sortedSales)
    }
  }, [salesData, remainingSalesData, selectedEmployee])

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

  const handleSelectChange = async (
    sale: SaleDto,
    field: 'deliveryStage' | 'signingStage',
    value: string
  ) => {
    try {
      if (field === 'signingStage') {
        if (!sale.signingStage && value) {
          const updatedSale = { ...sale, signingStage: value as SigningStage }

          setEditingSale(updatedSale)
          setIsCreateFormOpen(true)
        } else {
          await updateSale({ id: sale.id, sale: { ...sale, signingStage: value as SigningStage } })
          window.location.reload()
        }
      } else if (field === 'deliveryStage') {
        await updateSale({ id: sale.id, sale: { ...sale, deliveryStage: value as DeliveryStage } })
        window.location.reload()
      }
    } catch (error) {
      console.error('Ошибка при обновлении продажи:', error)
    }
  }

  const getCounterpartyName = (id: number) => {
    const counterparty = counterpartiesData?.find(cp => cp.id === id)

    return counterparty ? counterparty.name : '—'
  }

  const handleFileUpload = async (saleId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      try {
        const uploadResponse = await uploadPdf({ file, saleId: String(saleId) }).unwrap()
        const pdfUrl = uploadResponse.sale.pdfUrl

        await updateSale({ id: saleId, sale: { pdfUrl } }).unwrap()
        window.location.reload()
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error)
      }
    }
  }

  const handleFileOpen = (pdfUrl: string) => {
    const link = document.createElement('a')

    link.href = pdfUrl
    link.target = '_blank'
    link.click()
  }

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
              'Что',
              'От кого',
              'Логистика',
              'Закупка',
              'Продажа',
              'Зашло',
              'Маржа',
              'Стадия доставки',
              'Стадия подписания',
              'Стадия сделки',
              'Дата проставления статуса',
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
          {sales.map(sale => (
            <React.Fragment key={sale.id}>
              {/* Отображение продажи */}
              <tr>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>{sale.id}</td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {sale.date.split('T')[0]}
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {sale.pdfUrl ? (
                    <button
                      className={'text-blue-500'}
                      onClick={() => handleFileOpen(sale.pdfUrl as string)}
                    >
                      {sale.pdfUrl ? sale.pdfUrl.split('/').pop() : 'Нет файла'}
                    </button>
                  ) : (
                    'Нет PDF'
                  )}
                  {isDirector && (
                    <div className={'mt-2'}>
                      <input
                        className={'mb-2'}
                        id={`file-upload-${sale.id}`}
                        onChange={e => handleFileUpload(sale.id, e)}
                        style={{ display: 'none' }}
                        type={'file'}
                      />
                      <label
                        className={'bg-blue-500 text-white px-4 py-2 rounded cursor-pointer'}
                        htmlFor={`file-upload-${sale.id}`}
                      >
                        Загрузить другой PDF
                      </label>
                    </div>
                  )}
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {getCounterpartyName(sale.counterpartyId)}
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {sale.logisticsCost || '—'}
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {sale.purchaseCost || '—'}
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {sale.totalSaleAmount || '—'}
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {sale.paidNow + sale.prepaymentAmount || '—'}
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {sale.margin !== undefined && getSaleStage(sale.signingStage) === 'Конец'
                    ? sale.margin
                    : '—'}
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
                  {getSaleStage(sale.signingStage)}
                </td>
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {getSaleStage(sale.signingStage) === 'Конец' && sale.statusSetDate
                    ? sale.statusSetDate.split('T')[0]
                    : '—'}
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

              {/* Отображение ремейнинга после продажи с наследованием полей */}
              {remainingSalesData
                ?.filter((rem: any) => rem.saleId === sale.id) // Находим все ремейнинги для данной продажи
                .map((rem: any) => (
                  <tr className={'bg-gray-100'} key={`remaining-${rem.id}`}>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {rem.saleId} {/* Здесь показываем saleId */}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {rem.date.split('T')[0]}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {sale.pdfUrl ? (
                        <button
                          className={'text-blue-500'}
                          onClick={() => handleFileOpen(sale.pdfUrl as string)}
                        >
                          {sale.pdfUrl.split('/').pop()}
                        </button>
                      ) : (
                        'Нет PDF'
                      )}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {getCounterpartyName(sale.counterpartyId)}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {rem.logisticsCost || '—'}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {rem.purchaseCost || '—'}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {rem.totalSaleAmount || '—'}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {rem.paidNow + rem.prepaymentAmount || '—'}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>{'—'}</td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>{'—'}</td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>{'-'}</td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                      {'Начало'}
                    </td>
                    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>{'—'}</td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
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
