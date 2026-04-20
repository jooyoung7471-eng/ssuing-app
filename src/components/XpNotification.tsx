import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeOut, SlideInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius } from '../constants/spacing';

interface XpNotificationProps {
  xpEarned: number;
  levelUp?: boolean;
  newLevel?: number;
  onDismiss: () => void;
}

export default function XpNotification({
  xpEarned,
  levelUp,
  newLevel,
  onDismiss,
}: XpNotificationProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(onDismiss, 2500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <Animated.View
      entering={SlideInUp.duration(400).springify()}
      exiting={FadeOut.duration(300)}
      style={[styles.container, { top: insets.top + 8 }]}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Text style={styles.icon}>{'\u26A1'}</Text>
        </View>
        <View style={styles.textCol}>
          <Text style={styles.xpText}>+{xpEarned} XP</Text>
          {levelUp && newLevel != null && (
            <Text style={styles.levelUpText}>
              {'\u{1F389}'} Level {newLevel} 달성!
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 100,
    backgroundColor: colors.warningLight,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.warning + '40',
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: radius.xs,
    backgroundColor: colors.warning + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  textCol: {
    flex: 1,
  },
  xpText: {
    ...typography.h3,
    color: colors.warning,
  } as any,
  levelUpText: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  } as any,
});
