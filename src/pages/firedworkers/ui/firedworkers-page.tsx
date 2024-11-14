import { useState } from 'react'

import { WorkerDto } from '@/entities/workers'
import { useGetFiredWorkersQuery } from '@/entities/workers'

import RestoreWorkerForm from './RestoreWorkerForm'

function formatDate(date: Date | null | string | undefined): string {
  if (!date) {
    return ''
  }

  const validDate = typeof date === 'string' ? new Date(date) : date

  return validDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function FiredWorkersPage() {
  const { data: firedWorkers, error, isLoading } = useGetFiredWorkersQuery()
  const [workerToRestore, setWorkerToRestore] = useState<Omit<WorkerDto, 'table_id'> | null>(null)
  const [openRestoreForm, setOpenRestoreForm] = useState(false)

  const handleRestoreWorker = (worker: Omit<WorkerDto, 'table_id'>) => {
    setWorkerToRestore(worker)
    setOpenRestoreForm(true)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error loading fired workers</div>
  }

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
              Действия
            </th>
          </tr>
        </thead>
        <tbody className={'bg-white divide-y divide-gray-200'}>
          {firedWorkers?.map((worker, index) => (
            <tr key={index}>
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
      {openRestoreForm && workerToRestore && (
        <RestoreWorkerForm onClose={() => setOpenRestoreForm(false)} worker={workerToRestore} />
      )}
    </div>
  )
}
