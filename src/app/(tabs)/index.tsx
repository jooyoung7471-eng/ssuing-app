import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeCard from '../../components/ThemeCard';
import { useDailySentences } from '../../hooks/useDailySentences';
import { useGamification } from '../../hooks/useGamification';
import api from '../../services/api';
import { colors } from '../../constants/colors';
import type { Theme, LearningStats, Difficulty } from '../../types';

const DIFFICULTY_KEY = 'engwrite_difficulty';

export default function HomeScreen() {
  const router = useRouter();
  const { sentences: dailySentences, fetch: fetchDaily } = useDailySentences();
  const { sentences: bizSentences, fetch: fetchBiz } = useDailySentences();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const { stats: gamification, achievements, refetch: refetchGamification } = useGamification();

  const loadData = async (diff?: Difficulty) => {
    const d = diff ?? difficulty;
    await Promise.all([
      fetchDaily('daily', d),
      fetchBiz('business', d),
      api.get('/history/stats').then((r) => setStats(r.data.data)).catch(() => {}),
      refetchGamification(),
    ]);
  };

  useEffect(() => {
    // 저장된 난이도 복원
    AsyncStorage.getItem(DIFFICULTY_KEY).then((saved) => {
      const d = (saved === 'intermediate' ? 'intermediate' : 'beginner') as Difficulty;
      setDifficulty(d);
      loadData(d);
    });
  }, []);

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

  const recentAchievements = (achievements || [])
    .filter((a) => a.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>쓰잉</Text>
          {gamification.streakDays > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>
                {'\u{1F525}'} {gamification.streakDays}일 연속
              </Text>
            </View>
          )}
        </View>

        {/* Profile / Level Card */}
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.profileTop}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lv.{gamification.level}</Text>
            </View>
            <View style={styles.profileStats}>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatValue}>{gamification.totalSentences}</Text>
                <Text style={styles.profileStatLabel}>완료 문장</Text>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStat}>
                <Text style={styles.profileStatValue}>{gamification.totalPerfect}</Text>
                <Text style={styles.profileStatLabel}>만점</Text>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStat}>
                <Text style={styles.profileStatValue}>{gamification.longestStreak}</Text>
                <Text style={styles.profileStatLabel}>최장 연속</Text>
              </View>
            </View>
          </View>

          {/* XP Progress Bar */}
          <View style={styles.xpSection}>
            <View style={styles.xpLabelRow}>
              <Text style={styles.xpLabel}>XP</Text>
              <Text style={styles.xpLabel}>
                {gamification.totalXp} / {gamification.xpForNextLevel}
              </Text>
            </View>
            <View style={styles.xpBarBg}>
              <View
                style={[
                  styles.xpBarFill,
                  { width: `${Math.min(gamification.xpProgress * 100, 100)}%` },
                ]}
              />
            </View>
          </View>
        </LinearGradient>

        <Text style={styles.subtitle}>오늘의 학습을 시작하세요</Text>

        {/* Difficulty Selector */}
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
              초급 Beginner
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
              중급 Intermediate
            </Text>
          </TouchableOpacity>
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
        </View>

        {/* Quick Access Cards */}
        <Text style={styles.sectionTitle}>빠른 접근</Text>

        {/* Review Card */}
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => router.push('/review')}
          activeOpacity={0.8}
        >
          <View style={styles.quickLeft}>
            <View style={[styles.quickIcon, { backgroundColor: colors.errorLight }]}>
              <Text style={styles.quickEmoji}>{'\u{1F4DD}'}</Text>
            </View>
            <View>
              <Text style={styles.quickTitle}>오답 복습</Text>
              <Text style={styles.quickDesc}>점수 낮은 문장 다시 도전</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.text.hint} />
        </TouchableOpacity>

        {/* Weekly Report Card */}
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => router.push('/weekly')}
          activeOpacity={0.8}
        >
          <View style={styles.quickLeft}>
            <View style={[styles.quickIcon, { backgroundColor: '#EFF6FF' }]}>
              <Text style={styles.quickEmoji}>{'\u{1F4CA}'}</Text>
            </View>
            <View>
              <Text style={styles.quickTitle}>주간 리포트</Text>
              <Text style={styles.quickDesc}>이번 주 학습 요약 보기</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.text.hint} />
        </TouchableOpacity>

        {/* Achievements Card */}
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => router.push('/achievements')}
          activeOpacity={0.8}
        >
          <View style={styles.quickLeft}>
            <View style={[styles.quickIcon, { backgroundColor: colors.warningLight }]}>
              <Text style={styles.quickEmoji}>{'\u{1F3C6}'}</Text>
            </View>
            <View>
              <Text style={styles.quickTitle}>업적</Text>
              <Text style={styles.quickDesc}>
                {recentAchievements.length > 0
                  ? recentAchievements.map((a) => a.emoji).join(' ') + ' 최근 달성'
                  : '업적을 달성해 보세요'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.text.hint} />
        </TouchableOpacity>

        {/* History Card (existing) */}
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => router.push('/(tabs)/history')}
          activeOpacity={0.8}
        >
          <View style={styles.quickLeft}>
            <View style={[styles.quickIcon, { backgroundColor: '#F5F3FF' }]}>
              <Text style={styles.quickEmoji}>{'\u{1F4CB}'}</Text>
            </View>
            <View>
              <Text style={styles.quickTitle}>학습 기록</Text>
              <Text style={styles.quickDesc}>
                총 {stats?.totalCorrections ?? 0}문장 | 평균 {stats?.averageScore?.toFixed(1) ?? '0.0'}점
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.text.hint} />
        </TouchableOpacity>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning,
  },

  // Profile Card
  profileCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 16,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileStatLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  profileStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  xpSection: {},
  xpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  xpBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.secondary,
    marginBottom: 16,
  },
  difficultyContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  difficultyButtonActive: {
    backgroundColor: '#2563EB',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.hint,
  },
  difficultyTextActive: {
    color: '#FFFFFF',
  },
  cards: {},

  // Section
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 24,
    marginBottom: 12,
  },

  // Quick Access Cards
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  quickLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickEmoji: {
    fontSize: 18,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  quickDesc: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.text.secondary,
    marginTop: 2,
  },
});
