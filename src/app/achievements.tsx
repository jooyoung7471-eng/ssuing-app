import React from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGamification } from '../hooks/useGamification';
import { colors } from '../constants/colors';
import type { Achievement } from '../types';

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

  const unlocked = (achievements || []).filter((a) => a.unlockedAt);
  const locked = (achievements || []).filter((a) => !a.unlockedAt);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        <Text style={styles.sectionTitle}>
          달성한 업적 ({unlocked.length}/{(achievements || []).length})
        </Text>

        {unlocked.length === 0 && (
          <Text style={styles.emptyText}>아직 달성한 업적이 없습니다. 학습을 시작하세요!</Text>
        )}

        {unlocked.map((a) => (
          <AchievementBadge key={a.type} achievement={a} />
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>미달성 업적</Text>

        {locked.map((a) => (
          <AchievementBadge key={a.type} achievement={a} />
        ))}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
