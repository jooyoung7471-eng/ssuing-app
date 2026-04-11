import React from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWeeklyReport } from '../hooks/useWeeklyReport';
import { colors } from '../constants/colors';

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

function ChangeIndicator({ value, suffix = '' }: { value: number; suffix?: string }) {
  if (value === 0) return <Text style={styles.changeNeutral}>-</Text>;
  const isUp = value > 0;
  return (
    <Text style={isUp ? styles.changeUp : styles.changeDown}>
      {isUp ? '\u2191' : '\u2193'} {Math.abs(value).toFixed(suffix === '점' ? 1 : 0)}
      {suffix}
    </Text>
  );
}

export default function WeeklyScreen() {
  const { report, loading, error, refetch } = useWeeklyReport();

  const maxCount = Math.max(...report.dailyBreakdown.map((d) => d.count), 1);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Summary Cards */}
        <Text style={styles.sectionTitle}>이번 주 요약</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{report.totalSentences}</Text>
            <Text style={styles.summaryLabel}>완료 문장</Text>
            <ChangeIndicator value={report.comparedToLastWeek.sentences} suffix="문장" />
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{report.averageScore.toFixed(1)}</Text>
            <Text style={styles.summaryLabel}>평균 점수</Text>
            <ChangeIndicator value={report.comparedToLastWeek.score} suffix="점" />
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{report.totalXp}</Text>
            <Text style={styles.summaryLabel}>획득 XP</Text>
          </View>
        </View>

        {/* Daily Chart */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>일별 학습량</Text>
        <View style={styles.chartContainer}>
          {report.dailyBreakdown.length > 0 ? (
            <View style={styles.chart}>
              {report.dailyBreakdown.map((day, i) => {
                const heightPercent = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                return (
                  <View key={day.date} style={styles.barCol}>
                    <Text style={styles.barValue}>{day.count}</Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${Math.max(heightPercent, 4)}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{DAY_LABELS[i] ?? day.date.slice(-2)}</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.emptyText}>이번 주 학습 데이터가 없습니다.</Text>
          )}
        </View>

        {/* Insights placeholder */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>학습 인사이트</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightEmoji}>{'\u{1F4A1}'}</Text>
          <Text style={styles.insightText}>
            꾸준히 학습하면 더 정확한 분석을 제공할 수 있어요.{'\n'}매일 최소 1문장씩 작문해 보세요!
          </Text>
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
    padding: 20,
    paddingBottom: 40,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.text.secondary,
    marginTop: 4,
  },
  changeUp: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
    marginTop: 4,
  },
  changeDown: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
    marginTop: 4,
  },
  changeNeutral: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.text.hint,
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barValue: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  barTrack: {
    width: 24,
    height: 120,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
    marginTop: 6,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.hint,
    textAlign: 'center',
    paddingVertical: 20,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.hint.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.hint.border,
    gap: 12,
  },
  insightEmoji: {
    fontSize: 22,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: colors.text.secondary,
    lineHeight: 22,
  },
});
