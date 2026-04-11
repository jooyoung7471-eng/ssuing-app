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
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { useAuthStore, SocialProvider } from '../stores/authStore';

export default function AuthScreen() {
  const [error, setError] = useState('');
  const { socialLogin, loginAsGuest, isLoading } = useAuthStore();

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
      router.replace('/(tabs)');
    } catch (err: any) {
      // User cancellation — don't show error
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
    // The server would exchange this for an access token and get user info
    // For now, we send the code as the token
    await socialLogin('kakao', code);
  };

  const handleGuest = () => {
    loginAsGuest();
    router.replace('/(tabs)');
  };

  const showApple = Platform.OS === 'ios';

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header gradient */}
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.logo}>쓰잉</Text>
        <Text style={styles.subtitle}>매일 영어 작문 습관</Text>
      </LinearGradient>

      {/* Social login area */}
      <View style={styles.formArea}>
        <Text style={styles.sectionTitle}>시작하기</Text>

        {/* Error message */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>로그인 중...</Text>
          </View>
        ) : (
          <>
            {/* Apple Sign In — iOS only */}
            {showApple && (
              <TouchableOpacity
                style={styles.appleButton}
                onPress={() => handleSocialLogin('apple')}
                activeOpacity={0.8}
              >
                <Text style={styles.appleIcon}>{'\uF8FF'}</Text>
                <Text style={styles.appleButtonText}>Apple로 계속하기</Text>
              </TouchableOpacity>
            )}

            {/* Google Sign In */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={() => handleSocialLogin('google')}
              activeOpacity={0.8}
            >
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>Google로 계속하기</Text>
            </TouchableOpacity>

            {/* Kakao Sign In */}
            <TouchableOpacity
              style={styles.kakaoButton}
              onPress={() => handleSocialLogin('kakao')}
              activeOpacity={0.8}
            >
              <Text style={styles.kakaoIcon}>K</Text>
              <Text style={styles.kakaoButtonText}>카카오로 계속하기</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Guest link */}
            <TouchableOpacity onPress={handleGuest} style={styles.guestButton}>
              <Text style={styles.guestText}>게스트로 시작하기</Text>
            </TouchableOpacity>

            <Text style={styles.guestNote}>
              게스트 모드에서는 학습 기록이 기기에만 저장됩니다.{'\n'}
              나중에 설정에서 소셜 계정을 연동할 수 있습니다.
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 48,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logo: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.85)',
  },
  formArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.text.primary,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorBox: {
    backgroundColor: colors.errorLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  // Apple button
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 14,
    height: 52,
    marginBottom: 12,
    gap: 10,
  },
  appleIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  appleButtonText: {
    ...typography.button,
    color: '#FFFFFF',
    fontSize: 16,
  },
  // Google button
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 52,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DADCE0',
    gap: 10,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4285F4',
  },
  googleButtonText: {
    ...typography.button,
    color: '#1F1F1F',
    fontSize: 16,
  },
  // Kakao button
  kakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE500',
    borderRadius: 14,
    height: 52,
    marginBottom: 16,
    gap: 10,
  },
  kakaoIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#191919',
  },
  kakaoButtonText: {
    ...typography.button,
    color: '#191919',
    fontSize: 16,
  },
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.text.hint,
    marginHorizontal: 16,
  },
  // Guest
  guestButton: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  guestText: {
    ...typography.button,
    color: colors.text.secondary,
    fontSize: 16,
  },
  guestNote: {
    ...typography.caption,
    color: colors.text.hint,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 32,
  },
});
