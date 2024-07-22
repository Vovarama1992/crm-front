import type { AuthContext } from '@/app/providers/router/types'

import { Link, useOutletContext } from 'react-router-dom'

import { useMeQuery } from '@/entities/session'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { Typography } from '@/shared/ui/typography'

enum PermissionsEnum {
  COMMON_SALES = 'common_sales',
  CONTRAGENTS = 'see_self',
  DEPARTURES = 'departures',
  FINANCES = 'finances',
  MY_SALES = 'my_sales',
  PROCUREMENTS = 'procurements',
  SALARY_REPORTS = 'salary_reports_himself',
  SALES_LIST = 'see_self',
  SUMMARY_TABLE = 'summary_table',
  SUPPLIERS = 'suppliers',
}

const permissionLinks = [
  { label: 'Контрагент', path: ROUTER_PATHS.CONTRAGENTS, permission: PermissionsEnum.CONTRAGENTS },
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
  { label: 'Мои продажи', path: ROUTER_PATHS.MY_SALES, permission: PermissionsEnum.MY_SALES },
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
]

export const HomePage = () => {
  const context = useOutletContext<AuthContext>()

  console.log('useJsonOutletContext:', JSON.stringify(context))

  const { permissions } = context

  const { data } = useMeQuery()

  const roleName = data?.roleName || ''

  console.log('permissions: ' + permissions)
  console.log('inHomeroleName:', roleName)
  const isDirector = roleName == 'Директор'

  return (
    <div className={'h-screen flex items-center justify-center'} translate={'no'}>
      <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'}>
        {permissionLinks.map(
          link =>
            permissions[link.permission] && (
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
        )}
        {isDirector && (
          <Link
            className={
              'p-4 lg:p-6 border rounded-lg hover:bg-gray-100 transition transform lg:translate-y-[-10%] lg:translate-x-[-10%]'
            }
            to={ROUTER_PATHS.SIGN_UP}
          >
            <Typography className={'lg:text-lg'} variant={'link2'}>
              Регистрация нового пользователя
            </Typography>
          </Link>
        )}
      </div>
    </div>
  )
}
