import React, { useEffect, useState } from 'react'

type ExpenseReport = {
  category: string
  date: string
  expense: number
  id: number
  name: string
  subcategory: string
  userId?: number // Добавлено поле userId
}

type ReportDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (updatedReport: ExpenseReport) => void
  report: ExpenseReport | null
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  report,
}) => {
  const [editableReport, setEditableReport] = useState<ExpenseReport | null>(report)

  useEffect(() => {
    setEditableReport(report)
  }, [report])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editableReport) {
      const { name, value } = e.target

      setEditableReport({
        ...editableReport,
        [name]: name === 'expense' ? parseFloat(value) : value,
      })
    }
  }

  const handleSave = () => {
    if (editableReport) {
      onSave(editableReport)
      onClose()
    }
  }

  if (!isOpen || !editableReport) {
    return null
  }

  return (
    <div className={'fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'}>
      <div className={'bg-white p-6 rounded shadow-lg w-96'}>
        <h2 className={'text-xl mb-4'}>Детали расхода</h2>
        <div className={'flex flex-col space-y-4'}>
          <div>
            <label className={'block'}>userId</label>
            <input
              className={'border p-2 w-full'}
              name={'userId'}
              onChange={handleChange}
              type={'text'}
              value={editableReport.userId}
            />
          </div>
          <div>
            <label className={'block'}>Дата</label>
            <input
              className={'border p-2 w-full'}
              name={'date'}
              onChange={handleChange}
              type={'text'}
              value={editableReport.date}
            />
          </div>
          <div>
            <label className={'block'}>Сумма</label>
            <input
              className={'border p-2 w-full'}
              name={'expense'}
              onChange={handleChange}
              type={'number'}
              value={editableReport.expense}
            />
          </div>
          <div>
            <label className={'block'}>Название</label>
            <input
              className={'border p-2 w-full'}
              name={'name'}
              onChange={handleChange}
              type={'text'}
              value={editableReport.name}
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

export default ReportDetailsModal
