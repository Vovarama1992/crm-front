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
  id: number
  permissions: Permissions
} & RegistrationDto

export type RegistrationDto = {
  address?: string
  birthday?: string
  cardNumber?: string
  department_id: null | number
  dobNumber?: number
  email: string
  hireDate?: string
  isActive?: boolean
  managed_by?: number
  margin_percent?: number
  middleName: string
  mobile: string
  name: string
  password: string
  position?: string
  roleName: string
  salary?: number
  surname: string
}

export type LoginDto = {
  email: string
  password: string
}

export type Permissions = {
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
