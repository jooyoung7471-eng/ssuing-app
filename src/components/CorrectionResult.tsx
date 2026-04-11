import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../constants/colors';
import ScoreDisplay from './ScoreDisplay';
import type { CorrectionResult as CorrectionResultType } from '../types';

interface CorrectionResultProps {
  result: CorrectionResultType | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export default function CorrectionResult({
  result,
  loading,
  error,
  onRetry,
}: CorrectionResultProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>AI가 분석 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        {onRetry && (
          <Text style={styles.retryText} onPress={onRetry}>
            다시 시도
          </Text>
        )}
      </View>
    );
  }

  if (!result) return null;

  return (
    <Animated.View entering={FadeInDown.duration(400)}>
      {/* Score */}
      <ScoreDisplay score={result.score} />

      {/* My writing */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>내 작문</Text>
        <View style={styles.myCard}>
          <Text style={styles.myText}>{result.userWriting}</Text>
        </View>
      </View>

      {/* Corrected sentence */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>교정 문장</Text>
        <View style={styles.correctedCard}>
          <Text style={styles.correctedText}>{result.correctedSentence}</Text>
        </View>
      </View>

      {/* Highlights */}
      {(result.highlights || []).length > 0 && (
        <View style={styles.highlightsSection}>
          <Text style={styles.highlightsTitle}>수정 포인트</Text>
          {(result.highlights || []).map((h, i) => (
            <View key={i} style={styles.highlightItem}>
              <View style={styles.highlightRow}>
                <Text style={styles.originalWord}>{h.original}</Text>
                <Text style={styles.arrow}>{'\u2192'}</Text>
                <Text style={styles.correctedWord}>{h.corrected}</Text>
              </View>
              <Text style={styles.reason}>{h.reason}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Explanation */}
      <View style={styles.explanationSection}>
        <Text style={styles.explanationTitle}>설명</Text>
        <Text style={styles.explanationText}>{result.explanation}</Text>
      </View>

      {/* Native Expressions */}
      {(result.nativeExpressions || []).length > 0 && (
        <View style={styles.nativeExpressionsCard}>
          <Text style={styles.nativeExpressionsTitle}>이렇게도 말할 수 있어요</Text>
          {(result.nativeExpressions || []).map((expr, i) => (
            <Text key={i} style={styles.nativeExpressionItem}>
              {'\u2022'} {expr}
            </Text>
          ))}
        </View>
      )}

      {/* Key Expression */}
      {result.keyExpression && (
        <View style={styles.keyExpressionCard}>
          <Text style={styles.keyExpressionTitle}>
            {'\u{1F4A1}'} 오늘의 핵심 표현
          </Text>
          <Text style={styles.keyExpressionEnglish}>
            {result.keyExpression.english}
          </Text>
          <Text style={styles.keyExpressionKorean}>
            {result.keyExpression.korean}
          </Text>
          <Text style={styles.keyExpressionExample}>
            예문: {result.keyExpression.example}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.hint,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  myCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
    padding: 20,
  },
  myText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.secondary,
    lineHeight: 24,
  },
  correctedCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#16A34A',
    padding: 20,
  },
  correctedText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    lineHeight: 24,
  },
  highlightsSection: {
    marginTop: 20,
    backgroundColor: colors.warningLight,
    borderRadius: 12,
    padding: 16,
  },
  highlightsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.warning,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  highlightItem: {
    marginBottom: 8,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  originalWord: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.error,
    textDecorationLine: 'line-through',
  },
  arrow: {
    fontSize: 14,
    color: colors.text.hint,
  },
  correctedWord: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
  },
  reason: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.text.secondary,
  },
  explanationSection: {
    marginTop: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  explanationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.hint,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  explanationText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text.secondary,
    lineHeight: 22,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.secondary,
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.errorLight,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.error,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 12,
  },
  nativeExpressionsCard: {
    marginTop: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#16A34A',
    padding: 16,
  },
  nativeExpressionsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
    marginBottom: 10,
  },
  nativeExpressionItem: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: 2,
  },
  keyExpressionCard: {
    marginTop: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
    padding: 16,
  },
  keyExpressionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 10,
  },
  keyExpressionEnglish: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
  },
  keyExpressionKorean: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text.secondary,
    marginBottom: 6,
  },
  keyExpressionExample: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.text.secondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
