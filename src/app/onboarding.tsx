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
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius, shadows } from '../constants/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Page data ---

interface OnboardingPage {
  id: string;
  themeColor: string;
  gradientEnd: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  titleParts: { text: string; highlight?: boolean }[];
  subtitle: string;
}

const pages: OnboardingPage[] = [
  {
    id: '1',
    themeColor: colors.onboarding.purple,
    gradientEnd: '#7C3AED',
    icon: 'create-outline',
    label: '01 · DAILY HABIT',
    titleParts: [
      { text: '쓰면서 ' },
      { text: '자라는', highlight: true },
      { text: '\n영어 문장력' },
    ],
    subtitle: '하루 3문장, 꾸준한 기록이\n진짜 실력이 되어 돌아옵니다.',
  },
  {
    id: '2',
    themeColor: colors.onboarding.green,
    gradientEnd: '#059669',
    icon: 'checkmark-circle-outline',
    label: '02 · INSTANT FEEDBACK',
    titleParts: [
      { text: 'AI가 바로\n' },
      { text: '교정', highlight: true },
      { text: '해드려요' },
    ],
    subtitle: '문법·어순·자연스러움까지 세심하게\n설명과 함께 다듬어드립니다.',
  },
  {
    id: '3',
    themeColor: colors.onboarding.amber,
    gradientEnd: '#EA580C',
    icon: 'flame-outline',
    label: '03 · DAILY THREE',
    titleParts: [
      { text: '하루 ' },
      { text: '3문장', highlight: true },
      { text: '이면\n충분해요' },
    ],
    subtitle: '부담 없는 양으로 꾸준히.\n작은 습관이 큰 변화를 만듭니다.',
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
    <View style={styles.container}>
      {/* Top bar: progress + skip */}
      <View style={styles.topBar}>
        <View style={styles.progressContainer}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressSegment,
                {
                  width: index === currentIndex ? 24 : 8,
                  backgroundColor:
                    index === currentIndex
                      ? page.themeColor
                      : colors.border,
                },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={!isLastPage ? completeOnboarding : undefined}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ opacity: isLastPage ? 0 : 1 }}
          disabled={isLastPage}
        >
          <Text style={styles.skipText}>건너뛰기</Text>
        </TouchableOpacity>
      </View>

      {/* Hero illustration card */}
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: page.themeColor,
          },
        ]}
      >
        {/* Decorative circles */}
        <View style={[styles.heroCircle1, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
        <View style={[styles.heroCircle2, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />

        {/* Icon */}
        <View style={styles.heroIconContainer}>
          <Ionicons name={page.icon} size={100} color="rgba(255,255,255,0.95)" />
        </View>
      </View>

      {/* Text content */}
      <View style={styles.textContent}>
        <Text style={[styles.label, { color: page.themeColor }]}>
          {page.label}
        </Text>
        <Text style={styles.title}>
          {page.titleParts.map((part, i) => (
            <Text
              key={i}
              style={part.highlight ? { color: page.themeColor } : undefined}
            >
              {part.text}
            </Text>
          ))}
        </Text>
        <Text style={styles.subtitle}>{page.subtitle}</Text>
      </View>

      {/* Bottom CTA */}
      {isLastPage ? (
        <TouchableOpacity
          style={[styles.fullButton, { backgroundColor: colors.primary }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.fullButtonText}>시작하기</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.circleButton, { backgroundColor: page.themeColor }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const HERO_MARGIN = spacing.xl;
const HERO_WIDTH = SCREEN_WIDTH - HERO_MARGIN * 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 66,
    paddingBottom: spacing.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressSegment: {
    height: 4,
    borderRadius: 2,
  },
  skipText: {
    ...typography.body,
    color: colors.text.secondary,
    fontSize: 14,
  },
  // Hero card
  heroCard: {
    marginHorizontal: HERO_MARGIN,
    marginTop: spacing.xxl,
    height: 340,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  heroCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  heroCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  heroIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Text content
  textContent: {
    paddingHorizontal: 28,
    paddingTop: 28,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h1,
    fontSize: 28,
    lineHeight: 34,
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.text.secondary,
  },
  // Circle next button (pages 1-2)
  circleButton: {
    position: 'absolute',
    bottom: 28,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  // Full-width start button (page 3)
  fullButton: {
    position: 'absolute',
    bottom: 28,
    left: spacing.xl,
    right: spacing.xl,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
  },
  fullButtonText: {
    ...typography.button,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
