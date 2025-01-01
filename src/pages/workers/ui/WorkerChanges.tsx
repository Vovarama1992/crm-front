import React from 'react'

import { ChangeDto } from '@/entities/changes'
import { useGetWorkerChangesQuery } from '@/entities/workers'

type WorkerChangesProps = {
  onClose: () => void
  workerId: number
}

const WorkerChanges: React.FC<WorkerChangesProps> = ({ onClose, workerId }) => {
  const { data: changes, isError, isLoading } = useGetWorkerChangesQuery(workerId)

  const handleClose = () => {
    onClose()
  }

  if (isLoading) {
    return <div>Загрузка...</div>
  }
  if (isError) {
    return <div>Ошибка загрузки данных</div>
  }

  return (
    <div
      className={
        'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'
      }
    >
      <div
        className={
          'bg-white p-6 rounded-lg shadow-lg w-[80vw] md:w-[60vw] lg:w-[40vw] max-h-[80vh] overflow-y-auto'
        }
      >
        <h2 className={'text-xl font-semibold mb-4'}>История изменений</h2>
        {changes && changes.length > 0 ? (
          <ul className={'space-y-4'}>
            {changes.map((change: ChangeDto) => (
              <li className={'border-b border-gray-200 pb-2'} key={change.id}>
                <p className={'text-gray-600'}>{change.description}</p>
                <p className={'text-sm text-gray-500'}>
                  Дата: {new Date(change.changedAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>История изменений пуста.</p>
        )}
        <div className={'mt-4 flex justify-end'}>
          <button
            className={'px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400'}
            onClick={handleClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkerChanges
