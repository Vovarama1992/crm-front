/* eslint-disable max-lines */
import { useState } from 'react'

import { useSignUpMutation } from '@/entities/session'
import { RegistrationDto } from '@/entities/session/session.types'

type WorkerFormProps = {
  onClose?: () => void // Обработчик закрытия формы
}

const ROLES = ['Директор', 'Бухгалтер', 'РОП', 'Закупщик', 'Логист', 'Менеджер']

const WorkerForm: React.FC<WorkerFormProps> = ({ onClose }) => {
  const [createWorker] = useSignUpMutation()

  const [formState, setFormState] = useState<RegistrationDto>({
    birthday: new Date().toISOString().split('T')[0], // Текущая дата по умолчанию
    cardNumber: '',
    department_id: null,
    dobNumber: 0,
    email: '',
    hireDate: new Date().toISOString().split('T')[0], // Текущая дата по умолчанию
    margin_percent: 0.1,
    middleName: '',
    mobile: '',
    name: '',
    password: '',
    position: '',
    roleName: 'Менеджер',
    salary: 0,
    surname: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormState(prevState => ({
      ...prevState,
      [name]:
        name === 'dobNumber' ||
        name === 'department_id' ||
        name === 'margin_percent' ||
        name === 'salary'
          ? Number(value)
          : value,
    }))
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const role = e.target.value

    setFormState(prevState => ({
      ...prevState,
      roleName: e.target.checked ? role : '',
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Создание нового работника
    await createWorker(formState)

    // Дополнительная логика по завершению формы
    alert('Данные сотрудника успешно сохранены!')

    window.location.reload()

    // Закрываем форму после сохранения данных
    if (onClose) {
      onClose()
    }
  }

  return (
    <form
      className={
        'absolute left-[15%] top-[5%] bg-white p-6 rounded-lg shadow-lg w-[50vw] h-[80vh] bg-opacity-100'
      }
      onSubmit={handleSubmit}
    >
      <button
        className={'absolute top-2 right-2 text-gray-500 hover:text-gray-700'}
        onClick={() => onClose?.()}
        type={'button'}
      >
        <svg
          className={'w-6 h-6'}
          fill={'none'}
          stroke={'currentColor'}
          viewBox={'0 0 24 24'}
          xmlns={'http://www.w3.org/2000/svg'}
        >
          <path
            d={'M6 18L18 6M6 6l12 12'}
            strokeLinecap={'round'}
            strokeLinejoin={'round'}
            strokeWidth={'2'}
          ></path>
        </svg>
      </button>
      <div className={'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
        <div className={'flex flex-col'}>
          <label className={'text-gray-700 text-sm'}>Имя</label>
          <input
            className={
              'p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm h-[20px]'
            }
            name={'name'}
            onChange={handleChange}
            required
            type={'text'}
            value={formState.name}
          />
        </div>
        <div className={'flex flex-col'}>
          <label className={'text-gray-700 text-sm'}>Отчество</label>
          <input
            className={
              'p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm h-[20px]'
            }
            name={'middleName'}
            onChange={handleChange}
            required
            type={'text'}
            value={formState.middleName}
          />
        </div>
        <div className={'flex flex-col'}>
          <label className={'text-gray-700 text-sm'}>Фамилия</label>
          <input
            className={
              'p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm h-[20px]'
            }
            name={'surname'}
            onChange={handleChange}
            required
            type={'text'}
            value={formState.surname}
          />
        </div>
        <div className={'flex flex-col'}>
          <label className={'text-gray-700 text-sm'}>Должность</label>
          <input
            className={
              'p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm h-[20px]'
            }
            name={'position'}
            onChange={handleChange}
            required
            type={'text'}
            value={formState.position}
          />
        </div>
        <div className={'flex flex-col'}>
          <label className={'text-gray-700 text-sm'}>Почта</label>
          <input
            className={
              'p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm h-[20px]'
            }
            name={'email'}
            onChange={handleChange}
            required
            type={'email'}
            value={formState.email}
          />
        </div>
        <div className={'flex flex-col'}>
          <label className={'text-gray-700 text-sm'}>Добавочный номер</label>
          <input
            className={
              'p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm h-[20px]'
            }
            name={'dobNumber'}
            onChange={handleChange}
            required
            type={'number'}
            value={formState.dobNumber}
          />
        </div>
        <div className={'flex flex-col'}>
          <label className={'text-gray-700 text-sm'}>Мобильный</label>
          <input
            className={
              'p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm h-[20px]'
            }
            name={'mobile'}
            onChange={handleChange}
            required
            type={'text'}
            value={formState.mobile}
          />
        </div>
        <div className={'flex flex-col'}>
          <label className={'text-gray-700 text-sm'}>Процент маржи</label>
          <input
            className={
              'p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm h-[20px]'
            }
            name={'margin_percent'}
            onChange={handleChange}
            required
            type={'text'}
            value={formState.margin_percent}
          />
        </div>
        <div className={'flex flex-col'}>
          <label className={'text-gray-700 text-sm'}>Дата рождения</label>
          <input
            className={
              'p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm h-[20px]'
            }
            name={'birthday'}
            onChange={handleChange}
            required
            type={'date'}
            value={formState.birthday}
          />
        </div>
        <div className={'flex flex-col'}>
          <label className={'text-gray-700 text-sm'}>Номер карты для перевода</label>
          <input
            className={
              'p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm h-[20px]'
            }
            name={'cardNumber'}
            onChange={handleChange}
            required
            type={'text'}
            value={formState.cardNumber}
          />
        </div>
        <div className={'flex flex-col'}>
          <label className={'text-gray-700 text-sm'}>Адрес</label>
          <input
            className={
              'p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm h-[20px]'
            }
            name={'address'}
            onChange={handleChange}
            required
            type={'text'}
            value={formState.address || ''}
          />
        </div>
        <div className={'flex flex-col'}>
          <label className={'text-gray-700 text-sm'}>Дата принятия на работу</label>
          <input
            className={
              'p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm h-[20px]'
            }
            name={'hireDate'}
            onChange={handleChange}
            required
            type={'date'}
            value={formState.hireDate}
          />
        </div>
        <div className={'flex flex-col'}>
          <label className={'text-gray-700 text-sm'}>Пароль</label>
          <input
            className={
              'p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm h-[20px]'
            }
            name={'password'}
            onChange={handleChange}
            required
            type={'password'}
            value={formState.password}
          />
        </div>
        <div className={'flex flex-col col-span-full'}>
          <label className={'text-gray-700 text-sm'}>Роль</label>
          <div className={'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'}>
            {ROLES.map(role => (
              <div className={'flex items-center space-x-2'} key={role}>
                <input
                  checked={formState.roleName === role}
                  className={'form-checkbox'}
                  onChange={handleRoleChange}
                  type={'checkbox'}
                  value={role}
                />
                <label className={'text-gray-700 text-sm'}>{role}</label>
              </div>
            ))}
          </div>
        </div>
        <div className={'flex flex-col col-span-full'}>
          <label className={'text-gray-700 text-sm'}>Оклад</label>
          <input
            className={
              'p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm'
            }
            name={'salary'}
            onChange={handleChange}
            required
            type={'text'}
            value={formState.salary || ''}
          />
        </div>
      </div>
      <div className={'flex space-x-4 mt-4'}>
        <button
          className={
            'px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }
          type={'submit'}
        >
          Сохранить
        </button>
        <button
          className={
            'px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
          }
          onClick={() => onClose?.()}
          type={'button'}
        >
          Закрыть
        </button>
      </div>
    </form>
  )
}

export default WorkerForm
