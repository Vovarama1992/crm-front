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

export type PurchaseDto = {
  counterpartyId: number
  createdAt?: string
  dealId: number
  deliveryDeadline: string
  id: number
  invoiceLines: InvoiceLineDto[]
  invoiceToCustomer: string
  isSentAll?: boolean
  logisticsLines: LogisticsLineDto[]
  requestNumber: string
  supplierLines: SupplierLineDto[]
  userId: number
}

export type CreatePurchaseDto = Omit<PurchaseDto, 'id'>

export type UpdatePurchaseDto = { id: number } & Partial<CreatePurchaseDto>

export type InvoiceLineDto = {
  articleNumber: string
  comment?: string
  description: string
  id: number
  purchase?: any
  purchaseId: number
  quantity: number
  totalPrice: number
  unitPrice: number
}

export type CreateInvoiceLineDto = Omit<InvoiceLineDto, 'id'>

export type UpdateInvoiceLineDto = Partial<CreateInvoiceLineDto>

export type SupplierLineDto = {
  articleNumber: string
  comment?: string
  delivered: boolean
  description: string
  id: number
  paymentDate: string
  pdfUrl?: string
  purchaseId: number
  quantity: number
  shipmentDate: string
  supplierId: number
  supplierInvoice: string
  totalPurchaseAmount: number
}

export type CreateSupplierLineDto = Omit<SupplierLineDto, 'id'>

export type UpdateSupplierLineDto = Partial<CreateSupplierLineDto>

export type LogisticsLineDto = {
  amount: number
  carrier: string
  date: string
  description: string
  destination: Destination
  id: number
  pdfUrl?: string
  purchaseId: number
}

export type CreateLogisticsLineDto = Omit<LogisticsLineDto, 'id'>

export type UpdateLogisticsLineDto = Partial<CreateLogisticsLineDto>

export enum Destination {
  RETURN_FROM_CLIENT = 'RETURN_FROM_CLIENT',
  RETURN_TO_SUPPLIER = 'RETURN_TO_SUPPLIER',
  TO_CLIENT = 'TO_CLIENT',
  TO_US = 'TO_US',
}
