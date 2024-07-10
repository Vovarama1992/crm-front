import { Provider } from 'react-redux'

import { ThemeProvider } from '@/app/providers/theme'
import { Toaster } from '@/shared/ui-shad-cn/ui/toaster'

import { store } from '../store'
import { Router } from './router'

export const Providers = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router />
        <Toaster />
      </ThemeProvider>
    </Provider>
  )
}
