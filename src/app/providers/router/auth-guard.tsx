import type { AuthContext } from './types'

import { Navigate, Outlet, useOutletContext } from 'react-router-dom'

import { ROUTER_PATHS } from '@/shared/config/routes'

export const AuthGuard = () => {
  const { isAuthenticated, permissions } = useOutletContext<AuthContext>()

  console.log('AuthGuard context:', { isAuthenticated, permissions })

  return isAuthenticated ? (
    <Outlet context={{ isAuthenticated, permissions }} />
  ) : (
    <Navigate replace to={ROUTER_PATHS.SIGN_IN} />
  )
}
