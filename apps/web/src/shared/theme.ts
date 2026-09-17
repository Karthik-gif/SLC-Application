/**
 * Day / night preference for the whole product.
 *
 * This lives on the document element rather than on any one screen's root, because the hub
 * and the 21 converted applications are separate routes: a `data-theme` written onto the
 * hub's own `<div class="mp">` cannot be seen from /apps/ottk, which is why night mode used
 * to stop at the launcher. `<html data-theme="dark">` is above all of them.
 *
 * Each application's night colours are in its generated `<app>.dark.css`, built from its
 * legacy stylesheet by tools/gen-dark-css.mjs and scoped `:root[data-theme='dark'] .<app>`.
 */

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'slc.hub.theme'

/**
 * Pure, so the precedence is obvious and testable: an explicit choice always wins, and the
 * operating system's setting is only the starting point for someone who has never chosen.
 */
export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored
  return prefersDark ? 'dark' : 'light'
}

/** Reads the saved choice and the OS preference together. A blocked store just means the
 *  OS preference decides. */
export function initialTheme(): Theme {
  let stored: string | null = null
  try {
    stored = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    // Private browsing can refuse the read; fall through to the OS preference.
  }

  const prefersDark =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches

  return resolveTheme(stored, prefersDark)
}

export function storeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // The choice simply will not survive a reload.
  }
}

/** Publishes the choice to CSS. Every night rule in the product keys off this one attribute. */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}
