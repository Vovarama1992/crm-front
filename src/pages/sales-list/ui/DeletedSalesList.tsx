import React, { useEffect, useState } from 'react'

import { useGetDeletedSalesQuery, useRestoreSaleMutation } from '@/entities/sale'
import { SaleDto } from '@/entities/sale/sale.types'
import { formatCurrency } from '@/pages/kopeechnik'

interface DeletedSalesListProps {
  onClose: () => void
}

const DeletedSalesList: React.FC<DeletedSalesListProps> = ({ onClose }) => {
  const { data: deletedSalesData, isError, isLoading } = useGetDeletedSalesQuery()
  const [restoreSale] = useRestoreSaleMutation()

  const [selectedYear, setSelectedYear] = useState<string>('2025')
  const [selectedStartMonth, setSelectedStartMonth] = useState<string>('1')
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>('12')
  const [filteredSales, setFilteredSales] = useState<SaleDto[]>([])

  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value)
  }

  const handleStartMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStartMonth(event.target.value)
  }

  const handleEndMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEndMonth(event.target.value)
  }

  useEffect(() => {
    if (deletedSalesData) {
      const filtered = deletedSalesData.filter(sale => {
        const saleDate = new Date(sale.date)
        const saleMonth = saleDate.getMonth() + 1
        const saleYear = saleDate.getFullYear()

        return (
          saleYear === Number(selectedYear) &&
          saleMonth >= Number(selectedStartMonth) &&
          saleMonth <= Number(selectedEndMonth)
        )
      })

      setFilteredSales(filtered)
      setCurrentPage(1)
    }
  }, [deletedSalesData, selectedYear, selectedStartMonth, selectedEndMonth])

  const handleRestoreSale = async (saleId: number) => {
    try {
      await restoreSale(saleId).unwrap()
      alert('Продажа восстановлена!')
      onClose()
      window.location.reload()
    } catch (error) {
      console.error('Ошибка при восстановлении продажи:', error)
      alert('Ошибка при восстановлении продажи.')
    }
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const currentSales = filteredSales.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return <div>Загрузка...</div>
  }
  if (isError) {
    return <div>Произошла ошибка при загрузке данных.</div>
  }

  return (
    <div
      className={
        'absolute top-[20%] left-[5%] w-[90vw] h-[80vh] bg-white p-4 rounded shadow-lg overflow-y-auto'
      }
    >
      <h2 className={'text-2xl font-semibold mb-4'}>Удалённые продажи</h2>

      <div className={'mb-4'}>
        <label className={'mr-2'}>Выберите год:</label>
        <select onChange={handleYearChange} value={selectedYear}>
          {[...Array(6)].map((_, i) => (
            <option key={2020 + i} value={2020 + i}>
              {2020 + i}
            </option>
          ))}
        </select>

        <label className={'mr-2 ml-4'}>Выберите начальный месяц:</label>
        <select onChange={handleStartMonthChange} value={selectedStartMonth}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <label className={'mr-2 ml-4'}>Выберите конечный месяц:</label>
        <select onChange={handleEndMonthChange} value={selectedEndMonth}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      <table className={'min-w-full table-fixed border-collapse divide-y divide-gray-200'}>
        <thead>
          <tr>
            <th className={'px-4 py-2 text-left'}>Номер продажи</th>
            <th className={'px-4 py-2 text-left'}>Дата</th>

            <th className={'px-4 py-2 text-left'}>Сумма</th>
            <th className={'px-4 py-2 text-left'}>Логистика</th>
            <th className={'px-4 py-2 text-left'}>Маржа</th>
            <th className={'px-4 py-2 text-left'}>Предоплата</th>
            <th className={'px-4 py-2 text-left'}>Последняя доставка</th>
            <th className={'px-4 py-2 text-left'}>Действие</th>
          </tr>
        </thead>
        <tbody>
          {currentSales.map(sale => (
            <tr key={sale.id}>
              <td className={'px-4 py-2'}>{sale.id}</td>
              <td className={'px-4 py-2'}>{new Date(sale.date).toLocaleDateString()}</td>

              <td className={'px-4 py-2'}>{sale.totalSaleAmount}</td>
              <td className={'px-4 py-2'}>{sale.logisticsCost}</td>
              <td className={'px-4 py-2'}>
                {formatCurrency(
                  ((sale.paidNow + sale.prepaymentAmount) as number) -
                    sale.logisticsCost -
                    sale.purchaseCost
                )}
              </td>
              <td className={'px-4 py-2'}>{sale.prepaymentAmount}</td>
              <td className={'px-4 py-2'}>
                {sale.lastDeliveryDate
                  ? new Date(sale.lastDeliveryDate).toLocaleDateString()
                  : 'Нет данных'}
              </td>
              <td className={'px-4 py-2'}>
                <button
                  className={'bg-green-500 text-white p-2 rounded'}
                  onClick={() => handleRestoreSale(sale.id)}
                >
                  Восстановить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={'flex justify-between items-center mt-4'}>
        <button
          className={'bg-gray-300 text-gray-700 p-2 rounded'}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Предыдущая
        </button>
        <span>
          Страница {currentPage} из {totalPages}
        </span>
        <button
          className={'bg-gray-300 text-gray-700 p-2 rounded'}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Следующая
        </button>
      </div>

      <button
        className={'absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded shadow-md'}
        onClick={onClose}
      >
        Закрыть
      </button>
    </div>
  )
}

export default DeletedSalesList
