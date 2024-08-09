import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQueryWithReauth } from './base-query-with-reauth'
import {
  AVAILABLE_CATEGORIES_TAG,
  AVITO_REPORT_TAG,
  CONNECTION_TAG,
  CONNECTIONS_TAG,
  DEPARTURE_TAG,
  OZON_REPORT_TAG,
  SESSION_TAG,
  SHOP_TAG,
  SHOPS_TAG,
  WILDBERRIES_REPORT_TAG,
  WORKERS_TAG,
} from './tags'

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  reducerPath: 'baseApi',
  tagTypes: [
    SESSION_TAG,
    WORKERS_TAG,
    SHOP_TAG,
    SHOPS_TAG,
    CONNECTION_TAG,
    CONNECTIONS_TAG,
    AVAILABLE_CATEGORIES_TAG,
    WILDBERRIES_REPORT_TAG,
    AVITO_REPORT_TAG,
    OZON_REPORT_TAG,
    DEPARTURE_TAG,
  ],
})
