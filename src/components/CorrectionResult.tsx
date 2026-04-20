import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn, withDelay, withSpring } from 'react-native-reanimated';
import { colors, getScoreColor } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius, shadows } from '../constants/spacing';
import ScoreDisplay from './ScoreDisplay';
import type { CorrectionResult as CorrectionResultType } from '../types';

interface CorrectionResultProps {
  result: CorrectionResultType | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

// Grading steps checklist
const GRADING_STEPS = [
  { label: '문법 구조 분석', delay: 800 },
  { label: '어휘 적합성 검토', delay: 1600 },
  { label: '자연스러움 평가', delay: 2400 },
];

function GradingChecklist() {
  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    const timers = GRADING_STEPS.map((step, i) =>
      setTimeout(() => setCompletedSteps(i + 1), step.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <View style={styles.gradingContainer}>
      {/* Spinner */}
      <View style={styles.spinnerWrapper}>
        <View style={styles.spinnerOuter}>
          <Text style={styles.spinnerEmoji}>{'\u{1F916}'}</Text>
        </View>
      </View>

      <Text style={styles.gradingTitle}>AI가 문장을 분석하고 있어요</Text>
      <Text style={styles.gradingSubtitle}>
        문법 · 어순 · 자연스러움{'\n'}세 가지 관점으로 교정 중입니다
      </Text>

      {/* Steps */}
      <View style={styles.stepsContainer}>
        {GRADING_STEPS.map((step, i) => {
          const isDone = i < completedSteps;
          const isActive = i === completedSteps;
          return (
            <Animated.View
              key={i}
              style={[
                styles.stepRow,
                isActive && styles.stepRowActive,
              ]}
            >
              <View style={[
                styles.stepIcon,
                isDone && styles.stepIconDone,
                isActive && styles.stepIconActive,
              ]}>
                {isDone ? (
                  <Animated.Text
                    entering={ZoomIn.duration(300).springify()}
                    style={styles.stepCheck}
                  >
                    {'\u2713'}
                  </Animated.Text>
                ) : null}
              </View>
              <Text style={[
                styles.stepLabel,
                isDone && styles.stepLabelDone,
                isActive && styles.stepLabelActive,
              ]}>
                {step.label}
              </Text>
              {isActive && (
                <Text style={styles.stepEllipsis}>{'\u2026'}</Text>
              )}
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

export default function CorrectionResult({
  result,
  loading,
  error,
  onRetry,
}: CorrectionResultProps) {
  if (loading) {
    return <GradingChecklist />;
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

  const scoreColor = getScoreColor(result.score);

  return (
    <Animated.View entering={FadeInDown.duration(400)}>
      {/* Score section */}
      <View style={[styles.scoreCard, { borderColor: scoreColor + '40' }]}>
        <ScoreDisplay score={result.score} />
      </View>

      {/* My writing */}
      <Animated.View entering={FadeInUp.delay(100).duration(300)} style={styles.section}>
        <Text style={styles.sectionLabel}>YOUR ANSWER</Text>
        <View style={styles.myCard}>
          <Text style={styles.myText}>{result.userWriting}</Text>
        </View>
      </Animated.View>

      {/* Corrected sentence */}
      <Animated.View entering={FadeInUp.delay(200).duration(300)} style={styles.section}>
        <Text style={styles.correctedLabel}>{'\u2728'} CORRECTED</Text>
        <View style={styles.correctedCard}>
          <Text style={styles.correctedText}>{result.correctedSentence}</Text>
        </View>
      </Animated.View>

      {/* Highlights / correction points */}
      {(result.highlights || []).length > 0 && (
        <Animated.View entering={FadeInUp.delay(300).duration(300)} style={styles.highlightsSection}>
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
        </Animated.View>
      )}

      {/* Explanation */}
      <Animated.View entering={FadeInUp.delay(400).duration(300)} style={styles.explanationSection}>
        <View style={styles.explanationHeader}>
          <Text style={styles.explanationIcon}>{'\u{1F4D6}'}</Text>
          <Text style={styles.explanationTitle}>왜 이렇게 바뀌었나요?</Text>
        </View>
        <Text style={styles.explanationText}>{result.explanation}</Text>
      </Animated.View>

      {/* Key Expression */}
      {result.keyExpression && (
        <Animated.View entering={FadeInUp.delay(500).duration(300)} style={styles.keyExpressionCard}>
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
        </Animated.View>
      )}

      {/* Native Expressions */}
      {(result.nativeExpressions || []).length > 0 && (
        <Animated.View entering={FadeInUp.delay(600).duration(300)} style={styles.nativeExpressionsCard}>
          <Text style={styles.nativeExpressionsTitle}>이렇게도 말할 수 있어요</Text>
          {(result.nativeExpressions || []).map((expr, i) => (
            <Text key={i} style={styles.nativeExpressionItem}>
              {'\u2022'} {expr}
            </Text>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // --- Grading (loading) state ---
  gradingContainer: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
  },
  spinnerWrapper: {
    marginBottom: spacing.md,
  },
  spinnerOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: colors.primary,
    borderTopColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerEmoji: {
    fontSize: 28,
  },
  gradingTitle: {
    ...typography.body,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.xxs,
    textAlign: 'center',
  } as any,
  gradingSubtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
  } as any,
  stepsContainer: {
    width: '100%',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.xs,
  },
  stepRowActive: {
    backgroundColor: colors.primaryLight,
  },
  stepIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconDone: {
    backgroundColor: colors.success,
  },
  stepIconActive: {
    backgroundColor: colors.primary,
  },
  stepCheck: {
    color: colors.text.inverse,
    fontSize: 11,
    fontWeight: '800',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.hint,
    flex: 1,
  },
  stepLabelDone: {
    color: colors.text.secondary,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  stepEllipsis: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },

  // --- Error state ---
  errorContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.errorLight,
    borderRadius: radius.sm,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
  } as any,
  retryText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.sm,
  } as any,

  // --- Result state ---
  scoreCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.sm,
    ...shadows.sm,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  } as any,
  myCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: spacing.md,
  },
  myText: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 24,
  } as any,
  correctedLabel: {
    ...typography.label,
    color: colors.success,
    marginBottom: spacing.xs,
  } as any,
  correctedCard: {
    backgroundColor: colors.successLight,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
    padding: spacing.md,
  },
  correctedText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
    lineHeight: 24,
  } as any,
  highlightsSection: {
    marginTop: spacing.lg,
    backgroundColor: colors.warningLight,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  highlightsTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.warning,
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  } as any,
  highlightItem: {
    marginBottom: spacing.xs,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: 2,
  },
  originalWord: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
    textDecorationLine: 'line-through',
    flexShrink: 1,
  },
  arrow: {
    fontSize: 14,
    color: colors.text.hint,
  },
  correctedWord: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
    flexShrink: 1,
  },
  reason: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.text.secondary,
    lineHeight: 18,
  },
  explanationSection: {
    marginTop: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  explanationIcon: {
    fontSize: 16,
  },
  explanationTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.2,
  },
  explanationText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    lineHeight: 20,
  } as any,
  keyExpressionCard: {
    marginTop: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: spacing.md,
  },
  keyExpressionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  keyExpressionEnglish: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  keyExpressionKorean: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.text.secondary,
    marginBottom: 6,
  },
  keyExpressionExample: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.text.secondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  nativeExpressionsCard: {
    marginTop: spacing.md,
    backgroundColor: colors.successLight,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
    padding: spacing.md,
  },
  nativeExpressionsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
    marginBottom: spacing.sm,
  },
  nativeExpressionItem: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: 2,
  },
});
