export type DepartureDto = {
  arrivalDate: Date | null
  comments: null | string
  counterparty: {
    id: number
    inn: string
    name: string
  } | null // Включаем данные о контрагенте
  counterpartyId: number
  dealId: number
  destination: 'RETURN_FROM_CLIENT' | 'RETURN_TO_SUPPLIER' | 'TO_CLIENT' | 'TO_US'
  dispatchDate: Date
  expectedArrivalDate: Date | null
  finalAmount: null | number
  id: number
  specificDestination: 'TO_DOOR' | 'TO_TERMINAL'
  status: 'DELIVERED_ALL' | 'DELIVERED_PARTIALLY' | 'PROBLEM' | 'SENT_ALL' | 'SENT_PARTIALLY'
  trackingNumber: null | string
  transportCompany: null | string
  user: {
    department_id: number
    id: number
    name: string
    surname: string
  } // Включаем данные о пользователе
  userId: number
}

export type CreateDepartureDto = Omit<DepartureDto, 'counterparty' | 'id' | 'user'>

export type SupplierDto = {
  address: string
  contactPerson: string
  email: string
  id: number
  inn: string
  name: string
  note?: string
  phone: string
  website: string
}

export type CreateSupplierDto = {
  address: string
  contactPerson: string
  email: string
  inn: string
  name: string
  note?: string
  phone: string
  website: string
}

export type UpdateSupplierDto = Partial<CreateSupplierDto>
