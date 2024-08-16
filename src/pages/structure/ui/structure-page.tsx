import { useState } from 'react'

import {
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useFireWorkerMutation,
  useGetDepartmentsQuery,
  useGetWorkersQuery,
  useUpdateWorkerMutation,
} from '@/entities/workers'
import { WorkerDto } from '@/entities/workers'

import TransferForm from './TransferForm'

export const StructurePage = () => {
  const { data: departmentsData } = useGetDepartmentsQuery()
  const { data: workersData } = useGetWorkersQuery()

  const [deleteDepartment] = useDeleteDepartmentMutation()
  const [createDepartment] = useCreateDepartmentMutation()
  const [updateWorker] = useUpdateWorkerMutation()
  const [fireWorker] = useFireWorkerMutation()

  const [selectedWorker, setSelectedWorker] = useState<WorkerDto | null>(null)
  const [formType, setFormType] = useState<'demote' | 'promote' | 'transfer' | null>(null)

  if (!departmentsData || !workersData) {
    return <div>Loading...</div>
  }

  const virtualDepartments = [
    { id: -1, name: 'Дирекция', ropId: undefined },
    { id: -2, name: 'Сотрудники обеспечивающие работу компании', ropId: null },
    { id: -3, name: 'Не входят в отделы продаж', ropId: null },
  ]

  const departmentWithWorkers = [
    ...departmentsData.map(department => {
      const workers = workersData.filter(worker => worker.department_id === department.id)
      const rop = workers.find(worker => worker.roleName === 'РОП')
      const otherWorkers = workers.filter(worker => worker.roleName !== 'РОП')

      return {
        ...department,
        workers: rop ? [rop, ...otherWorkers] : otherWorkers,
      }
    }),
    {
      ...virtualDepartments[0],
      workers: workersData.filter(worker => worker.roleName === 'Директор'),
    },
    {
      ...virtualDepartments[1],
      workers: workersData.filter(worker => ['Бухгалтер', 'Закупщик'].includes(worker.roleName)),
    },
    {
      ...virtualDepartments[2],
      workers: workersData.filter(
        worker =>
          !worker.department_id && (worker.roleName === 'Менеджер' || worker.roleName === 'РОП')
      ),
    },
  ]

  const handleWorkerAction = (
    worker: WorkerDto,
    action: 'demote' | 'fire' | 'promote' | 'transfer'
  ) => {
    setSelectedWorker(worker)
    if (action === 'promote' || action === 'transfer' || action === 'demote') {
      setFormType(action)
    } else {
      fireWorker(worker.id).then(() => {
        window.location.reload()
      })
    }
  }

  const handleFormSubmit = () => {
    window.location.reload() // Перезагружаем страницу после отправки формы
  }

  const handleCreateDepartmentForRop = async (worker: WorkerDto) => {
    const departmentName = prompt('Введите название нового отдела:')

    if (departmentName) {
      const newDepartment = await createDepartment({ name: departmentName, ropId: worker.id })

      if (newDepartment.data) {
        await updateWorker({
          ...worker,
          department_id: newDepartment.data.id,
          roleName: 'РОП',
        })
        handleFormSubmit()
      }
    }
  }

  return (
    <div className={'p-6 bg-gray-100 min-h-screen'}>
      <h2 className={'text-2xl font-bold mb-6 text-center'}>Структура компании</h2>

      {departmentWithWorkers.map(department => (
        <div className={'mb-8'} key={department.id}>
          <h3 className={'text-xl font-semibold mb-4'}>{department.name}</h3>
          <ul className={'list-disc pl-6'}>
            {department.workers.map(worker => (
              <li className={'mb-2'} key={worker.id}>
                {worker.name} {worker.roleName === 'РОП' && '(Руководитель отдела)'}
                {worker.roleName === 'Менеджер' && (
                  <>
                    <button
                      className={'ml-2 text-red-500'}
                      onClick={() => handleWorkerAction(worker, 'fire')}
                    >
                      Удалить
                    </button>
                    <button
                      className={'ml-2 text-green-500'}
                      onClick={() => handleWorkerAction(worker, 'transfer')}
                    >
                      Перевести
                    </button>
                    <button
                      className={'ml-2 text-blue-500'}
                      onClick={() => handleWorkerAction(worker, 'promote')}
                    >
                      Поднять до РОПа
                    </button>
                  </>
                )}
                {worker.roleName === 'РОП' && !worker.department_id && (
                  <>
                    <button
                      className={'ml-2 text-purple-500'}
                      onClick={() => handleCreateDepartmentForRop(worker)}
                    >
                      Создать отдел
                    </button>
                  </>
                )}
                {worker.roleName === 'РОП' && worker.department_id && (
                  <>
                    <button
                      className={'ml-2 text-red-500'}
                      onClick={() => handleWorkerAction(worker, 'demote')}
                    >
                      Понизить
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {selectedWorker && formType && (
        <TransferForm
          departments={departmentsData}
          employee={selectedWorker}
          formType={formType}
          onCancel={() => {
            setSelectedWorker(null)
            setFormType(null)
          }}
          onDemote={async (worker: WorkerDto, newRopId?: number) => {
            if (newRopId) {
              await updateWorker({ ...worker, roleName: 'Менеджер' })
              await updateWorker({
                ...workersData.find(w => w.id === newRopId)!,
                department_id: worker.department_id,
                roleName: 'РОП',
              })
            } else {
              await updateWorker({ ...worker, department_id: undefined, roleName: 'Менеджер' })
              await deleteDepartment(worker.department_id!)
            }
            handleFormSubmit()
          }}
          onPromote={async (worker: WorkerDto, departmentName: string) => {
            const newDepartment = await createDepartment({ name: departmentName, ropId: worker.id })

            if (newDepartment.data) {
              await updateWorker({
                ...worker,
                department_id: newDepartment.data.id,
                roleName: 'РОП',
              })
              handleFormSubmit()
            }
          }}
          onTransfer={async (worker: WorkerDto, newDepartmentId: number) => {
            await updateWorker({ ...worker, department_id: newDepartmentId })
            handleFormSubmit()
          }}
        />
      )}
    </div>
  )
}

export default StructurePage
