import React from 'react'

type ModalProps = {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose, onSave }) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className={'fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'}>
      <div className={'bg-white p-8 rounded-lg shadow-lg w-96'}>
        <div className={'mb-4'}>{children}</div>
        <div className={'flex justify-end space-x-4'}>
          <button className={'mt-4 p-2 bg-blue-500 text-white rounded'} onClick={onSave}>
            Добавить
          </button>
          <button className={'mt-4 p-2 bg-gray-500 text-white rounded'} onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
