import { useEffect, useState } from 'react'

import {
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useFireWorkerMutation,
  useGetDepartmentsQuery,
  useGetWorkersQuery,
  useUpdateDepartmentMutation,
  useUpdateWorkerMutation,
} from '@/entities/workers'
import { DepartmentDto, WorkerDto } from '@/entities/workers'

import TransferForm from './TransferForm'

export const StructurePage = () => {
  const {
    data: departmentsData,
    error: departmentsError,
    isLoading: isLoadingDepartments,
  } = useGetDepartmentsQuery()
  const {
    data: workersData,
    error: workersError,
    isLoading: isLoadingWorkers,
  } = useGetWorkersQuery()
  const [deleteDepartment] = useDeleteDepartmentMutation()
  const [createDepartment] = useCreateDepartmentMutation()
  const [updateDepartment] = useUpdateDepartmentMutation()
  const [fireWorker] = useFireWorkerMutation()
  const [updateWorker] = useUpdateWorkerMutation()

  const [departmentList, setDepartmentList] = useState<DepartmentDto[]>([])
  const [workerList, setWorkerList] = useState<WorkerDto[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentDto | null>(null)
  const [transferEmployee, setTransferEmployee] = useState<WorkerDto | null>(null)
  const [newDepartmentName, setNewDepartmentName] = useState<string>('')

  useEffect(() => {
    if (departmentsData) {
      setDepartmentList(departmentsData)
    }
  }, [departmentsData])

  useEffect(() => {
    if (workersData) {
      setWorkerList(workersData)
    }
  }, [workersData])

  const handleDeleteDepartment = (id: number) => {
    deleteDepartment(id)
  }

  const handleCreateDepartment = (ropId: number, name: string) => {
    createDepartment({ name, ropId })
  }

  const handleUpdateDepartment = (department: Partial<DepartmentDto>) => {
    updateDepartment(department)
  }

  const handleDeleteWorker = (id: number) => {
    fireWorker(id)
  }

  const handleAssignRop = (rop: WorkerDto) => {
    if (!newDepartmentName) {
      return
    }

    handleCreateDepartment(rop.id, newDepartmentName)
    setNewDepartmentName('')
  }

  const handlePromoteWorker = (worker: WorkerDto, departmentId: number) => {
    updateWorker({ ...worker, department_id: departmentId, roleName: 'РОП' })
  }

  const handleDemoteWorker = (worker: WorkerDto) => {
    updateWorker({ ...worker, roleName: 'Менеджер' })
  }

  const handleTransferWorker = (worker: WorkerDto, newDepartmentId: number) => {
    updateWorker({ ...worker, department_id: newDepartmentId })
  }

  if (isLoadingDepartments || isLoadingWorkers) {
    return <div>Loading...</div>
  }
  if (departmentsError || workersError) {
    return <div>Error loading data</div>
  }

  const workersWithoutDepartment = workerList.filter(
    worker =>
      worker.department_id === null &&
      worker.roleName !== 'Директор' &&
      worker.roleName !== 'Закупщик' &&
      worker.roleName !== 'Бухгалтер'
  )

  const workersInAdministration = workerList.filter(
    worker =>
      worker.roleName === 'Директор' ||
      worker.roleName === 'Закупщик' ||
      worker.roleName === 'Бухгалтер'
  )

  const workersInSupport = workerList.filter(
    worker => worker.roleName === 'Закупщик' || worker.roleName === 'Бухгалтер'
  )

  const departmentsWithWorkers = departmentList.map(department => ({
    ...department,
    workers: workerList.filter(worker => worker.department_id === department.id),
  }))

  return (
    <div className={'p-6 bg-gray-100 min-h-screen'}>
      <h2 className={'text-2xl font-bold mb-6 text-center'}>Структура компании</h2>

      <div className={'mb-8'}>
        <h3 className={'text-xl font-semibold mb-4'}>Дирекция</h3>
        <ul className={'list-disc pl-6'}>
          {workersInAdministration.map(worker => (
            <li className={'mb-2'} key={worker.id}>
              {worker.name} ({worker.roleName})
              <button className={'ml-2 text-red-500'} onClick={() => handleDeleteWorker(worker.id)}>
                Удалить
              </button>
              <button className={'ml-2 text-blue-500'} onClick={() => setTransferEmployee(worker)}>
                Перенести
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={'mb-8'}>
        <h3 className={'text-xl font-semibold mb-4'}>Сотрудники обеспечивающие работу компании</h3>
        <ul className={'list-disc pl-6'}>
          {workersInSupport.map(worker => (
            <li className={'mb-2'} key={worker.id}>
              {worker.name} ({worker.roleName})
              <button className={'ml-2 text-red-500'} onClick={() => handleDeleteWorker(worker.id)}>
                Удалить
              </button>
              <button className={'ml-2 text-blue-500'} onClick={() => setTransferEmployee(worker)}>
                Перенести
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={'mb-8'}>
        <h3 className={'text-xl font-semibold mb-4'}>Департаменты</h3>
        <ul className={'list-disc pl-6'}>
          {departmentsWithWorkers.map(department => (
            <li className={'mb-2'} key={department.id}>
              {department.name}
              <button
                className={'ml-2 text-red-500'}
                onClick={() => handleDeleteDepartment(department.id)}
              >
                Удалить
              </button>
              <button
                className={'ml-2 text-blue-500'}
                onClick={() => setSelectedDepartment(department)}
              >
                Редактировать
              </button>
              <ul className={'list-disc pl-6'}>
                {department.workers.map(worker => (
                  <li className={'mb-2'} key={worker.id}>
                    {worker.name} {worker.roleName === 'РОП' ? '(Руководитель отдела)' : ''}
                    <button
                      className={'ml-2 text-red-500'}
                      onClick={() => handleDeleteWorker(worker.id)}
                    >
                      Удалить
                    </button>
                    <button
                      className={'ml-2 text-blue-500'}
                      onClick={() => setTransferEmployee(worker)}
                    >
                      Назначить РОПом
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className={'mb-8'}>
        <h3 className={'text-xl font-semibold mb-4'}>Не входят в отделы продаж</h3>
        <ul className={'list-disc pl-6'}>
          {workersWithoutDepartment.map(worker => (
            <li className={'mb-2'} key={worker.id}>
              {worker.name}
              <button className={'ml-2 text-red-500'} onClick={() => handleDeleteWorker(worker.id)}>
                Удалить
              </button>
              <button className={'ml-2 text-blue-500'} onClick={() => setTransferEmployee(worker)}>
                Назначить РОПом
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedDepartment && (
        <div>
          <h3 className={'text-xl font-semibold mb-4'}>Редактировать департамент</h3>
          <input
            className={'border p-2 mb-4 w-full'}
            onChange={e => setSelectedDepartment({ ...selectedDepartment, name: e.target.value })}
            type={'text'}
            value={selectedDepartment.name}
          />
          <button
            className={'mr-2 bg-blue-500 text-white px-4 py-2'}
            onClick={() => handleUpdateDepartment(selectedDepartment)}
          >
            Сохранить
          </button>
          <button className={'bg-gray-300 px-4 py-2'} onClick={() => setSelectedDepartment(null)}>
            Отмена
          </button>
        </div>
      )}

      {transferEmployee && (
        <div className={'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'}>
          <div className={'bg-white p-6 rounded-md shadow-lg w-full max-w-lg'}>
            <TransferForm
              departments={departmentList}
              employee={transferEmployee}
              onCancel={() => setTransferEmployee(null)}
              onDemote={handleDemoteWorker}
              onPromote={handlePromoteWorker}
              onSubmit={handleAssignRop}
              onTransfer={handleTransferWorker}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default StructurePage
