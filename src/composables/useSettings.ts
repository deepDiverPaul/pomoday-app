import { ref, watch } from 'vue'
import { useCrypto } from './useCrypto.ts'
import { useStore } from './useStore.ts'

export interface Settings {
  accessKey: string
  todayShown: boolean
}

const settingsDefault: Settings = {
  accessKey: '',
  todayShown: false,
}
const settings = ref<Settings>({ ...settingsDefault })

export function useSettings() {
  const { setValue, getValue } = useStore()
  const { encrypt, decrypt } = useCrypto()

  const loadSettings = async () => {
    const readSettings = await getValue<Settings>('settings')
    if (!readSettings) {
      settings.value = { ...settingsDefault }
      return
    }

    let accessKey = readSettings.accessKey ?? ''
    if (accessKey) {
      try {
        accessKey = decrypt(accessKey) as string
      }
      catch (error) {
        console.warn('Failed to decrypt stored accessKey:', error)
      }
    }

    settings.value = {
      ...settingsDefault,
      ...readSettings,
      accessKey,
    }
  }

  const saveSettings = async () => {
    const encryptedPassword = settings.value.accessKey
      ? encrypt(settings.value.accessKey) as string
      : ''

    await setValue<Settings>('settings', {
      ...settings.value,
      accessKey: encryptedPassword,
    })
  }

  watch(settings, () => {
    void saveSettings()
  }, { deep: true })

  void loadSettings()

  return {
    settings,
    loadSettings,
  }
}
