/**
 * Apple In-App Purchases 서비스 (expo-in-app-purchases)
 * - RevenueCat SDK 제거, StoreKit 2 기반 직접 구현
 * - 구독 초기화, 상품 조회, 구매, 복원
 */
import * as InAppPurchases from 'expo-in-app-purchases';
import { Platform } from 'react-native';

const PRODUCT_ID = 'app.ssuing.premium.monthly';

let isConnected = false;

/**
 * IAP 연결 초기화
 */
export async function configurePurchases(_userId?: string): Promise<void> {
  if (isConnected) return;

  try {
    await InAppPurchases.connectAsync();
    isConnected = true;
    console.log('[Purchases] IAP 연결 성공');
  } catch (error) {
    console.error('[Purchases] IAP 연결 실패:', error);
  }
}

/**
 * 프리미엄 구독 활성 상태 확인
 * - 구매 이력에서 현재 유효한 구독이 있는지 검사
 */
export async function checkPremiumStatus(): Promise<{
  isPremium: boolean;
  expirationDate: string | null;
  willRenew: boolean;
}> {
  try {
    if (!isConnected) {
      return { isPremium: false, expirationDate: null, willRenew: false };
    }

    const { results } = await InAppPurchases.getPurchaseHistoryAsync();
    if (!results || results.length === 0) {
      return { isPremium: false, expirationDate: null, willRenew: false };
    }

    // 해당 product의 구매 이력 확인
    const premiumPurchase = results.find(
      (p) => p.productId === PRODUCT_ID && p.acknowledged
    );

    if (premiumPurchase) {
      return {
        isPremium: true,
        expirationDate: null, // expo-in-app-purchases는 만료일을 직접 제공하지 않음
        willRenew: true, // 구독 활성 상태로 가정
      };
    }

    return { isPremium: false, expirationDate: null, willRenew: false };
  } catch (error) {
    console.error('[Purchases] 프리미엄 상태 확인 실패:', error);
    return { isPremium: false, expirationDate: null, willRenew: false };
  }
}

/**
 * 구매 가능한 상품 목록 가져오기
 * - RevenueCat의 PurchasesPackage 대신 IAPItemDetails 반환
 */
export async function getOfferings(): Promise<InAppPurchases.IAPItemDetails[]> {
  try {
    if (!isConnected) return [];

    const { results } = await InAppPurchases.getProductsAsync([PRODUCT_ID]);
    return results ?? [];
  } catch (error) {
    console.error('[Purchases] 상품 조회 실패:', error);
    return [];
  }
}

/**
 * 구독 구매
 */
export async function purchaseProduct(
  productId: string = PRODUCT_ID
): Promise<{ success: boolean; isPremium: boolean; error?: string }> {
  try {
    if (!isConnected) {
      return {
        success: false,
        isPremium: false,
        error: '결제 시스템이 초기화되지 않았습니다.',
      };
    }

    await InAppPurchases.purchaseItemAsync(productId);

    // 결과는 purchaseListener를 통해 비동기로 전달됨
    // 여기서는 요청 성공만 반환
    return { success: true, isPremium: false };
  } catch (error: any) {
    console.error('[Purchases] 구매 실패:', error);
    return {
      success: false,
      isPremium: false,
      error: error?.message || '구매 처리 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 구매 리스너 설정
 * - 구매 완료/실패 시 콜백 호출
 */
export function setPurchaseListener(
  onPurchaseComplete: (isPremium: boolean) => void
): void {
  InAppPurchases.setPurchaseListener(async ({ responseCode, results }) => {
    if (
      responseCode === InAppPurchases.IAPResponseCode.OK &&
      results &&
      results.length > 0
    ) {
      for (const purchase of results) {
        if (!purchase.acknowledged) {
          // 구매 확인 (finishTransaction)
          await InAppPurchases.finishTransactionAsync(purchase, true);
        }
        if (purchase.productId === PRODUCT_ID) {
          onPurchaseComplete(true);
        }
      }
    } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
      // 사용자 취소 - 별도 처리 없음
      console.log('[Purchases] 사용자가 구매를 취소했습니다.');
    } else {
      console.error('[Purchases] 구매 실패, responseCode:', responseCode);
      onPurchaseComplete(false);
    }
  });
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
    if (!isConnected) {
      return {
        success: false,
        isPremium: false,
        error: '결제 시스템이 초기화되지 않았습니다.',
      };
    }

    const { results } = await InAppPurchases.getPurchaseHistoryAsync();
    const hasPremium =
      results?.some((p) => p.productId === PRODUCT_ID) ?? false;

    return { success: true, isPremium: hasPremium };
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
 * IAP 연결 해제
 */
export async function disconnectPurchases(): Promise<void> {
  try {
    if (!isConnected) return;
    await InAppPurchases.disconnectAsync();
    isConnected = false;
  } catch (error) {
    console.error('[Purchases] 연결 해제 실패:', error);
  }
}

/**
 * RevenueCat 호환 - 사용자 로그인 (no-op)
 */
export async function loginPurchases(_userId: string): Promise<void> {
  // expo-in-app-purchases는 별도 로그인 불필요
}

/**
 * RevenueCat 호환 - 사용자 로그아웃 (no-op)
 */
export async function logoutPurchases(): Promise<void> {
  // expo-in-app-purchases는 별도 로그아웃 불필요
}
