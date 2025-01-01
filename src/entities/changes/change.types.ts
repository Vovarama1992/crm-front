export type CreateChangeDto = {
  changedAt: string
  changedBy: number
  entityId: number
  entityType: string
  fieldName: string
  newValue: boolean | null | number | string
  oldValue: boolean | null | number | string
}

export type UpdateChangeDto = {
  changedAt?: string
  changedBy?: number
  fieldName?: string
  newValue?: boolean | null | number | string
  oldValue?: boolean | null | number | string
}

export type ChangeDto = {
  changedAt: string
  changedBy: number
  description: string
  entityId: number
  entityType: string
  fieldName: string
  id: number
  newValue: boolean | null | number | string
  oldValue: boolean | null | number | string
}
