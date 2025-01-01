export enum DeliveryStage {
  IN_STOCK = 'IN_STOCK',
  ITEM_DELIVERED_FULL = 'ITEM_DELIVERED_FULL',
  ITEM_DELIVERED_PARTIAL = 'ITEM_DELIVERED_PARTIAL',
  ITEM_SENT = 'ITEM_SENT',
  PURCHASED_FOR_ORDER = 'PURCHASED_FOR_ORDER',
  RETURN = 'RETURN',
}

export enum SigningStage {
  SIGNED_IN_EDO = 'SIGNED_IN_EDO',
  SIGNED_ON_PAPER = 'SIGNED_ON_PAPER',
}

export type SaleDto = {
  counterparty?: any
  counterpartyId: number
  date: string // DateTime в формате ISO
  dealId: number
  deliveryStage?: DeliveryStage
  id: number
  invoiceNumber?: string
  isFinalAmount: boolean
  isIndependentDeal: boolean
  lastDeliveryDate?: string // DateTime в формате ISO
  logisticsCost: number
  margin?: number
  paidNow: number
  pdfPath?: string
  pdfUrl?: string
  prepaymentAmount: number
  progressed?: boolean
  purchaseCost: number
  ropId?: number
  saleAmount?: number
  saleId?: number
  signingStage?: SigningStage
  // Новые поля:
  statusSetDate?: string // DateTime в формате ISO
  totalSaleAmount?: number
  userId: number
}

export type CreateSaleDto = Omit<SaleDto, 'id'>

export type RemainingSaleDto = {
  counterpartyId: number
  date: string // DateTime в формате ISO
  dealId: number
  id: number
  invoiceNumber?: string
  isFinalAmount: boolean
  isIndependentDeal: boolean
  lastDeliveryDate?: string // DateTime в формате ISO
  logisticsCost: number
  paidNow: number
  prepaymentAmount: number
  purchaseCost: number
  saleAmount: number
  saleId: number
  statusSetDate?: string // DateTime в формате ISO
  totalSaleAmount?: number
  userId: number
}

export type CreateRemainingSaleDto = Omit<RemainingSaleDto, 'id'>

export type UpdateSaleDto = Partial<SaleDto>

export enum Destination {
  RETURN_FROM_CLIENT = 'RETURN_FROM_CLIENT',
  RETURN_TO_SUPPLIER = 'RETURN_TO_SUPPLIER',
  TO_CLIENT = 'TO_CLIENT',
  TO_US = 'TO_US',
}
