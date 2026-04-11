# 쓰잉 온보딩 설계서 v1.0

> 첫 실행 경험(FTUE) 최적화 -- 스플래시부터 첫 학습 진입까지

---

## 1. 전체 플로우 다이어그램

```
앱 첫 실행
  │
  ▼
[1] 스플래시 (0.5~1초, 자동 전환)
  │   "쓰잉" 로고 + 펜 스트로크 애니메이션
  │
  ▼
[2] 온보딩 슬라이드 (3장 스와이프)
  │   1장: "한글을 영어로, 써보세요" ─── 흥미 유발
  │   2장: "AI가 원어민처럼 교정" ──── 핵심 가치 전달
  │   3장: "하루 3문장이면 충분" ───── 진입 장벽 제거
  │
  │   [Skip] 어느 장에서든 → 인증 게이트로
  │   [시작하기] 3장 마지막 CTA → 인증 게이트로
  │
  ▼
[3] 인증 게이트 (AuthGateScreen)
  │   ├── [이메일로 시작하기] → 회원가입
  │   ├── [이미 계정이 있어요] → 로그인
  │   └── [게스트로 둘러보기] → 홈 (게스트 모드)
  │
  ▼
[4] 홈 스크린 → 첫 학습 시작
```

### 재방문 분기

```
앱 재실행
  │
  ├── isOnboarded=true, token 있음 → 토큰 검증 → 홈
  ├── isOnboarded=true, token 없음 → 인증 게이트
  └── isOnboarded=false → 온보딩 슬라이드부터
```

---

## 2. 벤치마킹 분석

### 듀오링고
- 온보딩에서 로그인 전 목표 설정(언어, 수준, 학습 이유)을 먼저 수행
- "이미 해봤다" 느낌을 줘서 이탈 방지
- 핵심: **가치 체험을 로그인보다 앞에 배치**

### 말해보카
- 3장 스와이프 온보딩 후 카카오/애플 소셜 로그인
- 일러스트 중심, 카피 극히 짧음
- 핵심: **비주얼로 설명, 텍스트 최소화**

### 케이크
- 영상 클립 미리보기로 콘텐츠 맛보기 제공
- 온보딩 2장 + 관심 주제 선택 후 로그인
- 핵심: **콘텐츠 샘플로 기대감 형성**

### 쓰잉에 적용할 교훈
1. 로그인은 온보딩 뒤로 (듀오링고, 말해보카, 케이크 공통)
2. 온보딩은 비주얼 중심, 3장 이내 (말해보카)
3. 게스트 모드를 항상 제공 -- 마찰 최소화 (듀오링고)
4. 감정 흐름 설계: 흥미 → 가치 인지 → "나도 할 수 있겠다"

---

## 3. 화면별 상세 설계

---

### 3-1. 스플래시 화면

```
┌──────────────────────────────────┐
│                                   │
│                                   │
│                                   │
│                                   │
│                                   │
│            ✏️                      │  ← 펜 아이콘 (Lottie)
│           쓰잉                    │  ← 로고, Pretendard Bold 36px
│                                   │
│      Write your English           │  ← SF Pro Text, 14px, #6B7280
│                                   │
│                                   │
│                                   │
│                                   │
│                                   │
│                                   │
└──────────────────────────────────┘

배경: #FFFFFF
```

#### 스플래시 스펙

| 항목 | 값 |
|------|-----|
| 표시 시간 | 800ms (최소 500ms, 최대 1000ms) |
| 배경색 | `#FFFFFF` |
| 로고 | "쓰잉" Pretendard Bold 36px, `#1A1A2E` |
| 서브텍스트 | "Write your English" SF Pro Text 14px, `#6B7280` |
| 아이콘 | 펜 스트로크 Lottie 애니메이션 (0.5초) |
| 전환 | fade-out 300ms → 온보딩 1장 fade-in 300ms |
| 자동 전환 | 800ms 후 자동, 터치 불필요 |

#### 애니메이션 시퀀스

```
0ms     : 배경 #FFFFFF 표시
100ms   : 펜 아이콘 stroke 드로잉 시작 (Lottie)
400ms   : "쓰잉" 텍스트 fade-in + translateY(-8px → 0)
500ms   : "Write your English" fade-in
800ms   : 전체 fade-out 시작 (300ms)
1100ms  : 온보딩 1장으로 전환 완료
```

---

### 3-2. 온보딩 슬라이드

#### 공통 레이아웃

```
┌──────────────────────────────────┐
│  StatusBar                        │
│                                   │
│                          건너뛰기  │  ← Skip 버튼 (우측 상단)
│                                   │
│                                   │
│                                   │
│         [메인 비주얼 영역]         │  ← 화면 상단 40% 차지
│         (일러스트/아이콘)          │
│                                   │
│                                   │
│                                   │
│                                   │
│       메인 카피 (1줄, Bold)        │  ← 중앙 정렬
│                                   │
│       서브 카피 (1~2줄)            │  ← 중앙 정렬
│                                   │
│                                   │
│           ● ○ ○                   │  ← 페이지 인디케이터
│                                   │
│   ┌──────────────────────────┐    │
│   │        다음               │    │  ← CTA 버튼
│   └──────────────────────────┘    │
│                                   │
└──────────────────────────────────┘
```

#### 공통 컴포넌트 스펙

| 컴포넌트 | 위치/크기 | 스타일 |
|----------|----------|--------|
| Skip 버튼 | 우측 상단, SafeArea 내부, padding 20px | Pretendard Medium 15px, `#9CA3AF`, 터치 영역 44x44px |
| 메인 비주얼 | 중앙, 화면 상단 40%, 최대 240x240px | Lottie 또는 SVG 일러스트 |
| 메인 카피 | 비주얼 하단 32px | Pretendard Bold 26px, `#1A1A2E`, 중앙 정렬 |
| 서브 카피 | 메인 카피 하단 12px | Pretendard Regular 16px, `#6B7280`, 중앙 정렬, line-height 24px |
| 페이지 인디케이터 | 서브 카피 하단 32px, 중앙 | 활성: 24x8px 라운드 바 `#4A90D9`, 비활성: 8x8px 원 `#D1D5DB`, gap 8px |
| CTA 버튼 | 하단 SafeArea 위 20px, 좌우 20px 마진 | height 52px, border-radius 14px, Pretendard SemiBold 17px |
| 스와이프 | 좌우 수평, threshold 30% | Spring: damping 20, stiffness 200 |

---

#### 온보딩 1장: "이거 뭐지? 흥미롭다"

```
┌──────────────────────────────────┐
│                                   │
│                          건너뛰기  │
│                                   │
│                                   │
│         ┌─────────────────┐       │
│         │                 │       │
│         │  "오늘 날씨 좋다" │       │  ← 한글 말풍선
│         │        ↓        │       │
│         │  ✏️ 타이핑 모션   │       │  ← 펜으로 쓰는 애니메이션
│         │        ↓        │       │
│         │ "The weather is  │       │  ← 영어 말풍선 등장
│         │   nice today"   │       │
│         └─────────────────┘       │
│                                   │
│     한글을 영어로, 써보세요         │  ← 메인 카피
│                                   │
│     한국어 문장을 보고               │  ← 서브 카피
│     나만의 영어로 표현해요           │
│                                   │
│           ● ○ ○                   │
│                                   │
│   ┌──────────────────────────┐    │
│   │         다음              │    │
│   └──────────────────────────┘    │
│                                   │
└──────────────────────────────────┘
```

| 항목 | 값 |
|------|-----|
| 배경색 | `#F0F4FF` (연한 블루) |
| 메인 비주얼 | 한글 → 영어 변환 일러스트 (Lottie). 한글 말풍선에서 펜 스트로크 → 영어 말풍선 등장 |
| 메인 카피 | **한글을 영어로, 써보세요** (14자) |
| 서브 카피 | 한국어 문장을 보고 / 나만의 영어로 표현해요 |
| CTA | "다음" (Primary #4A90D9, 텍스트 #FFFFFF) |
| 감정 목표 | 흥미, "이거 뭐지?" |
| 비주얼 애니메이션 | 한글 말풍선 0.3초 fade-in → 펜 쓰기 모션 0.5초 → 영어 말풍선 0.3초 slide-up + fade-in |

---

#### 온보딩 2장: "오 AI가 교정? 좋은데"

```
┌──────────────────────────────────┐
│                                   │
│                          건너뛰기  │
│                                   │
│                                   │
│         ┌─────────────────┐       │
│         │                 │       │
│         │ "I go to school │       │  ← 사용자 입력 (빨간 밑줄)
│         │  yesterday"     │       │
│         │      ↓ ✨ AI     │       │  ← AI 반짝이 아이콘
│         │ "I went to      │       │  ← AI 교정 (초록 하이라이트)
│         │  school         │       │
│         │  yesterday"     │       │
│         └─────────────────┘       │
│                                   │
│     AI가 원어민처럼 교정            │  ← 메인 카피
│                                   │
│     문법, 표현, 뉘앙스까지          │  ← 서브 카피
│     꼼꼼하게 피드백해요             │
│                                   │
│           ○ ● ○                   │
│                                   │
│   ┌──────────────────────────┐    │
│   │         다음              │    │
│   └──────────────────────────┘    │
│                                   │
└──────────────────────────────────┘
```

| 항목 | 값 |
|------|-----|
| 배경색 | `#F5F0FF` (연한 보라) |
| 메인 비주얼 | Before/After 교정 일러스트 (Lottie). 오류 문장에 빨간 밑줄 → AI 아이콘 등장 → 교정 문장 초록 하이라이트 |
| 메인 카피 | **AI가 원어민처럼 교정** (11자) |
| 서브 카피 | 문법, 표현, 뉘앙스까지 / 꼼꼼하게 피드백해요 |
| CTA | "다음" (Primary #4A90D9, 텍스트 #FFFFFF) |
| 감정 목표 | 신뢰, "오 AI가 교정해주네, 좋은데" |
| 비주얼 애니메이션 | 오류 문장 0.3초 → 빨간 밑줄 0.3초 → AI 아이콘 반짝 0.3초 → 교정 문장 slide-in 0.4초 (초록 하이라이트 fade-in) |

---

#### 온보딩 3장: "하루 3문장이면 나도 할 수 있겠다"

```
┌──────────────────────────────────┐
│                                   │
│                          건너뛰기  │
│                                   │
│                                   │
│         ┌─────────────────┐       │
│         │                 │       │
│         │   ☀️ 일상        │       │  ← 3개 테마 카드 미니 버전
│         │   💼 비즈니스    │       │
│         │   ✈️ 여행        │       │
│         │                 │       │
│         │   ✅ ✅ ✅       │       │  ← 3개 체크 완료 애니메이션
│         │   +25 XP  🔥3   │       │  ← XP 획득 + 스트릭
│         │                 │       │
│         └─────────────────┘       │
│                                   │
│     하루 3문장이면 충분             │  ← 메인 카피
│                                   │
│     매일 조금씩, 꾸준히 쌓이는       │  ← 서브 카피
│     나만의 영어 실력                │
│                                   │
│           ○ ○ ●                   │
│                                   │
│   ┌──────────────────────────┐    │
│   │       시작하기             │    │  ← "시작하기"로 변경
│   └──────────────────────────┘    │
│                                   │
└──────────────────────────────────┘
```

| 항목 | 값 |
|------|-----|
| 배경색 | `#F0FFF4` (연한 초록) |
| 메인 비주얼 | 3개 테마 미니 카드 + 체크 완료 + XP/스트릭 일러스트 (Lottie). 테마 카드 순차 등장 → 체크 애니메이션 → XP 카운트업 |
| 메인 카피 | **하루 3문장이면 충분** (10자) |
| 서브 카피 | 매일 조금씩, 꾸준히 쌓이는 / 나만의 영어 실력 |
| CTA | **"시작하기"** (그라데이션 #4A90D9 → #7C4DFF, 텍스트 #FFFFFF, scale 펄스 1회) |
| 감정 목표 | 자신감, "이 정도면 나도 할 수 있겠다" |
| 비주얼 애니메이션 | 테마 카드 0.2초 간격 순차 slide-in → 체크 0.2초 간격 순차 bounce → XP +25 카운트업 0.4초 → 스트릭 불꽃 bounce |

---

### 3-3. 인증 게이트 화면 (온보딩 → 로그인/게스트 전환)

```
┌──────────────────────────────────┐
│                                   │
│                                   │
│                                   │
│            ✏️                      │
│           쓰잉                    │  ← 로고, Pretendard Bold 32px
│                                   │
│     매일 3문장, 영작으로            │  ← 서브 카피
│     영어가 늘어요                  │
│                                   │
│                                   │
│                                   │
│                                   │
│   ┌──────────────────────────┐    │
│   │   이메일로 시작하기       │    │  ← Primary (파란색 채움)
│   └──────────────────────────┘    │
│                                   │
│   ┌──────────────────────────┐    │
│   │   이미 계정이 있어요      │    │  ← Secondary (아웃라인)
│   └──────────────────────────┘    │
│                                   │
│       게스트로 둘러보기            │  ← 텍스트 버튼 (#9CA3AF)
│                                   │
│   게스트로 시작해도 나중에          │  ← 안심 문구
│   계정을 연동할 수 있어요           │
│                                   │
└──────────────────────────────────┘
```

#### 전환 애니메이션 (온보딩 3장 → 인증 게이트)

| 항목 | 값 |
|------|-----|
| 트리거 | "시작하기" 버튼 탭 또는 마지막 장에서 좌 스와이프 |
| 전환 방식 | 온보딩 배경색 fade → #FFFFFF (400ms, ease-in-out) |
| 로고 | 스플래시와 동일 로고, scale(0.95→1.0) + fade-in 300ms |
| 버튼 그룹 | 아래에서 올라오며 등장, translateY(30→0) + fade-in, 400ms, 100ms 간격 stagger |
| 안심 문구 | 버튼 등장 200ms 후 fade-in |

#### 인증 게이트 컴포넌트 스펙

| 컴포넌트 | 스타일 |
|----------|--------|
| 배경 | `#FFFFFF` |
| 로고 | 펜 아이콘 + "쓰잉" Pretendard Bold 32px, `#1A1A2E` |
| 서브 카피 | Pretendard Regular 16px, `#6B7280`, 중앙 정렬 |
| Primary 버튼 | 배경 `#4A90D9`, 텍스트 `#FFFFFF`, height 52px, border-radius 14px, shadow |
| Secondary 버튼 | 배경 `#FFFFFF`, border 1.5px `#4A90D9`, 텍스트 `#4A90D9`, height 52px, border-radius 14px |
| 게스트 텍스트 버튼 | Pretendard Medium 15px, `#9CA3AF`, 터치 영역 44px, underline 없음 |
| 안심 문구 | Pretendard Regular 13px, `#9CA3AF`, 중앙 정렬 |
| 버튼 간격 | 12px |
| 좌우 마진 | 20px |

---

## 4. 색상/애니메이션 종합 스펙

### 4-1. 화면별 배경색

| 화면 | 배경색 | Hex | 의도 |
|------|--------|-----|------|
| 스플래시 | 화이트 | `#FFFFFF` | 깔끔한 첫인상 |
| 온보딩 1장 | 연한 블루 | `#F0F4FF` | 시원함, 시작의 느낌 |
| 온보딩 2장 | 연한 보라 | `#F5F0FF` | AI/기술 느낌, Secondary 색상 계열 |
| 온보딩 3장 | 연한 초록 | `#F0FFF4` | 성취감, 성장 |
| 인증 게이트 | 화이트 | `#FFFFFF` | 깔끔함, 신뢰 |

### 4-2. 애니메이션 타이밍 총괄

| 구간 | 타이밍 | Easing |
|------|--------|--------|
| 스플래시 표시 | 800ms | - |
| 스플래시 → 온보딩 전환 | fade 300ms | ease-in-out |
| 온보딩 슬라이드 스와이프 | spring (damping 20, stiffness 200) | spring |
| 온보딩 일러스트 자동 재생 | 화면 진입 시 0.3초 딜레이 후 시작 | - |
| 온보딩 CTA 등장 | 일러스트 완료 후 fade-in 300ms | ease-out |
| "시작하기" 버튼 펄스 | scale 1.0→1.03→1.0, 2초 주기 반복 | ease-in-out |
| 온보딩 → 인증 게이트 전환 | 배경 fade 400ms + 콘텐츠 stagger 100ms 간격 | ease-in-out |
| 인증 게이트 버튼 stagger | translateY(30→0) + fade, 각 100ms 간격 | cubic-bezier(0.16, 1, 0.3, 1) |

### 4-3. Lottie 에셋 목록

| 에셋 ID | 화면 | 설명 | 크기 | 반복 |
|---------|------|------|------|------|
| `splash_pen_stroke` | 스플래시 | 펜 드로잉 모션 | 120x120px | 1회 |
| `onboard_translate` | 온보딩 1장 | 한글→영어 변환 | 240x240px | 1회 |
| `onboard_ai_correct` | 온보딩 2장 | AI 교정 Before/After | 240x240px | 1회 |
| `onboard_daily_goal` | 온보딩 3장 | 3문장 완료 + XP 획득 | 240x240px | 1회 |

---

## 5. 프론트 개발자 전달용 컴포넌트 스펙

### 5-1. 파일 구조

```
src/
├── app/
│   ├── splash.tsx              ← 스플래시 화면 (expo-splash-screen 커스텀)
│   ├── onboarding.tsx          ← 온보딩 3장 스와이프
│   ├── auth-gate.tsx           ← 인증 선택 화면
│   └── _layout.tsx             ← 루트 분기 (isOnboarded 체크)
├── components/
│   ├── onboarding/
│   │   ├── OnboardingSlide.tsx ← 개별 슬라이드 컴포넌트
│   │   ├── PageIndicator.tsx   ← 페이지 인디케이터 (dot/bar)
│   │   └── SkipButton.tsx      ← 건너뛰기 버튼
│   └── auth/
│       └── AuthGate.tsx        ← 인증 게이트 UI
├── assets/
│   └── lottie/
│       ├── splash_pen_stroke.json
│       ├── onboard_translate.json
│       ├── onboard_ai_correct.json
│       └── onboard_daily_goal.json
└── stores/
    └── authStore.ts            ← isOnboarded 상태 관리
```

### 5-2. OnboardingSlide 컴포넌트

```typescript
interface OnboardingSlideProps {
  lottieSource: LottieSource;
  mainCopy: string;
  subCopy: string;
  backgroundColor: string;
  isLast?: boolean;
  onNext: () => void;
  onSkip: () => void;
}
```

#### Props 상세

| Prop | 타입 | 설명 |
|------|------|------|
| `lottieSource` | `AnimationObject` | Lottie JSON 에셋 |
| `mainCopy` | `string` | 메인 카피 (Bold 26px) |
| `subCopy` | `string` | 서브 카피 (Regular 16px, `\n`으로 줄바꿈) |
| `backgroundColor` | `string` | 배경색 hex |
| `isLast` | `boolean` | true이면 CTA를 "시작하기"로, 그라데이션 적용 |
| `onNext` | `() => void` | "다음"/"시작하기" 탭 핸들러 |
| `onSkip` | `() => void` | "건너뛰기" 탭 핸들러 |

### 5-3. PageIndicator 컴포넌트

```typescript
interface PageIndicatorProps {
  totalPages: number;
  currentPage: number;  // 0-indexed
}
```

#### 렌더링 로직

- 활성 페이지: 가로 24px, 세로 8px, border-radius 4px, 배경 `#4A90D9`
- 비활성 페이지: 8x8px 원형, 배경 `#D1D5DB`
- 전환: width 애니메이션 200ms (8px ↔ 24px), spring
- 간격: gap 8px

### 5-4. 온보딩 화면 (onboarding.tsx) 구현 가이드

```typescript
// 슬라이드 데이터
const SLIDES = [
  {
    lottieSource: require('@/assets/lottie/onboard_translate.json'),
    mainCopy: '한글을 영어로, 써보세요',
    subCopy: '한국어 문장을 보고\n나만의 영어로 표현해요',
    backgroundColor: '#F0F4FF',
  },
  {
    lottieSource: require('@/assets/lottie/onboard_ai_correct.json'),
    mainCopy: 'AI가 원어민처럼 교정',
    subCopy: '문법, 표현, 뉘앙스까지\n꼼꼼하게 피드백해요',
    backgroundColor: '#F5F0FF',
  },
  {
    lottieSource: require('@/assets/lottie/onboard_daily_goal.json'),
    mainCopy: '하루 3문장이면 충분',
    subCopy: '매일 조금씩, 꾸준히 쌓이는\n나만의 영어 실력',
    backgroundColor: '#F0FFF4',
  },
];
```

#### 핵심 구현 사항

| 항목 | 구현 방법 |
|------|----------|
| 스와이프 | `react-native-pager-view` 또는 `FlatList` horizontal + pagingEnabled |
| 배경색 전환 | `Animated.interpolateColor` (scrollX 기반) |
| Lottie | `lottie-react-native`, autoPlay=false → 페이지 진입 시 `play()` |
| Skip | `onPress` → `router.replace('/auth-gate')` + `authStore.skipOnboarding()` |
| 시작하기 | 3장 CTA → `router.replace('/auth-gate')` + `authStore.skipOnboarding()` |
| isOnboarded 영속화 | `AsyncStorage.setItem('isOnboarded', 'true')` |

### 5-5. 스플래시 구현 가이드

| 항목 | 구현 방법 |
|------|----------|
| 네이티브 스플래시 | `expo-splash-screen` -- `SplashScreen.preventAutoHideAsync()` |
| 커스텀 스플래시 | 네이티브 스플래시 hide 후, 커스텀 뷰에서 Lottie 재생 |
| 전환 | Lottie 완료 콜백(`onAnimationFinish`) → fade-out → 온보딩 navigate |
| 폰트 로딩 | 스플래시 표시 중 `expo-font` 로딩 완료 대기 |

### 5-6. 루트 레이아웃 분기 로직

```typescript
// _layout.tsx 의사 코드
const { isOnboarded, token, isLoading } = useAuthStore();

if (isLoading) return <SplashView />;
if (!isOnboarded) return <Redirect href="/onboarding" />;
if (!token && !isGuest) return <Redirect href="/auth-gate" />;
return <TabsLayout />;
```

### 5-7. 접근성 체크리스트

| 항목 | 기준 | 구현 |
|------|------|------|
| Skip 버튼 터치 영역 | 44x44px 이상 | `hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}` |
| CTA 버튼 높이 | 52px (48px 최소) | height: 52 |
| 색상 대비 | WCAG AA 4.5:1 | 메인 카피 `#1A1A2E` on `#F0F4FF` = 통과 |
| VoiceOver | 슬라이드 읽기 순서 | `accessibilityLabel`, `accessibilityRole="header"` for 메인 카피 |
| 모션 감소 | `prefers-reduced-motion` 대응 | Lottie autoPlay=false, `AccessibilityInfo.isReduceMotionEnabled` 체크 시 정적 이미지 표시 |
| 스와이프 대안 | 버튼으로도 이동 가능 | "다음" 버튼이 항상 존재 |

### 5-8. 성능 가이드라인

| 항목 | 권장 |
|------|------|
| Lottie JSON 크기 | 각 50KB 이하 |
| 이미지 대신 Lottie | 벡터 기반으로 해상도 독립적 |
| 배경색 전환 | `useNativeDriver: true` 불가 → `useNativeDriver: false` + `shouldRasterize` |
| 폰트 프리로딩 | 스플래시 중 완료 |
| 슬라이드 프리렌더 | FlatList `windowSize={3}` 또는 PagerView `offscreenPageLimit={1}` |

---

## 6. QA 검증 기준

| 검증 항목 | 기준 |
|----------|------|
| 스플래시 표시 시간 | 500ms ~ 1000ms 이내 |
| 온보딩 → 인증 게이트 전체 소요 시간 | 사용자가 Skip하면 2초 이내 도달 가능 |
| 스와이프 반응성 | 터치 후 프레임 드롭 없이 60fps |
| 배경색 전환 | 끊김 없이 부드럽게 보간 |
| Skip 동작 | 어느 페이지에서든 즉시 인증 게이트로 이동 |
| "시작하기" 동작 | 3장에서만 표시, 탭 시 인증 게이트로 이동 |
| 게스트 진입 | "게스트로 둘러보기" → 홈 직행, 로딩 없음 |
| 재실행 시 온보딩 스킵 | isOnboarded=true면 온보딩 안 보임 |
| 다크 모드 | v1.0에서는 라이트 모드 전용 (향후 대응) |
| 가로 모드 | 세로 고정 (portrait lock) |
| iPhone SE (320px) | 레이아웃 깨짐 없음, 스크롤 불필요 |
| iPhone 15 Pro Max (430px) | 비주얼 영역 적절한 크기 유지 |
