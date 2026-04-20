import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform, Switch, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { useAuthStore, SocialProvider } from '../../stores/authStore';
import {
  isPushEnabled,
  enablePushNotifications,
  disablePushNotifications,
  getReminderTime,
  scheduleDailyReminder,
} from '../../services/notifications';

const REMINDER_HOURS = [6, 7, 8, 9, 10, 11, 12, 18, 19, 20, 21];

export default function SettingsScreen() {
  const { user, isGuest, logout, deleteAccount, linkSocialAccount, isLoading } = useAuthStore();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState(9);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    isPushEnabled().then(setPushEnabled);
    getReminderTime().then(({ hour }) => setReminderHour(hour));
  }, []);

  const handleTogglePush = useCallback(async (value: boolean) => {
    if (value) {
      const success = await enablePushNotifications();
      if (!success && Platform.OS !== 'web') {
        Alert.alert('알림 권한', '설정에서 알림 권한을 허용해주세요.');
        return;
      }
      setPushEnabled(true);
    } else {
      await disablePushNotifications();
      setPushEnabled(false);
    }
  }, []);

  const handleChangeReminderTime = useCallback(async (hour: number) => {
    setReminderHour(hour);
    setShowTimePicker(false);
    if (pushEnabled) {
      await scheduleDailyReminder(hour, 0);
    }
  }, [pushEnabled]);

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

        {/* Push notification settings */}
        <View style={styles.notifSection}>
          <View style={styles.notifRow}>
            <View style={styles.notifLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.text.primary} />
              <Text style={styles.label}>푸시 알림</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={handleTogglePush}
              trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
              thumbColor={pushEnabled ? '#4F46E5' : '#F4F3F4'}
            />
          </View>
          {pushEnabled && (
            <>
              <View style={styles.notifDivider} />
              <TouchableOpacity
                style={styles.notifRow}
                onPress={() => setShowTimePicker(!showTimePicker)}
                activeOpacity={0.7}
              >
                <View style={styles.notifLeft}>
                  <Ionicons name="time-outline" size={20} color={colors.text.primary} />
                  <Text style={styles.label}>학습 리마인더</Text>
                </View>
                <View style={styles.timeDisplay}>
                  <Text style={styles.timeText}>
                    {reminderHour < 12
                      ? `오전 ${reminderHour}시`
                      : reminderHour === 12
                        ? '오후 12시'
                        : `오후 ${reminderHour - 12}시`}
                  </Text>
                  <Ionicons
                    name={showTimePicker ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={colors.text.hint}
                  />
                </View>
              </TouchableOpacity>
              {showTimePicker && (
                <View style={styles.timePickerWrap}>
                  {REMINDER_HOURS.map((h) => (
                    <TouchableOpacity
                      key={h}
                      style={[
                        styles.timeOption,
                        h === reminderHour && styles.timeOptionSelected,
                      ]}
                      onPress={() => handleChangeReminderTime(h)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.timeOptionText,
                          h === reminderHour && styles.timeOptionTextSelected,
                        ]}
                      >
                        {h < 12
                          ? `오전 ${h}시`
                          : h === 12
                            ? '오후 12시'
                            : `오후 ${h - 12}시`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        </View>

        {/* Version & Links */}
        <View style={styles.item}>
          <Text style={styles.label}>버전</Text>
          <Text style={styles.value}>1.1.0</Text>
        </View>

        <TouchableOpacity
          style={styles.item}
          onPress={() => Linking.openURL('https://ssuing-app-production.up.railway.app/privacy')}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.text.primary} />
            <Text style={styles.label}>개인정보 처리방침</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.text.hint} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => Linking.openURL('mailto:ssuing.app@gmail.com?subject=[쓰잉] 문의')}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="mail-outline" size={18} color={colors.text.primary} />
            <Text style={styles.label}>문의하기</Text>
          </View>
          <Text style={[styles.value, { fontSize: 12 }]}>ssuing.app@gmail.com</Text>
        </TouchableOpacity>

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
  // Notification section
  notifSection: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notifDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    ...typography.body,
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
  timePickerWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  timeOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  timeOptionSelected: {
    backgroundColor: '#4F46E5',
  },
  timeOptionText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  timeOptionTextSelected: {
    color: '#FFFFFF',
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
