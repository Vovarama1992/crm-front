import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { RootLayout } from '../../layouts/root-layout'
import { privateRoutes } from './private-routes'
import { publicRoutes } from './public-routes'

const router = createBrowserRouter([
  {
    children: [...publicRoutes, ...privateRoutes],
    element: <RootLayout />,
  },
])

export const Router = () => {
  return <RouterProvider router={router} />
}
