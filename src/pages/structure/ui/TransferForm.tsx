import { useState } from 'react'

import { DepartmentDto, WorkerDto } from '@/entities/workers'
import { useUpdateWorkerMutation } from '@/entities/workers'

type TransferFormProps = {
  departments: DepartmentDto[]
  employee: WorkerDto
  formType: 'demote' | 'promote' | 'transfer'
  onCancel: () => void
  onDemote: (worker: WorkerDto, newRopId?: number) => void
  onPromote: (worker: WorkerDto, departmentName: string) => void
  onTransfer: (worker: WorkerDto, newDepartmentId: null | number) => void
}

const TransferForm: React.FC<TransferFormProps> = ({
  departments,
  employee,
  formType,
  onCancel,
  onDemote,
  onPromote,
  onTransfer,
}) => {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<null | number>(null)
  const [departmentName, setDepartmentName] = useState<string>('')

  // Найдем текущий департамент сотрудника
  const currentDepartment = departments.find(dept => dept.id === employee.department_id)

  // Мутация для обновления данных сотрудника
  const [updateWorker] = useUpdateWorkerMutation()

  // Функция для поиска ropId в департаменте
  function findRopId(departmentId: number) {
    const department = departments.find(dep => dep.id === departmentId)

    return department?.ropId
  }

  const handleSubmit = async () => {
    console.log('Форма отправлена')
    console.log('Тип формы:', formType)

    if (formType === 'transfer') {
      const managedBy = selectedDepartmentId ? findRopId(selectedDepartmentId) : undefined

      console.log('Обновляем сотрудника:', {
        ...employee,
        department_id: selectedDepartmentId,
        managed_by: managedBy,
      })

      const { password, ...employeeData } = employee

      await updateWorker({
        ...employeeData,
        department_id: selectedDepartmentId,
        managed_by: managedBy, // Устанавливаем найденный ropId или undefined
      })

      console.log('Сотрудник успешно обновлен. Передаем данные в onTransfer.')

      onTransfer(employee, selectedDepartmentId)
    } else if (formType === 'promote' && departmentName) {
      onPromote(employee, departmentName)
    } else if (formType === 'demote') {
      if (currentDepartment && currentDepartment.ropId) {
        onDemote(employee, currentDepartment.ropId)
      } else {
        onDemote(employee)
      }
    }
  }

  return (
    <div className={'p-4 bg-white rounded shadow-md'}>
      <h3 className={'text-xl font-semibold mb-4'}>
        {formType === 'transfer' && `Перевести ${employee.name}`}
        {formType === 'promote' && `Повысить ${employee.name} до РОПа`}
        {formType === 'demote' && `Понизить ${employee.name}`}
      </h3>

      {formType === 'transfer' && (
        <div className={'mb-4'}>
          <label className={'block text-sm font-medium text-gray-700'}>Выбрать отдел</label>
          <select
            className={'mt-1 block w-full p-2 border border-gray-300 rounded-md'}
            onChange={e => setSelectedDepartmentId(Number(e.target.value) || null)}
            value={selectedDepartmentId || ''}
          >
            <option value={''}>Без отдела</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {formType === 'promote' && (
        <div className={'mb-4'}>
          <label className={'block text-sm font-medium text-gray-700'}>
            Название нового отдела
          </label>
          <input
            className={'mt-1 block w-full p-2 border border-gray-300 rounded-md'}
            onChange={e => setDepartmentName(e.target.value)}
            type={'text'}
            value={departmentName}
          />
        </div>
      )}

      {formType === 'demote' && (
        <div className={'mb-4'}>
          <label className={'block text-sm font-medium text-gray-700'}>Выберите действие</label>
          <div className={'mb-2'}>
            <label className={'inline-flex items-center'}>
              <input
                className={'form-radio'}
                name={'demoteOption'}
                onChange={() => console.log('Reassign selected')}
                type={'radio'}
                value={'reassign'}
              />
              <span className={'ml-2'}>Назначить нового РОПа</span>
            </label>
          </div>
          <div className={'mb-2'}>
            <label className={'inline-flex items-center'}>
              <input
                className={'form-radio'}
                name={'demoteOption'}
                onChange={() => console.log('Disband selected')}
                type={'radio'}
                value={'disband'}
              />
              <span className={'ml-2'}>Расформировать отдел</span>
            </label>
          </div>
        </div>
      )}

      <div className={'mt-6 flex justify-end'}>
        <button className={'mr-3 px-4 py-2 bg-gray-200 text-gray-800 rounded'} onClick={onCancel}>
          Отмена
        </button>
        <button className={'px-4 py-2 bg-blue-600 text-white rounded'} onClick={handleSubmit}>
          Подтвердить
        </button>
      </div>
    </div>
  )
}

export default TransferForm
