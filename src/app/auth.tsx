import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius, shadows } from '../constants/spacing';
import { useAuthStore, SocialProvider } from '../stores/authStore';

const TERMS_AGREED_KEY = 'terms_agreed';

// Dark theme colors for this screen only
const DARK = {
  bg: '#1A1A2E',
  surface: '#2A2A3E',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',
};

export default function AuthScreen() {
  const [error, setError] = useState('');
  const { socialLogin, loginAsGuest, isLoading } = useAuthStore();

  const navigateAfterLogin = async () => {
    const agreed = await AsyncStorage.getItem(TERMS_AGREED_KEY);
    if (agreed === 'true') {
      router.replace('/(tabs)');
    } else {
      router.replace('/terms');
    }
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    setError('');
    try {
      if (provider === 'apple') {
        await handleAppleLogin();
      } else if (provider === 'google') {
        await handleGoogleLogin();
      } else if (provider === 'kakao') {
        await handleKakaoLogin();
      }
      await navigateAfterLogin();
    } catch (err: any) {
      // User cancellation -- don't show error
      if (err?.code === 'ERR_REQUEST_CANCELED' || err?.code === 'ERR_CANCELED') {
        return;
      }
      const msg = err?.message || '소셜 로그인에 실패했습니다.';
      setError(msg);
    }
  };

  const handleAppleLogin = async () => {
    if (Platform.OS === 'web') {
      throw new Error('Apple 로그인은 iOS에서만 사용 가능합니다.');
    }
    const AppleAuthentication = await import('expo-apple-authentication');
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    const name = credential.fullName
      ? [credential.fullName.familyName, credential.fullName.givenName].filter(Boolean).join('')
      : undefined;
    await socialLogin('apple', credential.identityToken!, credential.email, name);
  };

  const handleGoogleLogin = async () => {
    const AuthSession = await import('expo-auth-session');
    const WebBrowser = await import('expo-web-browser');
    const Crypto = await import('expo-crypto');

    WebBrowser.maybeCompleteAuthSession();

    const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '__GOOGLE_CLIENT_ID__';
    const redirectUri = AuthSession.makeRedirectUri({ scheme: 'ssuing' });

    const state = Crypto.randomUUID();
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=id_token` +
      `&scope=${encodeURIComponent('openid email profile')}` +
      `&state=${state}` +
      `&nonce=${Crypto.randomUUID()}`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type !== 'success' || !result.url) {
      const err = new Error('Google 로그인이 취소되었습니다.');
      (err as any).code = 'ERR_REQUEST_CANCELED';
      throw err;
    }

    // Extract id_token from the redirect URL fragment
    const params = new URLSearchParams(result.url.split('#')[1] || '');
    const idToken = params.get('id_token');
    if (!idToken) {
      throw new Error('Google 로그인 토큰을 받지 못했습니다.');
    }

    // Decode JWT payload to get email and name (no verification on client)
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    await socialLogin('google', idToken, payload.email, payload.name);
  };

  const handleKakaoLogin = async () => {
    const WebBrowser = await import('expo-web-browser');
    const AuthSession = await import('expo-auth-session');

    WebBrowser.maybeCompleteAuthSession();

    const KAKAO_CLIENT_ID = process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID || '__KAKAO_CLIENT_ID__';
    const redirectUri = AuthSession.makeRedirectUri({ scheme: 'ssuing' });

    const authUrl =
      `https://kauth.kakao.com/oauth/authorize?` +
      `client_id=${KAKAO_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type !== 'success' || !result.url) {
      const err = new Error('카카오 로그인이 취소되었습니다.');
      (err as any).code = 'ERR_REQUEST_CANCELED';
      throw err;
    }

    // Extract authorization code
    const url = new URL(result.url);
    const code = url.searchParams.get('code');
    if (!code) {
      throw new Error('카카오 로그인 코드를 받지 못했습니다.');
    }

    // Send the authorization code to our server
    await socialLogin('kakao', code);
  };

  const handleGuest = async () => {
    loginAsGuest();
    await navigateAfterLogin();
  };

  const showApple = true; // Show Apple login on all platforms

  return (
    <View style={styles.screen}>
      {/* Gradient header with curved bottom */}
      <LinearGradient
        colors={[colors.onboarding.purple, '#7C3AED', '#A78BFA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        {/* Decorative dots */}
        <View style={[styles.dot, { top: 40, right: 40, width: 12, height: 12 }]} />
        <View style={[styles.dot, { top: 80, left: 40, width: 6, height: 6, opacity: 0.5 }]} />
        <View style={[styles.dot, { top: 140, right: 60, width: 8, height: 8, opacity: 0.5 }]} />
      </LinearGradient>

      {/* Logo area (overlaps gradient) */}
      <View style={styles.logoArea}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoChar}>{'쓰'}</Text>
        </View>
        <Text style={styles.logoTitle}>{'쓰잉'}</Text>
        <Text style={styles.tagline}>{'매일의 영어 작문 습관'}</Text>
      </View>

      {/* Bottom social login buttons */}
      <View style={styles.bottomArea}>
        {/* Error message */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.onboarding.purple} />
            <Text style={styles.loadingText}>{'로그인 중...'}</Text>
          </View>
        ) : (
          <>
            {/* Apple Sign In */}
            {showApple && (
              <TouchableOpacity
                style={styles.appleButton}
                onPress={() => handleSocialLogin('apple')}
                activeOpacity={0.8}
              >
                <Text style={styles.appleIcon}>{''}</Text>
                <Text style={styles.appleButtonText}>Apple{'로 계속하기'}</Text>
              </TouchableOpacity>
            )}

            {/* Guest link */}
            <TouchableOpacity onPress={handleGuest} style={styles.guestButton}>
              <Text style={styles.guestText}>{'게스트로 둘러보기'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DARK.bg,
  },
  // Gradient header
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
  },
  dot: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    opacity: 0.7,
  },
  // Logo
  logoArea: {
    alignItems: 'center',
    paddingTop: 120,
  },
  logoIcon: {
    width: 92,
    height: 92,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  logoChar: {
    fontSize: 44,
    fontWeight: '900',
    color: colors.onboarding.purple,
    letterSpacing: -2,
  },
  logoTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1.2,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  // Bottom area
  bottomArea: {
    position: 'absolute',
    bottom: 28,
    left: 28,
    right: 28,
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  loadingText: {
    ...typography.body,
    color: DARK.textSecondary,
  },
  // Apple button
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: radius.sm,
    height: 50,
    marginBottom: 10,
    gap: 10,
  },
  appleIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  appleButtonText: {
    ...typography.button,
    color: '#FFFFFF',
  },
  // Google button
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.sm,
    height: 50,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4285F4',
  },
  googleButtonText: {
    ...typography.button,
    color: colors.text.primary,
  },
  // Kakao button
  kakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE500',
    borderRadius: radius.sm,
    height: 50,
    marginBottom: 10,
    gap: 10,
  },
  kakaoIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3A1D1D',
  },
  kakaoButtonText: {
    ...typography.button,
    color: '#3A1D1D',
  },
  // Guest
  guestButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  guestText: {
    ...typography.bodySmall,
    color: DARK.textSecondary,
    textDecorationLine: 'underline',
  },
});
