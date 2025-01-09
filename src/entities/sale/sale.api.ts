import { baseApi } from '@/shared/api'

import { ChangeDto } from '../changes/change.types'
import {
  CommissionDto,
  CreateCommissionDto,
  CreateSaleDto,
  RemainingSaleDto,
  SaleDto,
  UpdateCommissionDto,
  UpdateSaleDto,
} from './sale.types'

const saleApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createCommission: builder.mutation<CommissionDto, CreateCommissionDto>({
      query: commission => ({
        body: commission,
        method: 'POST',
        url: '/commissions',
      }),
    }),

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

    getCommissionsBySaleId: builder.query<CommissionDto[], number>({
      query: saleId => ({
        method: 'GET',
        url: `/commissions/sale/${saleId}`,
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

    updateCommission: builder.mutation<
      CommissionDto,
      { commission: UpdateCommissionDto; id: number }
    >({
      query: ({ commission, id }) => ({
        body: commission,
        method: 'PUT',
        url: `/commissions/${id}`,
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
  useCreateCommissionMutation,
  useCreateRemainingSaleMutation,
  useCreateSaleMutation,
  useGetAllRemainingSalesQuery,
  useGetAllSalesQuery,
  useGetCommissionsBySaleIdQuery,
  useGetDeletedSalesQuery,
  useGetSaleByIdQuery,
  useGetSaleChangesQuery,
  useGetSalesByUserIdQuery,
  useRestoreSaleMutation,
  useSoftDeleteSaleMutation,
  useUpdateCommissionMutation,
  useUpdateSaleMutation,
  useUpdateSaleWithRemainingMutation,
} = saleApi
