import type {
  AccessAvitoDto,
  AccessOzonDto,
  AccessWildberriesDto,
  AfterAccessDto,
  CommonAccessDto,
  ConnectionDto,
} from './connection.types'

import { CONNECTION_TAG, CONNECTIONS_TAG, SHOPS_TAG, baseApi } from '@/shared/api'

import { ShopConnectionListDto } from './connection.types'

/* eslint-disable perfectionist/sort-objects */
const connectionApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getConnections: builder.query<ConnectionDto[], void>({
      providesTags: [CONNECTION_TAG],
      query: () => ({
        url: '/connections/handling/connections_list',
      }),
    }),
    getShopConnectionsList: builder.query<ShopConnectionListDto[], { shopId: string }>({
      providesTags: [CONNECTIONS_TAG],
      query: ({ shopId }) => ({
        url: `/connections/handling/shop_connections_list/${shopId}`,
      }),
    }),
    accessToConnection: builder.mutation<AfterAccessDto, CommonAccessDto>({
      invalidatesTags: (_, error) => (!error ? [CONNECTION_TAG, SHOPS_TAG] : []),
      query: ({ connection, ...data }) => ({
        body: { connection, ...data },
        method: 'POST',
        url: `/connections/handling/access_to_connection/${connection}`,
      }),
    }),
    accessWildberries: builder.mutation<AccessWildberriesDto, AccessWildberriesDto>({
      invalidatesTags: (_, error) => (!error ? [CONNECTION_TAG] : []),
      query: body => ({
        body,
        method: 'POST',
        url: '/connections/wildberries/access_to_wildberries/',
      }),
    }),

    accessAvito: builder.mutation<AccessAvitoDto, AccessAvitoDto>({
      invalidatesTags: (_, error) => (!error ? [CONNECTION_TAG] : []),
      query: body => ({
        body,
        method: 'POST',
        url: '/connections/avito/access_to_avito/',
      }),
    }),

    accessOzon: builder.mutation<AccessOzonDto, AccessOzonDto>({
      invalidatesTags: (_, error) => (!error ? [CONNECTION_TAG] : []),
      query: body => ({
        body,
        method: 'POST',
        url: '/connections/ozon/access_to_ozon/',
      }),
    }),
  }),
})

export const {
  endpoints: connectionEndpoints,
  util: connectionUtil,
  useGetConnectionsQuery,
  useAccessWildberriesMutation,
  useAccessAvitoMutation,
  useAccessToConnectionMutation,
  useAccessOzonMutation,
  useGetShopConnectionsListQuery,
} = connectionApi
