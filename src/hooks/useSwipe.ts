import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.4;
const SPRING_CONFIG = { damping: 20, stiffness: 200 };

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useSwipe({ onSwipeLeft, onSwipeRight }: UseSwipeOptions) {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleGestureEnd = useCallback(
    (translationX: number, velocityX: number) => {
      'worklet';
      if (translationX < -SWIPE_THRESHOLD || velocityX < -500) {
        translateX.value = withSpring(-SCREEN_WIDTH, SPRING_CONFIG, () => {
          if (onSwipeLeft) runOnJS(onSwipeLeft)();
          translateX.value = 0;
        });
      } else if (translationX > SWIPE_THRESHOLD || velocityX > 500) {
        translateX.value = withSpring(SCREEN_WIDTH, SPRING_CONFIG, () => {
          if (onSwipeRight) runOnJS(onSwipeRight)();
          translateX.value = 0;
        });
      } else {
        translateX.value = withSpring(0, SPRING_CONFIG);
      }
    },
    [onSwipeLeft, onSwipeRight, translateX],
  );

  return { translateX, animatedStyle, handleGestureEnd };
}
