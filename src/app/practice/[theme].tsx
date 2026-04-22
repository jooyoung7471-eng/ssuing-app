import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SentenceCard from '../../components/SentenceCard';
import WritingInput from '../../components/WritingInput';
import CorrectionResultView from '../../components/CorrectionResult';
import CompletionModal from '../../components/CompletionModal';
import XpNotification from '../../components/XpNotification';
import AchievementModal from '../../components/AchievementModal';
import { useDailySentences } from '../../hooks/useDailySentences';
import { useCorrection } from '../../hooks/useCorrection';
import { usePracticeStore } from '../../stores/practiceStore';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, radius, shadows } from '../../constants/spacing';
import type { Theme } from '../../types';

const THEME_GRADIENTS: Record<string, [string, string]> = {
  daily: [colors.primary, colors.primaryDark],
  travel: [colors.theme.travel, '#065F46'],
  business: [colors.secondary, colors.secondaryDark],
};

export default function PracticeScreen() {
  const { theme } = useLocalSearchParams<{ theme: Theme }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { sentences, loading: sentencesLoading, error: sentencesError, fetch: fetchSentences } = useDailySentences();
  const { result, loading: correctionLoading, error: correctionError, submit, reset: resetCorrection } = useCorrection();

  const store = usePracticeStore();
  const {
    currentIndex,
    corrections,
    drafts,
    completionShown,
    setCurrentIndex,
    setCorrection,
    setDraft,
    setSentences: storeSentences,
    setCompletionShown,
    resetForTheme,
  } = store;

  const scrollRef = useRef<ScrollView>(null);
  const inputSectionRef = useRef<View>(null);
  const [localDraft, setLocalDraft] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const [xpLevelUp, setXpLevelUp] = useState(false);
  const [xpNewLevel, setXpNewLevel] = useState<number | undefined>(undefined);
  const [pendingAchievements, setPendingAchievements] = useState<{ type: string; title: string; emoji: string }[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const draftRef = useRef('');
  const submittingRef = useRef(false);

  const themeTitle = theme === 'daily' ? '일상 영어' : theme === 'travel' ? '여행 영어' : '비즈니스 영어';
  const themeEmoji = theme === 'daily' ? '\u2615' : theme === 'travel' ? '\u{2708}\u{FE0F}' : '\u{1F4BC}';
  const gradientColors = THEME_GRADIENTS[theme || 'daily'] || THEME_GRADIENTS.daily;

  // [Fix 1] Only reset store when switching themes, preserve on re-entry
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    if (theme) {
      resetForTheme(theme);
      AsyncStorage.getItem('engwrite_difficulty').then((saved) => {
        const diff = saved === 'intermediate' ? 'intermediate' : 'beginner';
        fetchSentences(theme, diff as any);
      });
    }
  }, [theme]);

  useEffect(() => {
    if ((sentences || []).length > 0) {
      storeSentences(sentences);
    }
  }, [sentences]);

  const safeSentences = sentences || [];
  const currentSentence = safeSentences[currentIndex];
  const currentCorrection = currentSentence ? corrections[currentSentence.id] : null;
  const isCompleted = !!currentCorrection;

  const completedCount = Object.keys(corrections || {}).length;
  const allCompleted = safeSentences.length > 0 && completedCount >= safeSentences.length;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < safeSentences.length - 1;

  // [Fix 2] When switching sentence: show submitted text if completed, otherwise show draft
  useEffect(() => {
    if (currentSentence) {
      const existingCorrection = corrections[currentSentence.id];
      if (existingCorrection) {
        setLocalDraft(existingCorrection.userWriting);
        draftRef.current = existingCorrection.userWriting;
      } else {
        const savedDraft = drafts[currentSentence.id] || '';
        setLocalDraft(savedDraft);
        draftRef.current = savedDraft;
      }
      resetCorrection();
    }
  }, [currentIndex, currentSentence?.id]);

  const handleNext = () => {
    if (canGoNext) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (canGoPrev) setCurrentIndex(currentIndex - 1);
  };

  const handleDraftChange = (text: string) => {
    setLocalDraft(text);
    draftRef.current = text;
    if (currentSentence) {
      setDraft(currentSentence.id, text);
    }
  };

  // [Fix 3] Prevent double submission
  const handleSubmit = async () => {
    if (!currentSentence) return;
    if (submittingRef.current) return;
    if (corrections[currentSentence.id]) return;
    const writing = draftRef.current;
    if (writing.length < 10) return;

    submittingRef.current = true;
    const correctionResult = await submit(currentSentence.id, writing, undefined, currentSentence.koreanText);
    submittingRef.current = false;

    if (correctionResult) {
      setCorrection(currentSentence.id, correctionResult);

      if (correctionResult.xpEarned) {
        setXpEarned(correctionResult.xpEarned);
        setXpLevelUp(!!correctionResult.levelUp);
        setXpNewLevel(correctionResult.newLevel);
      }
      if ((correctionResult.newAchievements || []).length > 0) {
        setPendingAchievements(correctionResult.newAchievements || []);
        setShowAchievement(true);
      }

      // [Fix 4] Check completion with fresh count
      const newCount = Object.keys(usePracticeStore.getState().corrections || {}).length;
      if (newCount >= safeSentences.length && !completionShown) {
        setTimeout(() => setShowModal(true), 1000);
      }
    }
  };

  const handleRetry = async () => {
    if (!currentSentence || submittingRef.current) return;
    submittingRef.current = true;
    try {
      const correctionResult = await submit(currentSentence.id, draftRef.current, undefined, currentSentence.koreanText);
      if (correctionResult) {
        setCorrection(currentSentence.id, correctionResult);

        if (correctionResult.xpEarned) {
          setXpEarned(correctionResult.xpEarned);
          setXpLevelUp(!!correctionResult.levelUp);
          setXpNewLevel(correctionResult.newLevel);
        }
        if ((correctionResult.newAchievements || []).length > 0) {
          setPendingAchievements(correctionResult.newAchievements || []);
          setShowAchievement(true);
        }

        const newCount = Object.keys(usePracticeStore.getState().corrections || {}).length;
        if (newCount >= safeSentences.length && !completionShown) {
          setTimeout(() => setShowModal(true), 1000);
        }
      }
    } finally {
      submittingRef.current = false;
    }
  };

  // [Fix 5] Mark completion shown so it doesn't re-trigger
  const handleModalClose = () => {
    setShowModal(false);
    setCompletionShown(true);
    router.back();
  };

  const handleXpDismiss = () => {
    setXpEarned(null);
    setXpLevelUp(false);
    setXpNewLevel(undefined);
  };

  const handleAchievementClose = () => {
    setShowAchievement(false);
    setPendingAchievements((prev) => (prev || []).slice(1));
  };

  useEffect(() => {
    if (!showAchievement && pendingAchievements.length > 0) {
      setShowAchievement(true);
    }
  }, [showAchievement, pendingAchievements.length]);

  const correctionValues = Object.values(corrections || {});
  const averageScore = allCompleted && correctionValues.length > 0
    ? correctionValues.reduce((sum, c) => sum + c.score, 0) / correctionValues.length
    : 0;

  const totalXpEarned = correctionValues.reduce((sum, c) => sum + (c.xpEarned || 0), 0);

  const latestCorrection = correctionValues.find((c) => c.newLevel != null);
  const currentLevel = latestCorrection?.newLevel;

  if (sentencesLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.statusText}>문장을 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  if (sentencesError) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={[styles.statusText, { color: colors.error, marginBottom: 16 }]}>{sentencesError}</Text>
        <TouchableOpacity
          style={{ backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, marginBottom: spacing.xs }}
          onPress={() => {
            if (theme) {
              AsyncStorage.getItem('engwrite_difficulty').then((saved) => {
                const diff = saved === 'intermediate' ? 'intermediate' : 'beginner';
                fetchSentences(theme, diff as any);
              });
            }
          }}
        >
          <Text style={{ color: colors.text.inverse, fontWeight: '700', fontSize: 15 }}>다시 시도</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.text.secondary, fontSize: 14, marginTop: spacing.xs }}>홈으로 돌아가기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with gradient */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        {/* Decorative circles */}
        <View style={styles.decoCircle1} />
        <View style={styles.decoCircle2} />

        <SafeAreaView edges={['top']} style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backButtonText}>{'\u2190'}</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {themeEmoji} {themeTitle}
            </Text>
            <Text style={styles.headerSubtitle}>
              {currentIndex + 1} / {safeSentences.length} 문장
            </Text>
          </View>

          {/* Progress indicator */}
          <View style={styles.xpBadge}>
            <Text style={styles.xpBadgeText}>{completedCount}/{safeSentences.length}</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Content wrapper */}
      <View style={styles.contentWrapper}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets
        >
          {currentSentence && (
            <View key={currentSentence.id}>
              <SentenceCard
                sentence={currentSentence}
                index={currentIndex}
                total={safeSentences.length}
              />

              <View ref={inputSectionRef} style={styles.inputSection}>
                {isCompleted && (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                    <Text style={styles.completedText}>작문 완료</Text>
                  </View>
                )}
                <WritingInput
                  key={`input-${currentSentence.id}`}
                  value={localDraft}
                  onChangeText={handleDraftChange}
                  onSubmit={handleSubmit}
                  loading={correctionLoading}
                  disabled={isCompleted}
                  onInputFocus={() => {
                    setTimeout(() => {
                      inputSectionRef.current?.measureLayout(
                        scrollRef.current?.getInnerViewNode?.() as any,
                        (_x, y) => {
                          scrollRef.current?.scrollTo({ y: Math.max(0, y - 80), animated: true });
                        },
                        () => {},
                      );
                    }, 300);
                  }}
                />
              </View>

              {(currentCorrection || correctionLoading || correctionError) && (
                <View style={styles.resultSection}>
                  <CorrectionResultView
                    result={currentCorrection || result}
                    loading={correctionLoading}
                    error={correctionError}
                    onRetry={handleRetry}
                  />
                </View>
              )}
            </View>
          )}

          {/* Progress dots */}
          <View style={styles.dotsContainer}>
            {safeSentences.map((_, i) => {
              const sentenceId = safeSentences[i]?.id;
              const isDone = sentenceId && corrections[sentenceId];
              return (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === currentIndex ? styles.dotActive : isDone ? styles.dotCompleted : styles.dotInactive,
                  ]}
                />
              );
            })}
          </View>

          {/* Navigation buttons */}
          <View style={styles.navRow}>
            <TouchableOpacity
              onPress={handlePrev}
              disabled={!canGoPrev}
              style={[styles.navButton, styles.navButtonSecondary, !canGoPrev && styles.navButtonDisabled]}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={18} color={canGoPrev ? colors.text.primary : colors.disabled} />
              <Text style={[styles.navText, !canGoPrev && styles.navTextDisabled]}>다시 쓰기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              disabled={!canGoNext}
              style={[styles.navButton, styles.navButtonPrimary, !canGoNext && styles.navButtonDisabled]}
              activeOpacity={0.7}
            >
              <Text style={[styles.navTextPrimary, !canGoNext && styles.navTextDisabled]}>
                다음 문장
              </Text>
              <Ionicons name="chevron-forward" size={18} color={canGoNext ? colors.text.inverse : colors.disabled} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <CompletionModal
        visible={showModal}
        themeTitle={themeTitle}
        averageScore={Math.round(averageScore * 10) / 10}
        streakDays={0}
        totalXp={totalXpEarned}
        currentLevel={currentLevel}
        onClose={handleModalClose}
      />

      {xpEarned != null && (
        <XpNotification
          xpEarned={xpEarned}
          levelUp={xpLevelUp}
          newLevel={xpNewLevel}
          onDismiss={handleXpDismiss}
        />
      )}

      <AchievementModal
        visible={showAchievement}
        achievement={pendingAchievements[0] || null}
        onClose={handleAchievementClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  // --- Header ---
  gradientHeader: {
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
    overflow: 'hidden',
  },
  decoCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: 30,
    right: -30,
  },
  decoCircle2: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: 80,
    right: 50,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text.inverse,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  xpBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  xpBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text.inverse,
    letterSpacing: 0.5,
  },

  // --- Content ---
  contentWrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  inputSection: {
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.lg,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginBottom: spacing.xs,
  },
  completedText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success,
  },
  resultSection: {
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.lg,
  },

  // --- Dots ---
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  dotCompleted: {
    backgroundColor: colors.success,
  },
  dotInactive: {
    backgroundColor: colors.disabled,
  },

  // --- Navigation ---
  navRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.xs,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    height: 48,
  },
  navButtonSecondary: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navButtonPrimary: {
    flex: 2,
    backgroundColor: colors.primary,
    ...shadows.primary,
  },
  navButtonDisabled: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  navText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
  },
  navTextPrimary: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text.inverse,
  },
  navTextDisabled: {
    color: colors.disabled,
  },
  statusText: {
    ...typography.body,
    color: colors.text.secondary,
  } as any,
});
