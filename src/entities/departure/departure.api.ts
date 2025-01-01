import type {
  CreateDepartureDto,
  CreateSupplierDto,
  DepartureDto,
  SupplierDto,
  UpdateSupplierDto,
} from './departure.types'

import { DEPARTURE_TAG, baseApi } from '@/shared/api'

import { ChangeDto } from '../changes'

const departureApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createDeparture: builder.mutation<DepartureDto, CreateDepartureDto>({
      invalidatesTags: [DEPARTURE_TAG],
      query: body => ({
        body,
        method: 'POST',
        url: 'departures',
      }),
    }),

    createSupplier: builder.mutation<SupplierDto, CreateSupplierDto>({
      query: body => ({
        body,
        method: 'POST',
        url: 'suppliers',
      }),
    }),
    getDeletedDepartures: builder.query<DepartureDto[], void>({
      query: () => 'departures-deleted',
    }),
    getDepartures: builder.query<DepartureDto[], void>({
      providesTags: [DEPARTURE_TAG],
      query: () => 'departures',
    }),
    getDeparturesByDateRange: builder.query<DepartureDto[], { endDate: string; startDate: string }>(
      {
        providesTags: [DEPARTURE_TAG],
        query: ({ endDate, startDate }) => ({
          params: { endDate, startDate },
          url: 'departures/date-range',
        }),
      }
    ),
    getDeparturesByUser: builder.query<DepartureDto[], number>({
      providesTags: [DEPARTURE_TAG],
      query: userId => `departures/user/${userId}`,
    }),
    getDeparturesChanges: builder.query<ChangeDto[], { entityId: number; entityType: string }>({
      query: ({ entityId, entityType }) => ({
        params: { entityId, entityType },
        url: 'change',
      }),
    }),

    getSuppliers: builder.query<SupplierDto[], void>({
      query: () => 'suppliers',
    }),

    restoreDeparture: builder.mutation<DepartureDto, { id: number }>({
      invalidatesTags: [DEPARTURE_TAG],
      query: ({ id }) => ({
        method: 'PATCH',
        url: `departures/${id}/restore`,
      }),
    }),

    softDeleteDeparture: builder.mutation<DepartureDto, { id: number }>({
      invalidatesTags: [DEPARTURE_TAG],
      query: ({ id }) => ({
        method: 'PATCH',
        url: `departures/${id}/soft-delete`,
      }),
    }),

    updateDeparture: builder.mutation<DepartureDto, { data: Partial<DepartureDto>; id: number }>({
      invalidatesTags: [DEPARTURE_TAG],
      query: ({ data, id }) => ({
        body: data,
        method: 'PATCH',
        url: `departures/${id}`,
      }),
    }),

    updateSupplier: builder.mutation<SupplierDto, { data: UpdateSupplierDto; id: number }>({
      query: ({ data, id }) => ({
        body: data,
        method: 'PUT',
        url: `suppliers/${id}`,
      }),
    }),
  }),
})

export const {
  endpoints: departureEndpoints,
  useCreateDepartureMutation,
  useCreateSupplierMutation,
  useGetDeletedDeparturesQuery,
  useGetDeparturesByDateRangeQuery,
  useGetDeparturesByUserQuery,
  useGetDeparturesChangesQuery,
  useGetDeparturesQuery,
  useGetSuppliersQuery,
  useRestoreDepartureMutation,
  useSoftDeleteDepartureMutation,
  useUpdateDepartureMutation,
  useUpdateSupplierMutation,
} = departureApi
