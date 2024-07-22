import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { WorkerDto } from '@/entities/workers'
import { ROUTER_PATHS } from '@/shared/config/routes'

import ConfirmModal from './ConfirmModal'
import WorkerForm from './WorkerForm' // Импортируйте ConfirmModal

type EmployeeTableProps = {
  roleName: string
  workers: WorkerDto[]
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ roleName, workers }) => {
  const [selectedWorker, setSelectedWorker] = useState<WorkerDto | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [workerIdToDelete, setWorkerIdToDelete] = useState<number | undefined>(undefined)

  const handleFireWorker = (workerId: number) => {
    setWorkerIdToDelete(workerId)
    setConfirmModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (workerIdToDelete !== undefined) {
      // Получаем массив работников из localStorage
      const workersData = JSON.parse(localStorage.getItem('workers') || '[]') as WorkerDto[]

      // Находим работника, которого нужно удалить
      const workerToDelete = workersData.find(worker => worker.table_id === workerIdToDelete)

      if (workerToDelete) {
        // Обновляем массив работников, удаляя работника
        const updatedWorkers = workersData.filter(worker => worker.table_id !== workerIdToDelete)

        localStorage.setItem('workers', JSON.stringify(updatedWorkers))

        // Получаем массив уволенных работников из localStorage
        const firedWorkers = JSON.parse(localStorage.getItem('firedworkers') || '[]') as Omit<
          WorkerDto,
          'table_id'
        >[]

        // Создаем новый объект работника без ID
        const { table_id, ...workerWithoutId } = workerToDelete

        // Добавляем работника в список уволенных
        firedWorkers.push(workerWithoutId)
        localStorage.setItem('firedworkers', JSON.stringify(firedWorkers))
      }
    }

    // Закрываем модалку подтверждения удаления
    setConfirmModalOpen(false)
    setWorkerIdToDelete(undefined)
  }

  const handleViewDetails = (worker: WorkerDto) => {
    setSelectedWorker(worker)
    setOpen(true)
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
            {roleName === 'director' && (
              <th
                className={
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                }
              >
                Карта для перевода
              </th>
            )}
            {roleName === 'director' && (
              <th
                className={
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                }
              >
                Действия
              </th>
            )}
          </tr>
        </thead>
        <tbody className={'bg-white divide-y divide-gray-200'}>
          {workers.map((worker, i) => (
            <tr key={worker.table_id}>
              <td className={'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'}>
                {i + 1}
              </td>
              <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                {roleName === 'Директор' || roleName === 'Бухгалтер' ? (
                  <a
                    className={'text-blue-500 hover:text-blue-700'}
                    href={'#'}
                    onClick={() => handleViewDetails(worker)}
                  >
                    {worker.name}
                  </a>
                ) : (
                  worker.name
                )}
              </td>
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
              {roleName === 'Директор' && (
                <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
                  {worker.cardNumber}
                </td>
              )}
              {roleName === 'Директор' && (
                <td className={'px-6 py-4 whitespace-nowrap text-sm font-medium'}>
                  <button
                    className={'text-red-600 hover:text-red-900'}
                    onClick={() => handleFireWorker(worker.table_id)}
                  >
                    Уволить
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {roleName === 'Директор' && (
        <button
          className={
            'mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }
          onClick={() => {
            setSelectedWorker(undefined)
            setOpen(true)
          }}
        >
          Добавить сотрудника
        </button>
      )}
      <Link to={ROUTER_PATHS.FIREDWORKERS}>
        <button
          className={
            'mt-4 ml-[100px] px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }
        >
          Перейти к таблице уволенных
        </button>
      </Link>
      {open && (
        <WorkerForm
          existingWorker={selectedWorker}
          onClose={() => {
            setOpen(false)
            setSelectedWorker(undefined)
          }}
        />
      )}
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        workerId={workerIdToDelete || -1} // Передайте workerId
      />
    </div>
  )
}

export default EmployeeTable
