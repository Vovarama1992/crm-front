import { useEffect, useState } from 'react'

import { useMeQuery } from '@/entities/session'
import { WorkerDto } from '@/entities/workers'

import TransferForm from './TransferForm'
import workersData from './workersData'

export const StructurePage = () => {
  const { data } = useMeQuery()
  const userRole = data?.roleName

  const [workerList, setWorkerList] = useState<WorkerDto[]>(workersData)
  const [transferEmployee, setTransferEmployee] = useState<WorkerDto | null>(null)
  const [departmentWithoutRop, setDepartmentWithoutRop] = useState<null | string>(null)
  const [isRopInDepartment, setIsRopInDepartment] = useState<{ [key: string]: boolean }>(
    workersData.reduce(
      (acc, worker) => {
        if (worker.roleName === 'РОП' && worker.department) {
          acc[worker.department] = true
        }

        return acc
      },
      {} as { [key: string]: boolean }
    )
  )

  const handleTransfer = (transferData: {
    action: string
    employee: WorkerDto
    newDepartment?: string
  }) => {
    const { action, employee, newDepartment } = transferData
    const updatedWorkers = [...workerList]
    const employeeIndex = updatedWorkers.findIndex(worker => worker.table_id === employee.table_id)

    if (employeeIndex === -1) {
      return
    }

    const oldDepartment = employee.department

    if (action === 'demote') {
      updatedWorkers[employeeIndex].roleName = 'Менеджер'
    } else if (action === 'remove') {
      updatedWorkers.splice(employeeIndex, 1)
    } else if (action === 'new_department') {
      const newDeptName =
        newDepartment ||
        `Отдел продаж ${String.fromCharCode(65 + updatedWorkers.filter(worker => worker.department).length)}`

      updatedWorkers[employeeIndex].department = newDeptName
      updatedWorkers[employeeIndex].roleName = 'РОП'
      setIsRopInDepartment({ ...isRopInDepartment, [newDeptName]: true })
    } else if (action === 'transfer') {
      updatedWorkers[employeeIndex].department = newDepartment || null
    } else if (action === 'promote') {
      const newDeptName =
        newDepartment ||
        `Отдел продаж ${String.fromCharCode(65 + updatedWorkers.filter(worker => worker.department).length)}`

      updatedWorkers[employeeIndex].department = newDeptName
      updatedWorkers[employeeIndex].roleName = 'РОП'
      setIsRopInDepartment({ ...isRopInDepartment, [newDeptName]: true })
    }

    if (
      (action === 'demote' ||
        action === 'remove' ||
        action === 'transfer' ||
        action === 'promote') &&
      oldDepartment
    ) {
      const remainingRop = updatedWorkers.find(
        worker => worker.department === oldDepartment && worker.roleName === 'РОП'
      )

      if (!remainingRop) {
        setDepartmentWithoutRop(oldDepartment)
        setIsRopInDepartment({ ...isRopInDepartment, [oldDepartment]: false })
      }
    }

    setWorkerList(updatedWorkers)
    setTransferEmployee(null)
  }

  const handleCancel = () => {
    setTransferEmployee(null)
  }

  const departments = Array.from(
    new Set(workerList.map(worker => worker.department).filter(dept => dept !== null))
  ) as string[]

  const directors = workerList.filter(worker => worker.roleName === 'Директор')
  const companyStaff = workerList.filter(worker =>
    ['Бухгалтер', 'Закупщик'].includes(worker.roleName)
  )
  const salesDepartments = departments.map(dept => ({
    managers: workerList.filter(
      worker => worker.department === dept && worker.roleName === 'Менеджер'
    ),
    name: dept,
    rop: workerList.find(worker => worker.department === dept && worker.roleName === 'РОП'),
  }))
  const noDepartmentManagers = workerList.filter(
    worker => !worker.department && worker.roleName === 'Менеджер'
  )

  const handleAssignRop = (newRopId: number) => {
    const updatedWorkers = workerList.map(worker => {
      if (worker.table_id === newRopId) {
        worker.roleName = 'РОП'
      }

      return worker
    })

    setWorkerList(updatedWorkers)
    setIsRopInDepartment({ ...isRopInDepartment, [departmentWithoutRop!]: true })
    setDepartmentWithoutRop(null)
  }

  const handleDisbandDepartment = () => {
    const updatedWorkers = workerList.map(worker => {
      if (worker.department === departmentWithoutRop) {
        worker.department = null
      }

      return worker
    })

    setWorkerList(updatedWorkers)
    setIsRopInDepartment({ ...isRopInDepartment, [departmentWithoutRop!]: false })
    setDepartmentWithoutRop(null)
  }

  useEffect(() => {
    salesDepartments.forEach(dept => {
      if (!dept.rop && isRopInDepartment[dept.name] !== false) {
        setDepartmentWithoutRop(dept.name)
      }
    })
  }, [salesDepartments, isRopInDepartment])

  return (
    <div className={'p-6 bg-gray-100 min-h-screen'}>
      <h2 className={'text-2xl font-bold mb-6 text-center'}>Структура компании</h2>

      <div className={'mb-8'}>
        <h3 className={'text-xl font-semibold mb-4'}>Дирекция</h3>
        <ul className={'list-disc pl-6'}>
          {directors.map(worker => (
            <li className={'mb-2'} key={worker.table_id}>
              {worker.name}
            </li>
          ))}
        </ul>
      </div>

      <div className={'mb-8'}>
        <h3 className={'text-xl font-semibold mb-4'}>Сотрудники, обеспечивающие работу компании</h3>
        <ul className={'list-disc pl-6'}>
          {companyStaff.map(worker => (
            <li className={'mb-2'} key={worker.table_id}>
              {worker.name} - {worker.roleName}
            </li>
          ))}
        </ul>
      </div>

      {salesDepartments.map(dept => (
        <div className={'mb-8'} key={dept.name}>
          <h3 className={'text-xl font-semibold mb-4'}>{dept.name}</h3>
          <div className={'mb-4'}>
            <strong>РОП: {dept.rop?.name || 'Не назначен'}</strong>
            {userRole === 'Директор' && dept.rop && (
              <button
                className={'ml-2 bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600'}
                onClick={() => setTransferEmployee(dept.rop!)}
              >
                Перевести
              </button>
            )}
          </div>
          <ul className={'list-disc pl-6'}>
            {dept.managers.map(manager => (
              <li className={'mb-2'} key={manager.table_id}>
                {manager.name}
                {userRole === 'Директор' && (
                  <button
                    className={'ml-2 bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600'}
                    onClick={() => setTransferEmployee(manager)}
                  >
                    Перевести
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className={'mb-8'}>
        <h3 className={'text-xl font-semibold mb-4'}>Не входят в отделы продаж</h3>
        <ul className={'list-disc pl-6'}>
          {noDepartmentManagers.map(worker => (
            <li className={'mb-2'} key={worker.table_id}>
              {worker.name}
              {userRole === 'Директор' && (
                <button
                  className={'ml-2 bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600'}
                  onClick={() => setTransferEmployee(worker)}
                >
                  Перевести
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {transferEmployee && (
        <div className={'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'}>
          <div className={'bg-white p-6 rounded-md shadow-lg w-full max-w-lg'}>
            <TransferForm
              departments={departments}
              employee={transferEmployee}
              onCancel={handleCancel}
              onSubmit={handleTransfer}
            />
          </div>
        </div>
      )}

      {departmentWithoutRop && (
        <div className={'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'}>
          <div className={'bg-white p-6 rounded-md shadow-lg w-full max-w-lg'}>
            <h3 className={'text-xl font-semibold mb-4'}>
              Отдел {departmentWithoutRop} остался без РОПа
            </h3>
            <p className={'mb-4'}>Назначьте нового РОПа или расформируйте отдел:</p>
            <div className={'flex justify-between'}>
              <button
                className={'mr-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600'}
                onClick={handleDisbandDepartment}
              >
                Расформировать отдел
              </button>
              <div>
                <label className={'block text-sm font-medium text-gray-700'}>
                  Назначить нового РОПа
                </label>
                <select
                  className={'mt-1 block w-full p-2 border border-gray-300 rounded-md'}
                  onChange={e => handleAssignRop(parseInt(e.target.value, 10))}
                >
                  <option value={''}>Выберите менеджера</option>
                  {workerList
                    .filter(
                      worker =>
                        worker.department === departmentWithoutRop && worker.roleName === 'Менеджер'
                    )
                    .map(manager => (
                      <option key={manager.table_id} value={manager.table_id}>
                        {manager.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StructurePage
