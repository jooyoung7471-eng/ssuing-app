import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import Animated, {
  FadeIn,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius, shadows } from '../constants/spacing';

interface AchievementModalProps {
  visible: boolean;
  achievement: { type: string; title: string; emoji: string } | null;
  onClose: () => void;
}

function LevelBadge({ level }: { level: number }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.08, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.levelBadge, animatedStyle]}>
      <Text style={styles.levelLabel}>LEVEL</Text>
      <Text style={styles.levelNumber}>{level}</Text>
    </Animated.View>
  );
}

export default function AchievementModal({
  visible,
  achievement,
  onClose,
}: AchievementModalProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!achievement) return null;

  const isLevelUp = achievement.type === 'levelup';
  const levelMatch = achievement.title.match(/\d+/);
  const level = levelMatch ? parseInt(levelMatch[0]) : 0;

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View entering={FadeIn.duration(200)} style={styles.overlay}>
        {/* Radial glow effect */}
        <View style={styles.glowWrapper}>
          <View style={styles.glow} />
        </View>

        <Animated.View entering={ZoomIn.duration(400).springify()} style={styles.modal}>
          {/* Badge area */}
          {isLevelUp ? (
            <View style={styles.badgeArea}>
              <LevelBadge level={level} />
            </View>
          ) : (
            <Animated.Text
              entering={ZoomIn.delay(200).duration(300).springify()}
              style={styles.emoji}
            >
              {achievement.emoji}
            </Animated.Text>
          )}

          {/* Title */}
          {isLevelUp && (
            <Text style={styles.levelUpLabel}>LEVEL UP</Text>
          )}
          <Text style={styles.title}>
            {isLevelUp ? `레벨 ${level} 달성! \u{1F389}` : achievement.title}
          </Text>

          {isLevelUp ? (
            <Text style={styles.description}>
              더 복잡한 문장 표현에 도전해보세요.
            </Text>
          ) : (
            <Text style={styles.congrats}>축하합니다!</Text>
          )}

          {/* Unlocks section (for level up) */}
          {isLevelUp && (
            <View style={styles.unlocksSection}>
              <Text style={styles.unlocksLabel}>{'\u2728'} 새롭게 열린 기능</Text>
              <View style={styles.unlockRow}>
                <View style={styles.unlockIcon}>
                  <Text>{'\u{1F3AF}'}</Text>
                </View>
                <View style={styles.unlockText}>
                  <Text style={styles.unlockTitle}>새로운 문장 세트</Text>
                  <Text style={styles.unlockSub}>더 다양한 표현을 연습하세요</Text>
                </View>
              </View>
            </View>
          )}

          {/* CTA Button */}
          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.buttonText}>
              {isLevelUp ? '계속하기' : '닫기'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  glowWrapper: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    width: 300,
    height: 300,
    marginLeft: -150,
    marginTop: -150,
  },
  glow: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.secondary + '30',
  },
  modal: {
    backgroundColor: colors.card,
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  badgeArea: {
    marginBottom: spacing.lg,
  },
  levelBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD93D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.text.inverse,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  levelLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 1.4,
  },
  levelNumber: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.text.inverse,
    lineHeight: 42,
    letterSpacing: -2,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  levelUpLabel: {
    ...typography.label,
    color: colors.warning,
    letterSpacing: 1.5,
    marginBottom: spacing.xxs,
  } as any,
  title: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  } as any,
  congrats: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  } as any,
  description: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  } as any,
  unlocksSection: {
    width: '100%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  unlocksLabel: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  } as any,
  unlockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  unlockIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.xs,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockText: {
    flex: 1,
  },
  unlockTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.primary,
  },
  unlockSub: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
  },
  buttonText: {
    ...typography.button,
    color: colors.text.inverse,
  } as any,
});
