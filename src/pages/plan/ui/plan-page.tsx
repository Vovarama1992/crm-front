/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'

import { useMeQuery } from '@/entities/session'
import {
  useGetDepartmentsQuery,
  useGetUsersWithMotivationsQuery,
  useRecalculateAllUsersMarginMutation,
} from '@/entities/workers'
import { WorkerDto } from '@/entities/workers'
import { Typography } from '@/shared/ui/typography'

import { MotivationHistoryModal } from './MotivationHistoryModal'
import UpdateMotivationModal from './MotivationModal'

export const PlanPage = () => {
  const [recalculateAll] = useRecalculateAllUsersMarginMutation()
  const { data: usersWithMotivations = [], refetch } = useGetUsersWithMotivationsQuery()
  const { data: departments = [] } = useGetDepartmentsQuery()
  const { data: userData } = useMeQuery()
  const [filteredUsers, setFilteredUsers] = useState<WorkerDto[]>([])
  const [filterYear, setFilterYear] = useState<string>('')
  const [filterNonSales, setFilterNonSales] = useState<boolean>(false)
  const [filterComplexMotivation, setFilterComplexMotivation] = useState<boolean>(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isMotivationModalOpen, setIsMotivationModalOpen] = useState(false)
  const [selectedMotivation, setSelectedMotivation] = useState<any>(null)

  const toggleHistoryModal = () => setIsHistoryModalOpen(!isHistoryModalOpen)
  const toggleMotivationModal = () => setIsMotivationModalOpen(!isMotivationModalOpen)

  const userRole = userData?.roleName

  useEffect(() => {
    recalculateAll().then(({ data }) => {
      if (data && Array.isArray(data)) {
        data.forEach(({ newMarginPercent, planMargin, userId }: any) => {
          const user = usersWithMotivations.find((u: WorkerDto) => u.id === userId)

          if (user) {
            user.planMargin = planMargin
            user.margin_percent = newMarginPercent
          }
        })
      }
    })
  }, [])

  useEffect(() => {
    if (userRole === 'Менеджер' || userRole === 'Логист' || userRole === 'Закупщик') {
      setFilteredUsers(usersWithMotivations.filter(user => user.id === userData?.id))
    } else if (userRole === 'РОП') {
      const ropDepartment = departments.find(department => department.ropId === userData?.id)
      const usersInDepartment =
        ropDepartment?.users.filter(user => user.department_id == ropDepartment.id) ?? []

      setFilteredUsers(usersInDepartment)
    } else if (userRole === 'Директор') {
      setFilteredUsers(usersWithMotivations)
    }
  }, [userRole, usersWithMotivations, departments, userData?.id])

  useEffect(() => {
    let users = usersWithMotivations

    if (filterYear) {
      users = users.filter(user => {
        const demotivatedYear = user.demotivatedAt
          ? new Date(user.demotivatedAt).getFullYear()
          : null
        const motivatedYear = user.motivatedAt ? new Date(user.motivatedAt).getFullYear() : null

        return (
          !(demotivatedYear && demotivatedYear < Number(filterYear)) &&
          !(motivatedYear && motivatedYear > Number(filterYear))
        )
      })
    }

    if (filterNonSales) {
      users = users.filter(user => !user.department_id)
    }

    if (filterComplexMotivation) {
      users = users.filter(user => user.motivationType === 'HARD')
    }

    setFilteredUsers(users)
  }, [filterYear, filterNonSales, filterComplexMotivation, usersWithMotivations, departments])

  const handleMotivationClick = (motivation: any) => {
    setSelectedMotivation(motivation)
    toggleMotivationModal()
  }

  return (
    <div className={'p-6'} style={{ left: '10%', position: 'fixed', top: '10%' }}>
      <Typography className={'text-center text-4xl font-semibold mb-6'} variant={'h1'}>
        Годовой план
      </Typography>

      <div className={'my-4 flex space-x-4'}>
        <select
          className={'p-2 border rounded-md bg-white'}
          onChange={e => setFilterYear(e.target.value)}
          value={filterYear}
        >
          <option value={''}>Выберите год</option>
          {[2022, 2023, 2024, 2025].map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <label className={'flex items-center space-x-2'}>
          <input
            checked={filterNonSales}
            className={'form-checkbox'}
            onChange={e => setFilterNonSales(e.target.checked)}
            type={'checkbox'}
          />
          <span>Сотрудники, не входящие в отделы продаж</span>
        </label>

        <label className={'flex items-center space-x-2'}>
          <input
            checked={filterComplexMotivation}
            className={'form-checkbox'}
            onChange={e => setFilterComplexMotivation(e.target.checked)}
            type={'checkbox'}
          />
          <span>Сотрудники со сложной мотивацией</span>
        </label>
      </div>

      <table className={'w-full mt-6 table-auto border-collapse text-left bg-white shadow-lg'}>
        <thead>
          <tr className={'bg-gray-200 text-lg text-gray-800'}>
            <th className={'px-6 py-4 border-b'}>Сотрудник</th>
            <th className={'px-6 py-4 border-b'}>Минимальный план</th>
            <th className={'px-6 py-4 border-b'}>Средний план</th>
            <th className={'px-6 py-4 border-b'}>Максимальный план</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user: WorkerDto) => {
            const sortedMotivations = [...(user.motivations ?? [])].sort(
              (a, b) => a.threshold - b.threshold
            )

            return (
              <tr className={'hover:bg-gray-50 transition-all'} key={user.id}>
                <td className={'px-6 py-4 border-b'}>
                  {user.name} {user.surname} <br />
                  {user.motivationType === 'HARD' ? (
                    <>
                      с{' '}
                      {user.motivatedAt
                        ? new Date(user.motivatedAt).toLocaleDateString()
                        : 'не указано'}{' '}
                      по{' '}
                      {user.demotivatedAt
                        ? new Date(user.demotivatedAt).toLocaleDateString()
                        : new Date(
                            new Date().setFullYear(new Date().getFullYear(), 11, 31)
                          ).toLocaleDateString()}
                    </>
                  ) : (
                    'Простая мотивация'
                  )}
                </td>

                {sortedMotivations.map((motivation, index) => (
                  <td className={'px-6 py-4 border-b'} key={index}>
                    <div
                      className={'font-semibold text-gray-800 mb-1 cursor-pointer hover:underline'}
                      onClick={() => handleMotivationClick(motivation)}
                    >
                      Порог: {motivation.threshold}
                    </div>
                    <div className={'text-sm text-gray-600 mb-2'}>
                      Процент маржи: {motivation.marginPercent ?? 0}%
                    </div>
                    <div className={'w-full h-1 bg-gray-300 relative mb-2'}>
                      <div
                        className={'h-full bg-blue-500'}
                        style={{
                          width: `${Math.min(
                            ((user.planMargin ?? 0) / (motivation.threshold ?? 1)) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className={'text-sm text-gray-500'}>
                      Заполненность:{' '}
                      {motivation.threshold > 0
                        ? Math.min(
                            ((user.planMargin ?? 0) / motivation.threshold) * 100,
                            100
                          ).toFixed(2)
                        : '0'}{' '}
                      %
                    </div>
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>

      <button
        className={
          'bg-blue-600 mt-[25px] text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all'
        }
        onClick={toggleHistoryModal}
      >
        История изменений мотивации
      </button>
      {isHistoryModalOpen && (
        <MotivationHistoryModal onClose={toggleHistoryModal}></MotivationHistoryModal>
      )}

      {isMotivationModalOpen && selectedMotivation && (
        <UpdateMotivationModal
          initialMarginPercent={selectedMotivation.marginPercent}
          initialThreshold={selectedMotivation.threshold}
          isOpen={isMotivationModalOpen}
          motivationId={selectedMotivation.id}
          onClose={toggleMotivationModal}
          refetch={refetch}
        />
      )}
    </div>
  )
}
