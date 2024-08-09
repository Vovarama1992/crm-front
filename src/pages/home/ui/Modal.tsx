import React from 'react'

type ModalProps = {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center z-50'}>
      <div className={'fixed inset-0 bg-black opacity-50'} onClick={onClose}></div>
      <div className={'bg-white p-6 rounded-lg z-10 max-w-lg w-full'}>
        {children}
        <button className={'mt-4 w-full bg-red-500 text-white py-2 rounded-lg'} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  )
}

export default Modal
