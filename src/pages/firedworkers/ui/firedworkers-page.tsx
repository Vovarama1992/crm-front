import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useGetFiredWorkersQuery } from '@/entities/workers'
import { WorkerDto } from '@/entities/workers'
import { ROUTER_PATHS } from '@/shared/config/routes'

import FiredEmployeeTable from './FiredEmployeeTable'

export const FiredWorkersPage: React.FC = () => {
  const { data: firedWorkersData, error, isLoading } = useGetFiredWorkersQuery()

  const [firedWorkers, setFiredWorkers] = useState<WorkerDto[]>([])
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')

  useEffect(() => {
    if (firedWorkersData) {
      setFiredWorkers(firedWorkersData)
    }
  }, [firedWorkersData])

  const handleSearchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value)
  }

  const handleSearchEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchEmail(e.target.value)
  }

  // Фильтрация уволенных сотрудников по имени и почте
  const filteredFiredWorkers = firedWorkers.filter(worker => {
    const matchesName = worker.name.toLowerCase().includes(searchName.toLowerCase())
    const matchesEmail = worker.email.toLowerCase().includes(searchEmail.toLowerCase())

    return matchesName && matchesEmail
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading fired workers</div>
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
        <Link className={'p-2 bg-blue-500 text-white rounded'} to={ROUTER_PATHS.WORKERS}>
          Обратно
        </Link>
      </div>

      <FiredEmployeeTable workers={filteredFiredWorkers} />
    </div>
  )
}

export default FiredWorkersPage
