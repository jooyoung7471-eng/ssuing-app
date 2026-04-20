import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, getScoreColor } from '../constants/colors';

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
}

export default function ScoreDisplay({ score, maxScore = 10 }: ScoreDisplayProps) {
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withTiming((score / maxScore) * 100, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [score, maxScore, animatedWidth]);

  const scoreColor = getScoreColor(score);

  const barStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%` as any,
    backgroundColor: scoreColor,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.scoreRow}>
        <Text style={[styles.score, { color: scoreColor }]}>{Math.round(score * 10) / 10}</Text>
        <Text style={styles.maxScore}>/{maxScore}</Text>
      </View>
      <View style={styles.barBg}>
        <Animated.View style={[styles.barFill, barStyle]} />
      </View>
      <Text style={[styles.label, { color: scoreColor }]}>
        {score >= 8 ? '훌륭해요!' : score >= 5 ? '좋은 시도예요!' : '다시 도전해봐요!'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  score: {
    fontSize: 24,
    fontWeight: '700',
  },
  maxScore: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.hint,
  },
  barBg: {
    width: '80%',
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
});
