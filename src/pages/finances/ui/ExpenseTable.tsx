import React, { useEffect, useState } from 'react'

import { ExpenseDto } from '@/entities/deal/deal.types'

import AddExpenseModal from './AddExpenseModal'
import ReportDetailsModal from './ReportDetailsModal'

type Subcategory = {
  reports: ExpenseDto[]
  subcategory: string
}

type Category = {
  category: string
  subcategories: Subcategory[]
}

type ExpenseTableProps = {
  expenses: ExpenseDto[]
  months: string[]
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, months }) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<null | string>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<null | string>(null)
  const [selectedReport, setSelectedReport] = useState<ExpenseDto | null>(null)
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<string>(months[new Date().getMonth()])

  useEffect(() => {
    const structuredCategories: Category[] = []

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

    setCategories(structuredCategories)
  }, [expenses])

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
              <tr onClick={() => handleCategoryClick(category.category)}>
                <td className={'border px-4 py-2 cursor-pointer'}>{category.category}</td>
                <td className={'border px-4 py-2'}>{calculateTotalForCategory(category)}</td>
              </tr>
              {selectedCategory === category.category &&
                category.subcategories.map(subcategory => (
                  <React.Fragment key={subcategory.subcategory}>
                    <tr onClick={() => handleSubcategoryClick(subcategory.subcategory)}>
                      <td className={'border px-4 py-2 pl-8 cursor-pointer'}>
                        {subcategory.subcategory}
                      </td>
                      <td className={'border px-4 py-2'}>
                        {calculateTotalForSubcategory(subcategory)}
                      </td>
                    </tr>
                    {selectedSubcategory === subcategory.subcategory &&
                      subcategory.reports.map(
                        report =>
                          isReportInSelectedMonth(report) && (
                            <tr key={report.id} onClick={() => handleReportClick(report)}>
                              <td className={'border px-4 py-2 pl-16 cursor-pointer'}>
                                {report.name}
                              </td>
                              <td className={'border px-4 py-2'}>{report.expense}</td>
                            </tr>
                          )
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
