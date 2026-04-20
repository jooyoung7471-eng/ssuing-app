import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, getScoreColor } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius } from '../constants/spacing';

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
}

export default function ScoreDisplay({ score, maxScore = 10 }: ScoreDisplayProps) {
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withTiming((score / maxScore) * 100, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [score, maxScore, animatedWidth]);

  const scoreColor = getScoreColor(score);

  const barStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%` as any,
    backgroundColor: scoreColor,
  }));

  const getMessage = () => {
    if (score >= 8) return '훌륭해요!';
    if (score >= 5) return '좋은 시도예요!';
    return '다시 도전해봐요!';
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreRow}>
        <Text style={[styles.score, { color: scoreColor }]}>
          {Math.round(score * 10) / 10}
        </Text>
        <Text style={styles.maxScore}>/{maxScore}</Text>
      </View>
      <View style={styles.barBg}>
        <Animated.View style={[styles.barFill, barStyle]} />
      </View>
      <Text style={[styles.message, { color: scoreColor }]}>
        {getMessage()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  score: {
    ...typography.score,
  } as any,
  maxScore: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.text.hint,
  },
  barBg: {
    width: '80%',
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radius.xs,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: radius.xs,
  },
  message: {
    ...typography.body,
    fontWeight: '700',
    marginTop: spacing.sm,
  } as any,
});
