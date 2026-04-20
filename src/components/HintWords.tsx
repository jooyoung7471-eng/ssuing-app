import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius } from '../constants/spacing';
import type { HintWord } from '../types';

interface HintWordsProps {
  hints: HintWord[];
}

export default function HintWords({ hints }: HintWordsProps) {
  const safeHints = hints || [];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>KEY VOCABULARY</Text>
      <View style={styles.chipRow}>
        {safeHints.map((hint, i) => (
          <View key={i} style={styles.chip}>
            <Text style={styles.chipEnglish}>{hint.english}</Text>
            <Text style={styles.chipKorean}>{hint.korean}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  } as any,
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  chipEnglish: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  chipKorean: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.text.secondary,
  },
});
