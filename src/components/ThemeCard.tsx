import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import type { Theme, Difficulty } from '../types';

interface ThemeCardProps {
  theme: Theme;
  completedCount: number;
  totalCount: number;
  onPress: () => void;
  difficulty?: Difficulty;
}

const THEME_INFO: Record<Theme, { title: string; subtitle: string; emoji: string }> = {
  daily: {
    title: '일상 영어',
    subtitle: 'Daily English',
    emoji: '\u{1F4DD}',
  },
  business: {
    title: '비즈니스 영어',
    subtitle: 'Business English',
    emoji: '\u{1F4BC}',
  },
};

const THEME_GRADIENTS: Record<Difficulty, Record<Theme, [string, string]>> = {
  beginner: {
    daily: [colors.primary, colors.primaryLight],       // #4A90D9 → #6BA3E0
    business: [colors.secondary, colors.secondaryLight], // #7C4DFF → #9B7BFF
  },
  intermediate: {
    daily: ['#1E3A5F', '#2563EB'],    // 진한 남색
    business: ['#6B1D3A', '#C2185B'], // 진한 와인색
  },
};

export default function ThemeCard({ theme, completedCount, totalCount, onPress, difficulty = 'beginner' }: ThemeCardProps) {
  const config = THEME_INFO[theme];
  const gradient = THEME_GRADIENTS[difficulty][theme];

  const dots = Array.from({ length: totalCount }, (_, i) => i < completedCount);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.wrapper}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <Text style={styles.emoji}>{config.emoji}</Text>
          <View>
            <Text style={styles.title}>{config.title}</Text>
            <Text style={styles.subtitle}>{config.subtitle}</Text>
          </View>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.progressLabel}>오늘의 문장</Text>
          <View style={styles.dots}>
            {dots.map((filled, i) => (
              <View
                key={i}
                style={[styles.dot, filled ? styles.dotFilled : styles.dotEmpty]}
              />
            ))}
          </View>
          <Text style={styles.progressText}>
            {completedCount}/{totalCount} 완료
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    height: 140,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotFilled: {
    backgroundColor: '#FFFFFF',
  },
  dotEmpty: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
  },
});
