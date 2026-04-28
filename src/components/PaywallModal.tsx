/**
 * PaywallModal - 프리미엄 업그레이드 모달
 * - 기능 비교 카드 + 구매 버튼 + 복원 버튼
 */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius, shadows } from '../constants/spacing';
import { useSubscriptionStore } from '../stores/subscriptionStore';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  trigger?: string; // 어디서 트리거됐는지 (추적용)
}

const FEATURES = [
  {
    emoji: '\u{270D}\u{FE0F}',
    title: '하루 3문장 무제한',
    desc: '모든 테마에서 작문 + AI 교정',
    free: '하루 1문장',
    premium: '하루 3문장',
  },
  {
    emoji: '\u{1F30D}',
    title: '모든 테마',
    desc: '일상 + 비즈니스 + 여행',
    free: '일상만',
    premium: '모든 테마',
  },
  {
    emoji: '\u{1F4DA}',
    title: '오답 복습',
    desc: '틀린 문장을 다시 연습',
    free: '-',
    premium: '무제한',
  },
  {
    emoji: '\u{1F4CA}',
    title: '주간 리포트',
    desc: '학습 통계와 인사이트',
    free: '-',
    premium: '매주 제공',
  },
  {
    emoji: '\u{1F3C6}',
    title: '모든 업적 + 칭호',
    desc: '프리미엄 전용 업적 달성',
    free: '기본만',
    premium: '전체',
  },
];

export default function PaywallModal({ visible, onClose, trigger }: PaywallModalProps) {
  const {
    monthlyPackage,
    packages,
    isLoading,
    purchase,
    restore,
    loadPackages,
    trialDaysLeft,
    plan,
  } = useSubscriptionStore();

  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (visible && packages.length === 0) {
      loadPackages();
    }
  }, [visible]);

  const priceText = monthlyPackage?.product?.priceString || '5,000원/월';
  const hasFreeTrial = plan === 'free' && trialDaysLeft === 0;

  const handlePurchase = async () => {
    const result = await purchase();
    if (result.success) {
      onClose();
    } else if (result.error) {
      Alert.alert('구매 실패', result.error);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    const result = await restore();
    setRestoring(false);

    if (result.isPremium) {
      Alert.alert('복원 완료', '프리미엄 구독이 복원되었습니다.');
      onClose();
    } else if (result.error) {
      Alert.alert('복원 실패', result.error);
    } else {
      Alert.alert('복원 결과', '활성화된 구독을 찾을 수 없습니다.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={24} color={colors.text.secondary} />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroDecor} />
            <Text style={styles.heroEmoji}>{'\u{2B50}'}</Text>
            <Text style={styles.heroTitle}>{'Premium'}</Text>
            <Text style={styles.heroSubtitle}>
              {'영어 실력을 더 빠르게 키워보세요'}
            </Text>
          </LinearGradient>

          {/* Feature list */}
          <View style={styles.featureList}>
            {FEATURES.map((feat, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureEmoji}>{feat.emoji}</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feat.title}</Text>
                  <Text style={styles.featureDesc}>{feat.desc}</Text>
                </View>
                <View style={styles.featureBadge}>
                  <Text style={styles.featureBadgeText}>{feat.premium}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Price & CTA */}
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>{'월간 구독'}</Text>
            <Text style={styles.priceAmount}>{priceText}</Text>
            {hasFreeTrial && (
              <Text style={styles.trialNote}>{'7일 무료 체험 포함'}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.purchaseButton}
            onPress={handlePurchase}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.purchaseButtonText}>
                {hasFreeTrial ? '7일 무료 체험 시작' : '프리미엄 구독하기'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Restore */}
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={restoring}
            activeOpacity={0.7}
          >
            {restoring ? (
              <ActivityIndicator size="small" color={colors.text.secondary} />
            ) : (
              <Text style={styles.restoreText}>{'구매 복원'}</Text>
            )}
          </TouchableOpacity>

          {/* Legal text */}
          <Text style={styles.legalText}>
            {'구독은 Apple 계정으로 결제되며, 기간 만료 24시간 전에 자동 갱신됩니다. '}
            {'구독은 설정 > Apple ID > 구독에서 관리하거나 해지할 수 있습니다.'}
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 16 : 12,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
    overflow: 'hidden',
  },
  heroDecor: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
  },

  // Features
  featureList: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureEmoji: {
    fontSize: 18,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  featureBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  featureBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },

  // Price
  priceSection: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  trialNote: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success,
    marginTop: 6,
  },

  // CTA
  purchaseButton: {
    marginHorizontal: spacing.screenPadding,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
  },
  purchaseButtonText: {
    ...typography.button,
    fontSize: 16,
    color: '#FFFFFF',
  },

  // Restore
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  restoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },

  // Legal
  legalText: {
    paddingHorizontal: spacing.xl,
    fontSize: 10,
    fontWeight: '400',
    color: colors.text.hint,
    textAlign: 'center',
    lineHeight: 16,
  },
});
