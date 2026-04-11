import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSwipe } from '../hooks/useSwipe';

interface SwipeableCardsProps {
  currentIndex: number;
  totalCount: number;
  onNext: () => void;
  onPrev: () => void;
  children: React.ReactNode;
}

export default function SwipeableCards({
  currentIndex,
  totalCount,
  onNext,
  onPrev,
  children,
}: SwipeableCardsProps) {
  const handleSwipeLeft = useCallback(() => {
    onNext();
  }, [onNext]);

  const handleSwipeRight = useCallback(() => {
    onPrev();
  }, [onPrev]);

  const { translateX, animatedStyle, handleGestureEnd } = useSwipe({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
  });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      handleGestureEnd(e.translationX, e.velocityX);
    });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
      <View style={styles.dots}>
        {Array.from({ length: totalCount }, (_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    backgroundColor: '#4A90D9',
    width: 24,
  },
});
