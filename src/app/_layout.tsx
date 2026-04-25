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
  const segments = useSegments();
  const router = useRouter();
  const splashHidden = useRef(false);
  const appStartTime = useRef(Date.now());
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [termsAgreed, setTermsAgreed] = useState<boolean | null>(null);

  const refreshFlags = useCallback(async () => {
    const [obVal, taVal] = await Promise.all([
      AsyncStorage.getItem(ONBOARDING_KEY),
      AsyncStorage.getItem(TERMS_AGREED_KEY),
    ]);
    setOnboardingDone(obVal === 'true');
    setTermsAgreed(taVal === 'true');
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

  // 라우팅 가드 — 보호만 담당 (각 화면의 성공 이동을 중복하지 않음)
  useEffect(() => {
    if (onboardingDone === null || termsAgreed === null || !isReady) return;

    const inOnboarding = currentSegment === 'onboarding';
    const inAuth = currentSegment === 'auth';
    const inTerms = currentSegment === 'terms';
    const isAuthenticated = !!token || isGuest;

    // 온보딩 미완료 → 온보딩으로
    if (!onboardingDone && !inOnboarding && !inAuth && !inTerms) {
      router.replace('/onboarding');
      hideSplash();
      return;
    }

    // 미인증 → 로그인으로
    if (onboardingDone && !isAuthenticated && !inAuth && !inOnboarding) {
      router.replace('/auth');
      hideSplash();
      return;
    }

    // 약관 미동의 → 약관으로
    if (onboardingDone && isAuthenticated && !termsAgreed && !inTerms && !inAuth && !inOnboarding) {
      router.replace('/terms');
      hideSplash();
      return;
    }

    // 이미 올바른 화면에 있음 → 스플래시만 숨김
    // 주의: auth/onboarding/terms에서 (tabs)로 보내는 것은 각 화면이 직접 처리
    // 여기서 중복 replace하면 이중 네비게이션(깜빡임) 발생
    hideSplash();
  }, [token, isGuest, isReady, currentSegment, onboardingDone, termsAgreed]);

  function hideSplash() {
    if (splashHidden.current) return;
    splashHidden.current = true;
    // 최소 800ms 스플래시 표시 (재시작 시 너무 짧은 깜빡임 방지)
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
