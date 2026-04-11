import axios from 'axios';
import { Platform } from 'react-native';

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
};

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.remove();
    }
    const message =
      error.response?.data?.error?.message || '네트워크 오류가 발생했습니다.';
    return Promise.reject(new Error(message));
  },
);

export default api;
