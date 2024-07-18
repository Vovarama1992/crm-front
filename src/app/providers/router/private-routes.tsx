import type { RouteObject } from 'react-router-dom'

import { CommonSalesPage } from '@/pages/common-sales'
import { ContragentsPage } from '@/pages/contragents'
import { DeparturesPage } from '@/pages/departures'
import { FinancesPage } from '@/pages/finances'
import { HomePage } from '@/pages/home'
import { MySalesPage } from '@/pages/my-sales'
import { ProcurementsPage } from '@/pages/procurements'
import { SalaryReportsPage } from '@/pages/salary-reports-common'
import { SignUpPage } from '@/pages/sign-up'
import { SummaryTablePage } from '@/pages/summary-table'
import { SuppliersPage } from '@/pages/suppliers'
import { ROUTER_PATHS } from '@/shared/config/routes'

import { AuthGuard } from './auth-guard'

const {
  COMMON_SALES,
  CONTRAGENTS,
  DEPARTURES,
  FINANCES,
  HOME,
  MY_SALES,
  PROCUREMENTS,
  SALARY_REPORTS,

  SIGN_UP,
  SUMMARY_TABLE,
  SUPPLIERS,
} = ROUTER_PATHS

export const privateRoutes: RouteObject[] = [
  {
    children: [
      {
        element: <HomePage />,
        path: HOME,
      },
      {
        element: <SignUpPage />,
        path: SIGN_UP,
      },

      {
        element: <ContragentsPage />,
        path: CONTRAGENTS,
      },
      {
        element: <SummaryTablePage />,
        path: SUMMARY_TABLE,
      },
      {
        element: <DeparturesPage />,
        path: DEPARTURES,
      },

      {
        element: <SalaryReportsPage />,
        path: SALARY_REPORTS,
      },

      {
        element: <FinancesPage />,
        path: FINANCES,
      },
      {
        element: <MySalesPage />,
        path: MY_SALES,
      },
      {
        element: <CommonSalesPage />,
        path: COMMON_SALES,
      },
      {
        element: <SuppliersPage />,
        path: SUPPLIERS,
      },
      {
        element: <ProcurementsPage />,
        path: PROCUREMENTS,
      },
    ],
    element: <AuthGuard />,
  },
]
