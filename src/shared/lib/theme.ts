import { createStrictContext, useStrictContext } from './strict-context'

export type Theme = 'dark' | 'light' | 'system'

export const LOCAL_STORAGE_THEME_KEY = 'ui-theme'

export const DEFAULT_THEME: Theme = 'system'

type ThemeContextProps = {
  setTheme: (theme: Theme) => void
  theme: Theme
}

export const themeContext = createStrictContext<ThemeContextProps>()

export const useTheme = () => ({ ...useStrictContext(themeContext) })
