import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { useAuthStore, SocialProvider } from '../../stores/authStore';

export default function SettingsScreen() {
  const { user, isGuest, logout, deleteAccount, linkSocialAccount, isLoading } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth');
          },
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '정말 탈퇴하시겠습니까?\n모든 학습 기록이 삭제됩니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '탈퇴하기',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              router.replace('/auth');
            } catch (err: any) {
              Alert.alert('오류', err?.message || '탈퇴 처리 중 오류가 발생했습니다.');
            }
          },
        },
      ],
    );
  };

  const handleLinkAccount = async (provider: SocialProvider) => {
    try {
      if (provider === 'apple') {
        if (Platform.OS !== 'ios') {
          Alert.alert('알림', 'Apple 로그인은 iOS에서만 사용 가능합니다.');
          return;
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
        await linkSocialAccount('apple', credential.identityToken!, credential.email, name);
      } else if (provider === 'google') {
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
        if (result.type !== 'success' || !result.url) return;

        const params = new URLSearchParams(result.url.split('#')[1] || '');
        const idToken = params.get('id_token');
        if (!idToken) throw new Error('Google 토큰을 받지 못했습니다.');

        const payload = JSON.parse(atob(idToken.split('.')[1]));
        await linkSocialAccount('google', idToken, payload.email, payload.name);
      } else if (provider === 'kakao') {
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
        if (result.type !== 'success' || !result.url) return;

        const url = new URL(result.url);
        const code = url.searchParams.get('code');
        if (!code) throw new Error('카카오 코드를 받지 못했습니다.');

        await linkSocialAccount('kakao', code);
      }

      Alert.alert('성공', '소셜 계정이 연동되었습니다.');
    } catch (err: any) {
      if (err?.code === 'ERR_REQUEST_CANCELED' || err?.code === 'ERR_CANCELED') return;
      Alert.alert('오류', err?.message || '계정 연동에 실패했습니다.');
    }
  };

  const showApple = Platform.OS === 'ios';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* User info */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Ionicons
              name={isGuest ? 'person-outline' : 'person'}
              size={28}
              color="#4F46E5"
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userEmail}>
              {isGuest ? '게스트' : user?.name || user?.email || '알 수 없음'}
            </Text>
            <Text style={styles.userStatus}>
              {isGuest
                ? '로그인하면 학습 기록이 저장됩니다'
                : user?.provider
                  ? `${user.provider.charAt(0).toUpperCase() + user.provider.slice(1)} 계정으로 로그인됨`
                  : '로그인됨'}
            </Text>
          </View>
        </View>

        {/* Guest: social account linking */}
        {isGuest && (
          <View style={styles.linkSection}>
            <Text style={styles.linkTitle}>소셜 계정 연동</Text>
            {showApple && (
              <TouchableOpacity
                style={styles.linkAppleButton}
                onPress={() => handleLinkAccount('apple')}
                activeOpacity={0.7}
              >
                <Text style={styles.linkAppleText}>Apple 계정 연동</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.linkGoogleButton}
              onPress={() => handleLinkAccount('google')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkGoogleText}>Google 계정 연동</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkKakaoButton}
              onPress={() => handleLinkAccount('kakao')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkKakaoText}>카카오 계정 연동</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Version */}
        <View style={styles.item}>
          <Text style={styles.label}>버전</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>

        {/* Logout button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>
            {isGuest ? '로그인 화면으로' : '로그아웃'}
          </Text>
        </TouchableOpacity>

        {/* Delete account button — only for logged-in users */}
        {!isGuest && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
            <Text style={styles.deleteText}>회원 탈퇴</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0EDFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    ...typography.bodyBold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  userStatus: {
    ...typography.caption,
    color: colors.text.hint,
  },
  // Social link section (for guests)
  linkSection: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  linkTitle: {
    ...typography.bodyBold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  linkAppleButton: {
    backgroundColor: '#000000',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  linkAppleText: {
    ...typography.button,
    color: '#FFFFFF',
  },
  linkGoogleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DADCE0',
  },
  linkGoogleText: {
    ...typography.button,
    color: '#1F1F1F',
  },
  linkKakaoButton: {
    backgroundColor: '#FEE500',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  linkKakaoText: {
    ...typography.button,
    color: '#191919',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  label: {
    ...typography.body,
    color: colors.text.primary,
  },
  value: {
    ...typography.body,
    color: colors.text.secondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginTop: 8,
  },
  logoutText: {
    ...typography.bodyBold,
    color: colors.error,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  deleteText: {
    ...typography.bodyBold,
    color: '#FFFFFF',
  },
});
