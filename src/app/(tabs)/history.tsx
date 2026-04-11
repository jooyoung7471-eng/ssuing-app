import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHistory } from '../../hooks/useHistory';
import { colors, getScoreColor } from '../../constants/colors';
import { typography } from '../../constants/typography';
import type { HistoryRecord, Theme } from '../../types';

export default function HistoryScreen() {
  const router = useRouter();
  const { records, pagination, loading, error, fetch } = useHistory();
  const [selectedTheme, setSelectedTheme] = useState<Theme | undefined>();

  useEffect(() => {
    fetch(1, selectedTheme);
  }, [selectedTheme]);

  const onRefresh = () => fetch(1, selectedTheme);

  const loadMore = () => {
    if (pagination && pagination.page * pagination.limit < pagination.total) {
      fetch(pagination.page + 1, selectedTheme);
    }
  };

  const renderItem = ({ item }: { item: HistoryRecord }) => {
    const scoreColor = getScoreColor(item.score);
    const date = new Date(item.createdAt);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/history/${item.id}`)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{dateStr}</Text>
          <View style={[styles.scoreBadge, { backgroundColor: scoreColor + '15' }]}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>{item.score}/10</Text>
          </View>
        </View>
        <Text style={styles.koreanText} numberOfLines={2}>
          {item.koreanText}
        </Text>
        <Text style={styles.userWriting} numberOfLines={1}>
          {item.userWriting}
        </Text>
        <View style={styles.cardFooter}>
          <Ionicons name="arrow-forward" size={14} color={colors.text.hint} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={48} color={colors.text.hint} />
        <Text style={styles.emptyText}>아직 학습 기록이 없습니다</Text>
        <Text style={styles.emptySubtext}>작문을 시작해 보세요!</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.filterRow}>
        {([undefined, 'daily', 'business', 'travel'] as (Theme | undefined)[]).map((t) => (
          <TouchableOpacity
            key={t ?? 'all'}
            style={[styles.filterChip, selectedTheme === t && styles.filterChipActive]}
            onPress={() => setSelectedTheme(t)}
          >
            <Text
              style={[
                styles.filterText,
                selectedTheme === t && styles.filterTextActive,
              ]}
            >
              {t === undefined ? '전체' : t === 'daily' ? '일상' : t === 'travel' ? '여행' : '비즈니스'}
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: colors.text.inverse,
    fontWeight: '600',
  },
  list: {
    padding: 20,
    paddingTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardDate: {
    ...typography.caption,
    color: colors.text.hint,
  },
  scoreBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  scoreText: {
    ...typography.caption,
    fontWeight: '700',
  },
  koreanText: {
    ...typography.bodyBold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  userWriting: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  cardFooter: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: 16,
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.text.hint,
    marginTop: 4,
  },
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
