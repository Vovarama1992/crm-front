/* eslint-disable max-lines */
import type {
  CreateInvoiceLineDto,
  CreateSupplierLineDto,
  InvoiceLineDto,
  LogisticsLineDto,
  PurchaseDto,
  SupplierLineDto,
  UpdateInvoiceLineDto,
  UpdateLogisticsLineDto,
  UpdatePurchaseDto,
  UpdateSupplierLineDto,
} from './purchase.types'

import { baseApi } from '@/shared/api'

import { ChangeDto } from '../changes/change.types'
import { DealDto } from '../deal'
import {
  CounterpartyDto,
  CreateCounterpartyDto,
  CreateDealDto,
  CreateExpenseDto,
  CreatePaymentDto,
  ExpenseDto,
  PaymentDto,
} from '../deal/deal.types'
import { SaleDto } from '../sale'

const purchaseApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    GetDeletedPurchases: builder.query<PurchaseDto[], void>({
      query: () => ({
        url: '/purchases-deleted',
      }),
    }),

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
      query: () => ({
        url: '/payments',
      }),
    }),

    getAllPurchases: builder.query<PurchaseDto[], void>({
      query: () => ({
        url: '/purchases',
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

    getDeletedExpenses: builder.query<ExpenseDto[], void>({
      query: () => ({
        url: '/expenses-deleted',
      }),
    }),

    // Эндпойнт для получения истории изменений по расходу
    getExpenseChanges: builder.query<ChangeDto[], { entityId: number }>({
      query: ({ entityId }) => ({
        params: { entityId, entityType: 'EXPENSE' },
        url: 'change',
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

    getPaymentChanges: builder.query<ChangeDto[], { entityId: number }>({
      query: ({ entityId }) => ({
        params: { entityId, entityType: 'PAYMENT' },
        url: 'change',
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
    // Эндпойнт для восстановления расхода
    restoreExpense: builder.mutation<ExpenseDto, number>({
      query: id => ({
        method: 'PATCH',
        url: `/expenses/${id}/restore`,
      }),
    }),

    // Эндпойнт для мягкого удаления расхода
    softDeleteExpense: builder.mutation<ExpenseDto, number>({
      query: id => ({
        method: 'PATCH',
        url: `/expenses/${id}/soft-delete`,
      }),
    }),

    softDeletePurchase: builder.mutation<void, number>({
      query: id => ({
        method: 'PATCH',
        url: `/purchases/${id}/soft-delete`,
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

  useCreateSupplierLineMutation,
  useDeleteInvoiceLineMutation,
  useDeleteSupplierLineMutation,
  useGetAllCounterpartiesQuery,
  useGetAllDealsQuery,
  useGetAllExpensesQuery,
  useGetAllPaymentsQuery,
  useGetAllPurchasesQuery,

  useGetAllUsersMonthlyTurnoverAndMarginQuery,

  useGetDealsByDateRangeQuery,
  useGetDealsByDepartmentQuery,
  useGetDealsByUserIdQuery,
  useGetDeletedExpensesQuery,

  useGetDeletedPurchasesQuery,

  useGetExpenseChangesQuery,
  useGetExpensesByUserIdQuery,
  useGetInvoiceLinesByPurchaseIdQuery,
  useGetLogisticsLinesByPurchaseIdQuery,

  useGetMonthlyTurnoverAndMarginQuery,
  useGetPaymentChangesQuery,

  // Новые хуки для работы с продажами

  useGetSalesByUserIdQuery,
  useGetSupplierLinesByPurchaseIdQuery,
  useRestoreExpenseMutation,
  useSoftDeleteExpenseMutation,
  useSoftDeletePurchaseMutation,

  useUpdateDealMutation,

  useUpdateInvoiceLineMutation,
  useUpdateLogisticsLineMutation,
  useUpdatePaymentMutation,
  useUpdatePurchaseMutation,

  useUpdateSupplierLineMutation,

  util: dealUtil,
} = purchaseApi
