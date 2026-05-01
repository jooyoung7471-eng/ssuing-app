import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCorrection } from '../hooks/useCorrection';
import CorrectionResultView from '../components/CorrectionResult';
import api from '../services/api';
import { colors, getScoreColor } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius, shadows } from '../constants/spacing';
import type { Theme, Sentence, CorrectionResult, ReviewItem } from '../types';

type ThemeFilter = 'all' | Theme;
type Step = 1 | 2 | 3;

interface QuizResult {
  sentence: Sentence;
  correction: CorrectionResult;
  previousScore?: number; // 이전 점수 (비교용)
}

export default function ReviewScreen() {
  const router = useRouter();

  // Step management
  const [step, setStep] = useState<Step>(1);

  // Step 1: Settings
  const [themeFilter, setThemeFilter] = useState<ThemeFilter>('all');
  const [sentenceCount, setSentenceCount] = useState(10);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Step 2: Quiz
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [previousScores, setPreviousScores] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draft, setDraft] = useState('');
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [currentCorrection, setCurrentCorrection] = useState<CorrectionResult | null>(null);
  const { loading: correctionLoading, error: correctionError, submit, reset: resetCorrection } = useCorrection();
  const submittingRef = useRef(false);

  // Step 3 derived values
  const averageScore =
    quizResults.length > 0
      ? quizResults.reduce((sum, r) => sum + r.correction.score, 0) / quizResults.length
      : 0;

  const bestResult =
    quizResults.length > 0
      ? quizResults.reduce((best, r) => (r.correction.score > best.correction.score ? r : best), quizResults[0])
      : null;

  const worstResult =
    quizResults.length > 0
      ? quizResults.reduce((worst, r) => (r.correction.score < worst.correction.score ? r : worst), quizResults[0])
      : null;

  const keyExpressions = (quizResults || [])
    .filter((r) => r.correction?.keyExpression)
    .map((r) => r.correction.keyExpression!);

  // Combo calculation: longest streak of score >= 7
  const calculateCombo = (): number => {
    let maxCombo = 0;
    let currentCombo = 0;
    for (const r of quizResults) {
      if (r.correction.score >= 7) {
        currentCombo++;
        maxCombo = Math.max(maxCombo, currentCombo);
      } else {
        currentCombo = 0;
      }
    }
    return maxCombo;
  };

  // Improved sentences count (score improved from previous attempt)
  const improvedCount = (quizResults || []).filter(
    (r) => r.previousScore !== undefined && r.correction.score > r.previousScore
  ).length;

  // Bonus XP: 5 XP per review sentence
  const bonusXp = (quizResults || []).length * 5;

  // Step 1 handlers
  const handleStartReview = async () => {
    setSettingsLoading(true);
    setSettingsError(null);
    try {
      const params: Record<string, string | number> = { limit: sentenceCount };
      if (themeFilter !== 'all') params.theme = themeFilter;
      const res = await api.get('/review/weak', { params });
      const data: ReviewItem[] = Array.isArray(res.data?.data) ? res.data.data : [];
      if (data.length === 0) {
        setSettingsError('복습할 문장이 없습니다. 먼저 학습을 진행해 주세요.');
        setSettingsLoading(false);
        return;
      }
      // Store previous scores for comparison
      const prevScores: Record<string, number> = {};
      data.forEach((item: ReviewItem) => {
        const sid = item.sentenceId || item.id;
        prevScores[sid] = item.score;
      });
      setPreviousScores(prevScores);

      // Map ReviewItems to Sentence-like objects
      const mapped: Sentence[] = data.map((item: ReviewItem, idx: number) => ({
        id: item.sentenceId || item.id,
        koreanText: item.koreanText,
        theme: (themeFilter !== 'all' ? themeFilter : 'daily') as Theme,
        difficulty: 0,
        hintWords: [],
        order: idx,
        isCompleted: false,
      }));
      setSentences(mapped);
      setCurrentIndex(0);
      setQuizResults([]);
      setCurrentCorrection(null);
      setDraft('');
      resetCorrection();
      setStep(2);
    } catch (e: any) {
      const msg = e?.response?.data?.error?.message || e?.message || '복습 데이터를 불러오는데 실패했습니다.';
      setSettingsError(msg);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Step 2 handlers
  const currentSentence = sentences[currentIndex];
  const isCurrentSubmitted = !!currentCorrection;

  const handleSubmit = async () => {
    if (!currentSentence || submittingRef.current) return;
    if (draft.length < 10) return;

    submittingRef.current = true;
    try {
      const result = await submit(currentSentence.id, draft, undefined, currentSentence.koreanText);
      if (result) {
        setCurrentCorrection(result);
        setQuizResults((prev) => [
          ...prev,
          {
            sentence: currentSentence,
            correction: result,
            previousScore: previousScores[currentSentence.id],
          },
        ]);
      }
    } finally {
      submittingRef.current = false;
    }
  };

  const handleNext = () => {
    if (currentIndex < (sentences || []).length - 1) {
      setCurrentIndex(currentIndex + 1);
      setDraft('');
      setCurrentCorrection(null);
      resetCorrection();
    } else {
      // All done
      setStep(3);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // Show previous result if available
      const prevResult = (quizResults || []).find(
        (r) => r.sentence.id === (sentences || [])[currentIndex - 1]?.id
      );
      if (prevResult) {
        setCurrentCorrection(prevResult.correction);
        setDraft(prevResult.correction.userWriting);
      } else {
        setCurrentCorrection(null);
        setDraft('');
      }
      resetCorrection();
    }
  };

  const progressPercent = (sentences || []).length > 0 ? ((currentIndex + (isCurrentSubmitted ? 1 : 0)) / sentences.length) * 100 : 0;

  // Render Step 1: Settings
  const renderStep1 = () => {
    const themeOptions: { label: string; value: ThemeFilter }[] = [
      { label: '전체', value: 'all' },
      { label: '일상', value: 'daily' },
      { label: '비즈니스', value: 'business' },
      { label: '여행', value: 'travel' },
    ];
    const countOptions = [5, 10, 15, 20];

    return (
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsTitle}>복습 설정</Text>
        <Text style={styles.settingsSubtitle}>
          점수 낮은 문장을 다시 연습합니다
        </Text>

        {/* Theme chips */}
        <Text style={styles.settingsLabel}>테마</Text>
        <View style={styles.chipRow}>
          {themeOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.chip,
                themeFilter === opt.value && styles.chipActive,
              ]}
              onPress={() => setThemeFilter(opt.value)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  themeFilter === opt.value && styles.chipTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sentence count */}
        <Text style={styles.settingsLabel}>문장 수</Text>
        <View style={styles.chipRow}>
          {countOptions.map((count) => (
            <TouchableOpacity
              key={count}
              style={[
                styles.countButton,
                sentenceCount === count && styles.countButtonActive,
              ]}
              onPress={() => setSentenceCount(count)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.countButtonText,
                  sentenceCount === count && styles.countButtonTextActive,
                ]}
              >
                {count}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Error message */}
        {settingsError && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
            <Text style={styles.errorBoxText}>{settingsError}</Text>
          </View>
        )}

        {/* Start button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartReview}
          disabled={settingsLoading}
          activeOpacity={0.8}
        >
          {settingsLoading ? (
            <ActivityIndicator size="small" color={colors.text.inverse} />
          ) : (
            <Text style={styles.startButtonText}>복습 시작</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Render Step 2: Quiz
  const renderStep2 = () => {
    if (!currentSentence) return null;

    return (
      <View style={styles.quizContainer}>
        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarBg}>
            <View
              style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1}/{(sentences || []).length}
          </Text>
        </View>

        {/* Sentence card */}
        <View style={styles.quizCard}>
          <Text style={styles.quizKorean}>{currentSentence.koreanText}</Text>
          {(currentSentence.hintWords || []).length > 0 && (
            <View style={styles.hintRow}>
              {(currentSentence.hintWords || []).map((hw, i) => (
                <View key={i} style={styles.hintChip}>
                  <Text style={styles.hintText}>
                    {hw.english} ({hw.korean})
                  </Text>
                </View>
              ))}
            </View>
          )}
          {/* Show previous score if available */}
          {previousScores[currentSentence.id] !== undefined && (
            <View style={styles.prevScoreRow}>
              <Text style={styles.prevScoreLabel}>이전 점수:</Text>
              <Text style={[styles.prevScoreValue, { color: getScoreColor(previousScores[currentSentence.id]) }]}>
                {previousScores[currentSentence.id]}/10
              </Text>
            </View>
          )}
        </View>

        {/* Input */}
        {!isCurrentSubmitted && (
          <View style={styles.inputSection}>
            <TextInput
              style={styles.quizInput}
              placeholder="영어 문장을 작성하세요..."
              placeholderTextColor={colors.text.hint}
              value={draft}
              onChangeText={setDraft}
              multiline
              textAlignVertical="top"
              editable={!correctionLoading}
            />
            <TouchableOpacity
              style={[
                styles.submitButton,
                draft.length < 10 && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={draft.length < 10 || correctionLoading}
              activeOpacity={0.8}
            >
              {correctionLoading ? (
                <ActivityIndicator size="small" color={colors.text.inverse} />
              ) : (
                <Text style={styles.submitButtonText}>제출</Text>
              )}
            </TouchableOpacity>
            {correctionError && (
              <Text style={styles.errorText}>{correctionError}</Text>
            )}
          </View>
        )}

        {/* Correction result */}
        {isCurrentSubmitted && (
          <View style={styles.correctionSection}>
            <CorrectionResultView
              result={currentCorrection}
              loading={false}
              error={null}
            />
            {/* Score improvement indicator */}
            {previousScores[currentSentence.id] !== undefined && currentCorrection && (
              <View style={styles.improvementRow}>
                {currentCorrection.score > previousScores[currentSentence.id] ? (
                  <Text style={styles.improvedText}>
                    {'\u2191'} 성장했어요! ({previousScores[currentSentence.id]} {'\u2192'} {currentCorrection.score})
                  </Text>
                ) : currentCorrection.score === previousScores[currentSentence.id] ? (
                  <Text style={styles.sameText}>
                    {'\u2194'} 동일한 점수 ({currentCorrection.score})
                  </Text>
                ) : (
                  <Text style={styles.declinedText}>
                    {'\u2193'} 아쉬워요 ({previousScores[currentSentence.id]} {'\u2192'} {currentCorrection.score})
                  </Text>
                )}
              </View>
            )}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>
                {currentIndex < (sentences || []).length - 1 ? '다음' : '결과 보기'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.text.inverse} />
            </TouchableOpacity>
          </View>
        )}

        {/* Navigation */}
        <View style={styles.quizNavRow}>
          <TouchableOpacity
            onPress={handlePrev}
            disabled={currentIndex === 0}
            style={[
              styles.navButton,
              currentIndex === 0 && styles.navButtonDisabled,
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={currentIndex > 0 ? colors.primary : colors.disabled}
            />
            <Text
              style={[
                styles.navText,
                currentIndex === 0 && styles.navTextDisabled,
              ]}
            >
              이전
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render Step 3: Results with gamification
  const renderStep3 = () => {
    const scoreColor = getScoreColor(averageScore);
    const combo = calculateCombo();
    const scorePercent = Math.round(averageScore * 10); // 0~100%

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>복습 완료!</Text>

        {/* Average score card with progress gauge */}
        <View style={styles.avgScoreCard}>
          <Text style={styles.avgScoreLabel}>평균 점수</Text>
          <Text style={[styles.avgScoreNumber, { color: scoreColor }]}>
            {averageScore.toFixed(1)}/10
          </Text>
          {/* Progress bar gauge */}
          <View style={styles.gaugeBarBg}>
            <View
              style={[
                styles.gaugeBarFill,
                {
                  width: `${scorePercent}%`,
                  backgroundColor: scoreColor,
                },
              ]}
            />
          </View>
          <Text style={[styles.gaugePercent, { color: scoreColor }]}>
            {scorePercent}%
          </Text>
        </View>

        {/* Gamification badges */}
        <View style={styles.gamificationRow}>
          {combo >= 3 && (
            <View style={styles.gamiBadge}>
              <Text style={styles.gamiBadgeEmoji}>{'\uD83D\uDD25'}</Text>
              <Text style={styles.gamiBadgeText}>{combo}문장 연속 7점 이상!</Text>
            </View>
          )}
          <View style={styles.gamiBadge}>
            <Text style={styles.gamiBadgeEmoji}>{'\uD83D\uDD04'}</Text>
            <Text style={styles.gamiBadgeText}>복습 보너스 +{bonusXp} XP</Text>
          </View>
          {improvedCount > 0 && (
            <View style={styles.gamiBadge}>
              <Text style={styles.gamiBadgeEmoji}>{'\uD83D\uDCC8'}</Text>
              <Text style={styles.gamiBadgeText}>향상: {improvedCount}문장</Text>
            </View>
          )}
        </View>

        {/* Best / Worst */}
        <View style={styles.bestWorstRow}>
          {bestResult && (
            <View style={[styles.bestWorstCard, styles.bestCard]}>
              <Text style={styles.bestWorstLabel}>Best</Text>
              <Text style={styles.bestWorstScore}>
                {bestResult.correction.score}/10
              </Text>
              <Text style={styles.bestWorstText} numberOfLines={2}>
                {bestResult.sentence.koreanText}
              </Text>
            </View>
          )}
          {worstResult && (
            <View style={[styles.bestWorstCard, styles.worstCard]}>
              <Text style={styles.bestWorstLabel}>Worst</Text>
              <Text style={styles.bestWorstScore}>
                {worstResult.correction.score}/10
              </Text>
              <Text style={styles.bestWorstText} numberOfLines={2}>
                {worstResult.sentence.koreanText}
              </Text>
            </View>
          )}
        </View>

        {/* Key expressions */}
        {(keyExpressions || []).length > 0 && (
          <View style={styles.keyExpressionsSection}>
            <Text style={styles.keyExpressionsTitle}>
              {'\uD83D\uDCA1'} 핵심 표현 복습
            </Text>
            {(keyExpressions || []).map((expr, i) => (
              <View key={i} style={styles.keyExprItem}>
                <Text style={styles.keyExprBullet}>{'\u2022'}</Text>
                <View style={styles.keyExprContent}>
                  <Text style={styles.keyExprEnglish}>{expr.english}</Text>
                  <Text style={styles.keyExprKorean}>({expr.korean})</Text>
                  <Text style={styles.keyExprExample}>예문: {expr.example}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>상세 결과</Text>
          {(quizResults || []).map((r, i) => {
            const sc = getScoreColor(r.correction.score);
            const improved = r.previousScore !== undefined && r.correction.score > r.previousScore;
            return (
              <View key={i} style={styles.detailItem}>
                <View
                  style={[
                    styles.detailScoreBadge,
                    { backgroundColor: sc + '20' },
                  ]}
                >
                  <Text style={[styles.detailScore, { color: sc }]}>
                    {r.correction.score}
                  </Text>
                </View>
                <View style={styles.detailTextCol}>
                  <Text style={styles.detailKorean} numberOfLines={1}>
                    {r.sentence.koreanText}
                  </Text>
                  <Text style={styles.detailUserWriting} numberOfLines={1}>
                    {r.correction.userWriting}
                  </Text>
                </View>
                {improved && (
                  <View style={styles.improvedBadge}>
                    <Text style={styles.improvedBadgeText}>{'\u2191'}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Home button */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="home-outline" size={18} color={colors.text.inverse} />
          <Text style={styles.homeButtonText}>홈으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
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
    paddingBottom: spacing.xxxl,
  },

  // Step 1: Settings
  settingsContainer: {},
  settingsTitle: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  } as any,
  settingsSubtitle: {
    ...typography.bodySmall,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  } as any,
  settingsLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  } as any,
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text.secondary,
  } as any,
  chipTextActive: {
    color: colors.text.inverse,
  },
  countButton: {
    width: 52,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countButtonActive: {
    backgroundColor: colors.primary,
  },
  countButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  countButtonTextActive: {
    color: colors.text.inverse,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.errorLight,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  errorBoxText: {
    ...typography.bodySmall,
    fontSize: 14,
    color: colors.error,
    flex: 1,
  } as any,
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
    ...shadows.primary,
  },
  startButtonText: {
    ...typography.button,
    color: colors.text.inverse,
  } as any,

  // Step 2: Quiz
  quizContainer: {},
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.disabled,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text.secondary,
  } as any,
  quizCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  quizKorean: {
    ...typography.h3,
    color: colors.text.primary,
    lineHeight: 28,
  } as any,
  hintRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  hintChip: {
    backgroundColor: colors.hint.background,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.hint.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  hintText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.secondary,
  },
  prevScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  prevScoreLabel: {
    ...typography.bodySmall,
    color: colors.text.hint,
  } as any,
  prevScoreValue: {
    ...typography.bodySmall,
    fontWeight: '700',
  } as any,
  inputSection: {
    marginBottom: spacing.md,
  },
  quizInput: {
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 15,
    color: colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: spacing.sm,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.primary,
  },
  submitButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    ...typography.button,
    color: colors.text.inverse,
  } as any,
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.xs,
  } as any,
  correctionSection: {
    marginBottom: spacing.md,
  },
  improvementRow: {
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.successLight,
    alignItems: 'center',
  },
  improvedText: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.success,
  } as any,
  sameText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text.hint,
  } as any,
  declinedText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.error,
  } as any,
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    ...shadows.primary,
  },
  nextButtonText: {
    ...typography.button,
    color: colors.text.inverse,
  } as any,
  quizNavRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: spacing.xs,
    paddingBottom: spacing.lg,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
  },
  navButtonDisabled: {
    backgroundColor: colors.surfaceAlt,
  },
  navText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.primary,
  } as any,
  navTextDisabled: {
    color: colors.disabled,
  },

  // Step 3: Results
  resultsContainer: {},
  resultsTitle: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  } as any,
  avgScoreCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  avgScoreLabel: {
    ...typography.body,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: spacing.xxs,
  } as any,
  avgScoreNumber: {
    ...typography.score,
  } as any,
  gaugeBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: colors.disabled,
    borderRadius: 6,
    overflow: 'hidden',
  },
  gaugeBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  gaugePercent: {
    ...typography.bodySmall,
    fontWeight: '700',
    marginTop: 6,
  } as any,

  // Gamification badges
  gamificationRow: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  gamiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  gamiBadgeEmoji: {
    fontSize: 18,
  },
  gamiBadgeText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text.primary,
  } as any,

  bestWorstRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  bestWorstCard: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  bestCard: {
    backgroundColor: colors.successLight,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  worstCard: {
    backgroundColor: colors.errorLight,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  bestWorstLabel: {
    ...typography.label,
    color: colors.text.hint,
    marginBottom: spacing.xxs,
  } as any,
  bestWorstScore: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 6,
  },
  bestWorstText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    lineHeight: 18,
  } as any,
  keyExpressionsSection: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  keyExpressionsTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  } as any,
  keyExprItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    gap: 6,
  },
  keyExprBullet: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: 1,
  } as any,
  keyExprContent: {
    flex: 1,
  },
  keyExprEnglish: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primary,
  } as any,
  keyExprKorean: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: 2,
  } as any,
  keyExprExample: {
    fontSize: 12,
    color: colors.text.hint,
    fontStyle: 'italic',
    marginTop: 2,
  },
  detailsSection: {
    marginBottom: spacing.lg,
  },
  detailsTitle: {
    ...typography.bodyBold,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  } as any,
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  detailScoreBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailScore: {
    fontSize: 16,
    fontWeight: '800',
  },
  detailTextCol: {
    flex: 1,
  },
  detailKorean: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text.primary,
  } as any,
  detailUserWriting: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  improvedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  improvedBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.success,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
    ...shadows.primary,
  },
  homeButtonText: {
    ...typography.button,
    color: colors.text.inverse,
  } as any,
});
