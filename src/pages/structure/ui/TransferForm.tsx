/* eslint-disable no-nested-ternary */
import { useState } from 'react'

import { WorkerDto } from '@/entities/workers'

interface TransferFormProps {
  departments: string[]
  employee: WorkerDto
  onCancel: () => void
  onSubmit: (transferData: { action: string; employee: WorkerDto; newDepartment?: string }) => void
}

const TransferForm: React.FC<TransferFormProps> = ({
  departments,
  employee,
  onCancel,
  onSubmit,
}) => {
  const [action, setAction] = useState('')
  const [newDepartment, setNewDepartment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ action, employee, newDepartment })
  }

  const isRop = employee.roleName === 'РОП'
  const isManager = employee.roleName === 'Менеджер'

  return (
    <form className={'p-6 bg-white shadow-md rounded-md'} onSubmit={handleSubmit}>
      <h3 className={'text-lg font-semibold mb-4'}>Перевод сотрудника: {employee.name}</h3>
      <div className={'mb-4'}>
        <label className={'block text-sm font-medium text-gray-700'}>Действие</label>
        <select
          className={'mt-1 block w-full p-2 border border-gray-300 rounded-md'}
          onChange={e => setAction(e.target.value)}
          value={action}
        >
          <option value={''}>Выберите действие</option>
          {isRop ? (
            <>
              <option value={'demote'}>Понизить до менеджера</option>
              <option value={'remove'}>Удалить из структуры</option>
              <option value={'new_department'}>Создать новый отдел</option>
            </>
          ) : isManager ? (
            <>
              <option value={'transfer'}>Перевести в другой отдел</option>
              <option value={'remove'}>Удалить из структуры</option>
              <option value={'promote'}>Создать новый отдел и повысить до РОПа</option>
            </>
          ) : null}
        </select>
      </div>
      {(action === 'transfer' || action === 'new_department' || action === 'promote') && (
        <div className={'mb-4'}>
          <label className={'block text-sm font-medium text-gray-700'}>Новый отдел</label>
          {action !== 'transfer' && (
            <input
              className={'mt-1 block w-full p-2 border border-gray-300 rounded-md'}
              onChange={e => setNewDepartment(e.target.value)}
              placeholder={'Введите название нового отдела'}
              type={'text'}
              value={newDepartment}
            />
          )}
          {action === 'transfer' && (
            <select
              className={'mt-1 block w-full p-2 border border-gray-300 rounded-md'}
              onChange={e => setNewDepartment(e.target.value)}
              value={newDepartment}
            >
              <option value={''}>Выберите отдел</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
      <div className={'flex justify-end'}>
        <button
          className={'mr-2 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600'}
          onClick={onCancel}
          type={'button'}
        >
          Отмена
        </button>
        <button
          className={'bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600'}
          type={'submit'}
        >
          Сохранить
        </button>
      </div>
    </form>
  )
}

export default TransferForm
