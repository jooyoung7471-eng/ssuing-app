import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHistory } from '../../hooks/useHistory';
import { colors, getScoreColor100 } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, radius, shadows } from '../../constants/spacing';
import type { HistoryRecord, Theme } from '../../types';

// Generate month filter labels
function getMonthFilters(): { label: string; value: string | undefined }[] {
  const now = new Date();
  const filters: { label: string; value: string | undefined }[] = [
    { label: '전체', value: undefined },
  ];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${d.getMonth() + 1}월`;
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    filters.push({ label, value });
  }
  return filters;
}

export default function HistoryScreen() {
  const router = useRouter();
  const { records, pagination, loading, error, fetch } = useHistory();
  const [selectedTheme, setSelectedTheme] = useState<Theme | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>();
  const monthFilters = getMonthFilters();

  useEffect(() => {
    fetch(1, selectedTheme);
  }, [selectedTheme]);

  const onRefresh = () => fetch(1, selectedTheme);

  const loadMore = () => {
    if (pagination && pagination.page * pagination.limit < pagination.total) {
      fetch(pagination.page + 1, selectedTheme);
    }
  };

  const getScoreLabel = (score: number): string => {
    // Handle both 0-10 and 0-100 scales
    const normalizedScore = score <= 10 ? score * 10 : score;
    return String(normalizedScore);
  };

  const getScoreColorForItem = (score: number): string => {
    const normalizedScore = score <= 10 ? score * 10 : score;
    return getScoreColor100(normalizedScore);
  };

  const renderItem = ({ item }: { item: HistoryRecord }) => {
    const scoreColor = getScoreColorForItem(item.score);
    const date = new Date(item.createdAt);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/history/${item.id}`)}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardLeft}>
            <Text style={styles.cardDate}>{dateStr}</Text>
            <Text style={styles.cardKorean} numberOfLines={1}>
              {item.koreanText}
            </Text>
          </View>
          <View style={[styles.scorePill, { backgroundColor: scoreColor + '18' }]}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>
              {getScoreLabel(item.score)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={48} color={colors.text.hint} />
        <Text style={styles.emptyText}>{'아직 학습 기록이 없습니다'}</Text>
        <Text style={styles.emptySubtext}>{'작문을 시작해 보세요!'}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Title meta (navigation header already shows title) */}
      {pagination && pagination.total > 0 && (
        <View style={styles.titleSection}>
          <Text style={styles.titleMeta}>
            <Text style={styles.titleMetaBold}>{pagination.total}개</Text> 문장
          </Text>
        </View>
      )}

      {/* Theme filter */}
      <View style={styles.themeFilterRow}>
        {([undefined, 'daily', 'business'] as (Theme | undefined)[]).map((t) => (
          <TouchableOpacity
            key={t ?? 'all'}
            style={[styles.themeChip, selectedTheme === t && styles.themeChipActive]}
            onPress={() => setSelectedTheme(t)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.themeChipText,
                selectedTheme === t && styles.themeChipTextActive,
              ]}
            >
              {t === undefined ? '전체' : t === 'daily' ? '일상' : '비즈니스'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Title
  titleSection: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  titleMeta: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  titleMetaBold: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.text.primary,
  },

  // Month filter
  filterScroll: {
    maxHeight: 44,
  },
  filterRow: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.xs,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Theme filter
  themeFilterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xs,
    gap: 6,
  },
  themeChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
  },
  themeChipActive: {
    backgroundColor: colors.primary,
  },
  themeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  themeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // List
  list: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xxs,
    paddingBottom: 40,
  },

  // Card — compact 342x66 style
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    height: 66,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flex: 1,
    marginRight: 12,
  },
  cardDate: {
    ...typography.caption,
    color: colors.text.hint,
    marginBottom: 2,
  },
  cardKorean: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
    fontSize: 13,
  },
  scorePill: {
    borderRadius: radius.xs,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 42,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '800',
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.text.hint,
    marginTop: spacing.xxs,
  },

  // Error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.error,
  },
});
