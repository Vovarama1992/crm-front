import type { AuthContext } from '../providers/router/types'

import { Outlet } from 'react-router-dom'

import { useMeQuery } from '@/entities/session'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'

export const RootLayout = () => {
  const { data, isError, isLoading } = useMeQuery()
  const isAuthenticated = !isError && !isLoading

  console.log('useMeQuery isError:', isError)
  console.log('useMeQuery isLoading:', isLoading)
  console.log('useMeQuery data:', data)
  console.log('isAuthenticated:', isAuthenticated)

  if (isLoading) {
    return <div>Проверка ваших полномочий...</div>
  }
  const defaultPermissions = {
    common_sales: false,
    departures: false,
    finances: false,
    my_sales: false,
    procurements: false,
    salary_reports_common: false,
    salary_reports_himself: false,
    salary_reports_sellers: false,
    see_self: false,
    summary_table: false,
    suppliers: false,
  }

  const roleName = data?.roleName || ''

  const contextValue: AuthContext = {
    isAuthenticated,
    permissions: data?.permissions || defaultPermissions,
    roleName,
  }
  const name = data?.name || ''
  const surname = data?.surname || ''
  const user = data ? { name, surname } : undefined

  console.log('RootLayout rendered')
  console.log('dataRoleName: ' + roleName)
  console.log('contextValue:', contextValue)

  const renderMain = (
    <main className={'grow flex flex-col justify-center items-center pt-[var(--header-height)]'}>
      <Outlet context={contextValue} />
    </main>
  )

  if (isLoading) {
    return <div>Loading...</div> // Отображаем индикатор загрузки пока isLoading === true
  }

  if (isAuthenticated) {
    return (
      <>
        <Header user={user} />
        <div
          className={
            'px-8 h-screen flex-1 gap-5 md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)]'
          }
        >
          <Sidebar />
          {renderMain}
        </div>
      </>
    )
  }

  return (
    <div className={'h-screen min-w-full flex flex-col'}>
      <Header />
      {!isLoading && renderMain}
    </div>
  )
}
