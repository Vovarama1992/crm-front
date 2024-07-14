import type { RouteObject } from 'react-router-dom'

import { CommonSalesPage } from '@/pages/common-sales'
import { SeeSelfPage } from '@/pages/contragents'
import { DeparturesPage } from '@/pages/departures'
import { FinancesPage } from '@/pages/finances'
import { HomePage } from '@/pages/home'
import { MySalesPage } from '@/pages/my-sales'
import { ProcurementsPage } from '@/pages/procurements'
import { SalaryReportsCommonPage } from '@/pages/salary-reports-common'
import { SalaryReportsHimselfPage } from '@/pages/salary-reports-himself'
import { SalaryReportsSellersPage } from '@/pages/salary-reports-sellers'
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
  SALARY_REPORTS_COMMON,
  SALARY_REPORTS_HIMSELF,
  SALARY_REPORTS_SELLERS,
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
        element: <SeeSelfPage />,
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
        element: <SalaryReportsHimselfPage />,
        path: SALARY_REPORTS_HIMSELF,
      },
      {
        element: <SalaryReportsCommonPage />,
        path: SALARY_REPORTS_COMMON,
      },
      {
        element: <SalaryReportsSellersPage />,
        path: SALARY_REPORTS_SELLERS,
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
