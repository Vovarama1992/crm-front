import React, { useState } from 'react'

import { WorkerDto } from '@/entities/workers'
import { formatDate } from '@/pages/contragents/ui/contragents-page'

import RestoreWorkerForm from './RestoreWorkerForm'

type FiredEmployeeTableProps = {
  workers: WorkerDto[]
}

const FiredEmployeeTable: React.FC<FiredEmployeeTableProps> = ({ workers }) => {
  const [selectedWorker, setSelectedWorker] = useState<WorkerDto | undefined>(undefined)
  const [openRestoreForm, setOpenRestoreForm] = useState(false)

  // Функция для открытия формы восстановления
  const handleRestoreWorker = (worker: WorkerDto) => {
    setSelectedWorker(worker)
    setOpenRestoreForm(true)
  }

  // Закрытие формы восстановления
  const handleCloseRestoreForm = () => {
    setOpenRestoreForm(false)
    setSelectedWorker(undefined)
  }

  const sortedWorkers = workers.slice().sort((a, b) => {
    const dateA = new Date(a.deletedAt as Date)
    const dateB = new Date(b.deletedAt as Date)

    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className={'p-4'}>
      <table className={'min-w-full divide-y divide-gray-200'}>
        <thead className={'bg-gray-50'}>
          <tr>
            <th
              className={
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              }
            >
              №
            </th>
            <th
              className={
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              }
            >
              ФИО
            </th>
            <th
              className={
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              }
            >
              Должность
            </th>
            <th
              className={
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              }
            >
              Почта
            </th>
            <th
              className={
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              }
            >
              Добавочный
            </th>
            <th
              className={
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              }
            >
              Мобильный
            </th>
            <th
              className={
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              }
            >
              Дата рождения
            </th>
            <th
              className={
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              }
            >
              Дата увольнения
            </th>
            <th
              className={
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              }
            >
              Действия
            </th>
          </tr>
        </thead>
        <tbody className={'bg-white divide-y divide-gray-200'}>
          {sortedWorkers.map((worker, index) => (
            <tr key={worker.id}>
              <td className={'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'}>
                {index + 1}
              </td>
              <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>{worker.name}</td>
              <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                {worker.position}
              </td>
              <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                {worker.email}
              </td>
              <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                {worker.dobNumber}
              </td>
              <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                {worker.mobile}
              </td>
              <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                {formatDate(worker.birthday)}
              </td>
              <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                {formatDate(worker.deletedAt) as unknown as string}
              </td>
              <td className={'px-6 py-4 whitespace-nowrap text-sm font-medium'}>
                <button
                  className={'text-blue-600 hover:text-blue-900'}
                  onClick={() => handleRestoreWorker(worker)}
                >
                  Восстановить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Отображение формы восстановления */}
      {openRestoreForm && selectedWorker && (
        <RestoreWorkerForm onClose={handleCloseRestoreForm} worker={selectedWorker} />
      )}
    </div>
  )
}

export default FiredEmployeeTable
