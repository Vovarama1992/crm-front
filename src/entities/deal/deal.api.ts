/* eslint-disable perfectionist/sort-objects */
import type { DealDto } from './deal.types'

import { baseApi } from '@/shared/api'

const dealApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getDealsByUserId: builder.query<DealDto[], string>({
      query: userId => ({
        url: `/deals/user/${userId}`,
      }),
    }),
    getAllDeals: builder.query<DealDto[], void>({
      query: () => ({
        url: '/deals',
      }),
    }),
  }),
})

export const {
  useGetDealsByUserIdQuery,
  useGetAllDealsQuery,
  util: dealUtil,
  endpoints: dealEndpoints,
} = dealApi
