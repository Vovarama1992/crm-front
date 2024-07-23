import React, { useState } from 'react'

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

type AddExpenseModalProps = {
  categories: Category[]
  currentMaxId: number
  isOpen: boolean
  onClose: () => void
  onSave: (newReport: ExpenseReport, category: string, subcategory: string) => void
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  categories,
  currentMaxId,
  isOpen,
  onClose,
  onSave,
}) => {
  const [newCategory, setNewCategory] = useState<string>('')
  const [newSubcategory, setNewSubcategory] = useState<string>('')
  const [expenseName, setExpenseName] = useState<string>('')
  const [expenseAmount, setExpenseAmount] = useState<number>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const [author, setAuthor] = useState<string>('')
  const [date, setDate] = useState<string>('')

  const handleSave = () => {
    const newReport: ExpenseReport = {
      author,
      date,
      expense: expenseAmount,
      expense_id: currentMaxId + 1,
      name: expenseName,
    }
    const category = newCategory || selectedCategory
    const subcategory = newSubcategory || selectedSubcategory

    onSave(newReport, category, subcategory)
    onClose()
  }

  const categoryOptions = categories.map(cat => (
    <option key={cat.category} value={cat.category}>
      {cat.category}
    </option>
  ))

  const subcategoryOptions = selectedCategory
    ? categories
        .find(cat => cat.category === selectedCategory)
        ?.subcategories.map(subcat => (
          <option key={subcat.subcategory} value={subcat.subcategory}>
            {subcat.subcategory}
          </option>
        ))
    : []

  if (!isOpen) {
    return null
  }

  return (
    <div className={'fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'}>
      <div className={'bg-white p-6 rounded shadow-lg w-96'}>
        <h2 className={'text-xl mb-4'}>Добавить расход</h2>
        <div className={'flex flex-col space-y-4'}>
          <div>
            <label className={'block'}>Категория</label>
            <select
              className={'border p-2 w-full'}
              onChange={e => setSelectedCategory(e.target.value)}
              value={selectedCategory}
            >
              <option value={''}>Выберите категорию</option>
              {categoryOptions}
            </select>
            <input
              className={'border p-2 w-full mt-2'}
              onChange={e => setNewCategory(e.target.value)}
              placeholder={'Или введите новую категорию'}
              value={newCategory}
            />
          </div>
          <div>
            <label className={'block'}>Подкатегория</label>
            <select
              className={'border p-2 w-full'}
              disabled={!selectedCategory}
              onChange={e => setSelectedSubcategory(e.target.value)}
              value={selectedSubcategory}
            >
              <option value={''}>Выберите подкатегорию</option>
              {subcategoryOptions}
            </select>
            <input
              className={'border p-2 w-full mt-2'}
              disabled={!selectedCategory}
              onChange={e => setNewSubcategory(e.target.value)}
              placeholder={'Или введите новую подкатегорию'}
              value={newSubcategory}
            />
          </div>
          <div>
            <label className={'block'}>Название расхода</label>
            <input
              className={'border p-2 w-full'}
              onChange={e => setExpenseName(e.target.value)}
              type={'text'}
              value={expenseName}
            />
          </div>
          <div>
            <label className={'block'}>Сумма</label>
            <input
              className={'border p-2 w-full'}
              onChange={e => setExpenseAmount(parseFloat(e.target.value))}
              type={'number'}
              value={expenseAmount}
            />
          </div>
          <div>
            <label className={'block'}>Автор</label>
            <input
              className={'border p-2 w-full'}
              onChange={e => setAuthor(e.target.value)}
              type={'text'}
              value={author}
            />
          </div>
          <div>
            <label className={'block'}>Дата</label>
            <input
              className={'border p-2 w-full'}
              onChange={e => setDate(e.target.value)}
              type={'date'}
              value={date}
            />
          </div>
        </div>
        <div className={'flex justify-end space-x-4 mt-4'}>
          <button className={'bg-gray-500 text-white px-4 py-2 rounded'} onClick={onClose}>
            Закрыть
          </button>
          <button className={'bg-blue-500 text-white px-4 py-2 rounded'} onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddExpenseModal
