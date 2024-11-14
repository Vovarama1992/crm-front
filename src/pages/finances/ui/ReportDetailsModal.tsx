import React, { useEffect, useState } from 'react'

import { useGetWorkersQuery } from '@/entities/workers'

type ExpenseReport = {
  category: string
  date: string
  expense: number
  id: number
  name: string
  subcategory: string
  userId?: number
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
  const { data: workers = [] } = useGetWorkersQuery()
  const [workerName, setWorkerName] = useState<string>('')

  useEffect(() => {
    setEditableReport(report)

    if (report && report.userId) {
      const worker = workers.find((w: any) => w.id === report.userId)

      if (worker) {
        setWorkerName(`${worker.name} ${worker.surname}`)
      } else {
        setWorkerName('Неизвестный сотрудник')
      }
    }
  }, [report, workers])

  const handleSave = () => {
    if (editableReport) {
      onSave(editableReport)
      onClose()
    }
  }

  // Форматирование даты в нужный вид (например, "ДД.ММ.ГГГГ")
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }

    return new Date(date).toLocaleDateString('ru-RU', options)
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
            <label className={'block'}>Сотрудник</label>
            <input
              className={'border p-2 w-full'}
              readOnly // Поле только для чтения
              type={'text'}
              value={workerName}
            />
          </div>
          <div>
            <label className={'block'}>Дата</label>
            <input
              className={'border p-2 w-full'}
              readOnly // Поле только для чтения
              type={'text'}
              value={formatDate(editableReport.date)} // Форматированная дата
            />
          </div>
          <div>
            <label className={'block'}>Сумма</label>
            <input
              className={'border p-2 w-full'}
              readOnly // Поле только для чтения
              type={'text'}
              value={editableReport.expense.toFixed(2).replace('.', ',')} // Преобразование суммы
            />
          </div>
          <div>
            <label className={'block'}>Название</label>
            <input
              className={'border p-2 w-full'}
              readOnly // Поле только для чтения
              type={'text'}
              value={editableReport.name}
            />
          </div>
        </div>
        <div className={'flex justify-end space-x-4 mt-4'}>
          <button className={'bg-gray-500 text-white px-4 py-2 rounded'} onClick={onClose}>
            Закрыть
          </button>
          <button className={'bg-gray-500 text-white px-4 py-2 rounded'} onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportDetailsModal
