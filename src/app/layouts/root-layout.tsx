import type { AuthContext } from '../providers/router/types'

import { Outlet } from 'react-router-dom'

import { useMeQuery } from '@/entities/session'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'

export const RootLayout = () => {
  const { data, isError, isLoading } = useMeQuery()
  const isAuthenticated = !isError && !isLoading

  if (isLoading) {
    return <div>Проверка ваших полномочий...</div>
  }

  const defaultPermissions = {
    common_sales: false,
    contragents: false,
    departures: false,
    finances: false,
    my_sales: false,
    procurements: false,
    salary_reports: false,
    summary_table: false,
    suppliers: false,
  }
  const roleName = data?.roleName || ''
  const contextValue: AuthContext = {
    id: data?.id,
    isAuthenticated,
    permissions: data?.permissions || defaultPermissions,
    roleName,
  }
  const name = data?.name || ''
  const surname = data?.surname || ''
  const user = data ? { name, surname } : undefined

  const renderMain = (
    <main
      className={
        'grow flex  flex-col lg:justify-center lg:items-center justify-center items-center pt-[var(--header-height)]'
      }
    >
      <Outlet context={contextValue} />
    </main>
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isAuthenticated) {
    return (
      <>
        <Header user={user} />
        <div
          className={
            'px-8 flex h-screen flex-1 gap-5 md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:justify-center lg:items-center justify-center items-center lg:grid-cols-[220px_minmax(0,1fr)]'
          }
          translate={'no'}
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
