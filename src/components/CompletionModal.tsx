import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius, shadows } from '../constants/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CompletionModalProps {
  visible: boolean;
  themeTitle: string;
  averageScore: number;
  streakDays: number;
  totalXp?: number;
  currentLevel?: number;
  onClose: () => void;
}

interface StatBlockProps {
  icon: string;
  value: string;
  label: string;
  color: string;
  index: number;
}

function StatBlock({ icon, value, label, color, index }: StatBlockProps) {
  return (
    <Animated.View
      entering={FadeInUp.delay(300 + index * 100).duration(400).springify()}
      style={[styles.statBlock, { backgroundColor: color + '15' }]}
    >
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function CompletionModal({
  visible,
  themeTitle,
  averageScore,
  streakDays,
  totalXp,
  currentLevel,
  onClose,
}: CompletionModalProps) {
  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View entering={FadeIn.duration(300)} style={styles.overlay}>
        <View style={styles.fullScreen}>
          {/* Gradient top area */}
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientTop}
          >
            {/* Close button */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>{'\u2715'}</Text>
            </TouchableOpacity>

            {/* Medal */}
            <Animated.View entering={ZoomIn.delay(200).duration(500).springify()} style={styles.medalWrapper}>
              <View style={styles.medal}>
                <Text style={styles.medalEmoji}>{'\u{1F3C6}'}</Text>
                <View style={styles.medalCheck}>
                  <Text style={styles.medalCheckText}>{'\u2713'}</Text>
                </View>
              </View>
            </Animated.View>

            {/* Title area */}
            <Animated.View entering={FadeInUp.delay(100).duration(400)}>
              <Text style={styles.dateLabel}>
                DAILY COMPLETE
              </Text>
              <Text style={styles.title}>오늘도 해냈어요!</Text>
              <Text style={styles.subtitle}>3문장 완수 · 스트릭이 이어집니다</Text>
            </Animated.View>
          </LinearGradient>

          {/* Stats card area */}
          <View style={styles.contentArea}>
            <View style={styles.statsCard}>
              <View style={styles.statsRow}>
                <StatBlock
                  icon={'\u{1F525}'}
                  value={streakDays > 0 ? `${streakDays}` : '-'}
                  label="스트릭"
                  color={colors.warning}
                  index={0}
                />
                <StatBlock
                  icon={'\u2B50'}
                  value={averageScore > 0 ? `${Math.round(averageScore * 10) / 10}` : '-'}
                  label="평균"
                  color={colors.primary}
                  index={1}
                />
                <StatBlock
                  icon={'\u26A1'}
                  value={totalXp ? `+${totalXp}` : '-'}
                  label="XP"
                  color={colors.secondary}
                  index={2}
                />
              </View>

              {currentLevel != null && (
                <View style={styles.levelInfo}>
                  <Text style={styles.levelInfoText}>
                    현재 레벨: Lv. {currentLevel}
                  </Text>
                </View>
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonArea}>
              <TouchableOpacity style={styles.primaryButton} onPress={onClose} activeOpacity={0.85}>
                <Text style={styles.primaryButtonText}>
                  {'\u{1F3E0}'} 홈으로
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.card,
  },
  gradientTop: {
    paddingTop: 70,
    paddingBottom: 60,
    paddingHorizontal: spacing.screenPadding,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 60,
    right: spacing.screenPadding,
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  medalWrapper: {
    marginBottom: spacing.lg,
  },
  medal: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD93D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.text.inverse,
    ...shadows.lg,
  },
  medalEmoji: {
    fontSize: 48,
  },
  medalCheck: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.text.inverse,
  },
  medalCheckText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: '900',
  },
  dateLabel: {
    ...typography.label,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: spacing.xxs,
    letterSpacing: 1.5,
  } as any,
  title: {
    ...typography.h1,
    color: colors.text.inverse,
    textAlign: 'center',
    marginBottom: spacing.xs,
  } as any,
  subtitle: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  } as any,
  contentArea: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xxl,
    justifyContent: 'space-between',
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xxs,
    borderRadius: radius.sm,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: spacing.xxs,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  } as any,
  levelInfo: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  levelInfoText: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.primary,
  } as any,
  buttonArea: {
    paddingBottom: 40,
    gap: spacing.sm,
  },
  primaryButton: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.text.inverse,
    fontSize: 15,
  } as any,
});
