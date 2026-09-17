import type { Theme } from '../shared/theme.ts'

const SUN =
  'M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z'

const MOON = 'M9.37 5.51A7.35 7.35 0 009.1 7.5c0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27A7.014 7.014 0 0112 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.4-9.6c-.44-.06-.9-.1-1.1-.1z'

/**
 * Day / night switch for the hub.
 *
 * Borrows `.path-switch`, the pill the header already uses, so it sits with the sign-out
 * control rather than introducing a second button style. The icon shows what you get by
 * pressing it, and the label says the same thing in words — an icon alone would leave the
 * current state ambiguous.
 */
export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const goingDark = theme === 'light'

  return (
    <button
      type="button"
      className="path-switch mp-theme-toggle"
      onClick={onToggle}
      aria-pressed={theme === 'dark'}
      title={goingDark ? 'Switch to night mode' : 'Switch to day mode'}
    >
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
        <path d={goingDark ? MOON : SUN} />
      </svg>
      {goingDark ? 'Night' : 'Day'}
    </button>
  )
}
