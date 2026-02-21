import { fetch } from '@tauri-apps/plugin-http';
import { useStore } from './useStore.ts';
import { useCrypto } from './useCrypto.ts';

const BASE_URL = 'https://automation.deep-node.de/webhook';

type Settings = {
  username: string;
  password: string;
};

async function buildAuthHeader(): Promise<string | undefined> {
  const {decrypt} = useCrypto();
  const { getValue } = useStore();
  const settings = await getValue<Settings>('settings');
  if (!settings) return undefined;
  let {username, password} = settings;
  password = decrypt(password) as string;

  if (username && password) {
    const token = btoa(`${username}:${password}`);
    return `Basic ${token}`;
  }
  return undefined;
}

export function useApi() {
  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}/${endpoint}`;

    const authHeader = await buildAuthHeader();
    console.log('authHeader',authHeader);
    const headers = {
      'Content-Type': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...options.headers,
    } as Record<string, string>;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response;
  };

  const get = (endpoint: string, options: RequestInit = {}) =>
    apiFetch(endpoint, { ...options, method: 'GET' });

  const post = (endpoint: string, body: unknown, options: RequestInit = {}) =>
    apiFetch(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });

  const put = (endpoint: string, body: unknown, options: RequestInit = {}) =>
    apiFetch(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });

  return {
    get,
    post,
    put,
    fetch: apiFetch,
  };
}
