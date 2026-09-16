import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'

/**
 * Route id -> application component. The import paths are static strings so Vite can split
 * each application into its own chunk: opening the launcher does not download Invoice.
 *
 * Adding an application means adding a folder, an entry here, and an entry in
 * config/apps.json. Nothing else in the shell changes.
 */
export const FEATURES: Record<string, LazyExoticComponent<ComponentType>> = {
  'ottk': lazy(() => import('./ottk/index.tsx')),
  'dttk': lazy(() => import('./dttk/index.tsx')),
  'deal-id': lazy(() => import('./deal-id/index.tsx')),
  'tf-upload': lazy(() => import('./tf-upload/index.tsx')),
  'tf-manage': lazy(() => import('./tf-manage/index.tsx')),
  'invoice': lazy(() => import('./invoice/index.tsx')),
}
