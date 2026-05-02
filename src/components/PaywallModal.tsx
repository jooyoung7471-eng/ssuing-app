/**
 * PaywallModal - 프리미엄 업그레이드 모달 (Variant A: Free vs Pro 비교)
 * 디자인 핸드오프 스펙 기반 pixel-perfect 구현
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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius, shadows } from '../constants/spacing';
import { useSubscriptionStore, SubscriptionConfig } from '../stores/subscriptionStore';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  trigger?: string;
}

const BENEFITS = [
  {
    emoji: '\u270D\uFE0F',
    title: '무제한 작문',
    desc: '하루 3문장 한도 제거',
  },
  {
    emoji: '\uD83C\uDF0D',
    title: '모든 테마',
    desc: '비즈니스 \u00B7 여행 잠금 해제',
  },
  {
    emoji: '\uD83D\uDCDD',
    title: '오답 복습',
    desc: '약점 집중 트레이닝',
  },
  {
    emoji: '\uD83D\uDCCA',
    title: '주간 리포트',
    desc: '학습 통계 \u00B7 추세',
  },
  {
    emoji: '\uD83C\uDFC6',
    title: '전체 업적',
    desc: '모든 칭호 획득 가능',
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

  const priceText = monthlyPackage?.price || SubscriptionConfig.MONTHLY_PRICE_DISPLAY;
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ─── Hero 영역 ─── */}
          <LinearGradient
            colors={['#4A90D9', '#7C4DFF']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={styles.hero}
          >
            {/* 데코 원 2개 */}
            <View style={styles.decoCircle1} />
            <View style={styles.decoCircle2} />

            {/* 상단 sparkle row */}
            <View style={styles.sparkleRow}>
              <View style={styles.sparkleDotSmall} />
              <View style={styles.sparkleCenter}>
                <Ionicons name="star" size={16} color="#7C4DFF" />
              </View>
              <View style={styles.sparkleDotSmall} />
            </View>

            {/* SSUING PREMIUM 글래스 칩 */}
            <View style={styles.premiumChip}>
              <Text style={styles.premiumChipText}>SSUING PREMIUM</Text>
            </View>

            {/* 타이틀 */}
            <Text style={styles.heroTitle}>
              {'영어 실력,\n제한 없이.'}
            </Text>

            {/* 서브카피 */}
            <Text style={styles.heroSubtitle}>
              매일 더 많이, 더 다양하게 연습하세요
            </Text>

            {/* X 닫기 버튼 */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>

          {/* ─── Free vs Pro 비교 그리드 ─── */}
          <View style={styles.comparisonSection}>
            <View style={styles.comparisonGrid}>
              {/* Free 컬럼 */}
              <View style={styles.freeColumn}>
                <Text style={styles.columnLabel}>FREE</Text>
                <Text style={styles.columnLine}>하루 3문장</Text>
                <Text style={styles.columnLine}>일상 테마만</Text>
              </View>

              {/* Pro 컬럼 */}
              <LinearGradient
                colors={['#4A90D9', '#7C4DFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.proColumn}
              >
                <Text style={styles.proLabel}>PRO ✨</Text>
                <Text style={styles.proLine}>무제한</Text>
                <Text style={styles.proLine}>모든 기능</Text>
              </LinearGradient>
            </View>
          </View>

          {/* ─── 포함된 혜택 리스트 ─── */}
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsSectionTitle}>포함된 혜택</Text>
            <View style={styles.benefitsCard}>
              {BENEFITS.map((benefit, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <View style={styles.benefitDivider} />}
                  <View style={styles.benefitRow}>
                    <Text style={styles.benefitEmoji}>{benefit.emoji}</Text>
                    <View style={styles.benefitContent}>
                      <Text style={styles.benefitTitle}>{benefit.title}</Text>
                      <Text style={styles.benefitDesc}>{benefit.desc}</Text>
                    </View>
                    <View style={styles.benefitCheck}>
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    </View>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* ─── CTA 푸터 (고정) ─── */}
        <View style={styles.ctaFooter}>
          {/* 가격 행 */}
          <View style={styles.priceRow}>
            <Text style={styles.priceCaption}>
              {hasFreeTrial ? SubscriptionConfig.trialPriceCaption : '월간 구독'}
            </Text>
            <Text style={styles.priceAmount}>
              {'월 '}{priceText.replace('/월', '').replace('월', '')}
            </Text>
          </View>

          {/* CTA 버튼 */}
          <TouchableOpacity
            onPress={handlePurchase}
            disabled={isLoading}
            activeOpacity={0.8}
            style={styles.ctaButtonWrap}
          >
            <LinearGradient
              colors={['#4A90D9', '#2E6DB3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaButton}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.ctaButtonText}>
                  {hasFreeTrial ? SubscriptionConfig.trialCTALabel : '프리미엄 구독하기'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* 구매 복원 */}
          <TouchableOpacity
            onPress={handleRestore}
            disabled={restoring}
            activeOpacity={0.7}
            style={styles.restoreButton}
          >
            {restoring ? (
              <ActivityIndicator size="small" color={colors.text.secondary} />
            ) : (
              <Text style={styles.restoreText}>구매 복원</Text>
            )}
          </TouchableOpacity>

          {/* Apple 약관 */}
          <Text style={styles.legalText}>
            구독은 iTunes 계정을 통해 청구되며, 현재 결제 기간 종료 24시간 이전에 해지하지 않으면 자동 갱신됩니다. 결제 후에는 iTunes 계정 설정에서 구독을 관리하거나 해지할 수 있습니다.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // ── Hero ──
  hero: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 36,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 280,
    justifyContent: 'center',
  },
  decoCircle1: {
    position: 'absolute',
    top: -60,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  decoCircle2: {
    position: 'absolute',
    bottom: -30,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  sparkleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sparkleDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  sparkleCenter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumChip: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 14,
  },
  premiumChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Free vs Pro 비교 ──
  comparisonSection: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
  },
  comparisonGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  freeColumn: {
    flex: 1,
    backgroundColor: '#F4F5F7',
    borderRadius: radius.md,
    padding: 16,
  },
  columnLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.text.secondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  columnLine: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 22,
  },
  proColumn: {
    flex: 1,
    borderRadius: radius.md,
    padding: 16,
  },
  proLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  proLine: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
  },

  // ── 혜택 리스트 ──
  benefitsSection: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
  },
  benefitsSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 10,
  },
  benefitsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  benefitDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 16,
  },
  benefitEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 1,
  },
  benefitDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  benefitCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── CTA 푸터 ──
  ctaFooter: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceCaption: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  priceAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  ctaButtonWrap: {
    marginBottom: 12,
  },
  ctaButton: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  restoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  legalText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.text.hint,
    textAlign: 'center',
    lineHeight: 15,
    marginTop: 8,
    paddingHorizontal: 4,
  },
});
