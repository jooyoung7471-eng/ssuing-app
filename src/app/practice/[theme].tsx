import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
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
import type { Theme } from '../../types';

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

  const [localDraft, setLocalDraft] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const [xpLevelUp, setXpLevelUp] = useState(false);
  const [xpNewLevel, setXpNewLevel] = useState<number | undefined>(undefined);
  const [pendingAchievements, setPendingAchievements] = useState<{ type: string; title: string; emoji: string }[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const draftRef = useRef('');
  const submittingRef = useRef(false);

  const themeTitle = theme === 'daily' ? '일상 영어' : '비즈니스 영어';
  const themeEmoji = theme === 'daily' ? '\u2615' : '\u{1F4BC}';

  const today = new Date();
  const dateStr = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

  // [Fix 1] Only reset store when switching themes, preserve on re-entry
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    if (theme) {
      resetForTheme(theme);
      fetchSentences(theme);
    }
  }, [theme]);

  useEffect(() => {
    if (sentences.length > 0) {
      storeSentences(sentences);
    }
  }, [sentences]);

  const currentSentence = sentences[currentIndex];
  const currentCorrection = currentSentence ? corrections[currentSentence.id] : null;
  const isCompleted = !!currentCorrection;

  const completedCount = Object.keys(corrections).length;
  const allCompleted = sentences.length > 0 && completedCount >= sentences.length;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < sentences.length - 1;

  // [Fix 2] When switching sentence: show submitted text if completed, otherwise show draft
  useEffect(() => {
    if (currentSentence) {
      const existingCorrection = corrections[currentSentence.id];
      if (existingCorrection) {
        // Already corrected — show the submitted writing
        setLocalDraft(existingCorrection.userWriting);
        draftRef.current = existingCorrection.userWriting;
      } else {
        // Not yet corrected — show saved draft or empty
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
    if (corrections[currentSentence.id]) return; // already corrected
    const writing = draftRef.current;
    if (writing.length < 10) return;

    submittingRef.current = true;
    const correctionResult = await submit(currentSentence.id, writing);
    submittingRef.current = false;

    if (correctionResult) {
      setCorrection(currentSentence.id, correctionResult);

      // 게이미피케이션 피드백
      if (correctionResult.xpEarned) {
        setXpEarned(correctionResult.xpEarned);
        setXpLevelUp(!!correctionResult.levelUp);
        setXpNewLevel(correctionResult.newLevel);
      }
      if (correctionResult.newAchievements?.length) {
        setPendingAchievements(correctionResult.newAchievements);
        setShowAchievement(true);
      }

      // [Fix 4] Check completion with fresh count
      const newCount = Object.keys(usePracticeStore.getState().corrections).length;
      if (newCount >= sentences.length && !completionShown) {
        setTimeout(() => setShowModal(true), 1000);
      }
    }
  };

  const handleRetry = () => {
    if (currentSentence && !submittingRef.current) {
      submittingRef.current = true;
      submit(currentSentence.id, draftRef.current).finally(() => {
        submittingRef.current = false;
      });
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
    setPendingAchievements((prev) => prev.slice(1));
  };

  // 다음 업적이 남아 있으면 다시 표시
  useEffect(() => {
    if (!showAchievement && pendingAchievements.length > 0) {
      setShowAchievement(true);
    }
  }, [showAchievement, pendingAchievements.length]);

  const averageScore = allCompleted
    ? Object.values(corrections).reduce((sum, c) => sum + c.score, 0) / Object.values(corrections).length
    : 0;

  const totalXpEarned = Object.values(corrections).reduce((sum, c) => sum + (c.xpEarned || 0), 0);

  // 최신 레벨 정보: 가장 마지막 교정 결과에서 추출
  const latestCorrection = Object.values(corrections).find((c) => c.newLevel != null);
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
        <Text style={[styles.statusText, { color: colors.error }]}>{sentencesError}</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={theme === 'daily' ? ['#1E3A5F', '#2563EB', '#5B9CF6'] : ['#3B1F6E', '#7C4DFF', '#B388FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.decoCircle1} />
        <View style={styles.decoCircle2} />
        <View style={styles.decoCircle3} />

        <SafeAreaView edges={['top']} style={styles.topBar}>
          <Text style={styles.backButton} onPress={() => router.back()}>{'\u2190'}</Text>
          <Text style={styles.pageCounter}>{currentIndex + 1} / {sentences.length}</Text>
          <View style={{ width: 30 }} />
        </SafeAreaView>

        <View style={styles.headerContent}>
          <Text style={styles.headerEmoji}>{themeEmoji}</Text>
          <Text style={styles.headerTitle}>{themeTitle}</Text>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{dateStr}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.contentWrapper}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {currentSentence && (
            <View key={currentSentence.id}>
              <SentenceCard
                sentence={currentSentence}
                index={currentIndex}
                total={sentences.length}
              />

              <View style={styles.inputSection}>
                {isCompleted && (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
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
                />
              </View>

              {/* Show correction result — from store (persisted) or from current submission */}
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

          {/* Dots */}
          <View style={styles.dotsContainer}>
            {sentences.map((_, i) => {
              const sentenceId = sentences[i]?.id;
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

          {/* Navigation */}
          <View style={styles.navRow}>
            <TouchableOpacity
              onPress={handlePrev}
              disabled={!canGoPrev}
              style={[styles.navButton, !canGoPrev && styles.navButtonDisabled]}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={20} color={canGoPrev ? '#2563EB' : '#D1D5DB'} />
              <Text style={[styles.navText, !canGoPrev && styles.navTextDisabled]}>이전</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              disabled={!canGoNext}
              style={[styles.navButton, !canGoNext && styles.navButtonDisabled]}
              activeOpacity={0.7}
            >
              <Text style={[styles.navText, !canGoNext && styles.navTextDisabled]}>다음</Text>
              <Ionicons name="chevron-forward" size={20} color={canGoNext ? '#2563EB' : '#D1D5DB'} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <CompletionModal
        visible={showModal}
        themeTitle={themeTitle}
        averageScore={averageScore}
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
  gradientHeader: {
    height: 220,
    overflow: 'hidden',
  },
  decoCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -60,
    right: -40,
  },
  decoCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: 80,
    left: -30,
  },
  decoCircle3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: 20,
    right: 60,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backButton: {
    fontSize: 24,
    color: '#FFFFFF',
    width: 30,
  },
  pageCounter: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 12,
  },
  headerEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  dateBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  contentWrapper: {
    flex: 1,
    marginTop: -24,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  scroll: {
    paddingTop: 28,
    paddingBottom: 40,
  },
  inputSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  completedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16A34A',
  },
  resultSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 28,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#2563EB',
    width: 20,
  },
  dotCompleted: {
    backgroundColor: '#16A34A',
  },
  dotInactive: {
    backgroundColor: '#D1D5DB',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 24,
    paddingBottom: 32,
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
  statusText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.secondary,
  },
});
