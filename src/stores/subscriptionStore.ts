/**
 * 구독 상태 관리 Zustand 스토어
 * - isPremium, 무료 체험 기간, 일일 사용량 추적
 */
import { create } from 'zustand';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  configurePurchases,
  checkPremiumStatus,
  getOfferings,
  purchasePackage,
  restorePurchases,
} from '../services/purchases';
import type { PurchasesPackage } from 'react-native-purchases';

// AsyncStorage keys
const TRIAL_START_KEY = 'premium_trial_start';
const DAILY_USAGE_KEY = 'premium_daily_usage'; // JSON: { date: string, count: number }

const FREE_DAILY_LIMIT = 1; // 무료: 하루 1문장
const FREE_THEMES = ['daily'] as const; // 무료: 일상 테마만

// ── 설정 가능 상수 (한 곳에서 관리) ──────────────────────────
export const SubscriptionConfig = {
  /** 무료 체험 일수. App Store Connect introductory offer와 일치시킬 것. */
  TRIAL_DAYS: 7,
  /** 표시용 월간 가격. 실제 결제 가격은 RevenueCat product.priceString 사용 권장. */
  MONTHLY_PRICE_DISPLAY: '5,000원',
  /** 월간 구독 product ID (App Store Connect에서 생성) */
  PRODUCT_ID: 'app.ssuing.premium.monthly',

  // 카피 헬퍼
  get trialCTALabel() {
    return `${this.TRIAL_DAYS}일 무료 체험 시작`;
  },
  get trialPriceCaption() {
    return `${this.TRIAL_DAYS}일 무료 체험 후`;
  },
  trialBannerText(daysLeft: number) {
    return `무료 체험 ${daysLeft}일 남음`;
  },
};

const TRIAL_DAYS = SubscriptionConfig.TRIAL_DAYS;

export type SubscriptionPlan = 'free' | 'trial' | 'premium';

interface DailyUsage {
  date: string; // YYYY-MM-DD
  count: number;
}

interface SubscriptionState {
  // 상태
  plan: SubscriptionPlan;
  isPremium: boolean; // trial 또는 premium이면 true
  isLoading: boolean;
  trialEndsAt: Date | null;
  trialDaysLeft: number;
  expirationDate: string | null;
  willRenew: boolean;

  // 일일 사용량
  dailyUsageCount: number;
  canWriteMore: boolean;

  // 패키지
  packages: PurchasesPackage[];
  monthlyPackage: PurchasesPackage | null;

  // 액션
  initialize: (userId?: string) => Promise<void>;
  refreshStatus: () => Promise<void>;
  loadPackages: () => Promise<void>;
  purchase: (pkg?: PurchasesPackage) => Promise<{ success: boolean; error?: string }>;
  restore: () => Promise<{ success: boolean; isPremium: boolean; error?: string }>;
  recordUsage: () => Promise<void>;
  canAccessTheme: (theme: string) => boolean;
  canAccessFeature: (feature: 'review' | 'weekly' | 'allAchievements') => boolean;
  getRemainingWrites: () => number;
  startTrial: () => Promise<void>;
}

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function calculateTrialDaysLeft(trialStart: Date | null): number {
  if (!trialStart) return 0;
  const now = new Date();
  const endDate = new Date(trialStart.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
  const diff = endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  plan: 'free',
  isPremium: false,
  isLoading: false,
  trialEndsAt: null,
  trialDaysLeft: 0,
  expirationDate: null,
  willRenew: false,
  dailyUsageCount: 0,
  canWriteMore: true,
  packages: [],
  monthlyPackage: null,

  initialize: async (userId?: string) => {
    set({ isLoading: true });
    try {
      // RevenueCat 초기화
      await configurePurchases(userId);

      // 구독 상태 확인
      const status = await checkPremiumStatus();

      if (status.isPremium) {
        set({
          plan: 'premium',
          isPremium: true,
          expirationDate: status.expirationDate,
          willRenew: status.willRenew,
          canWriteMore: true,
          isLoading: false,
        });
        return;
      }

      // 무료 체험 확인
      const trialStartStr = await AsyncStorage.getItem(TRIAL_START_KEY);
      let plan = 'free' as SubscriptionPlan;
      let trialEndsAt: Date | null = null;
      let trialDaysLeft = 0;

      if (trialStartStr) {
        const trialStart = new Date(trialStartStr);
        trialDaysLeft = calculateTrialDaysLeft(trialStart);

        if (trialDaysLeft > 0) {
          plan = 'trial';
          trialEndsAt = new Date(trialStart.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
        }
      }

      // 일일 사용량 로드
      const usageStr = await AsyncStorage.getItem(DAILY_USAGE_KEY);
      let dailyUsageCount = 0;
      if (usageStr) {
        try {
          const usage: DailyUsage = JSON.parse(usageStr);
          if (usage.date === getTodayString()) {
            dailyUsageCount = usage.count;
          }
        } catch {}
      }

      const isPrem = plan === 'trial' || plan === 'premium';
      const canWriteMore = isPrem || dailyUsageCount < FREE_DAILY_LIMIT;

      set({
        plan,
        isPremium: isPrem,
        trialEndsAt,
        trialDaysLeft,
        dailyUsageCount,
        canWriteMore,
        isLoading: false,
      });
    } catch (error) {
      console.error('[SubscriptionStore] 초기화 실패:', error);
      set({ isLoading: false });
    }
  },

  refreshStatus: async () => {
    const status = await checkPremiumStatus();
    if (status.isPremium) {
      set({
        plan: 'premium',
        isPremium: true,
        expirationDate: status.expirationDate,
        willRenew: status.willRenew,
        canWriteMore: true,
      });
      return;
    }

    // 체험 상태 재확인
    const trialStartStr = await AsyncStorage.getItem(TRIAL_START_KEY);
    if (trialStartStr) {
      const trialStart = new Date(trialStartStr);
      const daysLeft = calculateTrialDaysLeft(trialStart);
      if (daysLeft > 0) {
        set({
          plan: 'trial' as SubscriptionPlan,
          isPremium: true,
          trialDaysLeft: daysLeft,
          canWriteMore: true,
        });
        return;
      }
    }

    const { dailyUsageCount } = get();
    set({
      plan: 'free' as SubscriptionPlan,
      isPremium: false,
      trialDaysLeft: 0,
      canWriteMore: dailyUsageCount < FREE_DAILY_LIMIT,
    });
  },

  loadPackages: async () => {
    const packages = await getOfferings();
    const monthly = packages.find(
      (p) => p.packageType === 'MONTHLY' || p.identifier === '$rc_monthly'
    ) || packages[0] || null;

    set({ packages, monthlyPackage: monthly });
  },

  purchase: async (pkg?: PurchasesPackage) => {
    const target = pkg || get().monthlyPackage;
    if (!target) {
      return { success: false, error: '구매 가능한 상품이 없습니다.' };
    }

    set({ isLoading: true });
    const result = await purchasePackage(target);
    if (result.success && result.isPremium) {
      set({
        plan: 'premium',
        isPremium: true,
        canWriteMore: true,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
    return result;
  },

  restore: async () => {
    set({ isLoading: true });
    const result = await restorePurchases();
    if (result.success && result.isPremium) {
      set({
        plan: 'premium',
        isPremium: true,
        canWriteMore: true,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
    return result;
  },

  recordUsage: async () => {
    const { isPremium, dailyUsageCount } = get();
    const newCount = dailyUsageCount + 1;
    const today = getTodayString();

    await AsyncStorage.setItem(
      DAILY_USAGE_KEY,
      JSON.stringify({ date: today, count: newCount })
    );

    set({
      dailyUsageCount: newCount,
      canWriteMore: isPremium || newCount < FREE_DAILY_LIMIT,
    });
  },

  canAccessTheme: (theme: string) => {
    const { isPremium } = get();
    if (isPremium) return true;
    return (FREE_THEMES as readonly string[]).includes(theme);
  },

  canAccessFeature: (feature: 'review' | 'weekly' | 'allAchievements') => {
    return get().isPremium;
  },

  getRemainingWrites: () => {
    const { isPremium, dailyUsageCount } = get();
    if (isPremium) return 3; // 프리미엄: 하루 3문장 (테마당)
    return Math.max(0, FREE_DAILY_LIMIT - dailyUsageCount);
  },

  startTrial: async () => {
    const existing = await AsyncStorage.getItem(TRIAL_START_KEY);
    if (existing) return; // 이미 체험 시작됨

    const now = new Date();
    await AsyncStorage.setItem(TRIAL_START_KEY, now.toISOString());

    const trialEndsAt = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

    set({
      plan: 'trial',
      isPremium: true,
      trialEndsAt,
      trialDaysLeft: TRIAL_DAYS,
      canWriteMore: true,
    });
  },
}));
