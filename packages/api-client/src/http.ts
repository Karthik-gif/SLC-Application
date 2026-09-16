import { ApiError, extractMessage } from './errors.ts'

export type ConnectionState = 'connected' | 'unreachable' | 'unknown'
type ConnectionListener = (state: ConnectionState) => void

const listeners = new Set<ConnectionListener>()
let connection: ConnectionState = 'unknown'

/**
 * Connection state is global rather than per-call because it describes one gateway that
 * every app shares. The shell's indicator subscribes once instead of each app tracking
 * its own copy, which is what the four legacy pages each did with setConnState().
 */
export function onConnectionChange(listener: ConnectionListener): () => void {
  listeners.add(listener)
  listener(connection)
  return () => listeners.delete(listener)
}

export function getConnectionState(): ConnectionState {
  return connection
}

function setConnection(next: ConnectionState): void {
  if (next === connection) return
  connection = next
  for (const listener of listeners) listener(next)
}

export type RequestOptions = {
  method?: string
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

export type ApiResponse<T> = {
  data: T
  status: number
  headers: Headers
}

/**
 * One call to the gateway. Returns the parsed body plus the response, because creating an
 * entity needs the headers (OData-EntityId / Location) as well as the body.
 *
 * `path` is gateway-relative and always starts with the service key: "/api/ottk/Bank".
 */
export async function apiRequest<T = unknown>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, signal } = options

  const init: RequestInit = { method, headers: { accept: 'application/json', ...headers }, credentials: 'same-origin' }
  if (signal) init.signal = signal
  if (body !== undefined) {
    init.body = typeof body === 'string' || body instanceof FormData ? (body as BodyInit) : JSON.stringify(body)
    if (!(body instanceof FormData) && !('content-type' in headers) && !('Content-Type' in headers)) {
      init.headers = { ...init.headers, 'content-type': 'application/json' }
    }
  }

  let res: Response
  try {
    res = await fetch(path, init)
  } catch (cause) {
    // The gateway itself is unreachable — a different failure from the gateway reaching
    // SAP and failing, though both leave the user equally offline.
    setConnection('unreachable')
    throw new ApiError('Cannot reach the SLC gateway. Is it running?', 0, cause)
  }

  setConnection(res.status === 502 ? 'unreachable' : 'connected')

  const text = await res.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!res.ok) {
    throw new ApiError(extractMessage(data, res.statusText || `HTTP ${res.status}`), res.status, data)
  }

  return { data: data as T, status: res.status, headers: res.headers }
}

/** The common case: the body only. */
export async function apiFetch<T = unknown>(path: string, options?: RequestOptions): Promise<T> {
  return (await apiRequest<T>(path, options)).data
}
