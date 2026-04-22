import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius } from '../constants/spacing';
import type { HintWord } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHIP_GAP = 10;
const CONTAINER_PADDING = 16;
const CHIP_WIDTH = (SCREEN_WIDTH - CONTAINER_PADDING * 2 - CHIP_GAP * 3) / 2;

interface HintWordsProps {
  hints: HintWord[];
}

export default function HintWords({ hints }: HintWordsProps) {
  const safeHints = hints || [];

  // 2열 그리드: 행별로 2개씩 묶기
  const rows: HintWord[][] = [];
  for (let i = 0; i < safeHints.length; i += 2) {
    rows.push(safeHints.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>KEY VOCABULARY</Text>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((hint, i) => (
            <View key={i} style={styles.chip}>
              <Text style={styles.chipEnglish}>{hint.english}</Text>
              <Text style={styles.chipKorean}>{hint.korean}</Text>
            </View>
          ))}
          {row.length === 1 && <View style={styles.chipPlaceholder} />}
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
    justifyContent: 'space-between',
    marginBottom: CHIP_GAP,
  },
  chip: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    padding: spacing.sm,
    width: CHIP_WIDTH,
  },
  chipPlaceholder: {
    width: CHIP_WIDTH,
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
