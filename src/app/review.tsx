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
      const result = await submit(currentSentence.id, draft);
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
            <ActivityIndicator size="small" color="#FFFFFF" />
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
                <ActivityIndicator size="small" color="#FFFFFF" />
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
              <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
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
              color={currentIndex > 0 ? '#2563EB' : '#D1D5DB'}
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
          <Ionicons name="home-outline" size={18} color="#FFFFFF" />
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
    padding: 20,
    paddingBottom: 40,
  },

  // Step 1: Settings
  settingsContainer: {},
  settingsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  settingsSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 24,
  },
  settingsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 10,
    marginTop: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  chipActive: {
    backgroundColor: '#2563EB',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  countButton: {
    width: 52,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countButtonActive: {
    backgroundColor: '#2563EB',
  },
  countButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  countButtonTextActive: {
    color: '#FFFFFF',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.errorLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  errorBoxText: {
    fontSize: 14,
    color: colors.error,
    flex: 1,
  },
  startButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Step 2: Quiz
  quizContainer: {},
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  quizCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  quizKorean: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    lineHeight: 28,
  },
  hintRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  hintChip: {
    backgroundColor: colors.hint.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.hint.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
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
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  prevScoreLabel: {
    fontSize: 13,
    color: colors.text.hint,
  },
  prevScoreValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  inputSection: {
    marginBottom: 16,
  },
  quizInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    fontSize: 15,
    color: colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 8,
  },
  correctionSection: {
    marginBottom: 16,
  },
  improvementRow: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
  },
  improvedText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
  },
  sameText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.hint,
  },
  declinedText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 16,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quizNavRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
    paddingBottom: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
  },
  navButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  navTextDisabled: {
    color: '#D1D5DB',
  },

  // Step 3: Results
  resultsContainer: {},
  resultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  avgScoreCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 28,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avgScoreLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  avgScoreNumber: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 12,
  },
  gaugeBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  gaugeBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  gaugePercent: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },

  // Gamification badges
  gamificationRow: {
    marginBottom: 16,
    gap: 8,
  },
  gamiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  gamiBadgeEmoji: {
    fontSize: 18,
  },
  gamiBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },

  bestWorstRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  bestWorstCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
  },
  bestCard: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 3,
    borderLeftColor: '#16A34A',
  },
  worstCard: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  bestWorstLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.hint,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bestWorstScore: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 6,
  },
  bestWorstText: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  keyExpressionsSection: {
    backgroundColor: '#E3F2FD',
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
    padding: 16,
    marginBottom: 20,
  },
  keyExpressionsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 12,
  },
  keyExprItem: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 6,
  },
  keyExprBullet: {
    fontSize: 14,
    color: '#2563EB',
    marginTop: 1,
  },
  keyExprContent: {
    flex: 1,
  },
  keyExprEnglish: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  keyExprKorean: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  keyExprExample: {
    fontSize: 12,
    color: colors.text.hint,
    fontStyle: 'italic',
    marginTop: 2,
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  detailScoreBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
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
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  detailUserWriting: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  improvedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  improvedBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16A34A',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
