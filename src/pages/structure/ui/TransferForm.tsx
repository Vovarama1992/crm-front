import { useState } from 'react'

import { DepartmentDto, WorkerDto } from '@/entities/workers'

type TransferFormProps = {
  departments: DepartmentDto[]
  employee: WorkerDto
  onCancel: () => void
  onDemote: (worker: WorkerDto) => void
  onPromote: (worker: WorkerDto, departmentId: number) => void
  onSubmit: (rop: WorkerDto, departmentName: string) => void
  onTransfer: (worker: WorkerDto, newDepartmentId: number) => void
}

const TransferForm: React.FC<TransferFormProps> = ({
  departments,
  employee,
  onCancel,
  onDemote,
  onPromote,
  onSubmit,
  onTransfer,
}) => {
  const [departmentName, setDepartmentName] = useState<string>('')
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<null | number>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (departmentName) {
      onSubmit(employee, departmentName)
    } else if (selectedDepartmentId) {
      onTransfer(employee, selectedDepartmentId)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className={'text-xl font-semibold mb-4'}>Назначить {employee.name}а РОПом</h3>
      <div className={'mb-4'}>
        <label className={'block text-sm font-medium text-gray-700'}>Название нового отдела</label>
        <input
          className={'mt-1 block w-full p-2 border border-gray-300 rounded-md'}
          onChange={e => setDepartmentName(e.target.value)}
          type={'text'}
          value={departmentName}
        />
      </div>
      <div className={'mb-4'}>
        <label className={'block text-sm font-medium text-gray-700'}>
          Выбрать существующий отдел
        </label>
        <select
          className={'mt-1 block w-full p-2 border border-gray-300 rounded-md'}
          onChange={e => setSelectedDepartmentId(parseInt(e.target.value))}
          value={selectedDepartmentId ?? ''}
        >
          <option value={''}>Выберите отдел</option>
          {departments.map(department => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>
      <div className={'mt-5 sm:mt-6 sm:flex sm:flex-row-reverse'}>
        <button
          className={
            'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm'
          }
          type={'submit'}
        >
          Назначить
        </button>
        <button
          className={
            'mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm'
          }
          onClick={onCancel}
          type={'button'}
        >
          Отмена
        </button>
      </div>
      <div className={'mt-4'}>
        <button
          className={
            'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm'
          }
          onClick={() => onPromote(employee, selectedDepartmentId ?? 0)}
          type={'button'}
        >
          Повысить
        </button>
        <button
          className={
            'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm'
          }
          onClick={() => onDemote(employee)}
          type={'button'}
        >
          Понизить
        </button>
      </div>
    </form>
  )
}

export default TransferForm
