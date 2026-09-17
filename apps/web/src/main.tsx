import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { applyTheme, initialTheme } from './shared/theme.ts'

// Before the first render rather than in an effect: an effect runs after the browser has
// already painted, so a night-mode user would see one white frame on every cold load.
applyTheme(initialTheme())

const container = document.getElementById('root')
if (!container) throw new Error('index.html is missing <div id="root">.')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
