import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useMeQuery } from '@/entities/session'
import { WorkerDto } from '@/entities/workers'
import { useGetActiveQuery } from '@/entities/workers'
import { ROUTER_PATHS } from '@/shared/config/routes'

import EmployeeTable from './EmployeeTable'

export const WorkersPage: React.FC = () => {
  const { data: meData } = useMeQuery()
  const roleName = meData?.roleName || ''

  const { data: workersData, error, isLoading } = useGetActiveQuery()

  const [workers, setWorkers] = useState<WorkerDto[]>([])
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')

  useEffect(() => {
    if (workersData) {
      setWorkers(workersData)
    }
  }, [workersData])

  const filteredWorkers = workers.filter(
    worker =>
      worker.name.toLowerCase().includes(searchName.toLowerCase()) &&
      worker.email.toLowerCase().includes(searchEmail.toLowerCase())
  )

  const handleSearchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value)
  }

  const handleSearchEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchEmail(e.target.value)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading workers</div>
  }

  return (
    <div className={'absolute left-[15%] top-[15%]'}>
      <div className={'flex justify-between items-center mb-4'}>
        <div>
          <input
            className={'mr-2 p-1 border'}
            onChange={handleSearchNameChange}
            placeholder={'Поиск по ФИО'}
            type={'text'}
            value={searchName}
          />
          <input
            className={'p-1 border'}
            onChange={handleSearchEmailChange}
            placeholder={'Поиск по почте'}
            type={'text'}
            value={searchEmail}
          />
        </div>
        <Link className={'p-2 bg-blue-500 text-white rounded'} to={ROUTER_PATHS.STRUCTURE}>
          Структура компании
        </Link>
      </div>

      <EmployeeTable roleName={roleName} workers={workers} />
    </div>
  )
}

export default WorkersPage
