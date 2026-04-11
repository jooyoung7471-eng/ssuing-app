import { create } from 'zustand';
import { Platform } from 'react-native';
import api from '../services/api';

export type SocialProvider = 'apple' | 'google' | 'kakao';

interface User {
  id: string;
  email: string;
  name?: string;
  provider?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  isReady: boolean;

  socialLogin: (provider: SocialProvider, token: string, email?: string | null, name?: string | null) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  linkSocialAccount: (provider: SocialProvider, token: string, email?: string | null, name?: string | null) => Promise<void>;
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
  async getUser(): Promise<User | null> {
    if (Platform.OS === 'web') {
      const raw = localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) : null;
    }
    const SecureStore = await import('expo-secure-store');
    const raw = await SecureStore.getItemAsync('auth_user');
    return raw ? JSON.parse(raw) : null;
  },
  async setUser(user: User): Promise<void> {
    const raw = JSON.stringify(user);
    if (Platform.OS === 'web') {
      localStorage.setItem('auth_user', raw);
      return;
    }
    const SecureStore = await import('expo-secure-store');
    await SecureStore.setItemAsync('auth_user', raw);
  },
  async removeUser(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem('auth_user');
      return;
    }
    const SecureStore = await import('expo-secure-store');
    await SecureStore.deleteItemAsync('auth_user');
  },
  async getIsGuest(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return localStorage.getItem('auth_is_guest') === 'true';
    }
    const SecureStore = await import('expo-secure-store');
    const val = await SecureStore.getItemAsync('auth_is_guest');
    return val === 'true';
  },
  async setIsGuest(isGuest: boolean): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem('auth_is_guest', String(isGuest));
      return;
    }
    const SecureStore = await import('expo-secure-store');
    await SecureStore.setItemAsync('auth_is_guest', String(isGuest));
  },
  async removeIsGuest(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem('auth_is_guest');
      return;
    }
    const SecureStore = await import('expo-secure-store');
    await SecureStore.deleteItemAsync('auth_is_guest');
  },
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isGuest: false,
  isLoading: false,
  isReady: false,

  socialLogin: async (provider: SocialProvider, socialToken: string, email?: string | null, name?: string | null) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/social', {
        provider,
        token: socialToken,
        email: email || undefined,
        name: name || undefined,
      });
      const user: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        provider: data.provider,
      };
      await tokenStorage.set(data.token);
      await tokenStorage.setUser(user);
      await tokenStorage.removeIsGuest();
      set({ token: data.token, user, isGuest: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loginAsGuest: () => {
    tokenStorage.setIsGuest(true);
    set({ token: null, user: null, isGuest: true });
  },

  logout: async () => {
    await tokenStorage.remove();
    await tokenStorage.removeUser();
    await tokenStorage.removeIsGuest();
    set({ token: null, user: null, isGuest: false });
  },

  loadToken: async () => {
    try {
      const [token, user, isGuest] = await Promise.all([
        tokenStorage.get(),
        tokenStorage.getUser(),
        tokenStorage.getIsGuest(),
      ]);
      set({ token, user, isGuest, isReady: true });
    } catch {
      set({ isReady: true });
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true });
    try {
      await api.delete('/auth/account');
      await tokenStorage.remove();
      await tokenStorage.removeUser();
      await tokenStorage.removeIsGuest();
      set({ token: null, user: null, isGuest: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  linkSocialAccount: async (provider: SocialProvider, socialToken: string, email?: string | null, name?: string | null) => {
    // Same as socialLogin — the server will link the social account to the existing user by email
    const { socialLogin } = get();
    await socialLogin(provider, socialToken, email, name);
  },
}));
