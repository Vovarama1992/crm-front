import React from 'react'

import { useMeQuery } from '@/entities/session'

import { PurchaseOrder } from './PurchaseTable'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (newRecord: PurchaseOrder) => void
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [newRecord, setNewRecord] = React.useState<PurchaseOrder>({
    creationDate: '',
    customer: '',
    customerInvoice: '',
    dealNumber: '',
    deliveryDeadline: '',
    invoiceLines: [],
    logisticsLines: [],
    manager: '',
    requestNumber: '',
    supplierLines: [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRecord({ ...newRecord, [e.target.name]: e.target.value })
  }

  const { data: userdata } = useMeQuery()
  const { name, surname } = userdata || {}

  const handleSave = () => {
    onSave(newRecord)

    const newNotification = {
      content: `${name} ${surname} добавил(а) новую запись в таблицу закупок.`,
      readBy: [],
      title: `Добавление записи в таблицу закупок`,
    }

    const currentNotifications = JSON.parse(
      localStorage.getItem('notifications') || '[]'
    ) as Notification[]
    const updatedNotifications = [...currentNotifications, newNotification]

    localStorage.setItem('notifications', JSON.stringify(updatedNotifications))

    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'}>
      <div className={'bg-white p-6 rounded shadow-lg'}>
        <h2 className={'text-xl font-bold mb-4'}>Добавить новую запись</h2>
        <form className={'space-y-4'}>
          <div>
            <label className={'block text-sm font-medium'}>Дата создания</label>
            <input
              className={'border p-2 w-full'}
              name={'creationDate'}
              onChange={handleChange}
              type={'date'}
              value={newRecord.creationDate}
            />
          </div>
          <div>
            <label className={'block text-sm font-medium'}>№ сделки</label>
            <input
              className={'border p-2 w-full'}
              name={'dealNumber'}
              onChange={handleChange}
              type={'text'}
              value={newRecord.dealNumber}
            />
          </div>
          <div>
            <label className={'block text-sm font-medium'}>Номер запроса</label>
            <input
              className={'border p-2 w-full'}
              name={'requestNumber'}
              onChange={handleChange}
              type={'text'}
              value={newRecord.requestNumber}
            />
          </div>
          <div>
            <label className={'block text-sm font-medium'}>Заказчик</label>
            <input
              className={'border p-2 w-full'}
              name={'customer'}
              onChange={handleChange}
              type={'text'}
              value={newRecord.customer}
            />
          </div>
          <div>
            <label className={'block text-sm font-medium'}>Счет заказчику</label>
            <input
              className={'border p-2 w-full'}
              name={'customerInvoice'}
              onChange={handleChange}
              type={'text'}
              value={newRecord.customerInvoice}
            />
          </div>
          <div>
            <label className={'block text-sm font-medium'}>Менеджер</label>
            <input
              className={'border p-2 w-full'}
              name={'manager'}
              onChange={handleChange}
              type={'text'}
              value={newRecord.manager}
            />
          </div>
          <div>
            <label className={'block text-sm font-medium'}>Крайняя дата поставки</label>
            <input
              className={'border p-2 w-full'}
              name={'deliveryDeadline'}
              onChange={handleChange}
              type={'date'}
              value={newRecord.deliveryDeadline}
            />
          </div>
        </form>
        <div className={'mt-4 flex justify-end space-x-4'}>
          <button className={'bg-gray-300 text-black px-4 py-2 rounded'} onClick={onClose}>
            Отмена
          </button>
          <button className={'bg-blue-500 text-white px-4 py-2 rounded'} onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
