export type DealDto = {
  closeDate: null | string
  comment: null | string
  counterparty: CounterpartyDto // добавлено
  counterpartyName: string
  dealType: 'REQUEST' | 'TASK'
  id: number
  lossReason?: 'DID_NOT_WORK' | 'EMPTY_TALK' | 'EXPENSIVE' | 'NO_REPORT' | 'OTHER'
  marginRub: number
  purchaseId?: number
  requestNumber: number
  saleId?: number
  stage:
    | 'DEAL_CLOSED'
    | 'INVOICE_PAID'
    | 'INVOICE_SENT'
    | 'LOST'
    | 'QUOTE_SENT'
    | 'WORKING_WITH_OBJECTIONS'
  turnoverRub: number
  userId: number
}

export type CreateDealDto = Omit<DealDto, 'counterparty' | 'id' | 'lossReason'>

export type CreateCounterpartyDto = {
  inn: string
  name: string
}

export type CounterpartyDto = {
  id: number
  inn: string
  name: string
}

export type ExpenseDto = {
  category: string
  date: string
  expense: number
  id: number
  name: string
  subcategory: string
  userId: number
}

export type CreateExpenseDto = Omit<ExpenseDto, 'id'>

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
  counterpartyId: number
  date: string
  dealId: number
  deliveryStage?: DeliveryStage
  id: number
  invoiceNumber?: string
  logisticsCost?: number
  margin?: number
  purchaseCost?: number
  saleAmount?: number
  signingStage?: SigningStage
  userId: number
}

export type CreateSaleDto = Omit<SaleDto, 'id'>

export type UpdateSaleDto = Partial<SaleDto>

export type PurchaseDto = {
  counterpartyId: number
  dealId: number
  deliveryDeadline: string
  id: number
  invoiceLines: InvoiceLineDto[]
  invoiceToCustomer: number
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
  id: number
  purchaseId: number
}

export type CreateLogisticsLineDto = Omit<LogisticsLineDto, 'id'>

export type UpdateLogisticsLineDto = Partial<CreateLogisticsLineDto>
