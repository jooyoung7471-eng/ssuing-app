/**
 * PremiumBadge - 프리미엄 관련 UI 컴포넌트 모음
 * - PremiumBadge: 기본 PRO 배지
 * - UpgradeBanner: 홈 화면 업그레이드 배너 (Free / Trial 2종)
 * - LockedThemeOverlay: 테마 카드 잠금 오버레이
 */
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import { radius } from '../constants/spacing';
import { SubscriptionConfig } from '../stores/subscriptionStore';

// ─── PremiumBadge (기본 배지) ───

interface PremiumBadgeProps {
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export default function PremiumBadge({ size = 'small', style }: PremiumBadgeProps) {
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        isSmall ? styles.badgeSmall : styles.badgeMedium,
        style,
      ]}
    >
      <Ionicons
        name="lock-closed"
        size={isSmall ? 10 : 14}
        color={colors.primary}
      />
      {!isSmall && <Text style={styles.badgeText}>PRO</Text>}
    </View>
  );
}

// ─── UpgradeBanner (홈 화면 배너) ───

interface UpgradeBannerProps {
  variant: 'free' | 'trial';
  trialDaysLeft?: number;
  onPress: () => void;
  style?: ViewStyle;
}

export function UpgradeBanner({ variant, trialDaysLeft = 0, onPress, style }: UpgradeBannerProps) {
  const isTrial = variant === 'trial';

  return (
    <TouchableOpacity
      style={[
        styles.bannerContainer,
        { backgroundColor: isTrial ? '#FEF3DC' : '#E8F1FB' },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* 아이콘 */}
      <View
        style={[
          styles.bannerIcon,
          {
            backgroundColor: isTrial
              ? 'rgba(245,158,11,0.18)'
              : 'rgba(74,144,217,0.18)',
          },
        ]}
      >
        <Ionicons
          name={isTrial ? 'hourglass-outline' : 'star'}
          size={20}
          color={isTrial ? '#F59E0B' : '#4A90D9'}
        />
      </View>

      {/* 텍스트 */}
      <View style={styles.bannerTextWrap}>
        <Text
          style={[
            styles.bannerTitle,
            { color: isTrial ? '#92400E' : '#2E6DB3' },
          ]}
        >
          {isTrial
            ? SubscriptionConfig.trialBannerText(trialDaysLeft)
            : 'Premium으로 업그레이드'}
        </Text>
        <Text
          style={[
            styles.bannerSubtitle,
            { color: isTrial ? '#B45309' : '#4A90D9' },
          ]}
        >
          {isTrial
            ? '지금 구독 확정하고 끊김 없이 사용'
            : '모든 테마 & 무제한 작문'}
        </Text>
      </View>

      {/* Chevron */}
      <Ionicons
        name="chevron-forward"
        size={18}
        color={isTrial ? '#B45309' : '#4A90D9'}
      />
    </TouchableOpacity>
  );
}

// ─── LockedThemeOverlay (테마 카드 잠금) ───

interface LockedThemeOverlayProps {
  onPress?: () => void;
}

export function LockedThemeOverlay({ onPress }: LockedThemeOverlayProps) {
  return (
    <TouchableOpacity
      style={styles.overlayContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.18)', 'rgba(0,0,0,0.32)']}
        style={styles.overlayVeil}
      >
        {/* PRO 칩 (우상단) */}
        <View style={styles.proChip}>
          <View style={styles.proChipLockCircle}>
            <Ionicons name="lock-closed" size={10} color="#2E6DB3" />
          </View>
          <Text style={styles.proChipText}>PRO</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─── PremiumLockOverlay (레거시 호환) ───

interface PremiumLockOverlayProps {
  message?: string;
  onPress?: () => void;
}

export function PremiumLockOverlay({ message = 'PRO', onPress }: PremiumLockOverlayProps) {
  return <LockedThemeOverlay onPress={onPress} />;
}

// ─── Styles ───

const styles = StyleSheet.create({
  // Badge
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    gap: 3,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgeMedium: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },

  // ── UpgradeBanner ──
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextWrap: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
  },

  // ── LockedThemeOverlay ──
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    overflow: 'hidden',
  },
  overlayVeil: {
    flex: 1,
    position: 'relative',
  },
  proChip: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 999,
    paddingLeft: 6,
    paddingRight: 10,
    paddingVertical: 6,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  proChipLockCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
});
