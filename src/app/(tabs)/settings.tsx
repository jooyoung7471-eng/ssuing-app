import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform, Switch, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, radius, shadows } from '../../constants/spacing';
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
        Alert.alert('\uC54C\uB9BC \uAD8C\uD55C', '\uC124\uC815\uC5D0\uC11C \uC54C\uB9BC \uAD8C\uD55C\uC744 \uD5C8\uC6A9\uD574\uC8FC\uC138\uC694.');
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
      '\uB85C\uADF8\uC544\uC6C3',
      '\uC815\uB9D0 \uB85C\uADF8\uC544\uC6C3 \uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?',
      [
        { text: '\uCDE8\uC18C', style: 'cancel' },
        {
          text: '\uB85C\uADF8\uC544\uC6C3',
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
      '\uD68C\uC6D0 \uD0C8\uD1F4',
      '\uC815\uB9D0 \uD0C8\uD1F4\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?\n\uBAA8\uB4E0 \uD559\uC2B5 \uAE30\uB85D\uC774 \uC0AD\uC81C\uB429\uB2C8\uB2E4.',
      [
        { text: '\uCDE8\uC18C', style: 'cancel' },
        {
          text: '\uD0C8\uD1F4\uD558\uAE30',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              router.replace('/auth');
            } catch (err: any) {
              Alert.alert('\uC624\uB958', err?.message || '\uD0C8\uD1F4 \uCC98\uB9AC \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.');
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
          Alert.alert('\uC54C\uB9BC', 'Apple \uB85C\uADF8\uC778\uC740 iOS\uC5D0\uC11C\uB9CC \uC0AC\uC6A9 \uAC00\uB2A5\uD569\uB2C8\uB2E4.');
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
        if (!idToken) throw new Error('Google \uD1A0\uD070\uC744 \uBC1B\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.');

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
        if (!code) throw new Error('\uCE74\uCE74\uC624 \uCF54\uB4DC\uB97C \uBC1B\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.');

        await linkSocialAccount('kakao', code);
      }

      Alert.alert('\uC131\uACF5', '\uC18C\uC15C \uACC4\uC815\uC774 \uC5F0\uB3D9\uB418\uC5C8\uC2B5\uB2C8\uB2E4.');
    } catch (err: any) {
      if (err?.code === 'ERR_REQUEST_CANCELED' || err?.code === 'ERR_CANCELED') return;
      Alert.alert('\uC624\uB958', err?.message || '\uACC4\uC815 \uC5F0\uB3D9\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.');
    }
  };

  const showApple = Platform.OS === 'ios';

  const formatHour = (h: number) =>
    h < 12
      ? `\uC624\uC804 ${h}\uC2DC`
      : h === 12
        ? '\uC624\uD6C4 12\uC2DC'
        : `\uC624\uD6C4 ${h - 12}\uC2DC`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <Text style={styles.screenTitle}>{'\uC124\uC815'}</Text>

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
              {isGuest ? '\uAC8C\uC2A4\uD2B8' : user?.name || user?.email || '\uC54C \uC218 \uC5C6\uC74C'}
            </Text>
            <Text style={styles.userStatus}>
              {isGuest
                ? '\uB85C\uADF8\uC778\uD558\uBA74 \uD559\uC2B5 \uAE30\uB85D\uC774 \uC800\uC7A5\uB429\uB2C8\uB2E4'
                : user?.provider
                  ? `${user.provider.charAt(0).toUpperCase() + user.provider.slice(1)} \uACC4\uC815\uC73C\uB85C \uB85C\uADF8\uC778\uB428`
                  : '\uB85C\uADF8\uC778\uB428'}
            </Text>
          </View>
          {!isGuest && user?.provider && (
            <View style={styles.providerBadge}>
              <Text style={styles.providerBadgeText}>
                {user.provider === 'kakao' ? '\uCE74\uCE74\uC624' : user.provider === 'apple' ? 'Apple' : 'Google'}
              </Text>
            </View>
          )}
        </View>

        {/* Guest: social account linking */}
        {isGuest && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{'\uACC4\uC815 \uC5F0\uB3D9'}</Text>
            <View style={styles.sectionCard}>
              {showApple && (
                <TouchableOpacity
                  style={styles.linkAppleButton}
                  onPress={() => handleLinkAccount('apple')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.linkAppleText}>Apple \uACC4\uC815 \uC5F0\uB3D9</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.linkGoogleButton}
                onPress={() => handleLinkAccount('google')}
                activeOpacity={0.7}
              >
                <Text style={styles.linkGoogleText}>Google \uACC4\uC815 \uC5F0\uB3D9</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linkKakaoButton}
                onPress={() => handleLinkAccount('kakao')}
                activeOpacity={0.7}
              >
                <Text style={styles.linkKakaoText}>{'\uCE74\uCE74\uC624 \uACC4\uC815 \uC5F0\uB3D9'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Notification Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'\uC54C\uB9BC'}</Text>
          <View style={styles.sectionCard}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowLabel}>{'\uD478\uC2DC \uC54C\uB9BC'}</Text>
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
                  <Text style={styles.rowLabel}>{'\uB9AC\uB9C8\uC778\uB354 \uC2DC\uAC04'}</Text>
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
          <Text style={styles.sectionTitle}>{'\uC815\uBCF4'}</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => Linking.openURL('https://ssuing-app-production.up.railway.app/privacy')}
              activeOpacity={0.7}
            >
              <Text style={styles.rowLabel}>{'\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68'}</Text>
              <Text style={styles.rowChevron}>{'\u203A'}</Text>
            </TouchableOpacity>
            <View style={styles.rowDivider} />
            <TouchableOpacity
              style={styles.row}
              onPress={() => Linking.openURL('mailto:ssuing.app@gmail.com?subject=[\uC4F0\uC789] \uBB38\uC758')}
              activeOpacity={0.7}
            >
              <Text style={styles.rowLabel}>{'\uBB38\uC758\uD558\uAE30'}</Text>
              <Text style={styles.rowChevron}>{'\u203A'}</Text>
            </TouchableOpacity>
            <View style={styles.rowDivider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{'\uBC84\uC804'}</Text>
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
              {isGuest ? '\uB85C\uADF8\uC778 \uD654\uBA74\uC73C\uB85C' : '\uB85C\uADF8\uC544\uC6C3'}
            </Text>
          </TouchableOpacity>

          {!isGuest && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text style={styles.deleteText}>{'\uD68C\uC6D0 \uD0C8\uD1F4'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
