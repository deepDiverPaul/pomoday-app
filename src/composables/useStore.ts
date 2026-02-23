import type { Store } from '@tauri-apps/plugin-store'

let storePromise: Promise<Store> | null = null

function isTauri() {
  return typeof window !== 'undefined' && Boolean((window as typeof window & { __TAURI__?: unknown }).__TAURI__)
}

async function getStore(): Promise<Store> {
  if (!storePromise) {
    const { load } = await import('@tauri-apps/plugin-store')
    storePromise = load('store.json', {
      autoSave: false,
      defaults: {},
    })
  }
  return storePromise
}

export function useStore() {
  const setValue = async <T>(key: string, value: T) => {
    if (isTauri()) {
      const store = await getStore()
      await store.set(key, value)
      await store.save()
      return
    }
    localStorage.setItem(key, JSON.stringify(value))
  }

  const getValue = async <T>(key: string) => {
    if (isTauri()) {
      const store = await getStore()
      return store.get<T>(key)
    }
    const rawValue = localStorage.getItem(key)
    if (rawValue === null)
      return null
    try {
      return JSON.parse(rawValue) as T
    }
    catch {
      return null
    }
  }

  return {
    setValue,
    getValue,
  }
}
