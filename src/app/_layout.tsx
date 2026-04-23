import { useEffect, useState, useRef, useCallback } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StyleSheet, View, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { useAuthStore } from '../stores/authStore';

const ONBOARDING_KEY = 'onboarding_completed';
const TERMS_AGREED_KEY = 'terms_agreed';

const isWeb = Platform.OS === 'web';
const Wrapper = isWeb ? View : GestureHandlerRootView;

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loadToken, isReady, token, isGuest } = useAuthStore();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [termsAgreed, setTermsAgreed] = useState<boolean | null>(null);
  const splashHidden = useRef(false);
  const segments = useSegments();
  const router = useRouter();

  // AsyncStorage 플래그 읽기
  const refreshFlags = useCallback(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((v) => setOnboardingDone(v === 'true'));
    AsyncStorage.getItem(TERMS_AGREED_KEY).then((v) => setTermsAgreed(v === 'true'));
  }, []);

  // 초기 로딩
  useEffect(() => {
    loadToken();
    refreshFlags();
  }, []);

  // 세그먼트 변경 시 플래그 갱신
  const currentSegment = segments[0] ?? '';
  useEffect(() => {
    refreshFlags();
  }, [currentSegment]);

  // 라우팅 가드
  useEffect(() => {
    if (onboardingDone === null || termsAgreed === null || !isReady) return;

    const inOnboarding = currentSegment === 'onboarding';
    const inAuth = currentSegment === 'auth';
    const inTerms = currentSegment === 'terms';
    const isAuthenticated = !!token || isGuest;

    let didRoute = false;

    if (!onboardingDone && !inOnboarding && !inAuth && !inTerms) {
      router.replace('/onboarding');
      didRoute = true;
    } else if (onboardingDone) {
      if (!isAuthenticated && !inAuth && !inOnboarding) {
        router.replace('/auth');
        didRoute = true;
      } else if (isAuthenticated && !termsAgreed && !inTerms && !inAuth && !inOnboarding) {
        router.replace('/terms');
        didRoute = true;
      } else if (isAuthenticated && termsAgreed && (inAuth || inOnboarding || inTerms)) {
        router.replace('/(tabs)');
        didRoute = true;
      }
    }

    // 스플래시 숨김: 첫 라우팅 결정 후
    if (!splashHidden.current) {
      splashHidden.current = true;
      // 라우팅이 발생했으면 약간 대기 후 숨김 (화면 전환 완료 대기)
      const delay = didRoute ? 300 : 0;
      setTimeout(() => SplashScreen.hideAsync(), delay);
    }
  }, [token, isGuest, isReady, currentSegment, onboardingDone, termsAgreed]);

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
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="terms" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
