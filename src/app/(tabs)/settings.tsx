import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { useAuthStore } from '../../stores/authStore';

export default function SettingsScreen() {
  const { user, isGuest, logout } = useAuthStore();

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
              {isGuest ? '게스트' : user?.email ?? '알 수 없음'}
            </Text>
            <Text style={styles.userStatus}>
              {isGuest ? '로그인하면 학습 기록이 저장됩니다' : '로그인됨'}
            </Text>
          </View>
        </View>

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
});
