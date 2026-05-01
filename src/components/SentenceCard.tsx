import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius, shadows } from '../constants/spacing';
import HintWords from './HintWords';
import type { Sentence } from '../types';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface SentenceCardProps {
  sentence: Sentence;
  index: number;
  total: number;
}

export default function SentenceCard({ sentence, index, total }: SentenceCardProps) {
  const [vocabOpen, setVocabOpen] = useState(false);

  const toggleVocab = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setVocabOpen(!vocabOpen);
  };

  return (
    <View style={styles.container}>
      {/* Number badge */}
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{index + 1}</Text>
      </View>

      {/* Korean prompt card */}
      <View style={styles.korCard}>
        <View style={styles.korHeader}>
          <Text style={styles.korLabel}>KOREAN</Text>
        </View>
        <Text style={styles.koreanText}>{sentence.koreanText}</Text>
        {(sentence as any).grammarHint && (
          <Text style={styles.grammarHint}>
            {'\u{1F4A1}'} {(sentence as any).grammarHint}
          </Text>
        )}
      </View>

      {/* Vocab toggle */}
      <TouchableOpacity style={styles.vocabHeader} onPress={toggleVocab} activeOpacity={0.7}>
        <Ionicons
          name={vocabOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.text.secondary}
        />
        <Text style={styles.vocabTitle}>
          {vocabOpen ? '힌트 접기' : '힌트 보기'}
        </Text>
      </TouchableOpacity>

      {vocabOpen && (
        <View style={styles.vocabBody}>
          <HintWords hints={sentence.hintWords || []} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screenPadding,
    alignItems: 'center',
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  numberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  korCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    width: '100%',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  korHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  korLabel: {
    ...typography.label,
    color: colors.primary,
  } as any,
  koreanText: {
    ...typography.h3,
    color: colors.text.primary,
    lineHeight: 28,
  } as any,
  grammarHint: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  vocabHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.xs,
  },
  vocabTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  vocabBody: {
    width: '100%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
});
