/* eslint-disable max-lines */
import type {
  CounterpartyDto,
  CreateCounterpartyDto,
  CreateDealDto,
  CreateExpenseDto,
  CreatePaymentDto,
  DealDto,
  ExpenseDto,
  PaymentDto,
  SaleDto,
  SupplierLineDto,
  UpdateSupplierLineDto,
} from './deal.types'

import { baseApi } from '@/shared/api'

import { ChangeDto } from '../changes/change.types'
import { PurchaseDto } from '../purchase'
import { UpdatePurchaseDto } from '../purchase/purchase.types'

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

    getMonthlyBonuses: builder.query<Record<string, number>, void>({
      query: () => ({
        url: '/deals/bonuses-by-month',
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

    updateDeal: builder.mutation<DealDto, { deal: Partial<DealDto>; id: number }>({
      query: ({ deal, id }) => ({
        body: deal,
        method: 'PATCH',
        url: `/deals/${id}`,
      }),
    }),

    updateExpense: builder.mutation<ExpenseDto, { data: Partial<ExpenseDto>; id: number }>({
      query: ({ data, id }) => ({
        body: data,
        method: 'PATCH',
        url: `/expenses/${id}`,
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

  useCreateMultiplePaymentsMutation,
  useCreatePaymentMutation,

  useGetAllCounterpartiesQuery,
  useGetAllDealsQuery,
  useGetAllExpensesQuery,
  useGetAllPaymentsQuery,

  useGetAllUsersMonthlyTurnoverAndMarginQuery,
  useGetDealsByDateRangeQuery,
  useGetDealsByDepartmentQuery,
  useGetDealsByUserIdQuery,

  useGetDeletedExpensesQuery,

  useGetExpenseChangesQuery,
  useGetExpensesByUserIdQuery,

  useGetMonthlyBonusesQuery,
  useGetMonthlyTurnoverAndMarginQuery,

  // Новые хуки для работы с продажами

  useGetPaymentChangesQuery,

  useGetSalesByUserIdQuery,
  useRestoreExpenseMutation,

  useSoftDeleteExpenseMutation,
  useUpdateDealMutation,

  useUpdateExpenseMutation,

  useUpdatePaymentMutation,
  useUpdatePurchaseMutation,
  useUpdateSupplierLineMutation,

  util: dealUtil,
} = dealApi
