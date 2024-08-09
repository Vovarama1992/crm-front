export type DepartureDto = {
  arrivalDate: null | string
  comments: null | string
  counterpartyId: number
  dealId: number
  destination: '' | 'RETURN_FROM_CLIENT' | 'RETURN_TO_SUPPLIER' | 'TO_CLIENT' | 'TO_US'
  dispatchDate: string
  expectedArrivalDate: null | string
  finalAmount: null | number
  id: number
  specificDestination: 'TO_DOOR' | 'TO_TERMINAL'
  status: 'DELIVERED_ALL' | 'DELIVERED_PARTIALLY' | 'PROBLEM' | 'SENT_ALL' | 'SENT_PARTIALLY'
  trackingNumber: null | string
  transportCompany: null | string
  userId: number
}

export type CreateDepartureDto = Omit<DepartureDto, 'id'>

export type SupplierDto = {
  address: string
  contactPerson: string
  email: string
  id: number
  name: string
  note?: string
  phone: string
  website: string
}

export type CreateSupplierDto = {
  address: string
  contactPerson: string
  email: string
  name: string
  note?: string
  phone: string
  website: string
}

export type UpdateSupplierDto = Partial<CreateSupplierDto>
