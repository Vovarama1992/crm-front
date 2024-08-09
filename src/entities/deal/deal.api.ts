import type {
  CounterpartyDto,
  CreateCounterpartyDto,
  CreateDealDto,
  CreateExpenseDto,
  DealDto,
  ExpenseDto,
  InvoiceLineDto,
  LogisticsLineDto,
  PurchaseDto,
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
    createSale: builder.mutation<SaleDto, Omit<SaleDto, 'id'>>({
      query: sale => ({
        body: sale,
        method: 'POST',
        url: '/sales',
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
    getAllPurchases: builder.query<PurchaseDto[], void>({
      query: () => ({
        url: '/purchases',
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
    // Новый эндпойнт для получения supplier lines по purchaseId
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

    updatePurchase: builder.mutation<PurchaseDto, { data: UpdatePurchaseDto; id: number }>({
      query: ({ data, id }) => ({
        body: data,
        method: 'PUT',
        url: `purchases/${id}`,
      }),
    }),

    updateSale: builder.mutation<SaleDto, { id: number; sale: UpdateSaleDto }>({
      query: ({ id, sale }) => ({
        body: sale,
        method: 'PUT',
        url: `/sales/${id}`,
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
  useCreateSaleMutation,
  useGetAllDealsQuery,
  useGetAllExpensesQuery,
  useGetAllPurchasesQuery,
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
  useUpdatePurchaseMutation,
  useUpdateSaleMutation,
  useUpdateSupplierLineMutation,
  util: dealUtil,
} = dealApi
