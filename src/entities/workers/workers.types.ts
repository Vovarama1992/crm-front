export type WorkerDto = {
  address?: string
  birthday?: string
  cardNumber?: string
  deletedAt?: Date
  demotivatedAt?: string
  department_id: number | undefined
  dobNumber: string | undefined
  email: string
  hireDate?: string
  id: number
  managed_by?: number
  margin_percent: number
  middleName: string
  mobile?: string
  motivatedAt?: string
  motivationType: MotivationType
  motivations: Motivation[]
  name: string
  password?: string
  planMargin?: number
  position?: string
  roleName: string
  salary?: number
  surname: string
}

export enum MotivationType {
  EASY = 'EASY',
  HARD = 'HARD',
}

export type Motivation = {
  createdAt: string
  id: number
  marginPercent: number
  threshold: number
  updatedAt: string
  userId: number
}

export type CreateMotivation = {
  marginPercent: number
  threshold: number
  userId: number
}
