import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

import { Mutex } from 'async-mutex'

import { baseQuery } from './base-query'

const mutex = new Mutex()

export const baseQueryWithReauth: BaseQueryFn<
  FetchArgs | string,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)

  if (
    result.error &&
    result.error.status === 401 &&
    (result.error?.data as { path?: string })?.path !== '/auth/login'
  ) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      // try to get a new token
      const refreshResult = await baseQuery(
        {
          method: 'POST',
          url: '/auth/token/refresh',
        },
        api,
        extraOptions
      )

      if (refreshResult.meta?.response?.status === 204) {
        // retry the initial query
        result = await baseQuery(args, api, extraOptions)
      }
      release()
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}
