import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface XpNotificationProps {
  xpEarned: number;
  levelUp?: boolean;
  newLevel?: number;
  onDismiss: () => void;
}

export default function XpNotification({
  xpEarned,
  levelUp,
  newLevel,
  onDismiss,
}: XpNotificationProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(onDismiss, 2000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <Animated.View
      entering={SlideInUp.duration(400)}
      exiting={FadeOut.duration(300)}
      style={[styles.container, { paddingTop: insets.top + 12 }]}
    >
      <View style={styles.content}>
        <Text style={styles.xpText}>+{xpEarned} XP</Text>
        {levelUp && newLevel != null && (
          <Text style={styles.levelUpText}>
            {'\uD83C\uDF89'} Level {newLevel} 달성!
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#FEF3C7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  xpText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F59E0B',
  },
  levelUpText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
});
