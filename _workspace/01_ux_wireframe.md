# EngWrite UX Wireframe

## 네비게이션 플로우

```
HomeScreen
  ├── [일상 영어 카드 탭] → PracticeScreen (theme: daily)
  ├── [비지니스 영어 카드 탭] → PracticeScreen (theme: business)
  └── [학습 기록 카드 탭] → HistoryScreen
                                └── [기록 항목 탭] → HistoryDetailScreen

PracticeScreen
  ├── [← 뒤로] → HomeScreen
  ├── [좌/우 스와이프] → 이전/다음 문장 카드 (1/3, 2/3, 3/3)
  └── [3문장 완료] → 축하 모달 → HomeScreen
```

---

## 1. HomeScreen -- 테마 선택

```
┌──────────────────────────────────┐
│  StatusBar                        │
│                                   │
│  EngWrite                  🔥 3   │  ← 앱 로고 + 스트릭 배지
│                                   │
│  오늘의 학습을 시작하세요          │  ← 서브타이틀 (Text Secondary)
│                                   │
│  ┌─────────────────────────────┐  │
│  │                             │  │
│  │  📝  일상 영어              │  │  ← 테마 카드 1
│  │      Daily English          │  │    배경: 그라데이션 (#4A90D9 → #6BA3E0)
│  │                             │  │    텍스트: White
│  │  오늘의 문장  ●●○  2/3 완료  │  │  ← 진행 도트 인디케이터
│  │                             │  │
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │                             │  │
│  │  💼  비지니스 영어           │  │  ← 테마 카드 2
│  │      Business English       │  │    배경: 그라데이션 (#7C4DFF → #9B7BFF)
│  │                             │  │    텍스트: White
│  │  오늘의 문장  ○○○  0/3 완료  │  │  ← 진행 도트 인디케이터
│  │                             │  │
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │  📊  학습 기록          →   │  │  ← 학습 기록 카드 (컴팩트)
│  │      총 24문장 | 평균 7.5점  │  │    배경: #FFFFFF, 보더: #E5E7EB
│  └─────────────────────────────┘  │
│                                   │
└──────────────────────────────────┘
```

### HomeScreen 컴포넌트 스펙

| 컴포넌트 | 크기/위치 | 스타일 |
|----------|----------|--------|
| 앱 로고 텍스트 | 좌측 상단, Pretendard Bold 28px | Color: #1A1A2E |
| 스트릭 배지 | 우측 상단 | 🔥 + 숫자, Color: #FF9800 |
| 서브타이틀 | 로고 하단 8px | Pretendard Regular 16px, #6B7280 |
| 테마 카드 | width: 100% - 40px, height: 140px, margin-bottom: 16px | border-radius: 16px, shadow: 0 2px 8px rgba(0,0,0,0.08) |
| 테마 아이콘 | 카드 내 좌측 상단 | 28px |
| 테마 제목 (한글) | 아이콘 우측 | Pretendard Bold 22px, #FFFFFF |
| 테마 부제 (영어) | 제목 하단 4px | SF Pro Text Regular 14px, rgba(255,255,255,0.8) |
| 진행 도트 | 카드 하단 좌측 | 채워진 원 ●: 완료, 빈 원 ○: 미완료, 8px, gap 6px |
| 진행 텍스트 | 도트 우측 8px | Pretendard Regular 13px, rgba(255,255,255,0.9) |
| 학습 기록 카드 | width: 100% - 40px, height: 64px | 배경: #FFFFFF, border: 1px solid #E5E7EB, border-radius: 12px |

---

## 2. PracticeScreen -- 문장 연습 (스와이프 카드)

### 2-A. 작문 입력 상태 (교정 전)

```
┌──────────────────────────────────┐
│  ←  일상 영어             1 / 3  │  ← 헤더: 뒤로 + 테마명 + 페이지
│  ━━━━━━━━━━━━━○○                │  ← 프로그레스 바 (Primary 색상)
│                                   │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐  │
│                                   │
│  │  나는 어제 친구와             │  │  ← 한글 문장 영역
│     카페에서 커피를 마셨다.       │     Pretendard Bold 20px
│  │                             │  │  중앙 정렬, Color: #1A1A2E
│                                   │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │  💡 힌트 단어          ▼    │  │  ← 힌트 헤더 (탭으로 토글)
│  │─────────────────────────────│  │    접기/펼치기, 300ms 슬라이드
│  │  yesterday  어제             │  │
│  │  friend     친구             │  │  ← 힌트 단어 목록
│  │  café       카페             │  │    영어: SF Pro Text Medium 16px, #7C4DFF
│  │  coffee     커피             │  │    한글: Pretendard Regular 14px, #6B7280
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │                             │  │
│  │  I drank coffee with my     │  │  ← 영어 작문 입력 영역
│  │  friend at a cafe yesterday │  │    SF Pro Text Regular 18px
│  │                             │  │    placeholder: "영어로 작문해 보세요..."
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │         작문 완료 ✓          │  │  ← 제출 버튼
│  └─────────────────────────────┘  │    10자 미만: disabled (#D1D5DB)
│                                   │    10자 이상: enabled (#4A90D9)
│  ← 스와이프로 문장 전환 →         │    height: 48px, border-radius: 12px
└──────────────────────────────────┘
```

### 2-B. 교정 결과 상태 (제출 후)

```
┌──────────────────────────────────┐
│  ←  일상 영어             1 / 3  │
│  ━━━━━━━━━━━━━○○                │
│                                   │
│  나는 어제 친구와                 │  ← 한글 문장 (축소)
│  카페에서 커피를 마셨다.           │
│                                   │
│  ┌─────────────────────────────┐  │
│  │  내 작문:                   │  │  ← 사용자 원문
│  │  I drank coffee with my     │  │    SF Pro Text Regular 16px, #6B7280
│  │  friend at a cafe yesterday │  │    취소선 스타일 (수정된 부분)
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │  ← 교정 결과 카드
│  │                      8/10   │  │    400ms 슬라이드업 애니메이션
│  │                    ████░░   │  │
│  │                             │  │
│  │  ✅ 교정된 문장:             │  │    교정 문장: SF Pro Text Medium 18px
│  │  I had coffee with my       │  │    Color: #1A1A2E
│  │  friend at a café           │  │    수정 부분: 하이라이트 배경 #FFF3E0
│  │  yesterday.                 │  │
│  │                             │  │
│  │  📝 설명:                   │  │    설명: Pretendard Regular 14px
│  │                             │  │
│  │  • "drank coffee" → "had    │  │    수정 포인트별 bullet
│  │    coffee" 가 더 자연스러운   │  │    원문: #F44336 취소선
│  │    표현입니다.               │  │    교정: #4CAF50 Bold
│  │                             │  │
│  │  • "cafe" → "café"          │  │
│  │    프랑스어 차용어로 악센트   │  │
│  │    표기가 정확합니다.         │  │
│  └─────────────────────────────┘  │
│                                   │
│  ← 스와이프로 다음 문장 →         │
└──────────────────────────────────┘
```

### 2-C. 전체 완료 축하 모달

```
┌──────────────────────────────────┐
│                                   │
│  ┌─────────────────────────────┐  │
│  │                             │  │
│  │         🎉                   │  │  ← 축하 아이콘 (애니메이션)
│  │                             │  │
│  │    오늘의 일상 영어 완료!     │  │  ← Pretendard Bold 24px
│  │                             │  │
│  │    평균 점수: 8.0 / 10      │  │  ← 카운트업 애니메이션
│  │    ████████░░               │  │
│  │                             │  │
│  │    🔥 연속 3일째!            │  │  ← 스트릭 표시
│  │                             │  │
│  │  ┌───────────────────────┐  │  │
│  │  │     홈으로 돌아가기     │  │  │  ← Primary 버튼
│  │  └───────────────────────┘  │  │
│  │                             │  │
│  └─────────────────────────────┘  │
│                                   │
└──────────────────────────────────┘
```

### PracticeScreen 컴포넌트 스펙

| 컴포넌트 | 크기/위치 | 스타일 |
|----------|----------|--------|
| 헤더 뒤로 버튼 | 좌측, 44x44 터치 영역 | ← 아이콘, Color: #1A1A2E |
| 테마명 | 헤더 중앙 | Pretendard SemiBold 17px, #1A1A2E |
| 페이지 표시 | 헤더 우측 | SF Pro Text Medium 15px, #6B7280 |
| 프로그레스 바 | 헤더 하단, height: 3px | 배경: #E5E7EB, 채움: #4A90D9 |
| 한글 문장 영역 | padding: 24px 20px | Pretendard Bold 20px, #1A1A2E, 중앙정렬 |
| 힌트 카드 | margin: 0 20px, border-radius: 12px | 배경: #F5F3FF, border: 1px solid #E8E0FF |
| 힌트 헤더 | 힌트 카드 상단, padding: 12px 16px | Pretendard Medium 15px, #7C4DFF |
| 힌트 단어 영어 | 좌측 | SF Pro Text Medium 16px, #7C4DFF |
| 힌트 단어 한글 | 우측 | Pretendard Regular 14px, #6B7280 |
| 작문 입력 | margin: 16px 20px, min-height: 80px | border: 1.5px solid #D1D5DB, focus: #4A90D9, border-radius: 12px, padding: 16px |
| 제출 버튼 | margin: 0 20px, height: 48px | border-radius: 12px, 배경: #4A90D9, 텍스트: White, Pretendard SemiBold 16px |
| 교정 결과 카드 | margin: 16px 20px | 배경: #FFFFFF, border-radius: 16px, shadow: 0 4px 16px rgba(0,0,0,0.1) |
| 점수 배지 | 교정 카드 우측 상단 | SF Pro Text Bold 24px, 색상: 점수별 (8+: #4CAF50, 5-7: #FF9800, 1-4: #F44336) |
| 점수 바 | 점수 하단 | height: 6px, border-radius: 3px, 색상: 점수별 동일 |
| 교정 문장 | 카드 내부 | SF Pro Text Medium 18px, #1A1A2E |
| 하이라이트 | 수정된 단어 배경 | 배경: #FFF3E0 (Warning light), border-radius: 4px, padding: 2px 4px |
| 설명 텍스트 | 교정 문장 하단 16px | Pretendard Regular 14px, #374151 |

### 스와이프 인터랙션

| 속성 | 값 |
|------|-----|
| 방향 | 수평 (좌/우) |
| 트리거 threshold | 화면 너비의 40% |
| 애니메이션 | spring (damping: 20, stiffness: 200) |
| 페이지 인디케이터 | 프로그레스 바로 현재 위치 표시 |
| 제스처 | 교정 결과 표시 중에도 스와이프 가능 |
| 경계 | 첫 문장에서 좌측 스와이프 바운스, 마지막 문장에서 우측 스와이프 바운스 |

---

## 3. HistoryScreen -- 학습 기록 목록

```
┌──────────────────────────────────┐
│  ←  학습 기록                     │
│                                   │
│  2026년 4월                       │  ← 월 단위 섹션 헤더
│                                   │
│  ┌─────────────────────────────┐  │
│  │  4/4 (금)                   │  │
│  │  일상 영어  ●●● 3문장 완료   │  │  ← 날짜별 기록 카드
│  │  평균 점수  8.0  ████████░░ │  │    탭 → HistoryDetailScreen
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │  4/3 (목)                   │  │
│  │  비지니스 영어  ●●○ 2문장    │  │
│  │  평균 점수  6.5  ██████░░░░ │  │
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │  4/3 (목)                   │  │
│  │  일상 영어  ●●● 3문장 완료   │  │
│  │  평균 점수  7.0  ███████░░░ │  │
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │  4/2 (수)                   │  │
│  │  일상 영어  ●●● 3문장 완료   │  │
│  │  평균 점수  9.0  █████████░ │  │
│  └─────────────────────────────┘  │
│                                   │
│  2026년 3월                       │  ← 이전 월 섹션
│  ...                              │
└──────────────────────────────────┘
```

## 4. HistoryDetailScreen -- 학습 기록 상세

```
┌──────────────────────────────────┐
│  ←  4/4 (금) 일상 영어            │
│                                   │
│  ┌─────────────────────────────┐  │
│  │  문장 1                     │  │  ← 문장별 기록 카드
│  │                             │  │
│  │  🇰🇷 나는 어제 친구와        │  │
│  │     카페에서 커피를 마셨다.   │  │
│  │                             │  │
│  │  ✍️ 내 작문:                │  │
│  │  I drank coffee with my     │  │
│  │  friend at a cafe yesterday │  │
│  │                             │  │
│  │  ✅ 교정:                   │  │
│  │  I had coffee with my       │  │
│  │  friend at a café yesterday.│  │
│  │                             │  │
│  │  점수: 8/10  ████████░░     │  │
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │  문장 2                     │  │
│  │  ...                        │  │
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │  문장 3                     │  │
│  │  ...                        │  │
│  └─────────────────────────────┘  │
│                                   │
└──────────────────────────────────┘
```

### HistoryScreen 컴포넌트 스펙

| 컴포넌트 | 크기/위치 | 스타일 |
|----------|----------|--------|
| 헤더 | 좌측: ← 뒤로, 중앙: 타이틀 | Pretendard SemiBold 17px |
| 월 섹션 헤더 | padding: 16px 20px 8px | Pretendard SemiBold 15px, #6B7280 |
| 기록 카드 | margin: 0 20px 12px, padding: 16px | 배경: #FFFFFF, border-radius: 12px, shadow: 0 1px 4px rgba(0,0,0,0.06) |
| 날짜 | 카드 상단 | Pretendard SemiBold 16px, #1A1A2E |
| 테마 + 완료 수 | 날짜 하단 4px | Pretendard Regular 14px, #6B7280 |
| 점수 바 | 카드 하단 | height: 4px, border-radius: 2px |
| 상세 문장 카드 | margin: 0 20px 16px, padding: 20px | 배경: #FFFFFF, border-radius: 16px |

---

## 데이터 모델 (화면 - API 매핑)

### PracticeScreen에서 필요한 데이터

```typescript
// 문장 카드 데이터 (GET /api/sentences?theme=daily&date=2026-04-04)
interface SentenceCard {
  id: string;
  koreanText: string;           // 한글 문장
  hintWords: HintWord[];        // 힌트 단어 목록
  order: number;                // 1, 2, 3
}

interface HintWord {
  english: string;              // 영어 단어
  korean: string;               // 한글 뜻
}

// 교정 요청 (POST /api/corrections)
interface CorrectionRequest {
  sentenceId: string;
  userAnswer: string;           // 사용자가 작성한 영어 문장
}

// 교정 결과 (POST /api/corrections 응답)
interface CorrectionResult {
  correctedSentence: string;    // 교정된 영어 문장
  explanation: string;          // 설명 텍스트
  score: number;                // 점수 (1-10)
  highlights: Highlight[];      // 수정 포인트
}

interface Highlight {
  original: string;             // 원래 단어/구문
  corrected: string;            // 교정된 단어/구문
  reason: string;               // 수정 이유
}
```

### HistoryScreen에서 필요한 데이터

```typescript
// 학습 기록 목록 (GET /api/history)
interface HistoryEntry {
  date: string;                 // "2026-04-04"
  theme: "daily" | "business";
  completedCount: number;       // 완료 문장 수
  totalCount: number;           // 전체 문장 수 (3)
  averageScore: number;         // 평균 점수
}

// 학습 기록 상세 (GET /api/history/:date/:theme)
interface HistoryDetail {
  sentences: {
    koreanText: string;
    userAnswer: string;
    correctedSentence: string;
    score: number;
  }[];
}
```
