import React from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGamification } from '../hooks/useGamification';
import { colors } from '../constants/colors';
import type { Achievement } from '../types';

const CATEGORY_CONFIG: { key: string; label: string; emoji: string }[] = [
  { key: 'first', label: '첫 경험', emoji: '\u{1F3AF}' },
  { key: 'cumulative', label: '누적 달성', emoji: '\u{1F4C8}' },
  { key: 'streak', label: '연속 학습', emoji: '\u{1F525}' },
  { key: 'master', label: '테마 마스터', emoji: '\u{1F3C6}' },
  { key: 'challenge', label: '실력 도전', emoji: '\u2B50' },
  { key: 'review', label: '복습', emoji: '\u{1F4DD}' },
  { key: 'level', label: '레벨', emoji: '\u{1F48E}' },
];

function AchievementBadge({ achievement }: { achievement: Achievement }) {
  const unlocked = !!achievement.unlockedAt;
  const dateStr = achievement.unlockedAt
    ? new Date(achievement.unlockedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <View style={[styles.badge, unlocked ? styles.badgeUnlocked : styles.badgeLocked]}>
      <View style={[styles.emojiCircle, unlocked ? styles.emojiCircleUnlocked : styles.emojiCircleLocked]}>
        <Text style={[styles.emoji, !unlocked && styles.emojiLocked]}>{achievement.emoji}</Text>
      </View>
      <View style={styles.badgeInfo}>
        <Text style={[styles.badgeTitle, !unlocked && styles.textLocked]}>{achievement.title}</Text>
        {unlocked ? (
          <Text style={styles.badgeDate}>{dateStr}</Text>
        ) : (
          <Text style={styles.badgeDesc}>{achievement.description}</Text>
        )}
      </View>
      {!unlocked && (
        <View style={styles.lockIcon}>
          <Text style={styles.lockText}>{'\u{1F512}'}</Text>
        </View>
      )}
    </View>
  );
}

export default function AchievementsScreen() {
  const { achievements, loading, refetch } = useGamification();

  const allAchievements = achievements || [];
  const unlockedCount = allAchievements.filter((a) => a.unlockedAt).length;
  const totalCount = allAchievements.length;

  // Group by category
  const grouped = CATEGORY_CONFIG.map((cat) => {
    const items = allAchievements.filter((a) => (a as any).category === cat.key);
    return { ...cat, items };
  }).filter((g) => g.items.length > 0);

  // Fallback: uncategorized items (e.g. from old data)
  const categorizedTypes = new Set(grouped.flatMap((g) => g.items.map((a) => a.type)));
  const uncategorized = allAchievements.filter((a) => !categorizedTypes.has(a.type));

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        <Text style={styles.headerTitle}>
          {unlockedCount}/{totalCount} 달성
        </Text>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: totalCount > 0 ? `${(unlockedCount / totalCount) * 100}%` : '0%' },
            ]}
          />
        </View>

        {grouped.map((group) => {
          const groupUnlocked = group.items.filter((a) => a.unlockedAt).length;
          return (
            <View key={group.key} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryEmoji}>{group.emoji}</Text>
                <Text style={styles.categoryLabel}>{group.label}</Text>
                <Text style={styles.categoryCount}>
                  {groupUnlocked}/{group.items.length}
                </Text>
              </View>
              {group.items.map((a) => (
                <AchievementBadge key={a.type} achievement={a} />
              ))}
            </View>
          );
        })}

        {uncategorized.length > 0 && (
          <View style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryEmoji}>{'\u{1F3C5}'}</Text>
              <Text style={styles.categoryLabel}>기타</Text>
              <Text style={styles.categoryCount}>
                {uncategorized.filter((a) => a.unlockedAt).length}/{uncategorized.length}
              </Text>
            </View>
            {uncategorized.map((a) => (
              <AchievementBadge key={a.type} achievement={a} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
  },
  categoryCount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeUnlocked: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  badgeLocked: {
    opacity: 0.6,
  },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  emojiCircleUnlocked: {
    backgroundColor: '#EFF6FF',
  },
  emojiCircleLocked: {
    backgroundColor: '#F3F4F6',
  },
  emoji: {
    fontSize: 24,
  },
  emojiLocked: {
    opacity: 0.4,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  textLocked: {
    color: colors.text.hint,
  },
  badgeDate: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  badgeDesc: {
    fontSize: 13,
    color: colors.text.hint,
    marginTop: 2,
  },
  lockIcon: {
    marginLeft: 8,
  },
  lockText: {
    fontSize: 16,
    opacity: 0.4,
  },
});
