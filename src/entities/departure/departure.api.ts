import type {
  CreateDepartureDto,
  CreateSupplierDto,
  DepartureDto,
  SupplierDto,
  UpdateSupplierDto,
} from './departure.types'

import { DEPARTURE_TAG, baseApi } from '@/shared/api'

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
    // Новые маршруты для поставщиков
    createSupplier: builder.mutation<SupplierDto, CreateSupplierDto>({
      query: body => ({
        body,
        method: 'POST',
        url: 'suppliers',
      }),
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
    getSuppliers: builder.query<SupplierDto[], void>({
      query: () => 'suppliers',
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
  useGetDeparturesByDateRangeQuery,
  useGetDeparturesByUserQuery,
  useGetDeparturesQuery,
  useGetSuppliersQuery,
  useUpdateDepartureMutation, // <-- Экспортируем новый хук
  useUpdateSupplierMutation,
  util: departureUtil,
} = departureApi
