import React, { useEffect, useState } from 'react'

import { WorkerDto } from '@/entities/workers'

import RestoreWorkerForm from './RestoreWorkerForm'

export function FiredWorkersPage() {
  const [firedWorkers, setFiredWorkers] = useState<Omit<WorkerDto, 'table_id'>[]>([])
  const [workerToRestore, setWorkerToRestore] = useState<Omit<WorkerDto, 'table_id'> | null>(null)
  const [openRestoreForm, setOpenRestoreForm] = useState(false)

  // Загрузка данных из localStorage при монтировании компонента
  useEffect(() => {
    const storedFiredWorkers = JSON.parse(localStorage.getItem('firedworkers') || '[]') as Omit<
      WorkerDto,
      'table_id'
    >[]

    setFiredWorkers(storedFiredWorkers)
  }, [])

  const handleRestoreWorker = (worker: Omit<WorkerDto, 'table_id'>) => {
    setWorkerToRestore({
      ...worker,
      cardNumber: worker.cardNumber,
      dobNumber: '',
      mobile: worker.mobile,
      position: '',
      roleName: '',
    })
    setOpenRestoreForm(true)
  }

  const handleSaveRestoredWorker = (restoredWorker: WorkerDto) => {
    // Добавляем работника обратно в список работников
    const workersData = JSON.parse(localStorage.getItem('workers') || '[]') as WorkerDto[]

    // Создаем новый идентификатор для восстановленного работника
    const newTableId =
      workersData.length > 0 ? Math.max(...workersData.map(worker => worker.table_id)) + 1 : 1

    // Восстанавливаем работника с новым идентификатором
    const workerWithNewId = { ...restoredWorker, table_id: newTableId }

    workersData.push(workerWithNewId)

    // Сохраняем обновленный список работников
    localStorage.setItem('workers', JSON.stringify(workersData))

    // Удаляем работника из списка уволенных
    const updatedFiredWorkers = firedWorkers.filter(fw => fw.email !== restoredWorker.email)

    localStorage.setItem('firedworkers', JSON.stringify(updatedFiredWorkers))

    // Обновляем состояние
    setFiredWorkers(updatedFiredWorkers)
    setOpenRestoreForm(false)
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
          {firedWorkers.map((worker, index) => (
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
                {worker.birthday}
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
        <RestoreWorkerForm
          onClose={() => setOpenRestoreForm(false)}
          onSave={handleSaveRestoredWorker}
          worker={workerToRestore}
        />
      )}
    </div>
  )
}
