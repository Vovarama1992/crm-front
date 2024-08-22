import React, { useState } from 'react'

import { useUpdateWorkerMutation } from '@/entities/workers'
import { WorkerDto } from '@/entities/workers'

type EditWorkerFormProps = {
  existingWorker: WorkerDto
  onClose: () => void
}

const EditWorkerForm: React.FC<EditWorkerFormProps> = ({ existingWorker, onClose }) => {
  const [updateWorker] = useUpdateWorkerMutation()

  const [formData, setFormData] = useState<WorkerDto>({
    ...existingWorker,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateWorker(formData).unwrap()
      onClose()
    } catch (error) {
      console.error('Failed to update the worker:', error)
    }
  }

  return (
    <div className={'fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center'}>
      <div className={'bg-white p-6 rounded-lg shadow-lg'}>
        <h2 className={'text-lg font-semibold mb-4'}>Редактировать сотрудника</h2>
        <form onSubmit={handleSubmit}>
          <div className={'mb-4'}>
            <label className={'block text-gray-700'}>Фамилия</label>
            <input
              className={'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'}
              name={'surname'}
              onChange={handleChange}
              required
              type={'text'}
              value={formData.surname}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-gray-700'}>Имя</label>
            <input
              className={'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'}
              name={'name'}
              onChange={handleChange}
              required
              type={'text'}
              value={formData.name}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-gray-700'}>Отчество</label>
            <input
              className={'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'}
              name={'middleName'}
              onChange={handleChange}
              type={'text'}
              value={formData.middleName}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-gray-700'}>Должность</label>
            <input
              className={'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'}
              name={'position'}
              onChange={handleChange}
              required
              type={'text'}
              value={formData.position}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-gray-700'}>Почта</label>
            <input
              className={'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'}
              name={'email'}
              onChange={handleChange}
              required
              type={'email'}
              value={formData.email}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-gray-700'}>Добавочный номер</label>
            <input
              className={'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'}
              name={'dobNumber'}
              onChange={handleChange}
              type={'text'}
              value={formData.dobNumber}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-gray-700'}>Мобильный телефон</label>
            <input
              className={'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'}
              name={'mobile'}
              onChange={handleChange}
              required
              type={'text'}
              value={formData.mobile}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-gray-700'}>Дата рождения</label>
            <input
              className={'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'}
              name={'birthday'}
              onChange={handleChange}
              required
              type={'date'}
              value={formData.birthday}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-gray-700'}>Дата приема на работу</label>
            <input
              className={'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'}
              name={'hireDate'}
              onChange={handleChange}
              required
              type={'date'}
              value={formData.hireDate}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-gray-700'}>Карта для перевода</label>
            <input
              className={'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'}
              name={'cardNumber'}
              onChange={handleChange}
              type={'text'}
              value={formData.cardNumber}
            />
          </div>
          <div className={'flex justify-end'}>
            <button
              className={'mr-2 px-4 py-2 bg-gray-300 rounded-lg'}
              onClick={onClose}
              type={'button'}
            >
              Отмена
            </button>
            <button className={'px-4 py-2 bg-blue-500 text-white rounded-lg'} type={'submit'}>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditWorkerForm
