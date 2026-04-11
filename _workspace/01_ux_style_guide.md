# EngWrite Style Guide

## 1. 색상 팔레트

### Primary Colors

| 이름 | HEX | 용도 |
|------|-----|------|
| Primary | `#4A90D9` | 메인 액션, 프로그레스 바, 활성 버튼, 링크 |
| Primary Light | `#6BA3E0` | 그라데이션 끝점, hover 상태 |
| Primary Dark | `#3A7BC8` | pressed 상태 |
| Secondary | `#7C4DFF` | 힌트 영역, 보조 강조, 비지니스 테마 |
| Secondary Light | `#9B7BFF` | 그라데이션 끝점 |

### Semantic Colors

| 이름 | HEX | 용도 |
|------|-----|------|
| Success | `#4CAF50` | 높은 점수 (8-10), 정답 부분, 완료 상태 |
| Success Light | `#E8F5E9` | 성공 배경 |
| Warning | `#FF9800` | 중간 점수 (5-7), 수정 하이라이트 |
| Warning Light | `#FFF3E0` | 수정 부분 배경 하이라이트 |
| Error | `#F44336` | 낮은 점수 (1-4), 오류 표시, 취소선 |
| Error Light | `#FFEBEE` | 오류 배경 |

### Neutral Colors

| 이름 | HEX | 용도 |
|------|-----|------|
| Background | `#FAFBFC` | 앱 배경 |
| Card | `#FFFFFF` | 카드 배경 |
| Border | `#E5E7EB` | 카드 테두리, 구분선 |
| Border Focus | `#4A90D9` | 입력 필드 포커스 테두리 |
| Disabled | `#D1D5DB` | 비활성 버튼, 비활성 텍스트 |
| Text Primary | `#1A1A2E` | 본문 텍스트, 제목 |
| Text Secondary | `#6B7280` | 보조 텍스트, 라벨 |
| Text Tertiary | `#9CA3AF` | placeholder, 비활성 텍스트 |

### 테마 카드 그라데이션

```
일상 영어: linear-gradient(135deg, #4A90D9, #6BA3E0)
비지니스 영어: linear-gradient(135deg, #7C4DFF, #9B7BFF)
```

---

## 2. 타이포그래피

### 폰트 패밀리

| 용도 | 폰트 | 플랫폼 fallback |
|------|------|-----------------|
| 한글 | Pretendard | System default (Apple SD Gothic Neo) |
| 영어 | SF Pro Text | System default (San Francisco) |

### 타이포그래피 스케일

| 토큰 | 폰트 | Weight | Size | Line Height | 용도 |
|------|------|--------|------|-------------|------|
| `heading1` | Pretendard | Bold (700) | 28px | 36px | 앱 로고 |
| `heading2` | Pretendard | Bold (700) | 24px | 32px | 축하 모달 제목 |
| `heading3` | Pretendard | SemiBold (600) | 22px | 30px | 테마 카드 제목 |
| `subtitle` | Pretendard | SemiBold (600) | 17px | 24px | 네비게이션 바 제목 |
| `body-ko` | Pretendard | Bold (700) | 20px | 28px | 한글 문장 (학습 대상) |
| `body-en` | SF Pro Text | Medium (500) | 18px | 26px | 교정 문장 |
| `input` | SF Pro Text | Regular (400) | 18px | 26px | 영어 작문 입력 |
| `hint-en` | SF Pro Text | Medium (500) | 16px | 22px | 힌트 영어 단어 |
| `hint-ko` | Pretendard | Regular (400) | 14px | 20px | 힌트 한글 뜻 |
| `label` | Pretendard | Medium (500) | 15px | 20px | 힌트 헤더, 섹션 라벨 |
| `caption` | Pretendard | Regular (400) | 13px | 18px | 진행 텍스트, 부가 정보 |
| `explanation` | Pretendard | Regular (400) | 14px | 22px | 교정 설명 텍스트 |
| `score` | SF Pro Text | Bold (700) | 24px | 32px | 점수 숫자 |
| `button` | Pretendard | SemiBold (600) | 16px | 22px | 버튼 텍스트 |

---

## 3. 간격 시스템

### Base Unit: 4px

| 토큰 | 값 | 용도 |
|------|-----|------|
| `space-xs` | 4px | 아이콘과 텍스트 사이 |
| `space-sm` | 8px | 힌트 단어 간 간격, 인라인 요소 간격 |
| `space-md` | 12px | 힌트 카드 내부 패딩 |
| `space-base` | 16px | 섹션 간 간격, 카드 내부 패딩, 입력 필드 패딩 |
| `space-lg` | 20px | 카드 패딩, 화면 좌우 마진 |
| `space-xl` | 24px | 한글 문장 영역 상하 패딩 |
| `space-2xl` | 32px | 주요 섹션 간 간격 |

### 화면 마진

```
Screen horizontal padding: 20px (좌우 동일)
Safe area: iOS SafeAreaView 적용
```

---

## 4. 카드 스타일

### 기본 카드

```css
background: #FFFFFF;
border-radius: 16px;
padding: 20px;
shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
```

### 테마 카드 (HomeScreen)

```css
border-radius: 16px;
padding: 20px;
height: 140px;
shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
/* 일상 영어 */
background: linear-gradient(135deg, #4A90D9, #6BA3E0);
/* 비지니스 영어 */
background: linear-gradient(135deg, #7C4DFF, #9B7BFF);
```

### 힌트 카드

```css
background: #F5F3FF;
border: 1px solid #E8E0FF;
border-radius: 12px;
padding: 12px 16px;
```

### 교정 결과 카드

```css
background: #FFFFFF;
border-radius: 16px;
padding: 20px;
shadow: 0 4px 16px rgba(0, 0, 0, 0.10);
```

### 기록 카드

```css
background: #FFFFFF;
border-radius: 12px;
padding: 16px;
shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
```

### 컴팩트 카드 (학습 기록 진입)

```css
background: #FFFFFF;
border: 1px solid #E5E7EB;
border-radius: 12px;
padding: 16px;
height: 64px;
```

---

## 5. 버튼 스타일

### Primary Button (작문 완료)

```css
/* 활성 */
background: #4A90D9;
color: #FFFFFF;
height: 48px;
border-radius: 12px;
font: Pretendard SemiBold 16px;
shadow: 0 2px 8px rgba(74, 144, 217, 0.3);

/* Pressed */
background: #3A7BC8;

/* 비활성 (입력 10자 미만) */
background: #D1D5DB;
color: #9CA3AF;
shadow: none;
```

### Text Button (뒤로가기)

```css
background: transparent;
color: #1A1A2E;
padding: 8px;
touch-target: 44x44px;  /* 최소 터치 영역 */
```

---

## 6. 인터랙션 스펙

### 스와이프 (PracticeScreen 문장 전환)

| 속성 | 값 |
|------|-----|
| 방향 | 수평 (좌/우) |
| 트리거 threshold | 화면 너비의 40% |
| 애니메이션 타입 | Spring |
| Spring damping | 20 |
| Spring stiffness | 200 |
| 현재 카드 | 스와이프 방향으로 translateX + opacity 0 |
| 다음 카드 | 반대 방향에서 translateX 진입 + opacity 1 |
| 바운스 | 첫/마지막 카드에서 탄성 바운스 (translateX: 30px, spring back) |
| 구현 | `react-native-gesture-handler` + `react-native-reanimated` |

### 힌트 접기/펼치기

| 속성 | 값 |
|------|-----|
| 트리거 | 힌트 헤더 탭 |
| 애니메이션 | height 슬라이드 (collapsed: 48px, expanded: auto) |
| 지속 시간 | 300ms |
| Easing | ease-in-out |
| 아이콘 | ▼ (펼침) / ▶ (접힘), 회전 애니메이션 |
| 초기 상태 | 펼침 (expanded) |

### 교정 결과 등장

| 속성 | 값 |
|------|-----|
| 트리거 | 작문 완료 버튼 탭 + API 응답 수신 |
| 애니메이션 | 아래에서 위로 슬라이드 (translateY: 100% → 0) + fade (opacity: 0 → 1) |
| 지속 시간 | 400ms |
| Easing | cubic-bezier(0.16, 1, 0.3, 1) (ease-out-expo) |
| 로딩 상태 | 스켈레톤 UI (shimmer 효과) 표시 후 결과로 교체 |

### 점수 카운트업

| 속성 | 값 |
|------|-----|
| 트리거 | 교정 결과 등장 완료 후 |
| 애니메이션 | 0 → 최종 점수 숫자 카운트업 |
| 지속 시간 | 600ms |
| 점수 바 | width 0% → (score/10 * 100)%, 600ms, ease-out |

### 축하 모달 (3문장 완료)

| 속성 | 값 |
|------|-----|
| 트리거 | 마지막 문장 교정 완료 후 1초 지연 |
| 배경 | 반투명 오버레이 (rgba(0,0,0,0.4)), fade-in 300ms |
| 모달 | scale(0.8) → scale(1) + fade-in, 400ms, spring |
| 아이콘 | 바운스 애니메이션 (scale pulse) |

### 버튼 Feedback

| 속성 | 값 |
|------|-----|
| 터치 시작 | scale(0.97), 100ms |
| 터치 끝 | scale(1.0), 150ms |
| Haptic | iOS: impactLight, Android: EFFECT_CLICK |

---

## 7. 아이콘

| 아이콘 | 용도 | 소스 |
|--------|------|------|
| ← (chevron-left) | 뒤로가기 | @expo/vector-icons (Ionicons) |
| 📝 | 일상 영어 테마 | Emoji 또는 커스텀 SVG |
| 💼 | 비지니스 영어 테마 | Emoji 또는 커스텀 SVG |
| 📊 | 학습 기록 | Emoji 또는 커스텀 SVG |
| 💡 | 힌트 단어 | Emoji 또는 커스텀 SVG |
| 🔥 | 스트릭 | Emoji |
| ✅ | 교정 문장 | Emoji |
| ▼ / ▶ | 접기/펼치기 | @expo/vector-icons (Ionicons) |

---

## 8. 반응형 및 접근성

### 반응형

- 최소 지원 화면: 320px (iPhone SE)
- 기준 디자인: 375px (iPhone 13 mini)
- 큰 화면 (428px+): 좌우 마진 증가, 카드 최대 너비 유지
- 텍스트: Dynamic Type 지원 (최소/최대 스케일 제한)

### 접근성

- 모든 터치 대상: 최소 44x44px
- 색상 대비: WCAG AA 기준 충족 (4.5:1 이상)
- VoiceOver/TalkBack 라벨 제공
- 힌트 접기/펼치기 상태: accessibilityState expanded/collapsed
- 점수: 숫자 + 바 이중 표현 (색각 이상 대응)
