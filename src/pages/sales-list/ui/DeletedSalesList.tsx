import React, { useEffect, useState } from 'react'

import { useGetDeletedSalesQuery, useRestoreSaleMutation } from '@/entities/sale'
import { SaleDto } from '@/entities/sale/sale.types'

interface DeletedSalesListProps {
  onClose: () => void
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

const DeletedSalesList: React.FC<DeletedSalesListProps> = ({ onClose }) => {
  const { data: deletedSalesData, isError, isLoading } = useGetDeletedSalesQuery()
  const [restoreSale] = useRestoreSaleMutation()

  const [selectedYear, setSelectedYear] = useState<string>('2024')
  const [selectedStartMonth, setSelectedStartMonth] = useState<string>('1')
  const [selectedEndMonth, setSelectedEndMonth] = useState<string>('12')
  const [filteredSales, setFilteredSales] = useState<SaleDto[]>([])

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = event.target.value

    setSelectedYear(year)
  }

  const handleStartMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const month = event.target.value

    setSelectedStartMonth(month)
  }

  const handleEndMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const month = event.target.value

    setSelectedEndMonth(month)
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

  if (isLoading) {
    return <div>Загрузка...</div>
  }
  if (isError) {
    return <div>Произошла ошибка при загрузке данных.</div>
  }

  return (
    <div
      className={
        'absolute top-[20%] left-[5%] w-[90vw] h-[60vh] bg-white p-4 rounded shadow-lg overflow-y-auto'
      }
    >
      <h2 className={'text-2xl font-semibold mb-4'}>Удалённые продажи</h2>

      {/* Фильтры */}
      <div className={'mb-4'}>
        <label className={'mr-2'}>Выберите год:</label>
        <select onChange={handleYearChange} value={selectedYear}>
          {[...Array(5)].map((_, i) => (
            <option key={2020 + i} value={2020 + i}>
              {2020 + i}
            </option>
          ))}
        </select>

        <label className={'mr-2 ml-4'}>Выберите начальный месяц:</label>
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
      </div>

      {/* Таблица с удалёнными продажами */}
      <table className={'min-w-full table-fixed border-collapse divide-y divide-gray-200'}>
        <thead>
          <tr>
            <th className={'px-4 py-2 text-left'}>ID</th>
            <th className={'px-4 py-2 text-left'}>Дата</th>
            <th className={'px-4 py-2 text-left'}>Сумма</th>
            <th className={'px-4 py-2 text-left'}>Действие</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale: SaleDto) => (
            <tr key={sale.id}>
              <td className={'px-4 py-2'}>{sale.id}</td>
              <td className={'px-4 py-2'}>{new Date(sale.date).toLocaleDateString()}</td>
              <td className={'px-4 py-2'}>{sale.totalSaleAmount}</td>
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

      <button
        className={'mt-4 ml-[100px] mb-[10px] bg-red-500 text-white p-2 rounded'}
        onClick={onClose}
      >
        Закрыть
      </button>
    </div>
  )
}

export default DeletedSalesList
