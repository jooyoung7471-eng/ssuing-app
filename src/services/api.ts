import axios from 'axios';
import { Platform } from 'react-native';

const DEVICE_ID_KEY = 'device_id';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const tokenStorage = {
  async get(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem('auth_token');
    }
    const SecureStore = await import('expo-secure-store');
    return SecureStore.getItemAsync('auth_token');
  },
  async set(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem('auth_token', token);
      return;
    }
    const SecureStore = await import('expo-secure-store');
    await SecureStore.setItemAsync('auth_token', token);
  },
  async remove(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem('auth_token');
      return;
    }
    const SecureStore = await import('expo-secure-store');
    await SecureStore.deleteItemAsync('auth_token');
  },
  async getDeviceId(): Promise<string> {
    if (Platform.OS === 'web') {
      let id = localStorage.getItem(DEVICE_ID_KEY);
      if (!id) {
        id = generateUUID();
        localStorage.setItem(DEVICE_ID_KEY, id);
      }
      return id;
    }
    const SecureStore = await import('expo-secure-store');
    let id = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    if (!id) {
      id = generateUUID();
      await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
    }
    return id;
  },
};

const api = axios.create({
  baseURL: 'https://ssuing-app-production.up.railway.app/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const deviceId = await tokenStorage.getDeviceId();
    config.headers['X-Device-Id'] = deviceId;
  } catch {
    // SecureStore unavailable, proceed without
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // BUG FIX: 토큰만 silently 지우면 authStore 메모리는 그대로라 사용자가
      // 자기도 모르게 게스트로 떨어져 진행률이 손실되는 문제가 있었다.
      // authStore도 함께 초기화하여 다음 라우팅에서 /auth로 리다이렉트되도록 한다.
      try {
        await tokenStorage.remove();
        const mod = await import('../stores/authStore');
        const setState = mod.useAuthStore.setState;
        setState({ token: null, user: null, isGuest: false });
      } catch {
        // best-effort: 실패해도 reject는 진행
      }
    }
    const message =
      error.response?.data?.error?.message || '네트워크 오류가 발생했습니다.';
    return Promise.reject(new Error(message));
  },
);

export default api;
