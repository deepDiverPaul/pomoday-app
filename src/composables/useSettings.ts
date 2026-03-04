import { ref, watch } from 'vue'
import { useCrypto } from './useCrypto.ts'
import { useStore } from './useStore.ts'

export interface Settings {
  username: string
  password: string
  todayShown: boolean
}

const settingsDefault: Settings = {
  username: '',
  password: '',
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

    let password = readSettings.password ?? ''
    if (password) {
      try {
        password = decrypt(password) as string
      }
      catch (error) {
        console.warn('Failed to decrypt stored password:', error)
      }
    }

    settings.value = {
      ...settingsDefault,
      ...readSettings,
      password,
    }
  }

  const saveSettings = async () => {
    const encryptedPassword = settings.value.password
      ? encrypt(settings.value.password) as string
      : ''

    await setValue<Settings>('settings', {
      ...settings.value,
      password: encryptedPassword,
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
