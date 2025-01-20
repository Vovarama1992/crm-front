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

export enum EntityType {
  DEPARTURE = 'DEPARTURE',
  EMPLOYEE = 'EMPLOYEE',
  EXPENSE = 'EXPENSE',
  INVOICE_LINE = 'INVOICE_LINE',
  LOGISTIC_LINE = 'LOGISTIC_LINE',
  MOTIVATION = 'MOTIVATION',
  PAYMENT = 'PAYMENT',
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  SUPPLIER_LINE = 'SUPPLIER_LINE',
}
