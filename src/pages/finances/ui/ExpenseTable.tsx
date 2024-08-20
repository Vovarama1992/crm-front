/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react'

import { useGetAllPaymentsQuery, useGetAllSalesQuery } from '@/entities/deal'
import { ExpenseDto } from '@/entities/deal/deal.types'
import { useGetWorkersQuery } from '@/entities/workers'

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

type ExpenseTableProps = {
  expenses: ExpenseDto[]
  months: string[]
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, months }) => {
  const { data: workersData } = useGetWorkersQuery()
  const { data: salesData } = useGetAllSalesQuery()
  const { data: paymentsData } = useGetAllPaymentsQuery()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<null | string>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<null | string>(null)
  const [selectedReport, setSelectedReport] = useState<ExpenseDto | null>(null)
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<string>(months[new Date().getMonth()])

  useEffect(() => {
    const structuredCategories: Category[] = []
    const monthIndex = months.indexOf(selectedMonth)
    const currentYear = new Date().getFullYear()

    // Формируем существующие категории на основе расходов
    expenses.forEach(expense => {
      const categoryIndex = structuredCategories.findIndex(cat => cat.category === expense.category)

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
          structuredCategories[categoryIndex].subcategories[subcategoryIndex].reports.push(expense)
        }
      }
    })

    // Добавляем фиксированную сумму аренды офиса
    structuredCategories.push({
      category: 'Офис',
      subcategories: [
        {
          reports: [
            {
              category: 'Офис',
              date: new Date(currentYear, monthIndex, 1).toISOString(),
              expense: 20000,
              id: -1, // Для уникальности id
              name: 'Аренда офиса',
              subcategory: 'Аренда',
            } as ExpenseDto,
          ],
          subcategory: 'Аренда',
        },
      ],
    })

    // Рассчитываем ФОТ и добавляем в соответствующую категорию
    if (workersData) {
      const fotSubcategory: Subcategory = {
        reports: [],
        subcategory: 'ФОТ',
      }

      const firstDayOfMonth = new Date(currentYear, monthIndex, 1)
      const lastDayOfMonth = new Date(currentYear, monthIndex + 1, 0) // Последний день месяца

      workersData.forEach(worker => {
        if (worker.hireDate && worker.salary) {
          const hiredDate = new Date(worker.hireDate)

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
      })

      // Добавляем выплаты с типом "Селери"
      const salaryPayments =
        paymentsData
          ?.filter(
            payment => payment.type === 'SALARY' && new Date(payment.date).getMonth() === monthIndex
          )
          .reduce((sum, payment) => sum + payment.amount, 0) || 0

      structuredCategories.push({
        category: 'ФОТ',
        payments: salaryPayments,
        subcategories: [fotSubcategory],
      })
    }

    // Создаем категорию "Заработали менеджеры" и добавляем совокупную маржу
    if (salesData) {
      const managerEarningsSubcategory: Subcategory = {
        reports: [],
        subcategory: 'Заработали менеджеры',
      }

      salesData.forEach(sale => {
        const saleDate = new Date(sale.date)

        if (
          saleDate.getFullYear() === currentYear &&
          saleDate.getMonth() === monthIndex &&
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
            payment => payment.type === 'BONUS' && new Date(payment.date).getMonth() === monthIndex
          )
          .reduce((sum, payment) => sum + payment.amount, 0) || 0

      structuredCategories.push({
        category: 'Заработали менеджеры',
        payments: bonusPayments,
        subcategories: [managerEarningsSubcategory],
      })
    }

    setCategories(structuredCategories)
  }, [expenses, workersData, salesData, paymentsData, selectedMonth, months])

  const isReportInSelectedMonth = (report: ExpenseDto): boolean => {
    const reportDate = new Date(report.date)
    const reportMonth = reportDate.toLocaleString('ru-RU', { month: 'long' })

    return reportMonth === selectedMonth.toLowerCase()
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

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory(null)
  }

  const handleSubcategoryClick = (subcategory: string) => {
    setSelectedSubcategory(subcategory)
  }

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value)
  }

  return (
    <div>
      <div className={'mb-4'}>
        <label htmlFor={'monthSelect'}>Выберите месяц: </label>
        <select
          className={'border p-2'}
          id={'monthSelect'}
          onChange={handleMonthChange}
          value={selectedMonth}
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
                          isReportInSelectedMonth(report) && (
                            <tr
                              className={'cursor-pointer bg-white hover:bg-gray-50'}
                              key={report.id}
                              onClick={() => handleReportClick(report)}
                            >
                              <td className={'border px-4 py-2 pl-16'}>{report.name}</td>
                              <td className={'border px-4 py-2'}>{report.expense}</td>
                            </tr>
                          )
                      )}
                  </React.Fragment>
                ))}
              {/* Строка "Выплачено" */}
              {category.payments && (
                <tr>
                  <td className={'border px-4 py-2 font-bold text-right'} colSpan={2}>
                    Выплачено: {category.payments}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
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
