import type { Settings } from './useSettings.ts'
import { useCrypto } from './useCrypto.ts'
import { useStore } from './useStore.ts'

const BASE_URL = import.meta.env.VITE_API_URL

function isTauri() {
  return typeof window !== 'undefined' && Boolean((window as typeof window & { __TAURI__?: unknown }).__TAURI__)
}

async function buildAuthHeader(): Promise<string | undefined> {
  const { decrypt } = useCrypto()
  const { getValue } = useStore()
  const settings = await getValue<Settings>('settings')
  if (!settings)
    return undefined
  let { accessKey } = settings
  accessKey = decrypt(accessKey) as string

  if (accessKey) {
    return `Bearer ${accessKey}`
  }
  return undefined
}

export function useApi() {
  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`

    const authHeader = await buildAuthHeader()
    const headers = {
      'Content-Type': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...options.headers,
    } as Record<string, string>

    const response = isTauri()
      ? await (await import('@tauri-apps/plugin-http')).fetch(url, {
          ...options,
          headers,
        })
      : await fetch(url, {
          ...options,
          headers,
        })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`)
    }

    return response
  }

  const get = (endpoint: string, options: RequestInit = {}) =>
    apiFetch(endpoint, { ...options, method: 'GET' })

  const post = (endpoint: string, body: unknown, options: RequestInit = {}) =>
    apiFetch(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) })

  const patch = (endpoint: string, body: unknown, options: RequestInit = {}) =>
    apiFetch(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) })

  const delete_ = (endpoint: string, body: unknown, options: RequestInit = {}) =>
    apiFetch(endpoint, { ...options, method: 'DELETE', body: JSON.stringify(body) })

  return {
    get,
    post,
    patch,
    delete: delete_,
    fetch: apiFetch,
  }
}
