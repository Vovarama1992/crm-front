import React from 'react'

import { WorkerDto } from '@/entities/workers/workers.types'

type ConfirmModalProps = {
  onClose: () => void
  onConfirm: () => void
  worker?: WorkerDto // Полный объект сотрудника
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ onClose, onConfirm, worker }) => {
  return (
    <div
      className={'fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50'}
    >
      <div className={'bg-white p-6 rounded-lg shadow-lg w-96'}>
        <h2 className={'text-lg font-semibold'}>Подтверждение удаления</h2>
        <p className={'mt-2'}>
          Вы уверены, что хотите удалить {worker?.surname} {worker?.name} {worker?.middleName}?
        </p>
        <div className={'mt-4 flex justify-end space-x-4'}>
          <button
            className={
              'px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
            }
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className={
              'px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500'
            }
            onClick={onConfirm}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
