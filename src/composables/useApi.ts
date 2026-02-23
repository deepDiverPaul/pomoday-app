import { useCrypto } from './useCrypto.ts'
import { useStore } from './useStore.ts'

const BASE_URL = 'https://automation.deep-node.de/webhook'

interface Settings {
  username: string
  password: string
}

function isTauri() {
  return typeof window !== 'undefined' && Boolean((window as typeof window & { __TAURI__?: unknown }).__TAURI__)
}

async function buildAuthHeader(): Promise<string | undefined> {
  const { decrypt } = useCrypto()
  const { getValue } = useStore()
  const settings = await getValue<Settings>('settings')
  if (!settings)
    return undefined
  let { username, password } = settings
  password = decrypt(password) as string

  if (username && password) {
    const token = btoa(`${username}:${password}`)
    return `Basic ${token}`
  }
  return undefined
}

export function useApi() {
  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}/${endpoint}`

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

  const put = (endpoint: string, body: unknown, options: RequestInit = {}) =>
    apiFetch(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) })

  return {
    get,
    post,
    put,
    fetch: apiFetch,
  }
}
