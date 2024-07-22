import React, { useEffect, useState } from 'react'

import { useMeQuery } from '@/entities/session'
import { WorkerDto } from '@/entities/workers'

import EmployeeTable from './EmployeeTable'

export const WorkersPage: React.FC = () => {
  const { data } = useMeQuery()
  const roleName = data?.roleName || ''

  // Получаем список работников из localStorage или используем начальные данные

  // Фильтрация работников по имени и почте
  const [workers, setWorkers] = useState<WorkerDto[]>([])
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')

  useEffect(() => {
    // Загружаем работников из localStorage при монтировании компонента
    const storedWorkers = JSON.parse(localStorage.getItem('workers') || '[]') as WorkerDto[]

    if (storedWorkers.length > 0) {
      setWorkers(storedWorkers)
    }
  }, [])

  // Фильтрация работников по имени и почте
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

  return (
    <div className={'absolute left-[15%] top-[15%]'}>
      <div>
        <input
          onChange={handleSearchNameChange}
          placeholder={'Поиск по ФИО'}
          type={'text'}
          value={searchName}
        />
        <input
          onChange={handleSearchEmailChange}
          placeholder={'Поиск по почте'}
          type={'text'}
          value={searchEmail}
        />
      </div>

      <EmployeeTable roleName={roleName} workers={filteredWorkers} />
    </div>
  )
}

export default WorkersPage
