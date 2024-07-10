import type { Theme } from '@/shared/lib/theme'

import type { PropsWithChildren } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { DEFAULT_THEME, LOCAL_STORAGE_THEME_KEY, themeContext } from '@/shared/lib/theme'

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme) || DEFAULT_THEME
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)

      return
    }

    root.classList.add(theme)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme)
    setThemeState(newTheme)
  }, [])

  return (
    <themeContext.Provider
      value={{
        setTheme,
        theme,
      }}
    >
      {children}
    </themeContext.Provider>
  )
}
