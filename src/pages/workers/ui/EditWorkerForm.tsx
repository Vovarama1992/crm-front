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
    margin_percent: existingWorker.margin_percent || 0, // Default value for marginPercent
    roleName: '', // Default value for role
    salary: existingWorker.salary || 0, // Default value for salary
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Convert salary and marginPercent to numbers
    if (name === 'salary' || name === 'margin_percent') {
      setFormData(prevData => ({
        ...prevData,
        [name]: parseFloat(value) || 0, // Convert to float
      }))
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const margin = formData.margin_percent / 100 // Извлекаем id отдельно, а все остальное — в updateData

      formData.margin_percent = margin
      const { id, ...updateData } = formData

      await updateWorker({ id, ...updateData }).unwrap() // Передаем id и набор данных для обновления
      onClose()
    } catch (error) {
      console.error('Failed to update the worker:', error)
    }
  }

  return (
    <div className={'fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center'}>
      <div className={'bg-white p-6 rounded-lg shadow-lg max-w-md w-full'}>
        <h2 className={'text-lg font-semibold mb-4'}>Редактировать сотрудника</h2>
        <form className={'grid grid-cols-1 gap-4'} onSubmit={handleSubmit}>
          <div className={'grid grid-cols-2 gap-4'}>
            <div className={'flex flex-col'}>
              <label className={'block text-gray-700'}>Фамилия</label>
              <input
                className={
                  'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
                }
                name={'surname'}
                onChange={handleChange}
                required
                type={'text'}
                value={formData.surname}
              />
            </div>
            <div className={'flex flex-col'}>
              <label className={'block text-gray-700'}>Имя</label>
              <input
                className={
                  'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
                }
                name={'name'}
                onChange={handleChange}
                required
                type={'text'}
                value={formData.name}
              />
            </div>
            <div className={'flex flex-col'}>
              <label className={'block text-gray-700'}>Отчество</label>
              <input
                className={
                  'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
                }
                name={'middleName'}
                onChange={handleChange}
                type={'text'}
                value={formData.middleName}
              />
            </div>
            <div className={'flex flex-col'}>
              <label className={'block text-gray-700'}>Должность</label>
              <input
                className={
                  'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
                }
                name={'position'}
                onChange={handleChange}
                required
                type={'text'}
                value={formData.position}
              />
            </div>
            <div className={'flex flex-col'}>
              <label className={'block text-gray-700'}>Почта</label>
              <input
                className={
                  'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
                }
                name={'email'}
                onChange={handleChange}
                required
                type={'email'}
                value={formData.email}
              />
            </div>
            <div className={'flex flex-col'}>
              <label className={'block text-gray-700'}>Добавочный номер</label>
              <input
                className={
                  'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
                }
                name={'dobNumber'}
                onChange={handleChange}
                type={'text'}
                value={formData.dobNumber}
              />
            </div>
            <div className={'flex flex-col'}>
              <label className={'block text-gray-700'}>Мобильный телефон</label>
              <input
                className={
                  'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
                }
                name={'mobile'}
                onChange={handleChange}
                required
                type={'text'}
                value={formData.mobile}
              />
            </div>
            <div className={'flex flex-col'}>
              <label className={'block text-gray-700'}>Дата рождения</label>
              <input
                className={
                  'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
                }
                name={'birthday'}
                onChange={handleChange}
                required
                type={'date'}
                value={formData.birthday}
              />
            </div>
            <div className={'flex flex-col'}>
              <label className={'block text-gray-700'}>Дата приема на работу</label>
              <input
                className={
                  'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
                }
                name={'hireDate'}
                onChange={handleChange}
                required
                type={'date'}
                value={formData.hireDate}
              />
            </div>
            <div className={'flex flex-col'}>
              <label className={'block text-gray-700'}>Карта для перевода</label>
              <input
                className={
                  'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
                }
                name={'cardNumber'}
                onChange={handleChange}
                type={'text'}
                value={formData.cardNumber}
              />
            </div>

            {/* New field for salary */}
            <div className={'flex flex-col'}>
              <label className={'block text-gray-700'}>Зарплата</label>
              <input
                className={
                  'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
                }
                name={'salary'}
                onChange={handleChange}
                type={'number'}
                value={formData.salary}
              />
            </div>

            {/* New field for margin percent */}
            <div className={'flex flex-col'}>
              <label className={'block text-gray-700'}>Процент маржи</label>
              <input
                className={
                  'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
                }
                name={'margin_percent'}
                onChange={handleChange}
                step={'0.01'} // Шаг изменения установлен на 0.01
                type={'number'}
                value={formData.margin_percent}
              />
            </div>

            {/* New field for role selection */}
            <div className={'flex flex-col col-span-2'}>
              <label className={'block text-gray-700'}>Роль</label>
              <select
                className={
                  'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
                }
                name={'roleName'}
                onChange={handleChange}
                value={formData.roleName}
              >
                <option value={''}>Выберите роль</option>
                <option value={'Менеджер'}>Менеджер</option>
                <option value={'РОП'}>РОП</option>
                <option value={'Директор'}>Директор</option>
                <option value={'Логист'}>Логист</option>
                <option value={'Закупщик'}>Закупщик</option>
                <option value={'Бухгалтер'}>Бухгалтер</option>
              </select>
            </div>
          </div>

          <div className={'flex justify-end gap-2 mt-4'}>
            <button
              className={'px-4 py-2 bg-gray-300 rounded-lg'}
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
