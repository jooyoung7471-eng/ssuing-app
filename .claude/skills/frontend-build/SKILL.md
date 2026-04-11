---
name: frontend-build
description: "영어 작문 학습 앱의 프론트엔드를 React Native + Expo로 구현하는 스킬. 스와이프 카드 UI, 작문 입력, 교정 결과 표시, 학습 기록 화면을 개발한다. '프론트엔드 구현', '화면 개발', 'UI 구현', '앱 코딩' 요청 시 사용."
---

# Frontend Build — React Native 프론트엔드 구현

UX 와이어프레임을 기반으로 React Native + Expo 앱을 구현한다.

## 사전 조건

작업 시작 전 반드시 읽는다:
1. `_workspace/01_ux_wireframe.md` — 화면 레이아웃
2. `_workspace/01_ux_style_guide.md` — 스타일 스펙
3. `_workspace/02_api_spec.md` — API 엔드포인트 (있을 경우)

## 프로젝트 구조

```
src/
├── app/                    # Expo Router 기반 화면
│   ├── (tabs)/
│   │   ├── index.tsx       # HomeScreen (테마 선택)
│   │   ├── history.tsx     # HistoryScreen
│   │   └── settings.tsx    # SettingsScreen
│   ├── practice/
│   │   └── [theme].tsx     # PracticeScreen (daily/business)
│   └── history/
│       └── [id].tsx        # HistoryDetail
├── components/
│   ├── SentenceCard.tsx    # 한글 문장 + 힌트 카드
│   ├── WritingInput.tsx    # 영어 작문 입력
│   ├── CorrectionResult.tsx # 교정 결과 표시
│   ├── HintWords.tsx       # 힌트 단어 (접기/펼치기)
│   ├── SwipeableCards.tsx  # 스와이프 카드 컨테이너
│   ├── ScoreDisplay.tsx    # 점수 표시 (애니메이션)
│   └── ThemeCard.tsx       # 테마 선택 카드
├── hooks/
│   ├── useDailySentences.ts # 오늘의 문장 조회
│   ├── useCorrection.ts     # 작문 교정 요청
│   ├── useHistory.ts        # 학습 기록 조회
│   └── useSwipe.ts          # 스와이프 제스처 훅
├── services/
│   └── api.ts               # API 클라이언트 (baseURL, 인터셉터)
├── stores/
│   └── practiceStore.ts     # 연습 상태 (zustand)
├── constants/
│   ├── colors.ts            # 색상 팔레트
│   └── typography.ts        # 폰트 스타일
└── types/
    └── index.ts             # 공유 타입 정의
```

## 핵심 컴포넌트 구현 가이드

### SwipeableCards
- react-native-gesture-handler의 `PanGestureHandler` 사용
- react-native-reanimated의 `useSharedValue`, `withSpring` 사용
- 좌우 스와이프로 이전/다음 문장 전환
- threshold: 화면 너비의 40%
- 스프링 애니메이션: damping 15, stiffness 150

### WritingInput
- TextInput에 multiline 적용
- KeyboardAvoidingView로 키보드 겹침 방지
- 10자 이상 입력 시 "작문 완료" 버튼 활성화
- 입력 중 자동저장 (debounce 500ms)

### CorrectionResult
- 교정 요청 중: 로딩 스피너 + "AI가 분석 중..." 메시지
- 결과 수신: 아래→위 슬라이드 애니메이션 (400ms)
- 수정된 부분 하이라이트 (highlights 배열 기반)
- 점수 카운트업 애니메이션

### HintWords
- 기본 접혀있음, 탭하면 펼치기
- 애니메이션: LayoutAnimation 또는 reanimated
- 영어 단어(Bold) + 한글 뜻(Regular) 쌍으로 표시

## API 연동 훅 패턴

```typescript
// 모든 훅은 이 패턴을 따른다
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
```

- 로딩/에러/성공 3가지 상태를 모두 처리
- 에러 시 사용자 친화적 메시지 표시
- 재시도 기능 포함

## 산출물

`src/` 디렉토리에 전체 프론트엔드 코드를 생성한다.
`package.json`, `app.json`, `tsconfig.json` 등 설정 파일도 포함한다.
