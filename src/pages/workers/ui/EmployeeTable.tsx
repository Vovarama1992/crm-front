import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { WorkerDto } from '@/entities/workers'
import { useFireWorkerMutation } from '@/entities/workers'
import { ROUTER_PATHS } from '@/shared/config/routes'

import ConfirmModal from './ConfirmModal'
import EditWorkerForm from './EditWorkerForm'
import WorkerForm from './WorkerForm'

type EmployeeTableProps = {
  roleName: string
  workers: WorkerDto[]
}

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

const EmployeeTable: React.FC<EmployeeTableProps> = ({ roleName, workers }) => {
  const [deleteWorker] = useFireWorkerMutation()

  const [selectedWorker, setSelectedWorker] = useState<WorkerDto | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [workerIdToDelete, setWorkerIdToDelete] = useState<number | undefined>(undefined)
  const [editWorkerOpen, setEditWorkerOpen] = useState(false)

  const handleFireWorker = (workerId: number) => {
    setWorkerIdToDelete(workerId)
    setConfirmModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (workerIdToDelete !== undefined) {
      try {
        await deleteWorker(workerIdToDelete).unwrap()
        setConfirmModalOpen(false)
        setWorkerIdToDelete(undefined)
      } catch (error) {
        console.error('Failed to delete the worker:', error)
      }
    }
  }

  const handleViewDetails = (worker: WorkerDto) => {
    setSelectedWorker(worker)
    setEditWorkerOpen(true)
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
            {roleName === 'Директор' && (
              <th
                className={
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                }
              >
                Карта для перевода
              </th>
            )}
            {roleName === 'Директор' && (
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
            <tr key={worker.id}>
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
                    {worker.name + ' ' + worker.middleName + ' ' + worker.surname}
                  </a>
                ) : (
                  worker.name + ' ' + worker.middleName + ' ' + worker.surname
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
                {formatDate(worker.birthday)}
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
                    onClick={() => handleFireWorker(worker.id)}
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
      {roleName === 'Директор' && (
        <Link to={ROUTER_PATHS.FIREDWORKERS}>
          <button
            className={
              'mt-4 ml-[100px] px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }
          >
            Перейти к таблице уволенных
          </button>
        </Link>
      )}
      {open && (
        <WorkerForm
          onClose={() => {
            setOpen(false)
            setSelectedWorker(undefined)
          }}
        />
      )}
      {editWorkerOpen && selectedWorker && (
        <EditWorkerForm
          existingWorker={selectedWorker}
          onClose={() => {
            setEditWorkerOpen(false)
            setSelectedWorker(undefined)
          }}
        />
      )}
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        workerId={workerIdToDelete || -1}
      />
    </div>
  )
}

export default EmployeeTable
