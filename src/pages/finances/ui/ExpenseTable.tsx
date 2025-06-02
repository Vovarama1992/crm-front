/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react'

import { useGetAllPaymentsQuery } from '@/entities/deal'
import { useGetMonthlyBonusesQuery } from '@/entities/deal'
import { ExpenseDto } from '@/entities/deal/deal.types'
import { useGetAllSalesQuery } from '@/entities/sale'
import { useGetWorkersQuery } from '@/entities/workers'
import { formatCurrency } from '@/pages/kopeechnik'

import AddExpenseModal from './AddExpenseModal'
import DeletedExpensesModal from './DeletedExpensesModal'
import FOTExpenseModal from './FOtExpenseModal'
import RentExpenseModal from './RentExpenseModal'
import ReportDetailsModal from './ReportDetailsModal'
import { EmployeeExpense } from './finances-page'

type Subcategory = {
  reports: ExpenseDto[]
  subcategory: string
}

type Category = {
  category: string
  payments?: number
  subcategories: Subcategory[]
}

const ExpenseTable: React.FC<{
  employeeExpenses: EmployeeExpense[]
  expenses: ExpenseDto[]
  months: string[]
}> = ({ employeeExpenses, expenses, months }) => {
  const { data: workersData } = useGetWorkersQuery()
  const { data: salesData } = useGetAllSalesQuery()
  const { data: paymentsData } = useGetAllPaymentsQuery()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<null | string>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<null | string>(null)
  const [selectedReport, setSelectedReport] = useState<ExpenseDto | null>(null)
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false)
  const [isRentModalOpen, setIsRentModalOpen] = useState(false)
  const [isFOTModalOpen, setIsFOTModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeletedExpensesModalOpen, setIsDeletedExpensesModalOpen] = useState(false)

  const { data: bonusesData } = useGetMonthlyBonusesQuery()

  const savedYear = localStorage.getItem('expensesSelectedYear')
  const selectedYear = savedYear ? Number(savedYear) : new Date().getFullYear()

  const startMonth = months[0]
  const endMonth = months[months.length - 1]

  const columnWidth = 150
  const monthColWidth = 700

  const handleOpenDeletedExpensesModal = () => setIsDeletedExpensesModalOpen(true)
  const handleOpenRentModal = () => setIsRentModalOpen(true)
  const handleOpenFOTModal = () => setIsFOTModalOpen(true)
  const handleCloseDeletedExpensesModal = () => setIsDeletedExpensesModalOpen(false)

  const monthNames = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
  ]
  const startMonthIndex = monthNames.indexOf(startMonth.toLowerCase())
  const endMonthIndex = monthNames.indexOf(endMonth.toLowerCase())

  useEffect(() => {
    const structuredCategories: Category[] = []

    const allExpenses = [...expenses]

    allExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date)
      const expenseMonthIndex = expenseDate.getMonth()
      const expenseYear = expenseDate.getFullYear()

      const isInInterval =
        expenseYear === selectedYear &&
        expenseMonthIndex >= startMonthIndex &&
        expenseMonthIndex <= endMonthIndex

      if (!isInInterval) {
        return
      }

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

    console.log('📦 bonusesData с бэка:', bonusesData)

    const bonusCategory: Category = {
      category: 'Премия',
      subcategories: [
        {
          reports: months.map((month, index) => {
            const expense = bonusesData?.[month] ?? 0

            const monthIndex = startMonthIndex + index

            const report = {
              category: 'Премия',
              date: new Date(selectedYear, monthIndex, 1).toISOString(), // ✅ исправили здесь
              expense,
              id: -10000 - index,
              name: 'Премия',
              subcategory: 'Автоматическая',
            }

            console.log(`📅 ${month} → ${expense}`, report)

            return report
          }),
          subcategory: 'Автоматическая',
        },
      ],
    }

    structuredCategories.push(bonusCategory)

    console.log('📊 Итоговые категории:', structuredCategories)

    setCategories(structuredCategories)
  }, [
    expenses,
    workersData,
    salesData,
    paymentsData,
    startMonth,
    endMonth,
    selectedYear,
    months,
    employeeExpenses,
    startMonthIndex,
    endMonthIndex,
    bonusesData,
  ])

  const handleAddExpense = () => setIsAddExpenseModalOpen(true)

  const handleUpdateReport = (updatedReport: ExpenseDto) => {
    const updatedCategories = categories.map(cat => ({
      ...cat,
      subcategories: cat.subcategories.map(subcat => ({
        ...subcat,
        reports: subcat.reports.map(report =>
          report.id === updatedReport.id ? updatedReport : report
        ),
      })),
    }))

    setCategories(updatedCategories)
  }

  const handleReportClick = (report: ExpenseDto) => {
    setSelectedReport(report)
    setIsDetailModalOpen(true)
  }

  const calculateTotalForMonth = (category: Category, monthIndex: number) => {
    const selectedMonth = startMonthIndex + monthIndex

    return category.subcategories.reduce((total, subcat) => {
      return (
        total +
        subcat.reports
          .filter(report => {
            const date = new Date(report.date)

            return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth
          })
          .reduce((sum, report) => sum + report.expense, 0)
      )
    }, 0)
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory(null)
  }

  const handleSubcategoryClick = (subcategory: string) => {
    setSelectedSubcategory(subcategory)
  }

  return (
    <div>
      <table
        className={'border'}
        style={{ width: columnWidth + months.length * monthColWidth + columnWidth }}
      >
        <thead>
          <tr>
            <th className={'border px-4 py-2 bg-gray-100'} style={{ width: columnWidth }}>
              Категория
            </th>
            {months.map(month => (
              <th
                className={'border px-6 py-3 bg-gray-100 text-right'}
                key={month}
                style={{ width: monthColWidth }}
              >
                {month}
              </th>
            ))}
            <th className={'border px-4 py-2 bg-gray-100'} style={{ width: columnWidth }}>
              Расход за период
            </th>
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
                {months.map((_, index) => (
                  <td className={'border px-6 py-3 text-right'} key={index}>
                    {formatCurrency(calculateTotalForMonth(category, index))}
                  </td>
                ))}
                <td className={'border px-6 py-3 text-right'}></td>
              </tr>

              {selectedCategory === category.category &&
                category.subcategories.map(subcategory => (
                  <React.Fragment key={subcategory.subcategory}>
                    <tr
                      className={`cursor-pointer ${selectedSubcategory === subcategory.subcategory ? 'bg-gray-300' : 'bg-gray-100'}`}
                      onClick={() => handleSubcategoryClick(subcategory.subcategory)}
                    >
                      <td className={'border px-4 py-2 pl-8'}>{subcategory.subcategory}</td>
                      {months.map((_, index) => {
                        const selectedMonth = startMonthIndex + index
                        const sum = subcategory.reports
                          .filter(report => {
                            const date = new Date(report.date)

                            return (
                              date.getFullYear() === selectedYear &&
                              date.getMonth() === selectedMonth
                            )
                          })
                          .reduce((acc, report) => acc + report.expense, 0)

                        return (
                          <td className={'border px-6 py-3 text-right'} key={index}>
                            {formatCurrency(sum)}
                          </td>
                        )
                      })}
                      <td className={'border px-6 py-3 text-right'}>
                        {formatCurrency(subcategory.reports.reduce((acc, r) => acc + r.expense, 0))}
                      </td>
                    </tr>

                    {selectedSubcategory === subcategory.subcategory && (
                      <tr className={'bg-white hover:bg-gray-50'}>
                        <td className={'border px-4 py-2 pl-16'}></td>
                        {months.map((_, index) => {
                          const selectedMonth = startMonthIndex + index
                          const monthReports = subcategory.reports.filter(r => {
                            const date = new Date(r.date)

                            return (
                              date.getFullYear() === selectedYear &&
                              date.getMonth() === selectedMonth
                            )
                          })

                          return (
                            <td className={'border px-6 py-3 text-right'} key={index}>
                              {monthReports.map(report => (
                                <div
                                  className={'cursor-pointer'}
                                  key={report.id}
                                  onClick={() => handleReportClick(report)}
                                >
                                  {report.name}: {formatCurrency(report.expense)}
                                </div>
                              ))}
                            </td>
                          )
                        })}
                        <td className={'border px-6 py-3 text-right'}></td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <button className={'mt-4 p-2 bg-blue-500 text-white rounded'} onClick={handleAddExpense}>
        Добавить расход
      </button>
      <button
        className={'mt-4 ml-2 p-2 bg-red-500 text-white rounded'}
        onClick={handleOpenDeletedExpensesModal}
      >
        Показать удаленные расходы
      </button>
      <button
        className={'mt-4 ml-2 p-2 bg-green-500 text-white rounded'}
        onClick={handleOpenRentModal}
      >
        АРЕНДА
      </button>
      <button
        className={'mt-4 ml-2 p-2 bg-yellow-500 text-white rounded'}
        onClick={handleOpenFOTModal}
      >
        ФОТ
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
      <DeletedExpensesModal
        isOpen={isDeletedExpensesModalOpen}
        onClose={handleCloseDeletedExpensesModal}
      />
      <RentExpenseModal isOpen={isRentModalOpen} onClose={() => setIsRentModalOpen(false)} />
      <FOTExpenseModal isOpen={isFOTModalOpen} onClose={() => setIsFOTModalOpen(false)} />
    </div>
  )
}

export default ExpenseTable
