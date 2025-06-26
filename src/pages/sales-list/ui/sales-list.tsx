/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react'

import {
  useGetAllRemainingSalesQuery,
  useGetAllSalesQuery,
  useUpdateSaleWithRemainingMutation,
} from '@/entities/sale'
import { SaleDto, SigningStage } from '@/entities/sale/sale.types'
import { useMeQuery, useUploadPdfMutation } from '@/entities/session'
import { useGetWorkersQuery } from '@/entities/workers'
import { SaleForm } from '@/pages/contragents/ui/Saleform'

import DeletedSalesList from './DeletedSalesList'
import { SalesEditForm } from './SalesEditForm'
import TableHeaders from './TableHeaders'
import TableRow from './TableRow'

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

const translatedSigningStage = {
  SIGNED_IN_EDO: 'Подписано в ЭДО',
  SIGNED_ON_PAPER: 'Подписано на бумаге',
}

const translatedDeliveryStage = {
  IN_STOCK: 'На складе',
  ITEM_DELIVERED_FULL: 'Доставлен товар весь',
  ITEM_DELIVERED_PARTIAL: 'Доставлен товар частично',
  ITEM_SENT: 'Отправлен товар',
  PURCHASED_FOR_ORDER: 'Закуплено под заказ',
  RETURN: 'Возврат',
}

const getSaleStage = (signingStage: SigningStage | undefined): string => {
  return signingStage ? 'Конец' : 'Начало'
}

export const SalesListPage: React.FC = () => {
  const { data: meData } = useMeQuery()
  const { data: salesData, refetch: refetchSales } = useGetAllSalesQuery()
  const { data: remainingSalesData, refetch: refetchRemainings } = useGetAllRemainingSalesQuery()
  const { data: workersData } = useGetWorkersQuery()
  const [updateSale] = useUpdateSaleWithRemainingMutation()
  const [uploadPdf] = useUploadPdfMutation()
  const [showDeletedSales, setShowDeletedSales] = useState(false)

  const [isSaleFormOpen, setSaleFormOpen] = useState(false)

  const refetch = () => {
    refetchSales()
    refetchRemainings()
  }

  const [selectedEmployee, setSelectedEmployee] = useState<null | number>(null)
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    const storedYear = localStorage.getItem('salesListSelectedYear')

    return storedYear || '2025'
  })

  const [selectedStartMonth, setSelectedStartMonth] = useState<string>(() => {
    const storedStartMonth = localStorage.getItem('salesListSelectedStartMonth')

    return storedStartMonth || '1'
  })

  const [selectedEndMonth, setSelectedEndMonth] = useState<string>(() => {
    const storedEndMonth = localStorage.getItem('salesListSelectedEndMonth')

    return storedEndMonth || '12'
  })
  const [editingSale, setEditingSale] = useState<SaleDto | null>(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [sales, setSales] = useState<SaleDto[]>([])

  const userId = meData?.id || null
  const roleName = meData?.roleName

  const handleEmployeeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value === '9999' ? 9999 : Number(event.target.value)

    setSelectedEmployee(value)
    localStorage.setItem('salesListSelectedEmployee', value.toString())
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = event.target.value

    setSelectedYear(year)
    localStorage.setItem('salesListSelectedYear', year)
  }

  const handleStartMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const month = event.target.value

    setSelectedStartMonth(month)
    localStorage.setItem('salesListSelectedStartMonth', month)

    // Обновляем конечный месяц, если начальный месяц становится больше
    if (Number(month) > Number(selectedEndMonth)) {
      setSelectedEndMonth(month)
      localStorage.setItem('salesListSelectedEndMonth', month)
    }
  }

  const handleEndMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const month = event.target.value

    setSelectedEndMonth(month)
    localStorage.setItem('salesListSelectedEndMonth', month)

    // Обновляем начальный месяц, если конечный месяц становится меньше
    if (Number(month) < Number(selectedStartMonth)) {
      setSelectedStartMonth(month)
      localStorage.setItem('salesListSelectedStartMonth', month)
    }
  }

  useEffect(() => {
  const stored = localStorage.getItem('salesListSelectedEmployee')
  if (stored) {
    setSelectedEmployee(Number(stored))
  } else if (meData?.id) {
    setSelectedEmployee(meData.id)
    localStorage.setItem('salesListSelectedEmployee', meData.id.toString())
  }
}, [meData?.id])

  useEffect(() => {
    if (salesData) {
      const roleFilteredSales = salesData.filter(sale => {
        const isVisibleToUser =
          roleName === 'Директор' ||
          roleName === 'Бухгалтер' ||
          roleName === 'Закупщик' ||
          (roleName === 'РОП' &&
            workersData?.some(
              worker => worker.department_id === meData?.department_id && worker.id === sale.userId
            )) ||
          ((roleName === 'Менеджер' || roleName === 'Логист') && sale.userId === userId)

        return isVisibleToUser
      })

      const finalFilteredSales = roleFilteredSales
        .filter(sale => {
          const saleDate = new Date(sale.date)
          const saleMonth = saleDate.getMonth() + 1
          const saleYear = saleDate.getFullYear()

          const isSaleForSelectedEmployee =
            selectedEmployee === 9999 || sale.userId === selectedEmployee

          return (
            saleYear === Number(selectedYear) &&
            saleMonth >= Number(selectedStartMonth) &&
            saleMonth <= Number(selectedEndMonth) &&
            isSaleForSelectedEmployee
          )
        })
        .sort((a, b) => b.id - a.id)

      setSales(finalFilteredSales)
    }
  }, [
    salesData,
    selectedEmployee,
    selectedStartMonth,
    selectedEndMonth,
    selectedYear,
    workersData,
    roleName,
    userId,
    meData?.department_id,
  ])

  const handleFileUpload = async (saleId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      try {
        const uploadResponse = await uploadPdf({ file, saleId: String(saleId) }).unwrap()
        const pdfUrl = uploadResponse.sale.pdfUrl

        await updateSale({ id: saleId, sale: { pdfUrl } }).unwrap()
        setSales(prevSales => prevSales.map(s => (s.id === saleId ? { ...s, pdfUrl } : s)))
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error)
      }
    }
  }

  const handleFileOpen = (pdfUrl: string): void => {
    const link = document.createElement('a')

    link.href = pdfUrl
    link.target = '_blank'
    link.click()
  }

  const handleSelectChange = async (
    sale: SaleDto,
    field: 'deliveryStage' | 'signingStage',
    value: string
  ) => {
    try {
      const updatedValue = value === '' ? null : value
      const updatedSale = {
        ...sale,
        [field]: updatedValue,
        statusSetDate: sale.statusSetDate || new Date().toISOString(),
      }

      setSales(prevSales => prevSales.map(s => (s.id === sale.id ? { ...s, ...updatedSale } : s)))
      await updateSale({ id: sale.id, sale: updatedSale }).unwrap()
    } catch (error) {
      console.error('Ошибка при обновлении продажи:', error)
    }
  }

  const openEditModal = (sale: SaleDto) => {
    setEditingSale(sale)
    setIsEditFormOpen(true)
  }

  const closeEditModal = () => {
    setEditingSale(null)
    setIsEditFormOpen(false)
  }

  const cancel = () => {
    setEditingSale(null)
    setIsEditFormOpen(false)
  }

  // Вычисление общей маржи, оборота и заработка
  const totalMargin = sales.reduce((acc, sale) => {
    if (sale.margin !== undefined && getSaleStage(sale.signingStage) === 'Конец') {
      return (
        acc +
        (((sale.prepaymentAmount + sale.paidNow) as number) -
          sale.logisticsCost -
          sale.purchaseCost)
      )
    }

    return acc
  }, 0)

  const totalTurnover = sales.reduce(
    (acc, sale) => acc + (sale.paidNow + sale.prepaymentAmount || 0),
    0
  )

  const calculateTotalEarned = (sales: SaleDto[], workersData: any): string => {
    if (!workersData || !sales) {
      return '0'
    }
    const userMarginMap = Object.fromEntries(
      workersData.map((worker: any) => [worker.id, worker.margin_percent || 0.1])
    )

    return sales
      .reduce((acc, sale) => {
        if (sale.margin !== undefined && getSaleStage(sale.signingStage) === 'Конец') {
          const margin =
            (sale.totalSaleAmount || 0) - (sale.logisticsCost || 0) - (sale.purchaseCost || 0)
          const userMarginPercent = userMarginMap[sale.userId] || 0

          return acc + margin * userMarginPercent
        }

        return acc
      }, 0)
      .toFixed(2)
  }

  // Функция для получения соответствующего remaining sale по id продажи
  const getRemainingSale = (saleId: number): SaleDto | undefined => {
    return remainingSalesData?.find(remainingSale => remainingSale.saleId === saleId)
  }

  return (
    <div className={'absolute top-[15%] left-[1%] w-[98vw] h-[70vh] flex flex-col'}>
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
            {[...Array(6)].map((_, i) => (
              <option key={2020 + i} value={2020 + i}>
                {2020 + i}
              </option>
            ))}
          </select>
        </div>

        {(roleName === 'Директор' ||
          roleName === 'Бухгалтер' ||
          roleName === 'РОП' ||
          roleName === 'Закупщик') && (
          <div>
            <label className={'mr-2'}>Выберите сотрудника:</label>
            <select onChange={handleEmployeeChange} value={selectedEmployee || 9999}>
              {roleName === 'Директор' && <option value={9999}>Все</option>}
              <option value={meData?.id}>Я сам</option>
              {workersData?.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.surname}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={'flex-grow overflow-y-auto'}>
        <table
          className={'min-w-full table-fixed border-collapse divide-y divide-gray-200'}
          style={{ width: '98vw' }}
        >
          <TableHeaders />
          <tbody className={'bg-white divide-y divide-gray-200'}>
            {sales.map(sale => (
              <React.Fragment key={sale.id}>
                <TableRow
                  getSaleStage={getSaleStage}
                  handleFileOpen={handleFileOpen}
                  handleFileUpload={handleFileUpload}
                  handleSelectChange={handleSelectChange}
                  openEditModal={openEditModal}
                  sale={sale}
                  translatedDeliveryStage={translatedDeliveryStage}
                  translatedSigningStage={translatedSigningStage}
                />
                {getSaleStage(sale.signingStage) === 'Конец' && (
                  <>
                    {getRemainingSale(sale.id) && (
                      <TableRow
                        getSaleStage={() => 'Начало'}
                        handleFileOpen={() => {}}
                        handleFileUpload={() => Promise.resolve()}
                        handleSelectChange={() => Promise.resolve()}
                        openEditModal={() => {}}
                        rowStyle={'bg-gray-100'}
                        sale={getRemainingSale(sale.id) as SaleDto}
                        translatedDeliveryStage={translatedDeliveryStage}
                        translatedSigningStage={translatedSigningStage}
                      />
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className={'mt-4 flex space-x-4 bg-gray-100 p-4 rounded fixed bottom-0 left-0 w-[98vw]'}>
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
          <p>{calculateTotalEarned(sales, workersData)}</p>
        </div>
        <div className={'flex-1 text-center'}>
          <button
            className={'bg-blue-500 text-white px-4 py-2 rounded'}
            onClick={() => setSaleFormOpen(true)}
          >
            Открыть форму создания продажи
          </button>
        </div>

        <div className={'flex-1 text-center'}>
          <button
            className={'bg-yellow-500 text-white p-2 rounded'}
            onClick={() => setShowDeletedSales(true)}
          >
            Удалённые продажи
          </button>
        </div>
      </div>

      {isEditFormOpen && editingSale && (
        <div className={'fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'}>
          <div className={'bg-white p-4 rounded'}>
            <SalesEditForm
              onCancel={cancel}
              onClose={closeEditModal}
              refetch={refetch}
              sale={editingSale}
            />
          </div>
        </div>
      )}
      {isSaleFormOpen && (
        <SaleForm
          dealId={9999}
          onClose={() => setSaleFormOpen(false)}
          userId={meData?.id as number}
        />
      )}
      {showDeletedSales && <DeletedSalesList onClose={() => setShowDeletedSales(false)} />}
    </div>
  )
}

export default SalesListPage
