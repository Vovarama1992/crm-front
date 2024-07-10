import type { CreateShopDto, ShopDto, UpdateShopDto } from './shop.types'

import { SHOP_TAG, SHOPS_TAG, baseApi } from '@/shared/api'

/* eslint-disable perfectionist/sort-objects */
const shopApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getUserShops: builder.query<ShopDto[], void>({
      providesTags: [SHOP_TAG],
      query: () => ({
        url: '/shops/shops_user_list',
      }),
    }),
    getUserShopsByPersonalId: builder.query<ShopDto[], { personalId: string }>({
      providesTags: [SHOPS_TAG],
      query: ({ personalId }) => ({
        url: '/shops/shops_by_personal_office_list/' + personalId,
      }),
    }),
    createShop: builder.mutation<ShopDto, CreateShopDto>({
      invalidatesTags: (_, error) => (!error ? [SHOP_TAG] : []),
      query: body => ({
        body,
        method: 'POST',
        url: '/shops/',
      }),
    }),

    updateShop: builder.mutation<UpdateShopDto, UpdateShopDto>({
      invalidatesTags: (_, error) => (!error ? [SHOP_TAG] : []),
      query: body => ({
        body,
        method: 'PUT',
        url: '/shops/',
      }),
    }),
  }),
})

export const {
  endpoints: shopEndpoints,
  util: shopUtil,
  useGetUserShopsQuery,
  useCreateShopMutation,
  useUpdateShopMutation,
  useGetUserShopsByPersonalIdQuery,
} = shopApi
