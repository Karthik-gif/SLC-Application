import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { applyTheme, initialTheme, storeTheme } from './theme.ts'
import type { Theme } from './theme.ts'

/**
 * Owns the day / night choice for every route.
 *
 * It sits above the router rather than inside the hub so that the choice survives opening an
 * application: /apps/ottk is a different route from the launcher, and a theme held in
 * MenuPage's own state would be unmounted the moment a tile was clicked.
 */

type ThemeValue = { theme: Theme; toggleTheme: () => void }

const ThemeCtx = createContext<ThemeValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Resolved during the initialiser rather than in an effect, so a night-mode user never
  // sees a white page flash before it is applied.
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      storeTheme(next)
      return next
    })
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

export function useTheme(): ThemeValue {
  const value = useContext(ThemeCtx)
  if (!value) throw new Error('useTheme must be used inside <ThemeProvider>.')
  return value
}
