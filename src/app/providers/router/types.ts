type Permissions = {
  common_sales: boolean
  contragents: boolean
  departures: boolean
  finances: boolean
  my_sales: boolean
  procurements: boolean
  salary_reports: boolean
  summary_table: boolean
  suppliers: boolean
}

export type AuthContext = {
  id: number | undefined
  isAuthenticated: boolean
  permissions: Permissions
  roleName: string
}
