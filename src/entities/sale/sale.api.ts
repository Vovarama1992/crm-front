import { baseApi } from '@/shared/api'

import { ChangeDto } from '../changes/change.types'
import { CreateSaleDto, RemainingSaleDto, SaleDto, UpdateSaleDto } from './sale.types'

const saleApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createRemainingSale: builder.mutation<RemainingSaleDto, RemainingSaleDto>({
      query: remainingSale => ({
        body: remainingSale,
        method: 'POST',
        url: '/remaining-sales',
      }),
    }),

    createSale: builder.mutation<SaleDto, CreateSaleDto>({
      query: sale => ({
        body: sale,
        method: 'POST',
        url: '/sales',
      }),
    }),

    getAllRemainingSales: builder.query<RemainingSaleDto[], void>({
      query: () => ({
        method: 'GET',
        url: '/remaining-sales',
      }),
    }),

    getAllSales: builder.query<SaleDto[], void>({
      query: () => ({
        url: '/sales',
      }),
    }),

    getDeletedSales: builder.query<SaleDto[], void>({
      query: () => ({
        method: 'GET',
        url: '/sales-deleted',
      }),
    }),

    getSaleById: builder.query<SaleDto, string>({
      query: id => ({
        url: `/sales/${id}`,
      }),
    }),

    getSaleChanges: builder.query<ChangeDto[], { entityId: number; entityType: 'SALE' }>({
      query: ({ entityId, entityType }) => ({
        method: 'GET',
        url: `/change?entityType=${entityType}&entityId=${entityId}`,
      }),
    }),

    getSalesByUserId: builder.query<SaleDto[], string>({
      query: userId => ({
        url: `/sales/user/${userId}`,
      }),
    }),

    restoreSale: builder.mutation<SaleDto, number>({
      query: id => ({
        method: 'PATCH',
        url: `/sales/${id}/restore`,
      }),
    }),

    softDeleteSale: builder.mutation<SaleDto, number>({
      query: id => ({
        method: 'PATCH',
        url: `/sales/${id}/soft-delete`,
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
        url: `/sales/${id}/with-remaining-sale`,
      }),
    }),
  }),
})

export const {
  useCreateRemainingSaleMutation,
  useCreateSaleMutation,
  useGetAllRemainingSalesQuery,
  useGetAllSalesQuery,
  useGetDeletedSalesQuery,
  useGetSaleByIdQuery,
  useGetSaleChangesQuery,
  useGetSalesByUserIdQuery,
  useRestoreSaleMutation,
  useSoftDeleteSaleMutation,
  useUpdateSaleMutation,
  useUpdateSaleWithRemainingMutation,
} = saleApi
