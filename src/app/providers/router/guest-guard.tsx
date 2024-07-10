import type { AuthContext } from './types'

import { Navigate, Outlet, useOutletContext } from 'react-router-dom'

import { ROUTER_PATHS } from '@/shared/config/routes'

export const GuestGuard = () => {
  const { isAuthenticated } = useOutletContext<AuthContext>()

  console.log('GuestGuard rendered')
  console.log('isAuthenticated:', isAuthenticated)

  return isAuthenticated ? <Navigate to={ROUTER_PATHS.HOME} /> : <Outlet />
}
