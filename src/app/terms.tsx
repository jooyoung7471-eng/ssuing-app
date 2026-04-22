import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius, shadows } from '../constants/spacing';
import {
  enablePushNotifications,
  registerForPushNotifications,
} from '../services/notifications';

const TERMS_AGREED_KEY = 'terms_agreed';
const MARKETING_AGREED_KEY = 'marketing_agreed';
const PUSH_AGREED_KEY = 'push_agreed';

// --- Term items ---

interface TermItem {
  id: string;
  label: string;
  required: boolean;
  content: string;
}

const TERMS: TermItem[] = [
  {
    id: 'service',
    label: '이용약관',
    required: true,
    content: `쓰잉 이용약관

제1조 (목적)
이 약관은 쓰잉(이하 "서비스")의 이용 조건과 절차, 이용자와 서비스 제공자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (서비스 이용)
1. 서비스는 영어 작문 학습을 위한 모바일 앱입니다.
2. 이용자는 매일 제공되는 한국어 문장을 영어로 작문하고, AI 기반 교정을 받을 수 있습니다.
3. 서비스는 학습 기록, 스트릭, 업적 등의 게이미피케이션 기능을 제공합니다.

제3조 (금지 행위)
1. 서비스를 악용하거나 비정상적인 방법으로 이용하는 행위
2. 타인의 정보를 도용하는 행위
3. 서비스의 안정적 운영을 방해하는 행위

제4조 (면책 조항)
1. AI 교정 결과는 참고용이며, 완벽한 정확성을 보장하지 않습니다.
2. 서비스 이용 중 발생한 학습 결과에 대해 서비스 제공자는 책임을 지지 않습니다.
3. 천재지변, 서버 장애 등 불가항력에 의한 서비스 중단에 대해 책임을 지지 않습니다.`,
  },
  {
    id: 'privacy',
    label: '개인정보처리방침',
    required: true,
    content: `개인정보 수집 및 이용 동의

1. 수집하는 개인정보 항목
- 소셜 로그인: 이메일 주소, 이름 (선택)
- 서비스 이용: 작문 내용, 교정 결과, 학습 기록, 스트릭 정보
- 기기 정보: 기기 식별자, 앱 버전, OS 정보

2. 수집 및 이용 목적
- 서비스 제공 및 회원 관리
- 학습 진도 관리 및 통계 제공
- AI 기반 영어 작문 교정 서비스 제공
- 서비스 개선 및 새로운 기능 개발

3. 보관 기간
- 회원 탈퇴 시까지 보관 후 즉시 파기
- 단, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관

4. 개인정보의 파기
- 보관 기간 경과 또는 처리 목적 달성 시 즉시 파기
- 전자적 파일 형태: 복구 불가능한 방법으로 영구 삭제`,
  },
  {
    id: 'age',
    label: '만 14세 이상입니다',
    required: true,
    content: `만 14세 이상 확인

본 서비스는 만 14세 이상의 이용자만 가입 및 이용이 가능합니다.
만 14세 미만의 아동은 법정대리인의 동의 없이 개인정보를 수집할 수 없으며, 본 서비스를 이용할 수 없습니다.`,
  },
  {
    id: 'thirdparty',
    label: '제3자 정보 제공 동의',
    required: true,
    content: `제3자 정보 제공 동의

쓰잉은 AI 기반 영어 작문 교정 서비스를 제공하기 위해 아래와 같이 개인정보를 제3자에게 제공합니다.

1. 제공받는 자: Anthropic (Claude AI)
2. 제공 목적: 영어 작문 교정 및 피드백 생성
3. 제공 항목: 이용자가 입력한 영어 작문 내용
4. 보유 기간: 교정 처리 완료 후 즉시 파기

* 작문 내용은 AI 교정을 위해 Anthropic(Claude)에 전송됩니다.
* Anthropic의 개인정보 처리방침에 따라 데이터가 처리됩니다.
* 이용자의 이메일, 이름 등 개인 식별 정보는 전송되지 않습니다.`,
  },
  {
    id: 'marketing',
    label: '마케팅 정보 수신',
    required: false,
    content: `마케팅 정보 수신 동의 (선택)

1. 수신 내용
- 새로운 학습 콘텐츠 업데이트 알림
- 이벤트 및 프로모션 안내
- 서비스 개선 소식

2. 수신 방법
- 푸시 알림, 이메일

3. 수신 거부
- 설정 화면에서 언제든지 수신을 거부할 수 있습니다.
- 수신 거부 시 마케팅 관련 알림이 더 이상 발송되지 않습니다.`,
  },
  {
    id: 'push',
    label: '푸시 알림 수신',
    required: false,
    content: `푸시 알림 수신 동의 (선택)

1. 알림 내용
- 매일 학습 리마인더 (오전 9시)
- 스트릭 유지 알림 (오후 8시, 당일 학습 미완료 시)
- 주간 리포트 알림

2. 알림 관리
- 설정 화면에서 언제든지 알림을 끄거나 시간을 변경할 수 있습니다.

3. 권한 요청
- 동의 시 기기의 알림 권한을 요청합니다.
- 기기 설정에서도 알림을 관리할 수 있습니다.`,
  },
];

// --- Component ---

export default function TermsScreen() {
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [modalContent, setModalContent] = useState<TermItem | null>(null);

  const allRequired = TERMS.filter((t) => t.required);
  const allRequiredChecked = allRequired.every((t) => checked[t.id]);
  const allChecked = TERMS.every((t) => checked[t.id]);

  const toggleItem = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleAll = useCallback(() => {
    if (allChecked) {
      setChecked({});
    } else {
      const next: Record<string, boolean> = {};
      TERMS.forEach((t) => {
        next[t.id] = true;
      });
      setChecked(next);
    }
  }, [allChecked]);

  const handleAgree = async () => {
    // Save agreement
    await AsyncStorage.setItem(TERMS_AGREED_KEY, 'true');
    if (checked.marketing) {
      await AsyncStorage.setItem(MARKETING_AGREED_KEY, 'true');
    }
    if (checked.push) {
      await AsyncStorage.setItem(PUSH_AGREED_KEY, 'true');
      // Request push permission and schedule notifications
      await enablePushNotifications();
    }

    // Navigate to home
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{'시작하기 전에'}</Text>
          <Text style={styles.headerSubtitle}>{'약관을 확인하고 동의해주세요.'}</Text>
        </View>

        {/* All agree card */}
        <TouchableOpacity
          style={styles.allAgreeCard}
          onPress={toggleAll}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, allChecked && styles.checkboxChecked]}>
            {allChecked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </View>
          <View style={styles.allAgreeTextWrap}>
            <Text style={styles.allAgreeText}>{'전체 동의'}</Text>
            <Text style={styles.allAgreeSubtext}>{'선택 항목을 포함한 모든 약관'}</Text>
          </View>
        </TouchableOpacity>

        {/* Individual items */}
        <View style={styles.termsList}>
          {TERMS.map((term, index) => (
            <View
              key={term.id}
              style={[
                styles.termRow,
                index > 0 && styles.termRowBorder,
              ]}
            >
              <TouchableOpacity
                style={styles.termLeft}
                onPress={() => toggleItem(term.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.checkbox, checked[term.id] && styles.checkboxChecked]}
                >
                  {checked[term.id] && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <View style={styles.termLabelWrap}>
                  <Text
                    style={[
                      styles.termTag,
                      term.required ? styles.tagRequired : styles.tagOptional,
                    ]}
                  >
                    {term.required ? '필수' : '선택'}
                  </Text>
                  <Text style={styles.termLabel}>{term.label}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalContent(term)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.viewLink}>{'보기'}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom button */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={[styles.agreeButton, !allRequiredChecked && styles.agreeButtonDisabled]}
          onPress={handleAgree}
          activeOpacity={0.8}
          disabled={!allRequiredChecked}
        >
          <Text
            style={[
              styles.agreeButtonText,
              !allRequiredChecked && styles.agreeButtonTextDisabled,
            ]}
          >
            {'동의하고 시작하기'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content modal */}
      <Modal
        visible={!!modalContent}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalContent(null)}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {modalContent?.label || ''}
            </Text>
            <TouchableOpacity
              onPress={() => setModalContent(null)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
          >
            <Text style={styles.modalBody}>{modalContent?.content || ''}</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  // Header
  header: {
    marginBottom: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.md,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: 6,
  },
  headerSubtitle: {
    ...typography.body,
    fontSize: 14,
    color: colors.text.secondary,
  },
  // All agree card
  allAgreeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.primary + '30',
    marginBottom: spacing.md,
  },
  allAgreeTextWrap: {
    flex: 1,
  },
  allAgreeText: {
    ...typography.bodyBold,
    color: colors.text.primary,
  },
  allAgreeSubtext: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  // Term list
  termsList: {
    paddingHorizontal: spacing.xxs,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  termRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  termLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  termLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
    gap: 6,
  },
  termTag: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 6,
  },
  tagRequired: {
    color: colors.error,
  },
  tagOptional: {
    color: colors.text.secondary,
  },
  termLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontSize: 14,
  },
  viewLink: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  // Checkbox
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.xs,
    borderWidth: 2,
    borderColor: colors.disabled,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  // Bottom
  bottomArea: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'web' ? spacing.xl : spacing.xs,
    backgroundColor: colors.background,
  },
  agreeButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
  },
  agreeButtonDisabled: {
    backgroundColor: colors.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  agreeButtonText: {
    ...typography.button,
    color: '#FFFFFF',
  },
  agreeButtonTextDisabled: {
    color: colors.text.hint,
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: spacing.lg,
  },
  modalBody: {
    ...typography.body,
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 22,
  },
});
