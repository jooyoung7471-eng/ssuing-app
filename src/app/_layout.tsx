import { useEffect, useState, useRef, useCallback } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StyleSheet, View, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';

const ONBOARDING_KEY = 'onboarding_completed';
const TERMS_AGREED_KEY = 'terms_agreed';

const isWeb = Platform.OS === 'web';
const Wrapper = isWeb ? View : GestureHandlerRootView;

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loadToken, isReady, token, isGuest } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const splashHidden = useRef(false);
  const appStartTime = useRef(Date.now());
  const initialRouted = useRef(false);
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [termsAgreed, setTermsAgreed] = useState<boolean | null>(null);

  const initializeSubscription = useSubscriptionStore((s) => s.initialize);

  // 초기 로딩 (1회만)
  useEffect(() => {
    (async () => {
      await loadToken();
      const [obVal, taVal] = await Promise.all([
        AsyncStorage.getItem(ONBOARDING_KEY),
        AsyncStorage.getItem(TERMS_AGREED_KEY),
      ]);
      setOnboardingDone(obVal === 'true');
      setTermsAgreed(taVal === 'true');

      // 구독 상태 ��기화
      initializeSubscription();
    })();
  }, []);

  // 라우팅 가드 — 앱 시작 시 1회만 올바른 화면으로 이동
  useEffect(() => {
    if (onboardingDone === null || termsAgreed === null || !isReady) return;
    if (initialRouted.current) return; // 이미 초기 라우팅 완료
    initialRouted.current = true;

    const isAuthenticated = !!token || isGuest;

    if (!onboardingDone) {
      router.replace('/onboarding');
    } else if (!isAuthenticated) {
      router.replace('/auth');
    } else if (!termsAgreed) {
      router.replace('/terms');
    }
    // 이미 인증+동의 완료면 기본 라우트 (tabs)에 그대로 있음

    hideSplash();
  }, [onboardingDone, termsAgreed, isReady, token, isGuest]);

  function hideSplash() {
    if (splashHidden.current) return;
    splashHidden.current = true;
    const elapsed = Date.now() - appStartTime.current;
    const delay = Math.max(0, 800 - elapsed);
    setTimeout(() => SplashScreen.hideAsync(), delay);
  }

  // Stack은 항상 렌더 (expo-router hooks 동작 필수)
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
        <Stack.Screen name="auth" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="terms" options={{ headerShown: false, gestureEnabled: false, animation: 'none' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="practice/[theme]" options={{ headerShown: false }} />
        <Stack.Screen name="history/[id]" options={{ headerTitle: '학습 상세', headerBackTitle: '돌아가기' }} />
        <Stack.Screen name="achievements" options={{ headerTitle: '업적', headerBackTitle: '돌아가기' }} />
        <Stack.Screen name="weekly" options={{ headerTitle: '주간 리포트', headerBackTitle: '돌아가기' }} />
        <Stack.Screen name="review" options={{ headerTitle: '오답 복습', headerBackTitle: '돌아가기' }} />
      </Stack>
    </Wrapper>
  );

  if (!isWeb) return content;

  return (
    <View style={styles.webOuter}>
      <View style={styles.webFrame}>{content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  webOuter: { flex: 1, backgroundColor: '#1A1A2E', alignItems: 'center' },
  webFrame: {
    flex: 1, width: '100%', maxWidth: 430, backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 10, overflow: 'hidden',
  },
});
