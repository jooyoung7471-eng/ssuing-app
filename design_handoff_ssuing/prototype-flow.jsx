// Prototype flow graph.
// Hotspot coords are in the 402×874 iPhone frame coordinate space.
// All coordinates below were VERIFIED by reading getBoundingClientRect()
// of actual buttons in the running app (not eyeballed). App content
// starts at y≈62 because of the Dynamic Island + frame padding.

const NODES = {
  // ── 1. Onboarding ─────────────────────────────────────────
  onb1: {
    label: '온보딩 1/3',
    screen: 'Onboarding',
    dark: false,
    desc: '퍼플 테마. "쓰면, 늘어요" — 매일 영작 습관을 만드는 앱 소개.',
    hotspots: [
      { x: 302, y: 692, w: 64, h: 64, to: 'onb2', label: '다음 (→)' },
      // 건너뛰기 span is tiny (48×16) — padded for usability
      { x: 295, y: 60, w: 80, h: 36, to: 'login', label: '건너뛰기' },
    ],
  },
  onb2: {
    label: '온보딩 2/3',
    screen: 'Onb2',
    dark: false,
    desc: '그린 테마. AI가 즉시 교정해주는 핵심 가치 소개.',
    hotspots: [
      { x: 302, y: 692, w: 64, h: 64, to: 'onb3', label: '다음 (→)' },
      { x: 295, y: 60, w: 80, h: 36, to: 'login', label: '건너뛰기' },
    ],
  },
  onb3: {
    label: '온보딩 3/3',
    screen: 'Onb3',
    dark: false,
    desc: '앰버 테마. 하루 3문장이면 충분 — 부담 없는 습관.',
    hotspots: [
      { x: 24, y: 700, w: 342, h: 56, to: 'login', label: '시작하기' },
    ],
  },

  // ── 2. Login ──────────────────────────────────────────────
  login: {
    label: '로그인',
    screen: 'Login',
    dark: true,
    desc: '소셜 로그인. Apple / Google / 카카오 중 탭하면 약관으로 이동.',
    hotspots: [
      { x: 28, y: 545, w: 334, h: 50, to: 'terms', label: 'Apple로 계속하기' },
      { x: 28, y: 603, w: 334, h: 50, to: 'terms', label: 'Google로 계속하기' },
      { x: 28, y: 663, w: 334, h: 50, to: 'terms', label: '카카오로 계속하기' },
      { x: 120, y: 730, w: 160, h: 32, to: 'home', label: '게스트로 둘러보기' },
    ],
  },

  // ── 3. Terms ──────────────────────────────────────────────
  terms: {
    label: '약관 동의',
    screen: 'Terms',
    dark: false,
    desc: '필수 약관 체크 후 홈으로 진입.',
    hotspots: [
      { x: 24, y: 706, w: 342, h: 50, to: 'home', label: '동의하고 시작' },
    ],
  },

  // ── 4. Home ───────────────────────────────────────────────
  home: {
    label: '홈',
    screen: 'Home',
    dark: false,
    desc: 'XP 카드 + 3개 테마. 상단 ⚙️로 설정, 📖 기록으로 학습 기록, 🔥 스트릭 배지로 스트릭 상세.',
    hotspots: [
      // Active theme card (일상 영어)
      { x: 20, y: 348, w: 350, h: 80, to: 'p_empty', label: '📝 일상 영어 시작' },
      // streak badge (top right)
      { x: 244, y: 60, w: 84, h: 48, to: 'streak', label: '🔥 스트릭 상세' },
      // ⚙️ settings gear (right of streak)
      { x: 332, y: 62, w: 44, h: 44, to: 'settings', label: '⚙️ 설정' },
      // 📖 기록 quick-access (bottom right of home)
      { x: 278, y: 708, w: 83, h: 51, to: 'history', label: '📖 학습 기록' },
    ],
  },

  // ── 5. Practice flow ──────────────────────────────────────
  p_empty: {
    label: '학습 · 작성 전',
    screen: 'PracticeEmpty',
    dark: false,
    desc: '한글 프롬프트 제시. 입력 영역 또는 하단 CTA 탭하면 작성 모드로.',
    hotspots: [
      // Main CTA at bottom
      { x: 20, y: 712, w: 350, h: 52, to: 'p_typing', label: '작문 시작' },
      // Input area (large tap zone)
      { x: 20, y: 280, w: 350, h: 150, to: 'p_typing', label: '입력 영역 탭' },
      // back arrow top-left
      { x: 20, y: 60, w: 44, h: 44, to: 'home', label: '← 홈으로' },
    ],
  },
  p_typing: {
    label: '학습 · 작성 중',
    screen: 'PracticeTyping',
    dark: false,
    desc: '사용자가 영문을 타이핑 중. 라이브 힌트 표시. 제출 버튼 탭.',
    hotspots: [
      { x: 20, y: 712, w: 350, h: 52, to: 'p_grading', label: '제출하기' },
    ],
  },
  p_grading: {
    label: '학습 · AI 분석',
    screen: 'PracticeGrading',
    dark: false,
    desc: 'AI가 문법 · 어휘 · 자연스러움 3단계로 분석 중. 화면 탭하여 결과로.',
    hotspots: [
      { x: 20, y: 280, w: 350, h: 400, to: 'p_result', label: '분석 완료 (탭)' },
    ],
  },
  p_result: {
    label: '학습 · 결과',
    screen: 'PracticeResult',
    dark: false,
    desc: '교정 결과 + diff 하이라이트 + 설명. 다음 문장 or 데일리 완료로.',
    hotspots: [
      // 다시 쓰기 (secondary, left)
      { x: 20, y: 716, w: 119, h: 48, to: 'p_typing', label: '다시 쓰기' },
      // 다음 문장 → (primary, right)
      { x: 147, y: 716, w: 223, h: 48, to: 'daily_done', label: '다음 문장 (3/3 완료)' },
    ],
  },

  // ── 6. Reward ─────────────────────────────────────────────
  daily_done: {
    label: '데일리 완료',
    screen: 'DailyComplete',
    dark: false,
    desc: '오늘의 3문장 완수. 공유하거나 다음 문장·홈으로 이동 가능.',
    hotspots: [
      // 공유하기 (top CTA)
      { x: 20, y: 656, w: 350, h: 52, to: 'levelup', label: '공유하기 → 레벨업' },
      // 🏠 홈으로 (left of secondary row)
      { x: 20, y: 718, w: 172, h: 46, to: 'home', label: '🏠 홈으로' },
      // 다음 문장 → (right of secondary row)
      { x: 200, y: 718, w: 170, h: 46, to: 'p_empty', label: '다음 문장 →' },
      // ✕ close in banner
      { x: 336, y: 62, w: 40, h: 40, to: 'home', label: '닫기 → 홈' },
    ],
  },
  levelup: {
    label: '레벨업',
    screen: 'LevelUp',
    dark: false,
    desc: '레벨 9 달성 모달. 새 기능 잠금 해제 안내.',
    hotspots: [
      { x: 49, y: 589, w: 292, h: 50, to: 'streak', label: '계속하기' },
    ],
  },
  streak: {
    label: '스트릭 +1',
    screen: 'StreakPlus',
    dark: false,
    desc: '13일 연속 달성 축하 토스트 + 주간 캘린더.',
    hotspots: [
      { x: 20, y: 714, w: 350, h: 50, to: 'home', label: '확인 → 홈' },
    ],
  },

  // ── 7. Settings & History ─────────────────────────────────
  settings: {
    label: '설정',
    screen: 'Settings',
    dark: false,
    desc: '푸시 알림·리마인더 시간 등 실제 사용 설정. 로그아웃·탈퇴 시 로그인 화면으로.',
    hotspots: [
      // back arrow top-left
      { x: 10, y: 58, w: 44, h: 44, to: 'home', label: '← 홈으로' },
      // 푸시 알림 행 (toggle 느낌 - self-loop)
      { x: 25, y: 278, w: 340, h: 52, to: 'settings', label: '🔔 푸시 알림 토글' },
      // 리마인더 시간 (self-loop)
      { x: 25, y: 330, w: 340, h: 43, to: 'settings', label: '⏰ 리마인더 시간' },
      // 로그아웃 버튼 (bottom left half)
      { x: 24, y: 612, w: 166, h: 41, to: 'login', label: '로그아웃 → 로그인' },
      // 회원 탈퇴 (bottom right half)
      { x: 198, y: 612, w: 168, h: 41, to: 'login', label: '회원 탈퇴' },
    ],
  },
  history: {
    label: '학습 기록',
    screen: 'History',
    dark: false,
    desc: '지금까지 작성한 문장 목록. 문장을 탭하면 결과 화면으로 재검토.',
    hotspots: [
      // back arrow top-left
      { x: 10, y: 58, w: 44, h: 44, to: 'home', label: '← 홈으로' },
      // 5 sentence cards → 결과 화면 재검토
      { x: 24, y: 258, w: 342, h: 66, to: 'p_result', label: '카페 문장 재검토' },
      { x: 24, y: 332, w: 342, h: 66, to: 'p_result', label: '회의 문장 재검토' },
      { x: 24, y: 406, w: 342, h: 66, to: 'p_result', label: '공항 문장 재검토' },
      { x: 24, y: 480, w: 342, h: 66, to: 'p_result', label: '이메일 문장 재검토' },
      { x: 24, y: 554, w: 342, h: 66, to: 'p_result', label: '커피 문장 재검토' },
    ],
  },
};

// Ordered flow for the left sidebar (the "happy path")
const FLOW = [
  'onb1', 'onb2', 'onb3',
  'login', 'terms',
  'home',
  'p_empty', 'p_typing', 'p_grading', 'p_result',
  'daily_done', 'levelup', 'streak',
  'settings', 'history',
];

window.PrototypeFlow = { NODES, FLOW };
