import { baseApi } from '@/shared/api'
import { combineSlices, configureStore } from '@reduxjs/toolkit'

const rootReducer = combineSlices(baseApi)

export const store = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
  reducer: rootReducer,
})
