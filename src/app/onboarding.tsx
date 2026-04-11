import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingPage {
  id: string;
  backgroundColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

const pages: OnboardingPage[] = [
  {
    id: '1',
    backgroundColor: '#4F46E5',
    icon: 'pencil-outline',
    title: '쓰면, 늘어요',
    subtitle: '한글을 보고 영어로 써보세요',
  },
  {
    id: '2',
    backgroundColor: '#10B981',
    icon: 'checkmark-circle-outline',
    title: 'AI가 바로 교정',
    subtitle: '원어민이 쓰는 자연스러운 표현으로\n고쳐주고 설명까지',
  },
  {
    id: '3',
    backgroundColor: '#F59E0B',
    icon: 'flame-outline',
    title: '하루 3문장이면 충분',
    subtitle: '매일 5분 투자로\n영어 작문 실력이 달라집니다',
  },
];

const ONBOARDING_KEY = 'onboarding_completed';

async function completeOnboarding() {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  router.replace('/auth');
}

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const page = pages[currentIndex];
  const isLastPage = currentIndex === pages.length - 1;

  const handleNext = () => {
    if (isLastPage) {
      completeOnboarding();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: page.backgroundColor }]}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
        <Text style={styles.skipText}>건너뛰기</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Ionicons name={page.icon} size={120} color="#FFFFFF" />
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.subtitle}>{page.subtitle}</Text>
      </View>

      {/* Bottom area */}
      <View style={styles.bottomContainer}>
        {/* Dot indicators */}
        <View style={styles.dotsContainer}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Next / Start button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>
            {isLastPage ? '시작하기' : '다음'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: SCREEN_HEIGHT,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 26,
  },
  bottomContainer: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dot: {
    borderRadius: 5,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
  },
  dotInactive: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  startButtonText: {
    color: '#4F46E5',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
