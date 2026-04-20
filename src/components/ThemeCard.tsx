import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    title: '\uC77C\uC0C1 \uC601\uC5B4',
    subtitle: '\uCE74\uD398\uC5D0\uC11C, \uC544\uCE68 \uB8E8\uD2F4',
    emoji: '\u{1F4DD}',
    color: colors.theme.daily,
    softColor: colors.theme.dailySoft,
  },
  business: {
    title: '\uBE44\uC988\uB2C8\uC2A4',
    subtitle: '\uC774\uBA54\uC77C \u00B7 \uD68C\uC758',
    emoji: '\u{1F4BC}',
    color: colors.theme.biz,
    softColor: colors.theme.bizSoft,
  },
  travel: {
    title: '\uC5EC\uD589 \uC601\uC5B4',
    subtitle: '\uACF5\uD56D \u00B7 \uD638\uD154',
    emoji: '\u{2708}\u{FE0F}',
    color: colors.theme.travel,
    softColor: colors.theme.travelSoft,
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
  const isActive = status === 'active';

  const dots = Array.from({ length: totalCount }, (_, i) => i < completedCount);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.wrapper}>
      <View
        style={[
          styles.card,
          isDone && styles.cardDone,
          isActive && [styles.cardActive, { borderColor: config.color + '50' }],
          !isActive && !isDone && styles.cardInactive,
        ]}
      >
        {/* Active top accent bar */}
        {isActive && (
          <View style={[styles.accentBar, { backgroundColor: config.color }]} />
        )}

        {/* Emoji icon in circle */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isDone ? colors.border : config.softColor,
            },
          ]}
        >
          <Text style={[styles.emoji, isDone && { opacity: 0.5 }]}>{config.emoji}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, isDone && styles.titleDone]}>{config.title}</Text>
            {isActive && (
              <View style={[styles.statusBadge, { backgroundColor: config.color + '20' }]}>
                <Text style={[styles.statusText, { color: config.color }]}>{'\uC9C4\uD589 \uC911'}</Text>
              </View>
            )}
            {isDone && (
              <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
                <Text style={[styles.statusText, { color: '#0F7B34' }]}>{'\uC644\uB8CC'}</Text>
              </View>
            )}
          </View>
          <Text style={styles.subtitle}>{config.subtitle}</Text>
          <View style={styles.dotsRow}>
            {dots.map((filled, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  filled && { width: 18, backgroundColor: config.color },
                  !filled && styles.dotEmpty,
                ]}
              />
            ))}
            <Text style={styles.progressText}>
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
      </View>
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
    borderRadius: 18,
    padding: 14,
    gap: 12,
    overflow: 'hidden',
  },
  cardActive: {
    backgroundColor: colors.card,
    borderWidth: 1,
    ...shadows.sm,
  },
  cardInactive: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardDone: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
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
    marginBottom: 2,
  },
  title: {
    ...typography.body,
    fontWeight: '800',
    color: colors.text.primary,
  },
  titleDone: {
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    fontSize: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  dotEmpty: {
    backgroundColor: colors.border,
  },
  progressText: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: '600',
    marginLeft: 4,
  },
  chevron: {
    color: colors.text.hint,
    fontSize: 18,
  },
});
