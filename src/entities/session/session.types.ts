export type BaseUserDto = {
  email: string
  id: number
  name: string
  roleName: string
  surname: string
}

export type UserRegisteredDto = {
  access_token: string
} & BaseUserDto

export type UserAuthenticatedDto = {
  permissions: Permissions
} & BaseUserDto

export type RegistrationDto = {
  email: string
  middleName: string
  name: string
  password: string
  roleName: string
  surname: string
}

export type LoginDto = {
  email: string
  password: string
}

export type Permissions = {
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
