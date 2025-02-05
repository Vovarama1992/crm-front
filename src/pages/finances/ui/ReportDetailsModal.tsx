import React, { useEffect, useState } from 'react'

import { useGetChangesByEntityTypeQuery } from '@/entities/changes'
import { useSoftDeleteExpenseMutation, useUpdateExpenseMutation } from '@/entities/deal'
import { useGetWorkersQuery } from '@/entities/workers' // Используем хук
import { EntityType } from '@/entities/changes/change.types'

import { ExpenseChangeHistoryModal } from './ExpenseChangeHistoryModal'

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
  const { data: changes = [] } = useGetChangesByEntityTypeQuery({ entityType: EntityType.EXPENSE }) // Загружаем историю изменений
  const [updateExpense] = useUpdateExpenseMutation()
  const [deleteExpense] = useSoftDeleteExpenseMutation()
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false)

  useEffect(() => {
    setEditableReport(report)
  }, [report])

  const handleSave = async () => {
    if (editableReport) {
      try {
        await updateExpense({ data: editableReport, id: editableReport.id }).unwrap()
        onSave(editableReport)
        onClose()
      } catch (error) {
        console.error('Ошибка при обновлении расхода:', error)
      }
    }
  }

  const handleDelete = async () => {
    if (editableReport) {
      try {
        await deleteExpense(editableReport.id).unwrap()
        onClose()
      } catch (error) {
        console.error('Ошибка при удалении расхода:', error)
      }
    }
  }

  const handleChange = (field: keyof ExpenseReport, value: number | string) => {
    setEditableReport(prev => (prev ? { ...prev, [field]: value } : null))
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
            <select
              className={'border p-2 w-full'}
              onChange={e => handleChange('userId', Number(e.target.value))}
              value={editableReport.userId || ''}
            >
              <option value={''}>Не выбран</option>
              {workers.map((worker: any) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name} {worker.surname}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={'block'}>Категория</label>
            <input
              className={'border p-2 w-full'}
              onChange={e => handleChange('category', e.target.value)}
              type={'text'}
              value={editableReport.category}
            />
          </div>
          <div>
            <label className={'block'}>Дата</label>
            <input
              className={'border p-2 w-full'}
              onChange={e => handleChange('date', e.target.value)}
              type={'date'}
              value={editableReport.date}
            />
          </div>
          <div>
            <label className={'block'}>Сумма</label>
            <input
              className={'border p-2 w-full'}
              onChange={e => handleChange('expense', parseFloat(e.target.value))}
              type={'number'}
              value={editableReport.expense}
            />
          </div>
          <div>
            <label className={'block'}>Название</label>
            <input
              className={'border p-2 w-full'}
              onChange={e => handleChange('name', e.target.value)}
              type={'text'}
              value={editableReport.name}
            />
          </div>
          <div>
            <label className={'block'}>Подкатегория</label>
            <input
              className={'border p-2 w-full'}
              onChange={e => handleChange('subcategory', e.target.value)}
              type={'text'}
              value={editableReport.subcategory}
            />
          </div>
        </div>
        <div className={'flex justify-center space-x-1 mt-4'}>
          <button
            className={'bg-green-500 text-white px-2 py-1 rounded'}
            onClick={() => setHistoryModalOpen(true)}
          >
            История
          </button>
          <button className={'bg-gray-500 text-white px-2 py-1 rounded'} onClick={onClose}>
            Закрыть
          </button>
          <button className={'bg-gray-700 text-white px-2 py-1 rounded'} onClick={handleSave}>
            Сохранить
          </button>
          <button className={'bg-red-600 text-white px-2 py-1 rounded'} onClick={handleDelete}>
            Удалить
          </button>
        </div>
      </div>

      {isHistoryModalOpen && (
        <ExpenseChangeHistoryModal
          changes={changes.filter(change => change.entityId === editableReport.id)} // Фильтрация по id расхода
          onClose={() => setHistoryModalOpen(false)}
        />
      )}
    </div>
  )
}

export default ReportDetailsModal
