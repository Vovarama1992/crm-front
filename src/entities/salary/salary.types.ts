export type SalaryDto = {
  earned: number
  id: number
  month: number
  paid: number
  salary: number
  user: {
    department: {
      id: number
      name: string
    }
    id: number
    name: string
  }
  userId: number
  year: number
}

export type CreateSalaryDto = Omit<SalaryDto, 'id' | 'user'>

export type UpdateSalaryDto = Partial<CreateSalaryDto>
