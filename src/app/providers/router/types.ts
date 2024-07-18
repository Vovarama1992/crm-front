type Permissions = {
  common_sales: boolean
  departures: boolean
  finances: boolean
  my_sales: boolean
  procurements: boolean
  salary_reports_common: boolean
  salary_reports_himself: boolean
  salary_reports_sellers: boolean
  see_self: boolean
  summary_table: boolean
  suppliers: boolean
}

export type AuthContext = {
  id: number | undefined
  isAuthenticated: boolean
  permissions: Permissions
  roleName: string
}
