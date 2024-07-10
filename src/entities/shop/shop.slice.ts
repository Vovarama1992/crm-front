import { InitialShopState } from '@/entities/shop/shop.types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: InitialShopState = {
  currentOffice: '',
}

export const shopSlice = createSlice({
  initialState,
  name: 'shopReducer',
  reducers: {
    reset: () => initialState,
    setCurrentOffice: (state, action: PayloadAction<string>) => {
      state.currentOffice = action.payload
    },
  },
})

export const shopActions = shopSlice.actions
