import type { RouteObject } from 'react-router-dom'

import { SignInPage } from '@/pages/sign-in'
import { ROUTER_PATHS } from '@/shared/config/routes'

const { SIGN_IN } = ROUTER_PATHS

export const publicRoutes: RouteObject[] = [
  {
    children: [
      {
        element: <SignInPage />,
        path: SIGN_IN,
      },
    ],
  },
]
