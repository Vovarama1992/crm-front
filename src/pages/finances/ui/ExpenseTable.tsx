import React, { useEffect, useState } from 'react'

import AddExpenseModal from './AddExpenseModal'
import ReportDetailsModal from './ReportDetailsModal'

type ExpenseReport = {
  author: string
  date: string
  expense: number
  expense_id: number
  name: string
}

type Subcategory = {
  reports: ExpenseReport[]
  subcategory: string
}

type Category = {
  category: string
  subcategories: Subcategory[]
}

type ExpenseTableProps = {
  initialCategories: Category[]
  months: string[]
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ initialCategories, months }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [selectedCategory, setSelectedCategory] = useState<null | string>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<null | string>(null)
  const [selectedReport, setSelectedReport] = useState<ExpenseReport | null>(null)
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<string>(months[new Date().getMonth()])
  const [currentMaxId, setCurrentMaxId] = useState<number>(0)
  const isReportInSelectedMonth = (report: ExpenseReport): boolean => {
    const reportDate = new Date(report.date)
    const reportMonth = reportDate.toLocaleString('ru-RU', { month: 'long' })

    return reportMonth === selectedMonth.toLowerCase()
  }

  useEffect(() => {
    const maxId = initialCategories.reduce((maxId, category) => {
      category.subcategories.forEach(subcat => {
        subcat.reports.forEach(report => {
          if (report.expense_id > maxId) {
            maxId = report.expense_id
          }
        })
      })

      return maxId
    }, 0)

    setCurrentMaxId(maxId)
  }, [initialCategories])

  const handleAddExpense = () => {
    setIsAddExpenseModalOpen(true)
  }

  const handleAddExpenseSave = (
    newReport: ExpenseReport,
    category: string,
    subcategory: string
  ) => {
    setCurrentMaxId(prevMaxId => prevMaxId + 1)
    const updatedCategories = categories.map(cat => {
      if (cat.category === category) {
        const updatedSubcategories = cat.subcategories.map(subcat => {
          if (subcat.subcategory === subcategory) {
            return { ...subcat, reports: [...subcat.reports, newReport] }
          }

          return subcat
        })

        return { ...cat, subcategories: updatedSubcategories }
      }

      return cat
    })

    setCategories(updatedCategories)
    setIsAddExpenseModalOpen(false)
  }

  const handleUpdateReport = (updatedReport: ExpenseReport) => {
    const updatedCategories = categories.map(cat => {
      const updatedSubcategories = cat.subcategories.map(subcat => {
        const updatedReports = subcat.reports.map(report =>
          report.expense_id === updatedReport.expense_id ? updatedReport : report
        )

        return { ...subcat, reports: updatedReports }
      })

      return { ...cat, subcategories: updatedSubcategories }
    })

    setCategories(updatedCategories)
  }

  const handleReportClick = (report: ExpenseReport) => {
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
                            <tr key={report.expense_id} onClick={() => handleReportClick(report)}>
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
        currentMaxId={currentMaxId}
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        onSave={handleAddExpenseSave}
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
