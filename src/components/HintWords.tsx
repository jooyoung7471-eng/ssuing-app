import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import type { HintWord } from '../types';

interface HintWordsProps {
  hints: HintWord[];
}

export default function HintWords({ hints }: HintWordsProps) {
  // 2-column grid layout like the reference
  const safeHints = hints || [];
  const rows: HintWord[][] = [];
  for (let i = 0; i < safeHints.length; i += 2) {
    rows.push(safeHints.slice(i, i + 2));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((hint, colIdx) => (
            <View key={colIdx} style={styles.cell}>
              <Text style={styles.english}>{hint.english}</Text>
              <Text style={styles.korean}>{hint.korean}</Text>
            </View>
          ))}
          {row.length === 1 && <View style={styles.cell} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cell: {
    flex: 1,
    paddingVertical: 4,
  },
  english: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  korean: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.text.secondary,
  },
});
