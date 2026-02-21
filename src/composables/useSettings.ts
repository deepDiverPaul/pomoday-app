import { ref, watch } from 'vue';
import { useStore } from './useStore.ts';
import { useCrypto } from './useCrypto.ts';

export type Settings = {
  username: string,
  password: string,
}

const settingsDefault: Settings = {
  username: '',
  password: '',
};

export function useSettings() {
  const { setValue, getValue } = useStore();
  const { encrypt, decrypt } = useCrypto();
  const settings = ref<Settings>({ ...settingsDefault });

  const loadSettings = async () => {
    const readSettings = await getValue<Settings>('settings');
    if (!readSettings) {
      settings.value = { ...settingsDefault };
      return;
    }

    let password = readSettings.password ?? '';
    if (password) {
      try {
        password = decrypt(password) as string;
      } catch (error) {
        console.warn('Failed to decrypt stored password:', error);
      }
    }

    settings.value = {
      username: readSettings.username ?? '',
      password,
    };
  };

  const saveSettings = async () => {
    const encryptedPassword = settings.value.password
      ? encrypt(settings.value.password) as string
      : '';

    await setValue<Settings>('settings', {
      username: settings.value.username,
      password: encryptedPassword,
    });
  };

  watch(settings, () => {
    void saveSettings();
  }, { deep: true });

  void loadSettings();

  return {
    settings,
    loadSettings,
  };
}
