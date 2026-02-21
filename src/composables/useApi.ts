import { fetch } from '@tauri-apps/plugin-http';

const BASE_URL = 'https://automation.deep-node.de/webhook';
const AUTH_HEADER = '';

export function useApi() {
  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}/${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': AUTH_HEADER,
      ...options.headers,
    };

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

  const post = (endpoint: string, body: any, options: RequestInit = {}) =>
    apiFetch(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });

  const put = (endpoint: string, body: any, options: RequestInit = {}) =>
    apiFetch(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });

  return {
    get,
    post,
    put,
    fetch: apiFetch,
  };
}
