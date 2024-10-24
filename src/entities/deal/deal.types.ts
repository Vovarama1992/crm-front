export type UserDto = {
  department_id: number
  id: number
  name: string
}

export type DealDto = {
  closeDate: null | string
  comment: null | string
  counterparty: CounterpartyDto // Информация о контрагенте
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
  user: UserDto // Добавлено поле для пользователя
  userId: number
}

export type CreateDealDto = Omit<DealDto, 'counterparty' | 'id' | 'lossReason' | 'user'>

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
  userId?: number
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

export type PurchaseDto = {
  counterpartyId: number
  createdAt?: string
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

export enum PaymentType {
  BONUS = 'BONUS',
  SALARY = 'SALARY',
}

export type PaymentDto = {
  amount: number
  date: string // DateTime в формате ISO
  id: number
  type: PaymentType
  userId: number
}

export type CreatePaymentDto = {
  amount: number
  date?: string // Опциональное поле, по умолчанию будет установлено текущая дата и время
  type?: PaymentType // Опциональное поле, с дефолтным значением SALARY
  userId: number
}

export enum Destination {
  RETURN_FROM_CLIENT = 'RETURN_FROM_CLIENT',
  RETURN_TO_SUPPLIER = 'RETURN_TO_SUPPLIER',
  TO_CLIENT = 'TO_CLIENT',
  TO_US = 'TO_US',
}
