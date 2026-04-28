/**
 * RevenueCat 구독 서비스
 * - 초기화, 구독 상태 확인, 구매 실행
 * - 환경변수: EXPO_PUBLIC_REVENUECAT_API_KEY
 */
import { Platform } from 'react-native';
import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';

// RevenueCat 상수
const REVENUECAT_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || '';
const ENTITLEMENT_ID = 'premium'; // RevenueCat Dashboard에서 설정한 entitlement identifier

let isConfigured = false;

/**
 * RevenueCat SDK 초기화
 */
export async function configurePurchases(userId?: string): Promise<void> {
  if (isConfigured) return;
  if (!REVENUECAT_API_KEY) {
    console.warn('[Purchases] EXPO_PUBLIC_REVENUECAT_API_KEY가 설정되지 않았습니다.');
    return;
  }

  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    Purchases.configure({
      apiKey: REVENUECAT_API_KEY,
      appUserID: userId || undefined,
    });

    isConfigured = true;
  } catch (error) {
    console.error('[Purchases] 초기화 실패:', error);
  }
}

/**
 * 현재 고객 정보 가져오기
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    if (!isConfigured) return null;
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error('[Purchases] 고객 정보 조회 실패:', error);
    return null;
  }
}

/**
 * 프리미엄 구독 활성 상태 확인
 */
export async function checkPremiumStatus(): Promise<{
  isPremium: boolean;
  expirationDate: string | null;
  willRenew: boolean;
}> {
  try {
    const customerInfo = await getCustomerInfo();
    if (!customerInfo) {
      return { isPremium: false, expirationDate: null, willRenew: false };
    }

    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
    if (entitlement) {
      return {
        isPremium: true,
        expirationDate: entitlement.expirationDate,
        willRenew: entitlement.willRenew,
      };
    }

    return { isPremium: false, expirationDate: null, willRenew: false };
  } catch (error) {
    console.error('[Purchases] 프리미엄 상태 확인 실패:', error);
    return { isPremium: false, expirationDate: null, willRenew: false };
  }
}

/**
 * 구매 가능한 패키지 목록 가져오기
 */
export async function getOfferings(): Promise<PurchasesPackage[]> {
  try {
    if (!isConfigured) return [];
    const offerings = await Purchases.getOfferings();
    if (offerings.current && offerings.current.availablePackages.length > 0) {
      return offerings.current.availablePackages;
    }
    return [];
  } catch (error) {
    console.error('[Purchases] 상품 조회 실패:', error);
    return [];
  }
}

/**
 * 구독 구매
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{ success: boolean; isPremium: boolean; error?: string }> {
  try {
    if (!isConfigured) {
      return { success: false, isPremium: false, error: '결제 시스템이 초기화되지 않았습니다.' };
    }

    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isPremium = !!customerInfo.entitlements.active[ENTITLEMENT_ID];

    return { success: true, isPremium };
  } catch (error: any) {
    // 사용자 취소
    if (error.userCancelled) {
      return { success: false, isPremium: false };
    }
    console.error('[Purchases] 구매 실패:', error);
    return {
      success: false,
      isPremium: false,
      error: error?.message || '구매 처리 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 구독 복원
 */
export async function restorePurchases(): Promise<{
  success: boolean;
  isPremium: boolean;
  error?: string;
}> {
  try {
    if (!isConfigured) {
      return { success: false, isPremium: false, error: '결제 시스템이 초기화되지 않았습니다.' };
    }

    const customerInfo = await Purchases.restorePurchases();
    const isPremium = !!customerInfo.entitlements.active[ENTITLEMENT_ID];

    return { success: true, isPremium };
  } catch (error: any) {
    console.error('[Purchases] 복원 실패:', error);
    return {
      success: false,
      isPremium: false,
      error: error?.message || '구매 복원 중 오류가 발생했습니다.',
    };
  }
}

/**
 * RevenueCat 사용자 ID 설정 (로그인 시)
 */
export async function loginPurchases(userId: string): Promise<void> {
  try {
    if (!isConfigured) return;
    await Purchases.logIn(userId);
  } catch (error) {
    console.error('[Purchases] 로그인 실패:', error);
  }
}

/**
 * RevenueCat 로그아웃 (익명 사용자로 전환)
 */
export async function logoutPurchases(): Promise<void> {
  try {
    if (!isConfigured) return;
    await Purchases.logOut();
  } catch (error) {
    console.error('[Purchases] 로그아웃 실패:', error);
  }
}
