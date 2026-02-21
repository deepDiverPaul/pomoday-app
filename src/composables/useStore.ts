import { load, type Store } from '@tauri-apps/plugin-store';
let storePromise: Promise<Store> | null = null;

function getStore(): Promise<Store> {
  if (!storePromise) {
    storePromise = load('store.json', {
      autoSave: false,
      defaults: {},
    });
  }
  return storePromise;
}

export function useStore() {
  const setValue = async <T>(key: string, value: T) => {
    console.log('setValue',key,value);
    const store = await getStore();
    await store.set(key, value);
    await store.save();
  };

  const getValue = async <T>(key: string) => {
    console.log('getValue',key);
    const store = await getStore();
    return store.get<T>(key);
  };

  return {
    setValue,
    getValue,
  };
}


