import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StyleSheet, View, Platform, ActivityIndicator } from 'react-native';
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

function useProtectedRoute(
  onboardingDone: boolean | null,
  termsAgreed: boolean | null,
  refreshFlags: () => void,
) {
  const { token, isGuest, isReady } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // 현재 최상위 세그먼트를 문자열로 변환해 안정적인 의존성으로 사용.
  // segments 배열 참조는 매 렌더마다 바뀔 수 있으므로 segments[0] 문자열로 비교한다.
  const currentSegment = segments[0] ?? '';

  // 세그먼트가 변경될 때마다 AsyncStorage에서 플래그를 다시 읽는다.
  // onboarding.tsx, auth.tsx, terms.tsx가 AsyncStorage를 직접 변경한 뒤
  // router.replace()로 화면을 전환하면, 세그먼트 변경이 이 effect를 트리거한다.
  // refreshFlags는 비동기로 state를 갱신하고, state 변경이 아래 라우팅 effect를
  // 다시 실행하므로 최신 플래그 기반으로 올바른 라우팅 결정을 내린다.
  useEffect(() => {
    refreshFlags();
  }, [currentSegment]);

  useEffect(() => {
    if (onboardingDone === null || termsAgreed === null || !isReady) return;

    const inOnboarding = segments[0] === 'onboarding';
    const inAuthScreen = segments[0] === 'auth';
    const inTermsScreen = segments[0] === 'terms';
    const isAuthenticated = !!token || isGuest;

    if (!onboardingDone && !inOnboarding && !inAuthScreen && !inTermsScreen) {
      router.replace('/onboarding');
      return;
    }

    if (onboardingDone) {
      if (!isAuthenticated && !inAuthScreen && !inOnboarding) {
        router.replace('/auth');
      } else if (isAuthenticated && !termsAgreed && !inTermsScreen && !inAuthScreen && !inOnboarding) {
        router.replace('/terms');
      } else if (isAuthenticated && termsAgreed && (inAuthScreen || inOnboarding || inTermsScreen)) {
        router.replace('/(tabs)');
      }
    }
  }, [token, isGuest, isReady, segments, onboardingDone, termsAgreed]);
}

export default function RootLayout() {
  const { loadToken, isReady } = useAuthStore();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [termsAgreed, setTermsAgreed] = useState<boolean | null>(null);

  // AsyncStorage에서 플래그를 다시 읽어 state를 갱신하는 함수.
  // onboarding.tsx, terms.tsx가 AsyncStorage를 직접 변경한 뒤
  // router.replace()로 화면이 바뀌면, segments 변경이 useProtectedRoute를
  // 재실행하고, 이때 refreshFlags로 최신 값을 반영한다.
  const refreshFlags = () => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      setOnboardingDone(value === 'true');
    });
    AsyncStorage.getItem(TERMS_AGREED_KEY).then((value) => {
      setTermsAgreed(value === 'true');
    });
  };

  useEffect(() => {
    loadToken();
    refreshFlags();
  }, []);

  // 모든 초기 데이터 로딩이 완료되면 스플래시 숨김
  const allReady = isReady && onboardingDone !== null && termsAgreed !== null;
  useEffect(() => {
    if (allReady) {
      // 최소 1초 대기 후 숨김 (너무 빠른 깜빡임 방지)
      const timer = setTimeout(() => SplashScreen.hideAsync(), 500);
      return () => clearTimeout(timer);
    }
  }, [allReady]);

  useProtectedRoute(onboardingDone, termsAgreed, refreshFlags);

  if (!allReady) {
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
        <Stack.Screen name="terms" options={{ headerShown: false, gestureEnabled: false }} />
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
