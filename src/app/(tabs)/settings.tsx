import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform, Switch, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, radius, shadows } from '../../constants/spacing';
import { useAuthStore, SocialProvider } from '../../stores/authStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import PaywallModal from '../../components/PaywallModal';
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
  const { plan, isPremium, trialDaysLeft, expirationDate, willRenew, restore } = useSubscriptionStore();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState(9);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

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

  const formatHour = (h: number) =>
    h < 12
      ? `오전 ${h}시`
      : h === 12
        ? '오후 12시'
        : `오후 ${h - 12}시`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <Text style={styles.screenTitle}>{'설정'}</Text>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Ionicons
              name={isGuest ? 'person-outline' : 'person'}
              size={24}
              color={colors.primary}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
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
          {!isGuest && user?.provider && (
            <View style={styles.providerBadge}>
              <Text style={styles.providerBadgeText}>
                {user.provider === 'kakao' ? '카카오' : user.provider === 'apple' ? 'Apple' : 'Google'}
              </Text>
            </View>
          )}
        </View>

        {/* Premium Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'구독'}</Text>
          <View style={styles.sectionCard}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowLabel}>{'구독 상태'}</Text>
              </View>
              <View style={[
                styles.providerBadge,
                {
                  backgroundColor: isPremium ? colors.primaryLight : colors.surfaceAlt,
                  borderColor: isPremium ? colors.primary + '30' : colors.border,
                },
              ]}>
                <Text style={[
                  styles.providerBadgeText,
                  { color: isPremium ? colors.primary : colors.text.secondary },
                ]}>
                  {plan === 'premium' ? 'Premium' : plan === 'trial' ? `\uCCB4\uD5D8 (${trialDaysLeft}\uC77C)` : 'Free'}
                </Text>
              </View>
            </View>
            {plan === 'premium' && expirationDate && (
              <>
                <View style={styles.rowDivider} />
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>{'갱신일'}</Text>
                  <Text style={styles.rowValue}>
                    {new Date(expirationDate).toLocaleDateString('ko-KR')}
                  </Text>
                </View>
                <View style={styles.rowDivider} />
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>{'자동 갱신'}</Text>
                  <Text style={styles.rowValue}>{willRenew ? '켜짐' : '꺼짐'}</Text>
                </View>
              </>
            )}
            {!isPremium && (
              <>
                <View style={styles.rowDivider} />
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => setShowPaywall(true)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.rowLabel, { color: colors.primary, fontWeight: '700' }]}>
                    {'Premium \uC73C\uB85C \uC5C5\uADF8\uB808\uC774\uB4DC'}
                  </Text>
                  <Text style={styles.rowChevron}>{'›'}</Text>
                </TouchableOpacity>
              </>
            )}
            <View style={styles.rowDivider} />
            <TouchableOpacity
              style={styles.row}
              onPress={async () => {
                const result = await restore();
                if (result.isPremium) {
                  Alert.alert('\uBCF5\uC6D0 \uC644\uB8CC', '\uAD6C\uB3C5\uC774 \uBCF5\uC6D0\uB418\uC5C8\uC2B5\uB2C8\uB2E4.');
                } else {
                  Alert.alert('\uBCF5\uC6D0 \uACB0\uACFC', '\uD65C\uC131\uD654\uB41C \uAD6C\uB3C5\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.');
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.rowLabel}>{'구매 복원'}</Text>
              <Text style={styles.rowChevron}>{'›'}</Text>
            </TouchableOpacity>
            {plan === 'premium' && (
              <>
                <View style={styles.rowDivider} />
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      Linking.openURL('https://apps.apple.com/account/subscriptions');
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.rowLabel}>{'구독 관리'}</Text>
                  <Text style={styles.rowChevron}>{'›'}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Guest: social account linking */}
        {isGuest && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{'계정 연동'}</Text>
            <View style={styles.sectionCard}>
              {showApple && (
                <TouchableOpacity
                  style={styles.linkAppleButton}
                  onPress={() => handleLinkAccount('apple')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.linkAppleText}>Apple 계정 연동</Text>
                </TouchableOpacity>
              )}
              {/* Google/카카오는 추후 지원 예정 */}
            </View>
          </View>
        )}

        {/* Notification Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'알림'}</Text>
          <View style={styles.sectionCard}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowLabel}>{'푸시 알림'}</Text>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={handleTogglePush}
                trackColor={{ false: colors.disabled, true: colors.primary + '40' }}
                thumbColor={pushEnabled ? colors.primary : '#F4F3F4'}
              />
            </View>
            {pushEnabled && (
              <>
                <View style={styles.rowDivider} />
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => setShowTimePicker(!showTimePicker)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.rowLabel}>{'리마인더 시간'}</Text>
                  <View style={styles.timeDisplay}>
                    <Text style={styles.timeText}>{formatHour(reminderHour)}</Text>
                    <Ionicons
                      name={showTimePicker ? 'chevron-up' : 'chevron-down'}
                      size={14}
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
                          {formatHour(h)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'정보'}</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => Linking.openURL('https://ssuing-app-production.up.railway.app/privacy')}
              activeOpacity={0.7}
            >
              <Text style={styles.rowLabel}>{'개인정보처리방침'}</Text>
              <Text style={styles.rowChevron}>{'›'}</Text>
            </TouchableOpacity>
            <View style={styles.rowDivider} />
            <TouchableOpacity
              style={styles.row}
              onPress={() => Linking.openURL('mailto:ssuing.app@gmail.com?subject=[쓰잉] 문의')}
              activeOpacity={0.7}
            >
              <Text style={styles.rowLabel}>{'문의하기'}</Text>
              <Text style={styles.rowChevron}>{'›'}</Text>
            </TouchableOpacity>
            <View style={styles.rowDivider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{'버전'}</Text>
              <Text style={styles.rowValue}>1.1.0</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>
              {isGuest ? '로그인 화면으로' : '로그아웃'}
            </Text>
          </TouchableOpacity>

          {!isGuest && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text style={styles.deleteText}>{'회원 탈퇴'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="settings"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: 40,
  },
  screenTitle: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },

  // User Card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.body,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 2,
  },
  userStatus: {
    ...typography.caption,
    color: colors.text.hint,
  },
  providerBadge: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  providerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.text.secondary,
  },

  // Section
  section: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingLeft: 4,
    marginBottom: 6,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowLabel: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  rowValue: {
    ...typography.bodySmall,
    color: colors.text.hint,
  },
  rowChevron: {
    color: colors.text.hint,
    fontSize: 16,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 14,
  },

  // Time picker
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  timePickerWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
  },
  timeOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
  },
  timeOptionSelected: {
    backgroundColor: colors.primary,
  },
  timeOptionText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  timeOptionTextSelected: {
    color: '#FFFFFF',
  },

  // Social link buttons
  linkAppleButton: {
    backgroundColor: '#000000',
    borderRadius: radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    margin: 14,
    marginBottom: 0,
  },
  linkAppleText: {
    ...typography.button,
    color: '#FFFFFF',
  },
  linkGoogleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DADCE0',
    marginHorizontal: 14,
    marginTop: 10,
  },
  linkGoogleText: {
    ...typography.button,
    color: '#1F1F1F',
  },
  linkKakaoButton: {
    backgroundColor: '#FEE500',
    borderRadius: radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    margin: 14,
    marginTop: 10,
  },
  linkKakaoText: {
    ...typography.button,
    color: '#191919',
  },

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.xs,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.error + '30',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.error,
  },
});
