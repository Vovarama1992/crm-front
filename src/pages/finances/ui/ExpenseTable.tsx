/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react'

import { useGetAllPaymentsQuery, useGetAllSalesQuery } from '@/entities/deal'
import { ExpenseDto } from '@/entities/deal/deal.types'
import { useGetWorkersQuery } from '@/entities/workers'
import { formatCurrency } from '@/pages/kopeechnik'

import AddExpenseModal from './AddExpenseModal'
import ReportDetailsModal from './ReportDetailsModal'

type Subcategory = {
  reports: ExpenseDto[]
  subcategory: string
}

type Category = {
  category: string
  payments?: number // Сумма выплат для категории
  subcategories: Subcategory[]
}

const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
] // Массив месяцев

const ExpenseTable: React.FC<{ expenses: ExpenseDto[] }> = ({ expenses }) => {
  const { data: workersData } = useGetWorkersQuery()
  const { data: salesData } = useGetAllSalesQuery()
  const { data: paymentsData } = useGetAllPaymentsQuery()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<null | string>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<null | string>(null)
  const [selectedReport, setSelectedReport] = useState<ExpenseDto | null>(null)
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [startMonth, setStartMonth] = useState<string>(months[0]) // По умолчанию первый месяц
  const [endMonth, setEndMonth] = useState<string>(months[0]) // По умолчанию первый месяц

  useEffect(() => {
    const structuredCategories: Category[] = []
    const startMonthIndex = months.indexOf(startMonth)
    const endMonthIndex = months.indexOf(endMonth)
    const currentYear = new Date().getFullYear()

    // Формируем существующие категории на основе расходов
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date)
      const expenseMonthIndex = expenseDate.getMonth()
      const isInInterval =
        expenseDate.getFullYear() === currentYear &&
        expenseMonthIndex >= startMonthIndex &&
        expenseMonthIndex <= endMonthIndex

      if (isInInterval) {
        const categoryIndex = structuredCategories.findIndex(
          cat => cat.category === expense.category
        )

        if (categoryIndex === -1) {
          structuredCategories.push({
            category: expense.category,
            subcategories: [
              {
                reports: [expense],
                subcategory: expense.subcategory,
              },
            ],
          })
        } else {
          const subcategoryIndex = structuredCategories[categoryIndex].subcategories.findIndex(
            subcat => subcat.subcategory === expense.subcategory
          )

          if (subcategoryIndex === -1) {
            structuredCategories[categoryIndex].subcategories.push({
              reports: [expense],
              subcategory: expense.subcategory,
            })
          } else {
            structuredCategories[categoryIndex].subcategories[subcategoryIndex].reports.push(
              expense
            )
          }
        }
      }
    })

    // Добавляем фиксированную сумму аренды офиса для выбранного интервала
    structuredCategories.push({
      category: 'Офис',
      subcategories: [
        {
          reports: [
            {
              category: 'Офис',
              date: new Date(currentYear, startMonthIndex, 1).toISOString(),
              expense: 20000 * (endMonthIndex - startMonthIndex + 1), // Умножаем на количество месяцев
              id: -1, // Для уникальности id
              name: 'Аренда офиса',
              subcategory: 'Аренда',
            } as ExpenseDto,
          ],
          subcategory: 'Аренда',
        },
      ],
    })

    // Рассчитываем ФОТ и добавляем в соответствующую категорию для выбранного интервала
    if (workersData) {
      const fotSubcategory: Subcategory = {
        reports: [],
        subcategory: 'ФОТ',
      }

      workersData.forEach(worker => {
        if (worker.hireDate && worker.salary) {
          const hiredDate = new Date(worker.hireDate)

          if (hiredDate <= new Date(currentYear, endMonthIndex + 1, 0)) {
            for (let month = startMonthIndex; month <= endMonthIndex; month++) {
              const firstDayOfMonth = new Date(currentYear, month, 1)
              const lastDayOfMonth = new Date(currentYear, month + 1, 0) // Последний день месяца

              if (hiredDate <= lastDayOfMonth) {
                const daysInMonth = lastDayOfMonth.getDate()
                const workingDays =
                  hiredDate > firstDayOfMonth ? daysInMonth - hiredDate.getDate() + 1 : daysInMonth

                const proportionalSalary = Math.round(
                  (worker.salary || 0) * (workingDays / daysInMonth)
                )

                fotSubcategory.reports.push({
                  category: 'ФОТ',
                  date: worker.hireDate,
                  expense: proportionalSalary,
                  id: worker.id,
                  name: worker.name,
                  subcategory: 'ФОТ',
                } as ExpenseDto)
              }
            }
          }
        }
      })

      // Добавляем выплаты с типом "Селери"
      const salaryPayments =
        paymentsData
          ?.filter(
            payment =>
              payment.type === 'SALARY' &&
              new Date(payment.date).getMonth() >= startMonthIndex &&
              new Date(payment.date).getMonth() <= endMonthIndex
          )
          .reduce((sum, payment) => sum + payment.amount, 0) || 0

      structuredCategories.push({
        category: 'ФОТ',
        payments: salaryPayments,
        subcategories: [fotSubcategory],
      })
    }

    // Создаем категорию "Заработали менеджеры" и добавляем совокупную маржу для выбранного интервала
    if (salesData) {
      const managerEarningsSubcategory: Subcategory = {
        reports: [],
        subcategory: 'Заработали менеджеры',
      }

      salesData.forEach(sale => {
        const saleDate = new Date(sale.date)
        const saleMonthIndex = saleDate.getMonth()

        if (
          saleDate.getFullYear() === currentYear &&
          saleMonthIndex >= startMonthIndex &&
          saleMonthIndex <= endMonthIndex &&
          sale.margin
        ) {
          managerEarningsSubcategory.reports.push({
            category: 'Заработали менеджеры',
            date: sale.date,
            expense: sale.margin,
            id: sale.id,
            name: `Заработано по сделке #${sale.id}`,
            subcategory: 'Заработали менеджеры',
          } as ExpenseDto)
        }
      })

      // Добавляем выплаты с типом "Бонус"
      const bonusPayments =
        paymentsData
          ?.filter(
            payment =>
              payment.type === 'BONUS' &&
              new Date(payment.date).getMonth() >= startMonthIndex &&
              new Date(payment.date).getMonth() <= endMonthIndex
          )
          .reduce((sum, payment) => sum + payment.amount, 0) || 0

      structuredCategories.push({
        category: 'Заработали менеджеры',
        payments: bonusPayments,
        subcategories: [managerEarningsSubcategory],
      })
    }

    setCategories(structuredCategories)
  }, [expenses, workersData, salesData, paymentsData, startMonth, endMonth])

  const isReportInSelectedRange = (report: ExpenseDto): boolean => {
    const reportDate = new Date(report.date)
    const reportMonthIndex = reportDate.getMonth()
    const startMonthIndex = months.indexOf(startMonth)
    const endMonthIndex = months.indexOf(endMonth)

    return (
      reportDate.getFullYear() === new Date().getFullYear() &&
      reportMonthIndex >= startMonthIndex &&
      reportMonthIndex <= endMonthIndex
    )
  }

  const handleAddExpense = () => {
    setIsAddExpenseModalOpen(true)
  }

  const handleUpdateReport = (updatedReport: ExpenseDto) => {
    const updatedCategories = categories.map(cat => {
      const updatedSubcategories = cat.subcategories.map(subcat => {
        const updatedReports = subcat.reports.map(report =>
          report.id === updatedReport.id ? updatedReport : report
        )

        return { ...subcat, reports: updatedReports }
      })

      return { ...cat, subcategories: updatedSubcategories }
    })

    setCategories(updatedCategories)
  }

  const handleReportClick = (report: ExpenseDto) => {
    setSelectedReport(report)
    setIsDetailModalOpen(true)
  }

  const calculateTotalForCategory = (category: Category) => {
    return category.subcategories.reduce((total, subcat) => {
      return total + calculateTotalForSubcategory(subcat)
    }, 0)
  }

  const calculateTotalForSubcategory = (subcategory: Subcategory) => {
    return subcategory.reports.reduce((total, report) => {
      return total + report.expense
    }, 0)
  }

  const calculateTotalExpenses = () => {
    return categories.reduce((total, category) => {
      return total + calculateTotalForCategory(category)
    }, 0)
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory(null)
  }

  const handleSubcategoryClick = (subcategory: string) => {
    setSelectedSubcategory(subcategory)
  }

  const handleStartMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStartMonth(event.target.value)
  }

  const handleEndMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEndMonth(event.target.value)
  }

  return (
    <div>
      <div className={'mb-4'}>
        <label htmlFor={'startMonthSelect'}>Выберите начальный месяц: </label>
        <select
          className={'border p-2'}
          id={'startMonthSelect'}
          onChange={handleStartMonthChange}
          value={startMonth}
        >
          {months.map(month => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        <label className={'ml-4'} htmlFor={'endMonthSelect'}>
          Выберите конечный месяц:{' '}
        </label>
        <select
          className={'border p-2'}
          id={'endMonthSelect'}
          onChange={handleEndMonthChange}
          value={endMonth}
        >
          {months.map(month => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <table className={'table-auto w-full border-collapse'}>
        <thead>
          <tr>
            <th className={'border px-4 py-2 bg-gray-100'}>Категория</th>
            <th className={'border px-4 py-2 bg-gray-100'}>Сумма</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <React.Fragment key={category.category}>
              <tr
                className={`cursor-pointer ${selectedCategory === category.category ? 'bg-gray-200' : 'bg-white'}`}
                onClick={() => handleCategoryClick(category.category)}
              >
                <td className={'border px-4 py-2 font-bold'}>{category.category}</td>
                <td className={'border px-4 py-2 font-bold'}>
                  {calculateTotalForCategory(category)}
                </td>
              </tr>
              {selectedCategory === category.category &&
                category.subcategories.map(subcategory => (
                  <React.Fragment key={subcategory.subcategory}>
                    <tr
                      className={`cursor-pointer ${selectedSubcategory === subcategory.subcategory ? 'bg-gray-300' : 'bg-gray-100'}`}
                      onClick={() => handleSubcategoryClick(subcategory.subcategory)}
                    >
                      <td className={'border px-4 py-2 pl-8'}>{subcategory.subcategory}</td>
                      <td className={'border px-4 py-2'}>
                        {calculateTotalForSubcategory(subcategory)}
                      </td>
                    </tr>
                    {selectedSubcategory === subcategory.subcategory &&
                      subcategory.reports.map(
                        report =>
                          isReportInSelectedRange(report) && (
                            <tr
                              className={'cursor-pointer bg-white hover:bg-gray-50'}
                              key={report.id}
                              onClick={() => handleReportClick(report)}
                            >
                              <td className={'border px-4 py-2 pl-16'}>{report.name}</td>
                              <td className={'border px-4 py-2'}>
                                {formatCurrency(report.expense)}
                              </td>
                            </tr>
                          )
                      )}
                  </React.Fragment>
                ))}
              {/* Строка "Выплачено" */}
              {category.payments && (
                <tr>
                  <td className={'border px-4 py-2 font-bold text-right'} colSpan={2}>
                    Выплачено: {formatCurrency(category.payments)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {/* Общий расход */}
          <tr>
            <td className={'border px-4 py-2 font-bold text-right'} colSpan={2}>
              Общий расход за период: {calculateTotalExpenses()}
            </td>
          </tr>
        </tbody>
      </table>

      <button className={'mt-4 p-2 bg-blue-500 text-white rounded'} onClick={handleAddExpense}>
        Добавить расход
      </button>

      <AddExpenseModal
        categories={categories}
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
      />

      <ReportDetailsModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSave={handleUpdateReport}
        report={selectedReport}
      />
    </div>
  )
}

export default ExpenseTable
