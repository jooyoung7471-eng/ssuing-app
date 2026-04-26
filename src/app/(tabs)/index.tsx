import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import ThemeCard from '../../components/ThemeCard';
import { useDailySentences } from '../../hooks/useDailySentences';
import { useGamification } from '../../hooks/useGamification';
import api from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, radius, shadows } from '../../constants/spacing';
import type { Theme, LearningStats, Difficulty } from '../../types';

const DIFFICULTY_KEY = 'engwrite_difficulty';

function getLevelTitle(level: number): string {
  if (level >= 21) return '영어 전설';
  if (level >= 16) return '작문 마스터';
  if (level >= 11) return '영어 달인';
  if (level >= 8) return '문장 장인';
  if (level >= 5) return '영어 탐험가';
  if (level >= 3) return '초보 작가';
  return '영어 새싹';
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { sentences: dailySentences, fetch: fetchDaily } = useDailySentences();
  const { sentences: bizSentences, fetch: fetchBiz } = useDailySentences();
  const { sentences: travelSentences, fetch: fetchTravel } = useDailySentences();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const { stats: gamification, achievements, refetch: refetchGamification } = useGamification();

  // XP progress bar animation
  const xpBarWidth = useSharedValue(0);

  const animatedXpStyle = useAnimatedStyle(() => ({
    width: `${xpBarWidth.value}%`,
  }));

  const loadData = async (diff?: Difficulty) => {
    const d = diff ?? difficulty;
    await Promise.all([
      fetchDaily('daily', d),
      fetchBiz('business', d),
      fetchTravel('travel', d),
      api.get('/history/stats').then((r) => setStats(r.data.data)).catch(() => {}),
      refetchGamification(),
    ]);
  };

  useEffect(() => {
    // Restore saved difficulty
    AsyncStorage.getItem(DIFFICULTY_KEY).then((saved) => {
      const d = (saved === 'intermediate' ? 'intermediate' : 'beginner') as Difficulty;
      setDifficulty(d);
      loadData(d);
    });
  }, []);

  // Animate XP bar when gamification data loads
  useEffect(() => {
    if (gamification.xpProgress > 0) {
      xpBarWidth.value = 0;
      const targetPct = Math.min(gamification.xpProgress * 100, 100);
      // Small delay then animate
      const timeout = setTimeout(() => {
        xpBarWidth.value = withTiming(targetPct, {
          duration: 1200,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [gamification.xpProgress]);

  const handleDifficultyChange = async (d: Difficulty) => {
    setDifficulty(d);
    await AsyncStorage.setItem(DIFFICULTY_KEY, d);
    loadData(d);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleThemePress = (theme: Theme) => {
    router.push(`/practice/${theme}`);
  };

  const dailyCompleted = (dailySentences || []).filter((s) => s.isCompleted).length;
  const bizCompleted = (bizSentences || []).filter((s) => s.isCompleted).length;
  const travelCompleted = (travelSentences || []).filter((s) => s.isCompleted).length;

  const recentAchievements = (achievements || [])
    .filter((a) => a.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
    .slice(0, 3);

  const totalThemes = 3;
  const completedThemes = [dailyCompleted, bizCompleted, travelCompleted].filter(
    (c, i) => c >= ((i === 0 ? dailySentences : i === 1 ? bizSentences : travelSentences) || []).length && ((i === 0 ? dailySentences : i === 1 ? bizSentences : travelSentences) || []).length > 0
  ).length;
  const remainingThemes = totalThemes - completedThemes;

  // Date formatting
  const now = new Date();
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dateCaption = `${now.getMonth() + 1}월 ${now.getDate()}일 ${weekdays[now.getDay()]}`;

  const xpToNext = gamification.xpForNextLevel - gamification.totalXp;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header: date + greeting + streak + settings */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.dateCaption}>{dateCaption}</Text>
            <Text style={styles.greeting}>안녕하세요{user?.name ? `, ${user.name}님` : ''} {'\u{1F44B}'}</Text>
          </View>
          <View style={styles.headerRight}>
            {gamification.streakDays > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakEmoji}>{'\u{1F525}'}</Text>
                <Text style={styles.streakText}>{gamification.streakDays}일</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('/(tabs)/settings')}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={18} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero XP Card */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          {/* Decorative circle */}
          <View style={styles.heroDecor} />

          <View style={styles.heroContent}>
            {/* Top row: LEVEL + title + next level info */}
            <View style={styles.heroTopRow}>
              <View style={styles.levelRow}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>LEVEL {gamification.level}</Text>
                </View>
                <Text style={styles.titleText}>{getLevelTitle(gamification.level)}</Text>
              </View>
              <Text style={styles.nextLevelText}>
                {'다음 레벨까지'} {xpToNext > 0 ? xpToNext : 0} XP
              </Text>
            </View>

            {/* XP display */}
            <Text style={styles.xpDisplay}>
              {gamification.totalXp}{' '}
              <Text style={styles.xpTotal}>/ {gamification.xpForNextLevel} XP</Text>
            </Text>

            {/* Progress bar */}
            <View style={styles.xpBarBg}>
              <Animated.View style={[styles.xpBarFill, animatedXpStyle]} />
            </View>

            {/* 3 stats */}
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{gamification.totalSentences}</Text>
                <Text style={styles.heroStatLabel}>{'완료'}</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{gamification.streakDays}일</Text>
                <Text style={styles.heroStatLabel}>{'연속'}</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{gamification.longestStreak}일</Text>
                <Text style={styles.heroStatLabel}>{'최장'}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Difficulty Segment + completion info */}
        <View style={styles.difficultyRow}>
          <View style={styles.difficultyContainer}>
            <TouchableOpacity
              style={[
                styles.difficultyButton,
                difficulty === 'beginner' && styles.difficultyButtonActive,
              ]}
              onPress={() => handleDifficultyChange('beginner')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.difficultyText,
                  difficulty === 'beginner' && styles.difficultyTextActive,
                ]}
              >
                {'초급'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.difficultyButton,
                difficulty === 'intermediate' && styles.difficultyButtonActive,
              ]}
              onPress={() => handleDifficultyChange('intermediate')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.difficultyText,
                  difficulty === 'intermediate' && styles.difficultyTextActive,
                ]}
              >
                {'중급'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.completionInfo}>
            {completedThemes}개 완료 {'\u00B7'} {remainingThemes}개 남음
          </Text>
        </View>

        {/* Theme Cards */}
        <View style={styles.cards}>
          <ThemeCard
            theme="daily"
            completedCount={dailyCompleted}
            totalCount={(dailySentences || []).length || 3}
            onPress={() => handleThemePress('daily')}
            difficulty={difficulty}
          />
          <ThemeCard
            theme="business"
            completedCount={bizCompleted}
            totalCount={(bizSentences || []).length || 3}
            onPress={() => handleThemePress('business')}
            difficulty={difficulty}
          />
          <ThemeCard
            theme="travel"
            completedCount={travelCompleted}
            totalCount={(travelSentences || []).length || 3}
            onPress={() => handleThemePress('travel')}
            difficulty={difficulty}
          />
        </View>

        {/* Quick Access List */}
        <View style={styles.quickAccessList}>
          <TouchableOpacity
            style={styles.quickListItem}
            onPress={() => router.push('/review')}
            activeOpacity={0.7}
          >
            <View style={[styles.quickListIcon, { backgroundColor: colors.primaryLight }]}>
              <Text style={styles.quickListEmoji}>{'\u{1F4DA}'}</Text>
            </View>
            <View style={styles.quickListContent}>
              <Text style={styles.quickListTitle}>오답 복습</Text>
              <Text style={styles.quickListDesc}>틀린 문장을 다시 연습해요</Text>
            </View>
            {(stats?.totalCorrections ?? 0) > 0 && (
              <View style={styles.quickListBadge}>
                <Text style={styles.quickListBadgeText}>
                  {Math.min(stats?.totalCorrections ?? 0, 99)}
                </Text>
              </View>
            )}
            <Text style={styles.quickListChevron}>{'\u203A'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickListItem}
            onPress={() => router.push('/weekly')}
            activeOpacity={0.7}
          >
            <View style={[styles.quickListIcon, { backgroundColor: colors.warningLight }]}>
              <Text style={styles.quickListEmoji}>{'\u{1F4CA}'}</Text>
            </View>
            <View style={styles.quickListContent}>
              <Text style={styles.quickListTitle}>주간 리포트</Text>
              <Text style={styles.quickListDesc}>이번 주 학습 통계를 확인해요</Text>
            </View>
            <Text style={styles.quickListChevron}>{'\u203A'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickListItem, { borderBottomWidth: 0 }]}
            onPress={() => router.push('/achievements')}
            activeOpacity={0.7}
          >
            <View style={[styles.quickListIcon, { backgroundColor: colors.secondaryLight }]}>
              <Text style={styles.quickListEmoji}>{'\u{1F3C6}'}</Text>
            </View>
            <View style={styles.quickListContent}>
              <Text style={styles.quickListTitle}>업적</Text>
              <Text style={styles.quickListDesc}>달성한 업적을 확인해요</Text>
            </View>
            {recentAchievements.length > 0 && (
              <View style={styles.quickListBadge}>
                <Text style={styles.quickListBadgeText}>{recentAchievements.length}</Text>
              </View>
            )}
            <Text style={styles.quickListChevron}>{'\u203A'}</Text>
          </TouchableOpacity>
        </View>
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
    padding: spacing.screenPadding,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  dateCaption: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#FFF5E0',
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.warning + '60',
  },
  streakEmoji: {
    fontSize: 15,
  },
  streakText: {
    fontWeight: '800',
    color: '#C2680D',
    fontSize: 13,
  },
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Hero XP Card
  heroCard: {
    borderRadius: radius.xl,
    padding: 18,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.primary,
  },
  heroDecor: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  heroContent: {
    position: 'relative',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  nextLevelText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  xpDisplay: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    marginBottom: 12,
  },
  xpTotal: {
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.75,
  },
  xpBarBg: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginBottom: 12,
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.pill,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 12,
  },
  heroStat: {
    flex: 1,
  },
  heroStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroStatLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
  },
  heroStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  // Difficulty Segment
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  difficultyContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  difficultyButton: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  difficultyButtonActive: {
    backgroundColor: '#FFFFFF',
    ...shadows.md,
    shadowOpacity: 0.15,
    elevation: 3,
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  difficultyTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  completionInfo: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },

  // Theme Cards
  cards: {
    marginBottom: spacing.md,
  },

  // Quick Access List
  quickAccessList: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    overflow: 'hidden',
    ...shadows.sm,
  },
  quickListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  quickListIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  quickListEmoji: {
    fontSize: 18,
  },
  quickListContent: {
    flex: 1,
    minWidth: 0,
  },
  quickListTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  quickListDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  quickListBadge: {
    backgroundColor: colors.error,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  quickListBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quickListChevron: {
    color: colors.text.hint,
    fontSize: 20,
    fontWeight: '300',
  },
});
