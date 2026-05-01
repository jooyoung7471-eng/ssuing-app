import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius, shadows } from '../constants/spacing';
import type { Theme, Difficulty } from '../types';

type ThemeStatus = 'active' | 'inactive' | 'done';

interface ThemeCardProps {
  theme: Theme;
  completedCount: number;
  totalCount: number;
  onPress: () => void;
  difficulty?: Difficulty;
  status?: ThemeStatus;
}

const THEME_INFO: Record<Theme, { title: string; subtitle: string; emoji: string; color: string; softColor: string }> = {
  daily: {
    title: '일상 영어',
    subtitle: '카페에서, 아침 루틴',
    emoji: '\u{1F4DD}',
    color: colors.theme.daily,
    softColor: colors.theme.dailySoft,
  },
  business: {
    title: '비즈니스',
    subtitle: '이메일 · 회의',
    emoji: '\u{1F4BC}',
    color: colors.theme.biz,
    softColor: colors.theme.bizSoft,
  },
  travel: {
    title: '여행 영어',
    subtitle: '공항 · 호텔',
    emoji: '\u{2708}\u{FE0F}',
    color: colors.theme.travel,
    softColor: colors.theme.travelSoft,
  },
};

// Gradient colors per difficulty + theme
const GRADIENT_COLORS: Record<Difficulty, Record<Theme, [string, string]>> = {
  beginner: {
    daily: ['#4A90D9', '#6BA3E0'],
    business: ['#7C4DFF', '#9B7BFF'],
    travel: ['#10B981', '#34D399'],
  },
  intermediate: {
    daily: ['#1E3A5F', '#2563EB'],
    business: ['#6B1D3A', '#C2185B'],
    travel: ['#065F46', '#059669'],
  },
};

function deriveStatus(completedCount: number, totalCount: number, explicitStatus?: ThemeStatus): ThemeStatus {
  if (explicitStatus) return explicitStatus;
  if (completedCount >= totalCount && totalCount > 0) return 'done';
  if (completedCount > 0) return 'active';
  return 'inactive';
}

export default function ThemeCard({ theme, completedCount, totalCount, onPress, difficulty = 'beginner', status: explicitStatus }: ThemeCardProps) {
  const config = THEME_INFO[theme];
  const status = deriveStatus(completedCount, totalCount, explicitStatus);
  const isDone = status === 'done';

  const dots = Array.from({ length: totalCount }, (_, i) => i < completedCount);
  const gradientColors = GRADIENT_COLORS[difficulty][theme];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.wrapper}>
      <LinearGradient
        colors={isDone ? [colors.surfaceAlt, colors.surfaceAlt] : gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, isDone && styles.cardDone]}
      >
        {/* Decorative circle */}
        {!isDone && <View style={styles.decorCircle} />}

        {/* Emoji icon in circle */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isDone ? colors.border : 'rgba(255,255,255,0.2)',
            },
          ]}
        >
          <Text style={[styles.emoji, isDone && { opacity: 0.5 }]}>{config.emoji}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, isDone && styles.titleDone]}>{config.title}</Text>
            {isDone && (
              <View style={styles.doneBadge}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={styles.doneText}>{'완료'}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.subtitle, !isDone && styles.subtitleLight]}>{config.subtitle}</Text>
          <View style={styles.dotsRow}>
            {dots.map((filled, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  filled && { width: 18, backgroundColor: isDone ? colors.success : 'rgba(255,255,255,0.9)' },
                  !filled && (isDone ? styles.dotEmptyDone : styles.dotEmpty),
                ]}
              />
            ))}
            <Text style={[styles.progressText, !isDone && styles.progressTextLight]}>
              {completedCount}/{totalCount}
            </Text>
          </View>
        </View>

        {/* Right arrow or check */}
        {isDone ? (
          <Ionicons name="checkmark" size={20} color={colors.success} />
        ) : (
          <Text style={styles.chevron}>{'\u203A'}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    height: 140,
    gap: 12,
    overflow: 'hidden',
    ...shadows.sm,
  },
  cardDone: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  decorCircle: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  emoji: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  title: {
    ...typography.body,
    fontWeight: '800',
    color: '#FFFFFF',
    fontSize: 17,
  },
  titleDone: {
    color: colors.text.secondary,
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.success + '20',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  doneText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F7B34',
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 2,
  },
  subtitleLight: {
    color: 'rgba(255,255,255,0.75)',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  dotEmpty: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotEmptyDone: {
    backgroundColor: colors.border,
  },
  progressText: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: '600',
    marginLeft: 4,
  },
  progressTextLight: {
    color: 'rgba(255,255,255,0.8)',
  },
  chevron: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 22,
    fontWeight: '300',
  },
});
