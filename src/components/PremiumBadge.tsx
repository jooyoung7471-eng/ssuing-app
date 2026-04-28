/**
 * PremiumBadge - 프리미엄 잠금/배지 아이콘
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { radius } from '../constants/spacing';

interface PremiumBadgeProps {
  size?: 'small' | 'medium';
  style?: any;
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

interface PremiumLockOverlayProps {
  message?: string;
}

export function PremiumLockOverlay({ message = 'PRO' }: PremiumLockOverlayProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.lockCircle}>
        <Ionicons name="lock-closed" size={18} color={colors.primary} />
      </View>
      <Text style={styles.overlayText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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

  // Overlay for locked theme cards
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  lockCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
  },
});
