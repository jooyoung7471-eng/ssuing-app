import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StyleSheet, View, Platform, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { useAuthStore } from '../stores/authStore';

const ONBOARDING_KEY = 'onboarding_completed';

const isWeb = Platform.OS === 'web';

// Web doesn't need GestureHandlerRootView — it causes crashes
let Wrapper: React.ComponentType<{ style?: any; children?: React.ReactNode }> = View;
if (!isWeb) {
  try {
    const { GestureHandlerRootView } = require('react-native-gesture-handler');
    Wrapper = GestureHandlerRootView;
  } catch {
    // fallback to View
  }
}

function useProtectedRoute(onboardingDone: boolean | null) {
  const { token, isGuest, isReady } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait until both onboarding check and auth are ready
    if (onboardingDone === null || !isReady) return;

    const inOnboarding = segments[0] === 'onboarding';
    const inAuthScreen = segments[0] === 'auth';
    const isAuthenticated = !!token || isGuest;

    // Step 1: onboarding not done yet → go to onboarding
    if (!onboardingDone && !inOnboarding) {
      router.replace('/onboarding');
      return;
    }

    // Step 2: onboarding done → normal auth flow
    if (onboardingDone) {
      if (!isAuthenticated && !inAuthScreen && !inOnboarding) {
        router.replace('/auth');
      } else if (isAuthenticated && (inAuthScreen || inOnboarding)) {
        router.replace('/(tabs)');
      }
    }
  }, [token, isGuest, isReady, segments, onboardingDone]);
}

export default function RootLayout() {
  const { loadToken, isReady } = useAuthStore();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    loadToken();
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      setOnboardingDone(value === 'true');
    });
  }, []);

  useProtectedRoute(onboardingDone);

  if (!isReady || onboardingDone === null) {
    const loading = (
      <View style={[styles.root, styles.loading]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );

    if (!isWeb) return loading;
    return (
      <View style={styles.webOuter}>
        <View style={styles.webFrame}>{loading}</View>
      </View>
    );
  }

  const content = (
    <Wrapper style={styles.root}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text.primary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="practice/[theme]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="history/[id]"
          options={{
            headerTitle: '학습 상세',
            headerBackTitle: '돌아가기',
          }}
        />
        <Stack.Screen
          name="achievements"
          options={{
            headerTitle: '업적',
            headerBackTitle: '돌아가기',
          }}
        />
        <Stack.Screen
          name="weekly"
          options={{
            headerTitle: '주간 리포트',
            headerBackTitle: '돌아가기',
          }}
        />
        <Stack.Screen
          name="review"
          options={{
            headerTitle: '오답 복습',
            headerBackTitle: '돌아가기',
          }}
        />
      </Stack>
    </Wrapper>
  );

  if (!isWeb) return content;

  return (
    <View style={styles.webOuter}>
      <View style={styles.webFrame}>
        {content}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  webOuter: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
  },
  webFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
});
