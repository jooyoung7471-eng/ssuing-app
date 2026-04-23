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

  const rows: HintWord[][] = [];
  for (let i = 0; i < safeHints.length; i += 2) {
    rows.push(safeHints.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>KEY VOCABULARY</Text>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          <View style={styles.chip}>
            <Text style={styles.chipEnglish}>{row[0].english}</Text>
            <Text style={styles.chipKorean}>{row[0].korean}</Text>
          </View>
          {row[1] ? (
            <View style={styles.chip}>
              <Text style={styles.chipEnglish}>{row[1].english}</Text>
              <Text style={styles.chipKorean}>{row[1].korean}</Text>
            </View>
          ) : (
            <View style={styles.chipEmpty} />
          )}
        </View>
      ))}
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
    marginBottom: spacing.sm,
  } as any,
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chip: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginHorizontal: 5,
  },
  chipEmpty: {
    flex: 1,
    marginHorizontal: 5,
  },
  chipEnglish: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  chipKorean: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
  },
});
