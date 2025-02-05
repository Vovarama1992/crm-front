/* eslint-disable max-lines */
import React, { useEffect, useState } from 'react'

import { useGetAllPaymentsQuery } from '@/entities/deal'
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
  payments?: number // Сумма выплат для категории
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
  const [expenseSum, setSum] = useState(0)

  const startMonth = months[0]
  const endMonth = months[months.length - 1]

  const handleOpenDeletedExpensesModal = () => {
    setIsDeletedExpensesModalOpen(true)
  }
  const handleOpenRentModal = () => setIsRentModalOpen(true)
  const handleOpenFOTModal = () => setIsFOTModalOpen(true)

  const handleCloseDeletedExpensesModal = () => {
    setIsDeletedExpensesModalOpen(false)
  }

  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const savedYear = localStorage.getItem('expensesSelectedYear')

    return savedYear ? Number(savedYear) : new Date().getFullYear()
  })

  const isReportInSelectedRange = (report: ExpenseDto): boolean => {
    const reportDate = new Date(report.date)
    const reportMonthIndex = reportDate.getMonth()
    const startMonthIndex = months.indexOf(startMonth)
    const endMonthIndex = months.indexOf(endMonth)

    return (
      reportDate.getFullYear() === selectedYear &&
      reportMonthIndex >= startMonthIndex &&
      reportMonthIndex <= endMonthIndex
    )
  }

  useEffect(() => {
    console.log('Начинаем формирование категорий...')
    console.log('Исходные расходы:', expenses)
    console.log('Выбранный год:', selectedYear)
    console.log('Диапазон месяцев:', startMonth, '-', endMonth)

    const structuredCategories: Category[] = []
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

    console.log('Индексы месяцев:', startMonthIndex, '-', endMonthIndex)

    if (startMonthIndex === -1 || endMonthIndex === -1) {
      console.error('Ошибка: не удалось найти индексы месяцев.')

      return
    }

    let sum = 0

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date)
      const expenseMonthIndex = expenseDate.getMonth()
      const expenseYear = expenseDate.getFullYear()

      const isInInterval =
        expenseYear === selectedYear &&
        expenseMonthIndex >= startMonthIndex &&
        expenseMonthIndex <= endMonthIndex

      if (isInInterval) {
        sum += expense.expense

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
      } else {
        console.log(`❌ Расход ${expense.name} не попадает в диапазон`)
      }
    })

    // Добавление категории "Зарплата сотрудников" с подкатегорией "Премия"
    const salaryCategoryIndex = structuredCategories.findIndex(
      cat => cat.category === 'Зарплата сотрудников'
    )

    if (salaryCategoryIndex === -1) {
      structuredCategories.push({
        category: 'Зарплата сотрудников',
        subcategories: [
          {
            reports: expenses.filter(
              expense =>
                expense.category === 'Зарплата сотрудников' && expense.subcategory === 'Премия'
            ),
            subcategory: 'Премия',
          },
        ],
      })
    } else {
      const salarySubcategoryIndex = structuredCategories[
        salaryCategoryIndex
      ].subcategories.findIndex(subcat => subcat.subcategory === 'Премия')

      if (salarySubcategoryIndex === -1) {
        structuredCategories[salaryCategoryIndex].subcategories.push({
          reports: expenses.filter(
            expense =>
              expense.category === 'Зарплата сотрудников' && expense.subcategory === 'Премия'
          ),
          subcategory: 'Премия',
        })
      }
    }

    setSum(sum)
    console.log('Итоговые категории:', structuredCategories)
    setCategories(structuredCategories)
  }, [expenses, workersData, salesData, paymentsData, startMonth, endMonth, selectedYear, months])

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

  const calculateTotalForMonth = (category: Category, monthIndex: number) => {
    return category.subcategories.reduce((total, subcat) => {
      return (
        total +
        subcat.reports
          .filter(report => new Date(report.date).getMonth() === monthIndex)
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
  const width = months.length * 300

  return (
    <div className={`w-[${width}px]`}>
      <table>
        <thead>
          <tr>
            <th className={'border px-4 py-2 bg-gray-100'}>Категория</th>
            {months.map(month => (
              <th className={'border px-4 py-2 bg-gray-100'} key={month}>
                {month}
              </th>
            ))}
            <th className={'border px-4 py-2 bg-gray-100'}>Расход за период</th>
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
                {months.map((month, index) => (
                  <td className={'border px-4 py-2'} key={month}>
                    {formatCurrency(calculateTotalForMonth(category, index))}
                  </td>
                ))}
              </tr>
              {selectedCategory === category.category &&
                category.subcategories.map(subcategory => (
                  <React.Fragment key={subcategory.subcategory}>
                    <tr
                      className={`cursor-pointer ${selectedSubcategory === subcategory.subcategory ? 'bg-gray-300' : 'bg-gray-100'}`}
                      onClick={() => handleSubcategoryClick(subcategory.subcategory)}
                    >
                      <td className={'border px-4 py-2 pl-8'}>{subcategory.subcategory}</td>
                      {months.map((month, index) => (
                        <td className={'border px-4 py-2'} key={month}>
                          {formatCurrency(
                            subcategory.reports
                              .filter(report => new Date(report.date).getMonth() === index)
                              .reduce((sum, report) => sum + report.expense, 0)
                          )}
                        </td>
                      ))}
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
            </React.Fragment>
          ))}
          <tr>
            <td
              className={'border px-4 py-2 font-bold text-right'}
              colSpan={months.length + 1}
            ></td>
            <td className={'border px-4 py-2 font-bold text-center'}>{expenseSum}</td>
          </tr>
        </tbody>
      </table>

      <button className={'mt-4 p-2 bg-blue-500 text-white rounded'} onClick={handleAddExpense}>
        Добавить расход
      </button>

      <button
        className={'mt-4 ml-2 p-2 bg-red-500 text-white rounded'}
        onClick={handleOpenDeletedExpensesModal}
      >
        Показать удаленннные расходы
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
