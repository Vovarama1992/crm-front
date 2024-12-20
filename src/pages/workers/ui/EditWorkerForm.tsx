import React, { useState } from 'react'

import { useUpdateWorkerMutation } from '@/entities/workers'
import { WorkerDto } from '@/entities/workers'

type EditWorkerFormProps = {
  existingWorker: WorkerDto
  onClose: () => void
}

const EditWorkerForm: React.FC<EditWorkerFormProps> = ({ existingWorker, onClose }) => {
  const [updateWorker] = useUpdateWorkerMutation()
  const [isPasswordChanged, setIsPasswordChanged] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const [formData, setFormData] = useState<WorkerDto>({
    ...existingWorker,
    margin_percent: existingWorker.margin_percent || 0, // Default value for marginPercent
    roleName: existingWorker.roleName, // Default value for role
    salary: existingWorker.salary || 0, // Default value for salary
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'password') {
      setIsPasswordChanged(true) // Устанавливаем флаг изменения пароля
    }

    if (name === 'salary' || name === 'margin_percent') {
      setFormData(prevData => ({
        ...prevData,
        [name]: parseFloat(value) || 0,
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
      const margin = Number(formData.margin_percent) / 100 // Преобразуем margin_percent

      // Обновляем поля для отправки
      const { id, ...updateData } = formData

      updateData.margin_percent = margin

      if (!isPasswordChanged) {
        delete updateData.password
      }

      await updateWorker({ id, ...updateData }).unwrap() // Передаем id и обновленные данные
      onClose()
    } catch (error) {
      console.error('Failed to update the worker:', error)
    }
  }

  return (
    <div
      className={
        'fixed top-[8vh] left-[8vw] h-[90vh] w-[90vw] flex items-center justify-center border-4 border-gray-400 shadow-inner text-sm overflow-y-auto'
      }
    >
      <div className={'bg-white p-6 rounded-lg shadow-lg w-full h-full'}>
        <h2 className={'text-lg font-semibold mb-4'}>Редактировать сотрудника</h2>
        <form className={'grid grid-cols-1 gap-4 w-full h-full'} onSubmit={handleSubmit}>
          <div className={'grid grid-cols-2 gap-4 w-full h-full'}>
            <div className={'flex flex-col w-full'}>
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
            <div className={'col-span-2'}>
              <button
                className={'px-4 py-2 bg-gray-300 rounded-lg mb-2'}
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                type={'button'}
              >
                {isPasswordVisible ? 'Отменить изменение пароля' : 'Поменять пароль'}
              </button>
            </div>

            {/* Поле ввода пароля, видимое только при нажатии на кнопку */}
            {isPasswordVisible && (
              <div className={'flex flex-col col-span-2'}>
                <label className={'block text-gray-700'}>Пароль</label>
                <input
                  className={
                    'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
                  }
                  defaultValue={''}
                  name={'password'}
                  onChange={handleChange}
                  type={'text'}
                />
              </div>
            )}
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
                defaultValue={formData.margin_percent * 100}
                name={'margin_percent'}
                onChange={handleChange}
                type={'text'}
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
