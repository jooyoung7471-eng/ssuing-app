import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScoreDisplay from '../../components/ScoreDisplay';
import { useHistory } from '../../hooks/useHistory';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import type { HistoryDetail } from '../../types';

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fetchDetail } = useHistory();
  const [detail, setDetail] = useState<HistoryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchDetail(id).then((d) => {
        setDetail(d);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={[]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!detail) {
    return (
      <SafeAreaView style={styles.center} edges={[]}>
        <Text style={styles.errorText}>기록을 찾을 수 없습니다</Text>
      </SafeAreaView>
    );
  }

  const date = new Date(detail.createdAt);
  const dateStr = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.date}>{dateStr}</Text>

        <ScoreDisplay score={detail.score} />

        <View style={styles.section}>
          <Text style={styles.label}>한글 문장</Text>
          <Text style={styles.korean}>{detail.koreanText}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>내가 쓴 문장</Text>
          <View style={styles.textBox}>
            <Text style={styles.writing}>{detail.userWriting}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>교정된 문장</Text>
          <View style={[styles.textBox, styles.correctedBox]}>
            <Text style={styles.writing}>{detail.correctedSentence}</Text>
          </View>
        </View>

        {(detail.highlights || []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>수정 포인트</Text>
            {(detail.highlights || []).map((h, i) => (
              <View key={i} style={styles.highlightItem}>
                <View style={styles.highlightRow}>
                  <Text style={styles.originalWord}>{h.original}</Text>
                  <Text style={styles.arrow}>→</Text>
                  <Text style={styles.correctedWord}>{h.corrected}</Text>
                </View>
                <Text style={styles.reason}>{h.reason}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>설명</Text>
          <Text style={styles.explanation}>{detail.explanation}</Text>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  date: {
    ...typography.caption,
    color: colors.text.hint,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
  },
  label: {
    ...typography.caption,
    color: colors.text.hint,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  korean: {
    ...typography.h3,
    color: colors.text.primary,
  },
  textBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  correctedBox: {
    borderColor: colors.success + '40',
    backgroundColor: colors.success + '08',
  },
  writing: {
    ...typography.body,
    color: colors.text.primary,
  },
  highlightItem: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  originalWord: {
    ...typography.body,
    color: colors.error,
    textDecorationLine: 'line-through',
  },
  arrow: {
    ...typography.body,
    color: colors.text.hint,
  },
  correctedWord: {
    ...typography.bodyBold,
    color: colors.success,
  },
  reason: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  explanation: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
  },
});
