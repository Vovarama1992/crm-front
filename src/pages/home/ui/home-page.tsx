import type { AuthContext } from '@/app/providers/router/types'

import { useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'

import { useGetNotificationsQuery } from '@/entities/notifications'
import { useMeQuery } from '@/entities/session'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { Typography } from '@/shared/ui/typography'

enum PermissionsEnum {
  COMMON_SALES = 'common_sales',
  CONTRAGENTS = 'contragents',
  DEPARTURES = 'departures',
  FINANCES = 'finances',
  MY_SALES = 'my_sales',
  PLAN = 'plan_page',
  PROCUREMENTS = 'procurements',
  SALARY_REPORTS = 'salary_reports',
  SALES_LIST = 'contragents',
  SUMMARY_TABLE = 'summary_table',
  SUPPLIERS = 'suppliers',
}

const permissionLinks = [
  { label: 'Пайплайн', path: ROUTER_PATHS.CONTRAGENTS, permission: PermissionsEnum.CONTRAGENTS },
  {
    label: 'Сводная таблица',
    path: ROUTER_PATHS.SUMMARY_TABLE,
    permission: PermissionsEnum.SUMMARY_TABLE,
  },
  { label: 'Отправления', path: ROUTER_PATHS.DEPARTURES, permission: PermissionsEnum.DEPARTURES },
  {
    label: 'Отчеты по зарплате ',
    path: ROUTER_PATHS.SALARY_REPORTS,
    permission: PermissionsEnum.SALARY_REPORTS,
  },

  { label: 'Доходы - расходы', path: ROUTER_PATHS.FINANCES, permission: PermissionsEnum.FINANCES },

  {
    label: 'Общие продажи',
    path: ROUTER_PATHS.COMMON_SALES,
    permission: PermissionsEnum.COMMON_SALES,
  },
  {
    label: 'Список продаж',
    path: ROUTER_PATHS.SALES_LIST,
    permission: PermissionsEnum.SALES_LIST,
  },
  { label: 'Поставщики', path: ROUTER_PATHS.SUPPLIERS, permission: PermissionsEnum.SUPPLIERS },
  { label: 'Закупки', path: ROUTER_PATHS.PROCUREMENTS, permission: PermissionsEnum.PROCUREMENTS },
  { label: 'Годовой план', path: ROUTER_PATHS.PLAN, permission: PermissionsEnum.PLAN },
]

export const HomePage = () => {
  const context = useOutletContext<AuthContext>()
  const { permissions } = context
  const { data: userData } = useMeQuery()
  const { data: notifications = [], refetch } = useGetNotificationsQuery({
    page: 1,
    userId: userData ? userData.id : 1,
  })

  useEffect(() => {
    refetch() // Вызываем обновление данных каждый раз, когда компонент рендерится
  }, [refetch])

  console.log(notifications)

  const roleName = userData?.roleName

  return (
    <div className={'h-screen flex flex-col items-center justify-center'} translate={'no'}>
      <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'}>
        {permissionLinks.map(link => {
          // Сделать видимым "Отчеты по зарплате" для всех
          if (link.permission === PermissionsEnum.SALARY_REPORTS) {
            return (
              <Link
                className={
                  'p-4 lg:p-6 border rounded-lg hover:bg-gray-100 transition transform lg:translate-y-[-10%] lg:translate-x-[-10%]'
                }
                key={link.permission}
                to={link.path}
              >
                <Typography
                  className={'lg:text-[26px] text-[18px] decoration-skip-ink-none'}
                  variant={'link1'}
                >
                  {link.label}
                </Typography>
              </Link>
            )
          }

          if (link.permission === PermissionsEnum.PLAN) {
            return (
              <Link
                className={
                  'p-4 lg:p-6 border rounded-lg hover:bg-gray-100 transition transform lg:translate-y-[-10%] lg:translate-x-[-10%]'
                }
                key={link.permission}
                to={link.path}
              >
                <Typography
                  className={'lg:text-[26px] text-[18px] decoration-skip-ink-none'}
                  variant={'link1'}
                >
                  {link.label}
                </Typography>
              </Link>
            )
          }

          if (roleName === 'Закупщик' && link.permission === PermissionsEnum.CONTRAGENTS) {
            return null
          }

          // Для "Бухгалтера" показываем все остальные отчеты, даже если прав нет
          if (roleName === 'Бухгалтер' || permissions[link.permission as PermissionsEnum]) {
            return (
              <Link
                className={
                  'p-4 lg:p-6 border rounded-lg hover:bg-gray-100 transition transform lg:translate-y-[-10%] lg:translate-x-[-10%]'
                }
                key={link.permission}
                to={link.path}
              >
                <Typography
                  className={'lg:text-[26px] text-[18px] decoration-skip-ink-none'}
                  variant={'link1'}
                >
                  {link.label}
                </Typography>
              </Link>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
