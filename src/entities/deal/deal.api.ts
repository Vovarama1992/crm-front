/* eslint-disable max-lines */
import type {
  CounterpartyDto,
  CreateCounterpartyDto,
  CreateDealDto,
  CreateExpenseDto,
  CreateInvoiceLineDto,
  CreatePaymentDto,
  CreateSaleDto,
  CreateSupplierLineDto,
  DealDto,
  ExpenseDto,
  InvoiceLineDto,
  LogisticsLineDto,
  PaymentDto,
  PurchaseDto,
  RemainingSaleDto,
  SaleDto,
  SupplierLineDto,
  UpdateInvoiceLineDto,
  UpdateLogisticsLineDto,
  UpdatePurchaseDto,
  UpdateSaleDto,
  UpdateSupplierLineDto,
} from './deal.types'

import { baseApi } from '@/shared/api'

const dealApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createCounterparty: builder.mutation<CounterpartyDto, CreateCounterpartyDto>({
      query: counterparty => ({
        body: counterparty,
        method: 'POST',
        url: '/counterparties',
      }),
    }),

    createDeal: builder.mutation<DealDto, CreateDealDto>({
      query: deal => ({
        body: deal,
        method: 'POST',
        url: '/deals',
      }),
    }),

    createExpense: builder.mutation<ExpenseDto, CreateExpenseDto>({
      query: expense => ({
        body: expense,
        method: 'POST',
        url: '/expenses',
      }),
    }),

    createInvoiceLine: builder.mutation<InvoiceLineDto, CreateInvoiceLineDto>({
      query: invoiceLine => ({
        body: invoiceLine,
        method: 'POST',
        url: `/purchases/${invoiceLine.purchaseId}/invoice-lines`,
      }),
    }),
    createMultiplePayments: builder.mutation<PaymentDto[], CreatePaymentDto[]>({
      query: payments => ({
        body: payments,
        method: 'POST',
        url: '/payments/bulk',
      }),
    }),

    createPayment: builder.mutation<PaymentDto, CreatePaymentDto>({
      query: payment => ({
        body: payment,
        method: 'POST',
        url: '/payments',
      }),
    }),

    // Эндпоинт для создания нового RemainingSale
    createRemainingSale: builder.mutation<RemainingSaleDto, RemainingSaleDto>({
      query: remainingSale => ({
        body: remainingSale,
        method: 'POST',
        url: '/remaining-sales', // Маршрут для создания RemainingSale
      }),
    }),

    createSale: builder.mutation<SaleDto, CreateSaleDto>({
      query: sale => ({
        body: sale,
        method: 'POST',
        url: '/sales',
      }),
    }),

    createSupplierLine: builder.mutation<SupplierLineDto, CreateSupplierLineDto>({
      query: supplierLine => ({
        body: supplierLine,
        method: 'POST',
        url: `/purchases/${supplierLine.purchaseId}/supplier-lines`,
      }),
    }),

    deleteInvoiceLine: builder.mutation<void, number>({
      query: id => ({
        method: 'DELETE',
        url: `/purchases/invoice-line/${id}`,
      }),
    }),

    // Эндпоинт для удаления supplier line
    deleteSupplierLine: builder.mutation<void, number>({
      query: id => ({
        method: 'DELETE',
        url: `/purchases/supplier-line/${id}`,
      }),
    }),

    getAllCounterparties: builder.query<CounterpartyDto[], void>({
      query: () => ({
        url: '/counterparties',
      }),
    }),

    getAllDeals: builder.query<DealDto[], void>({
      query: () => ({
        url: '/deals',
      }),
    }),

    getAllExpenses: builder.query<ExpenseDto[], void>({
      query: () => ({
        url: '/expenses',
      }),
    }),

    getAllPayments: builder.query<PaymentDto[], void>({
      // Добавляем получение всех выплат
      query: () => ({
        url: '/payments',
      }),
    }),

    getAllPurchases: builder.query<PurchaseDto[], void>({
      query: () => ({
        url: '/purchases',
      }),
    }),

    // Эндпоинт для получения всех RemainingSales
    getAllRemainingSales: builder.query<RemainingSaleDto[], void>({
      query: () => ({
        method: 'GET',
        url: '/remaining-sales', // Маршрут на бэкенде для получения всех RemainingSales
      }),
    }),

    getAllSales: builder.query<SaleDto[], void>({
      query: () => ({
        url: '/sales',
      }),
    }),

    getAllUsersMonthlyTurnoverAndMargin: builder.query<
      any[],
      { endDate: string; startDate: string }
    >({
      query: ({ endDate, startDate }) => ({
        method: 'GET',
        params: { endDate, startDate },
        url: `/deals/all-users-monthly-turnover-and-margin`,
      }),
    }),

    getDealsByDateRange: builder.query<DealDto[], { endDate: string; startDate: string }>({
      query: ({ endDate, startDate }) => ({
        params: { endDate, startDate },
        url: '/deals/date-range',
      }),
    }),

    getDealsByDepartment: builder.query<DealDto[], string>({
      query: departmentId => ({
        url: `/deals/department/${departmentId}`,
      }),
    }),

    getDealsByUserId: builder.query<DealDto[], string>({
      query: userId => ({
        url: `/deals/user/${userId}`,
      }),
    }),

    getExpensesByUserId: builder.query<ExpenseDto[], string>({
      query: userId => ({
        url: `/expenses/user/${userId}`,
      }),
    }),

    // Новый эндпойнт для получения invoice lines по purchaseId
    getInvoiceLinesByPurchaseId: builder.query<InvoiceLineDto[], number>({
      query: purchaseId => ({
        method: 'GET',
        url: `/purchases/${purchaseId}/invoice-lines`,
      }),
    }),

    // Новый эндпойнт для получения logistics lines по purchaseId
    getLogisticsLinesByPurchaseId: builder.query<LogisticsLineDto[], number>({
      query: purchaseId => ({
        method: 'GET',
        url: `/purchases/${purchaseId}/logistics-lines`,
      }),
    }),

    getMonthlyTurnoverAndMargin: builder.query<any[], { month: number; year: number }>({
      query: ({ month, year }) => ({
        method: 'GET',
        params: { month, year },
        url: `/deals/monthly-turnover-and-margin`,
      }),
    }),

    getSaleById: builder.query<SaleDto, string>({
      query: id => ({
        url: `/sales/${id}`,
      }),
    }),

    getSalesByUserId: builder.query<SaleDto[], string>({
      query: userId => ({
        url: `/sales/user/${userId}`,
      }),
    }),

    getSupplierLinesByPurchaseId: builder.query<SupplierLineDto[], number>({
      query: purchaseId => ({
        method: 'GET',
        url: `/purchases/${purchaseId}/supplier-lines`,
      }),
    }),

    updateDeal: builder.mutation<DealDto, { deal: Partial<DealDto>; id: number }>({
      query: ({ deal, id }) => ({
        body: deal,
        method: 'PATCH',
        url: `/deals/${id}`,
      }),
    }),

    updateInvoiceLine: builder.mutation<InvoiceLineDto, { data: UpdateInvoiceLineDto; id: number }>(
      {
        query: ({ data, id }) => ({
          body: data,
          method: 'PUT',
          url: `purchases/invoice-line/${id}`,
        }),
      }
    ),

    updateLogisticsLine: builder.mutation<
      LogisticsLineDto,
      { data: UpdateLogisticsLineDto; id: number }
    >({
      query: ({ data, id }) => ({
        body: data,
        method: 'PUT',
        url: `purchases/logistics-line/${id}`,
      }),
    }),

    updatePayment: builder.mutation<PaymentDto, { data: Partial<PaymentDto>; id: number }>({
      query: ({ data, id }) => ({
        body: data,
        method: 'PATCH',
        url: `/payments/${id}`,
      }),
    }),

    updatePurchase: builder.mutation<PurchaseDto, { data: UpdatePurchaseDto; id: number }>({
      query: ({ data, id }) => ({
        body: data,
        method: 'PUT',
        url: `purchases/${id}`,
      }),
    }),
    // Эндпоинт для обновления существующего RemainingSale
    updateRemainingSale: builder.mutation<
      RemainingSaleDto,
      { data: Partial<RemainingSaleDto>; id: number }
    >({
      query: ({ data, id }) => ({
        body: data,
        method: 'PUT',
        url: `/remaining-sales/${id}`, // Маршрут для обновления RemainingSale по id
      }),
    }),

    updateSale: builder.mutation<SaleDto, { id: number; sale: UpdateSaleDto }>({
      query: ({ id, sale }) => ({
        body: sale,
        method: 'PUT',
        url: `/sales/${id}`,
      }),
    }),

    updateSaleWithRemaining: builder.mutation<SaleDto, { id: number; sale: UpdateSaleDto }>({
      query: ({ id, sale }) => ({
        body: sale,
        method: 'PUT',
        url: `/sales/${id}/with-remaining-sale`, // Маршрут на бэкенде для обновления Sale и создания RemainingSale
      }),
    }),

    updateSupplierLine: builder.mutation<
      SupplierLineDto,
      { data: UpdateSupplierLineDto; id: number }
    >({
      query: ({ data, id }) => ({
        body: data,
        method: 'PUT',
        url: `purchases/supplier-line/${id}`,
      }),
    }),
  }),
})

export const {
  endpoints: dealEndpoints,
  useCreateCounterpartyMutation,
  useCreateDealMutation,
  useCreateExpenseMutation,
  useCreateInvoiceLineMutation,
  useCreateMultiplePaymentsMutation,
  useCreatePaymentMutation,
  useCreateRemainingSaleMutation,
  useCreateSaleMutation,
  useCreateSupplierLineMutation,
  useDeleteInvoiceLineMutation,
  useDeleteSupplierLineMutation,
  useGetAllCounterpartiesQuery,
  useGetAllDealsQuery,
  useGetAllExpensesQuery,
  useGetAllPaymentsQuery,
  useGetAllPurchasesQuery,
  useGetAllRemainingSalesQuery,
  useGetAllSalesQuery,
  useGetAllUsersMonthlyTurnoverAndMarginQuery,
  useGetDealsByDateRangeQuery,
  useGetDealsByDepartmentQuery,
  useGetDealsByUserIdQuery,
  useGetExpensesByUserIdQuery,
  useGetInvoiceLinesByPurchaseIdQuery,
  useGetLogisticsLinesByPurchaseIdQuery,
  useGetMonthlyTurnoverAndMarginQuery,
  useGetSaleByIdQuery,
  useGetSalesByUserIdQuery,
  useGetSupplierLinesByPurchaseIdQuery,
  useUpdateDealMutation,
  useUpdateInvoiceLineMutation,
  useUpdateLogisticsLineMutation,
  useUpdatePaymentMutation,
  useUpdatePurchaseMutation,
  useUpdateRemainingSaleMutation,
  useUpdateSaleMutation,
  useUpdateSaleWithRemainingMutation,
  useUpdateSupplierLineMutation,
  util: dealUtil,
} = dealApi
