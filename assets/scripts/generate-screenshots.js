const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const W = 1290, H = 2796;
const SQUARE = 2796;
const CX = SQUARE / 2; // 1398 - center x for text
const LEFT = (SQUARE - W) / 2; // 753 - left edge of content area
const MOCKUP_X = LEFT + 100; // 853
const MOCKUP_W = W - 200; // 1090

const OUTPUT_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function generateSVG(index, { bg, mainCopy, subCopy, mockupContent }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SQUARE} ${SQUARE}" width="${SQUARE}" height="${SQUARE}">
  <defs>
    <clipPath id="content-clip">
      <rect x="${LEFT}" y="0" width="${W}" height="${H}"/>
    </clipPath>
  </defs>
  <!-- Background fills entire square -->
  <rect width="${SQUARE}" height="${SQUARE}" fill="#000"/>
  <!-- Visible content area -->
  <rect x="${LEFT}" y="0" width="${W}" height="${H}" fill="${bg}"/>
  <!-- Main Copy -->
  <text x="${CX}" y="320" text-anchor="middle" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="88" font-weight="bold" fill="white">${mainCopy}</text>
  <!-- Sub Copy -->
  <text x="${CX}" y="420" text-anchor="middle" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="42" fill="rgba(255,255,255,0.85)">${subCopy}</text>
  <!-- Mockup Area -->
  ${mockupContent}
</svg>`;
}

// ===== Screenshot 1: Hero =====
const screen1 = {
  bg: '#1B2838',
  mainCopy: '쓰면, 늘어요',
  subCopy: '하루 3문장, AI가 원어민처럼 고쳐줘요',
  mockupContent: `
  <rect x="${MOCKUP_X}" y="520" width="${MOCKUP_W}" height="1900" rx="40" fill="#ffffff" opacity="0.97"/>
  <!-- App header -->
  <rect x="${MOCKUP_X + 40}" y="570" width="${MOCKUP_W - 80}" height="60" rx="12" fill="#F0F4F8"/>
  <text x="${MOCKUP_X + 80}" y="610" font-family="Apple SD Gothic Neo, sans-serif" font-size="32" fill="#64748B">오늘의 문장 1/3</text>
  <!-- Korean sentence -->
  <text x="${MOCKUP_X + 60}" y="740" font-family="Apple SD Gothic Neo, sans-serif" font-size="38" font-weight="bold" fill="#1B2838">나는 매일 아침 커피를 마신다.</text>
  <!-- Input area -->
  <rect x="${MOCKUP_X + 40}" y="800" width="${MOCKUP_W - 80}" height="180" rx="20" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
  <text x="${MOCKUP_X + 80}" y="870" font-family="Apple SD Gothic Neo, sans-serif" font-size="34" fill="#334155">I drink coffee every morning.</text>
  <!-- Submit button -->
  <rect x="${MOCKUP_X + 40}" y="1020" width="${MOCKUP_W - 80}" height="80" rx="16" fill="#4F46E5"/>
  <text x="${CX}" y="1072" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="34" font-weight="bold" fill="white">제출하기</text>
  <!-- AI Correction result -->
  <rect x="${MOCKUP_X + 40}" y="1150" width="${MOCKUP_W - 80}" height="500" rx="20" fill="#F0FDF4" stroke="#86EFAC" stroke-width="2"/>
  <text x="${MOCKUP_X + 80}" y="1220" font-family="Apple SD Gothic Neo, sans-serif" font-size="30" fill="#16A34A" font-weight="bold">AI 교정 결과</text>
  <!-- Score -->
  <circle cx="${MOCKUP_X + MOCKUP_W - 140}" cy="1210" r="50" fill="#4F46E5"/>
  <text x="${MOCKUP_X + MOCKUP_W - 140}" y="1220" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="28" font-weight="bold" fill="white">8/10</text>
  <!-- Correction text -->
  <text x="${MOCKUP_X + 80}" y="1300" font-family="Apple SD Gothic Neo, sans-serif" font-size="30" fill="#DC2626" text-decoration="line-through">I drink coffee every morning.</text>
  <text x="${MOCKUP_X + 80}" y="1360" font-family="Apple SD Gothic Neo, sans-serif" font-size="30" fill="#16A34A" font-weight="bold">I have coffee every morning.</text>
  <text x="${MOCKUP_X + 80}" y="1440" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#64748B">"have coffee"가 더 자연스러운 원어민 표현이에요.</text>
  <text x="${MOCKUP_X + 80}" y="1490" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#64748B">"drink coffee"도 맞지만, 습관을 나타낼 때는</text>
  <text x="${MOCKUP_X + 80}" y="1535" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#64748B">"have"를 더 자주 사용합니다.</text>
  <!-- XP earned -->
  <rect x="${MOCKUP_X + 40}" y="1700" width="${MOCKUP_W - 80}" height="80" rx="16" fill="#FFF7ED" stroke="#FDBA74" stroke-width="2"/>
  <text x="${CX}" y="1752" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="30" fill="#EA580C" font-weight="bold">+25 XP 획득! 🔥 3일 연속 스트릭</text>
  `
};

// ===== Screenshot 2: AI Correction =====
const screen2 = {
  bg: '#FFFFFF',
  mainCopy: 'AI가 원어민 표현으로',
  subCopy: '틀린 이유까지 설명해줍니다',
  mockupContent: `
  <!-- Override text color for white bg -->
  <text x="${CX}" y="320" text-anchor="middle" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="88" font-weight="bold" fill="#4F46E5" style="visibility:visible">&#160;</text>
  <rect x="${LEFT}" y="0" width="${W}" height="${H}" fill="white"/>
  <text x="${CX}" y="320" text-anchor="middle" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="88" font-weight="bold" fill="#1E1B4B">AI가 원어민 표현으로</text>
  <text x="${CX}" y="420" text-anchor="middle" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="42" fill="#6366F1">틀린 이유까지 설명해줍니다</text>
  <!-- Mockup phone -->
  <rect x="${MOCKUP_X}" y="520" width="${MOCKUP_W}" height="1900" rx="40" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="3"/>
  <!-- Original sentence -->
  <rect x="${MOCKUP_X + 40}" y="580" width="${MOCKUP_W - 80}" height="120" rx="16" fill="#FEF2F2" stroke="#FECACA" stroke-width="2"/>
  <text x="${MOCKUP_X + 70}" y="625" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#991B1B" font-weight="bold">내가 쓴 문장</text>
  <text x="${MOCKUP_X + 70}" y="675" font-family="Apple SD Gothic Neo, sans-serif" font-size="30" fill="#DC2626">She don't like going to school.</text>
  <!-- Arrow -->
  <text x="${CX}" y="760" text-anchor="middle" font-size="48" fill="#4F46E5">⬇</text>
  <!-- Corrected sentence -->
  <rect x="${MOCKUP_X + 40}" y="790" width="${MOCKUP_W - 80}" height="120" rx="16" fill="#F0FDF4" stroke="#BBF7D0" stroke-width="2"/>
  <text x="${MOCKUP_X + 70}" y="835" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#166534" font-weight="bold">교정된 문장</text>
  <text x="${MOCKUP_X + 70}" y="885" font-family="Apple SD Gothic Neo, sans-serif" font-size="30" fill="#16A34A" font-weight="bold">She doesn't like going to school.</text>
  <!-- Explanation cards -->
  <rect x="${MOCKUP_X + 40}" y="960" width="${MOCKUP_W - 80}" height="300" rx="20" fill="white" stroke="#E2E8F0" stroke-width="2"/>
  <text x="${MOCKUP_X + 70}" y="1010" font-family="Apple SD Gothic Neo, sans-serif" font-size="28" fill="#4F46E5" font-weight="bold">📘 문법 설명</text>
  <text x="${MOCKUP_X + 70}" y="1060" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#334155">3인칭 단수(she/he/it) 주어에는</text>
  <text x="${MOCKUP_X + 70}" y="1100" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#334155">"doesn't"를 사용합니다.</text>
  <text x="${MOCKUP_X + 70}" y="1160" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#334155">"don't"는 I/you/we/they에 사용해요.</text>
  <rect x="${MOCKUP_X + 70}" y="1200" width="200" height="40" rx="8" fill="#EEF2FF"/>
  <text x="${MOCKUP_X + 90}" y="1228" font-family="Apple SD Gothic Neo, sans-serif" font-size="22" fill="#4F46E5">주어-동사 수일치</text>
  <!-- Second explanation -->
  <rect x="${MOCKUP_X + 40}" y="1300" width="${MOCKUP_W - 80}" height="250" rx="20" fill="white" stroke="#E2E8F0" stroke-width="2"/>
  <text x="${MOCKUP_X + 70}" y="1350" font-family="Apple SD Gothic Neo, sans-serif" font-size="28" fill="#F59E0B" font-weight="bold">💡 원어민 팁</text>
  <text x="${MOCKUP_X + 70}" y="1400" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#334155">"going to school" 대신 "attending school"도</text>
  <text x="${MOCKUP_X + 70}" y="1440" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#334155">격식 있는 표현으로 사용 가능합니다.</text>
  <text x="${MOCKUP_X + 70}" y="1500" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#64748B">예: She doesn't like attending school.</text>
  <!-- Score bar -->
  <rect x="${MOCKUP_X + 40}" y="1600" width="${MOCKUP_W - 80}" height="100" rx="16" fill="#EEF2FF"/>
  <text x="${MOCKUP_X + 80}" y="1645" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#4F46E5" font-weight="bold">정확도</text>
  <rect x="${MOCKUP_X + 200}" y="1630" width="600" height="24" rx="12" fill="#E2E8F0"/>
  <rect x="${MOCKUP_X + 200}" y="1630" width="420" height="24" rx="12" fill="#4F46E5"/>
  <text x="${MOCKUP_X + 830}" y="1650" font-family="Apple SD Gothic Neo, sans-serif" font-size="28" fill="#4F46E5" font-weight="bold">7/10</text>
  `
};

// ===== Screenshot 3: Gamification =====
const screen3 = {
  bg: 'url(#grad3)',
  mainCopy: '매일 쓰는 게 실력',
  subCopy: '스트릭 깨기 싫어서 또 열게 돼요',
  mockupContent: `
  <defs>
    <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FF6B35"/>
      <stop offset="100%" stop-color="#FFB347"/>
    </linearGradient>
  </defs>
  <rect x="${LEFT}" y="0" width="${W}" height="${H}" fill="url(#grad3)"/>
  <text x="${CX}" y="320" text-anchor="middle" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="88" font-weight="bold" fill="white">매일 쓰는 게 실력</text>
  <text x="${CX}" y="420" text-anchor="middle" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="42" fill="rgba(255,255,255,0.9)">스트릭 깨기 싫어서 또 열게 돼요</text>
  <!-- Mockup -->
  <rect x="${MOCKUP_X}" y="520" width="${MOCKUP_W}" height="1900" rx="40" fill="white" opacity="0.97"/>
  <!-- Weekly streak -->
  <text x="${CX}" y="620" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="32" fill="#334155" font-weight="bold">이번 주 스트릭</text>
  ${['월','화','수','목','금','토','일'].map((day, i) => {
    const x = MOCKUP_X + 80 + i * 135;
    const active = i < 5;
    return `
    <circle cx="${x}" cy="710" r="42" fill="${active ? '#FF6B35' : '#F1F5F9'}"/>
    <text x="${x}" y="720" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="24" fill="${active ? 'white' : '#94A3B8'}" font-weight="bold">${day}</text>
    ${active ? `<text x="${x}" y="680" text-anchor="middle" font-size="20" fill="white">🔥</text>` : ''}`;
  }).join('')}
  <text x="${CX}" y="810" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="36" fill="#FF6B35" font-weight="bold">🔥 5일 연속! 대단해요!</text>
  <!-- Level & XP -->
  <rect x="${MOCKUP_X + 40}" y="870" width="${MOCKUP_W - 80}" height="200" rx="24" fill="#FFF7ED" stroke="#FDBA74" stroke-width="2"/>
  <text x="${MOCKUP_X + 100}" y="930" font-family="Apple SD Gothic Neo, sans-serif" font-size="28" fill="#92400E" font-weight="bold">레벨</text>
  <text x="${MOCKUP_X + 100}" y="990" font-family="Apple SD Gothic Neo, sans-serif" font-size="56" fill="#FF6B35" font-weight="bold">Lv. 12</text>
  <text x="${MOCKUP_X + 400}" y="930" font-family="Apple SD Gothic Neo, sans-serif" font-size="28" fill="#92400E" font-weight="bold">경험치</text>
  <rect x="${MOCKUP_X + 400}" y="960" width="500" height="20" rx="10" fill="#FED7AA"/>
  <rect x="${MOCKUP_X + 400}" y="960" width="350" height="20" rx="10" fill="#FF6B35"/>
  <text x="${MOCKUP_X + 400}" y="1020" font-family="Apple SD Gothic Neo, sans-serif" font-size="24" fill="#92400E">2,450 / 3,000 XP</text>
  <!-- Achievements -->
  <text x="${MOCKUP_X + 70}" y="1150" font-family="Apple SD Gothic Neo, sans-serif" font-size="30" fill="#334155" font-weight="bold">획득한 배지</text>
  ${[
    { emoji: '🌟', name: '첫 문장', color: '#FEF3C7' },
    { emoji: '🔥', name: '7일 스트릭', color: '#FEE2E2' },
    { emoji: '💎', name: '완벽 점수', color: '#DBEAFE' },
    { emoji: '🚀', name: '속도왕', color: '#F0FDF4' },
  ].map((badge, i) => {
    const x = MOCKUP_X + 80 + i * 240;
    return `
    <rect x="${x}" y="1180" width="200" height="200" rx="20" fill="${badge.color}" stroke="#E2E8F0" stroke-width="1"/>
    <text x="${x + 100}" y="1270" text-anchor="middle" font-size="52">${badge.emoji}</text>
    <text x="${x + 100}" y="1340" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="22" fill="#334155" font-weight="bold">${badge.name}</text>`;
  }).join('')}
  <!-- Today stats -->
  <rect x="${MOCKUP_X + 40}" y="1440" width="${MOCKUP_W - 80}" height="160" rx="20" fill="#F8FAFC"/>
  <text x="${MOCKUP_X + 100}" y="1500" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#64748B">오늘 작성</text>
  <text x="${MOCKUP_X + 100}" y="1550" font-family="Apple SD Gothic Neo, sans-serif" font-size="40" fill="#334155" font-weight="bold">3 / 3 문장</text>
  <text x="${MOCKUP_X + 550}" y="1500" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#64748B">평균 점수</text>
  <text x="${MOCKUP_X + 550}" y="1550" font-family="Apple SD Gothic Neo, sans-serif" font-size="40" fill="#FF6B35" font-weight="bold">8.5점</text>
  `
};

// ===== Screenshot 4: Hints =====
const screen4 = {
  bg: '#E8F8F5',
  mainCopy: '막히면 힌트 한 번',
  subCopy: '단어 몰라도 포기 안 해요',
  mockupContent: `
  <rect x="${LEFT}" y="0" width="${W}" height="${H}" fill="#E8F8F5"/>
  <text x="${CX}" y="320" text-anchor="middle" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="88" font-weight="bold" fill="#0F766E">막히면 힌트 한 번</text>
  <text x="${CX}" y="420" text-anchor="middle" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="42" fill="#115E59">단어 몰라도 포기 안 해요</text>
  <!-- Mockup -->
  <rect x="${MOCKUP_X}" y="520" width="${MOCKUP_W}" height="1900" rx="40" fill="white" stroke="#99F6E4" stroke-width="3"/>
  <!-- Korean sentence -->
  <text x="${MOCKUP_X + 60}" y="620" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#64748B">한국어 문장</text>
  <text x="${MOCKUP_X + 60}" y="680" font-family="Apple SD Gothic Neo, sans-serif" font-size="36" font-weight="bold" fill="#1E293B">그 영화는 내 기대보다 훨씬 좋았다.</text>
  <!-- Input area with cursor -->
  <rect x="${MOCKUP_X + 40}" y="730" width="${MOCKUP_W - 80}" height="150" rx="20" fill="#F8FAFC" stroke="#14B8A6" stroke-width="2"/>
  <text x="${MOCKUP_X + 80}" y="800" font-family="Apple SD Gothic Neo, sans-serif" font-size="32" fill="#334155">The movie was much</text>
  <rect x="${MOCKUP_X + 490}" y="775" width="2" height="35" fill="#14B8A6"/>
  <text x="${MOCKUP_X + 80}" y="845" font-family="Apple SD Gothic Neo, sans-serif" font-size="24" fill="#94A3B8">영어로 작성하세요...</text>
  <!-- Hint button -->
  <rect x="${MOCKUP_X + 40}" y="920" width="200" height="56" rx="28" fill="#14B8A6"/>
  <text x="${MOCKUP_X + 140}" y="956" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="white" font-weight="bold">💡 힌트 보기</text>
  <!-- Hint chips expanded -->
  <rect x="${MOCKUP_X + 40}" y="1010" width="${MOCKUP_W - 80}" height="380" rx="20" fill="#F0FDFA" stroke="#99F6E4" stroke-width="2"/>
  <text x="${MOCKUP_X + 80}" y="1060" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#0F766E" font-weight="bold">💡 핵심 단어 힌트</text>
  ${[
    { word: 'better than', meaning: '~보다 좋은' },
    { word: 'expectation', meaning: '기대' },
    { word: 'much / far', meaning: '훨씬' },
  ].map((hint, i) => {
    const y = 1100 + i * 85;
    return `
    <rect x="${MOCKUP_X + 70}" y="${y}" width="380" height="60" rx="30" fill="#CCFBF1" stroke="#5EEAD4" stroke-width="1"/>
    <text x="${MOCKUP_X + 100}" y="${y + 38}" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#0D9488" font-weight="bold">${hint.word}</text>
    <text x="${MOCKUP_X + 480}" y="${y + 38}" font-family="Apple SD Gothic Neo, sans-serif" font-size="24" fill="#64748B">${hint.meaning}</text>`;
  }).join('')}
  <!-- Hint usage info -->
  <rect x="${MOCKUP_X + 40}" y="1430" width="${MOCKUP_W - 80}" height="70" rx="16" fill="#FFF7ED"/>
  <text x="${CX}" y="1475" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="24" fill="#92400E">힌트 사용 시 최대 점수: 8점 (감점 -2)</text>
  <!-- Example completion -->
  <rect x="${MOCKUP_X + 40}" y="1540" width="${MOCKUP_W - 80}" height="200" rx="20" fill="#ECFDF5" stroke="#86EFAC" stroke-width="2"/>
  <text x="${MOCKUP_X + 80}" y="1590" font-family="Apple SD Gothic Neo, sans-serif" font-size="24" fill="#16A34A" font-weight="bold">힌트로 완성한 문장 예시</text>
  <text x="${MOCKUP_X + 80}" y="1650" font-family="Apple SD Gothic Neo, sans-serif" font-size="28" fill="#334155">The movie was much better than</text>
  <text x="${MOCKUP_X + 80}" y="1695" font-family="Apple SD Gothic Neo, sans-serif" font-size="28" fill="#334155">my expectation.</text>
  `
};

// ===== Screenshot 5: CTA =====
const screen5 = {
  bg: '#2D1B69',
  mainCopy: '3개월 후, 다른 영어',
  subCopy: '지금 시작하세요',
  mockupContent: `
  <rect x="${LEFT}" y="0" width="${W}" height="${H}" fill="#2D1B69"/>
  <text x="${CX}" y="320" text-anchor="middle" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="88" font-weight="bold" fill="white">3개월 후, 다른 영어</text>
  <text x="${CX}" y="420" text-anchor="middle" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="42" fill="rgba(255,255,255,0.85)">지금 시작하세요</text>
  <!-- Mockup -->
  <rect x="${MOCKUP_X}" y="520" width="${MOCKUP_W}" height="1900" rx="40" fill="#1E1145" stroke="#7C3AED" stroke-width="3"/>
  <!-- Growth graph -->
  <text x="${CX}" y="620" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="30" fill="#C4B5FD" font-weight="bold">나의 성장 그래프</text>
  <!-- Graph area -->
  <rect x="${MOCKUP_X + 60}" y="660" width="${MOCKUP_W - 120}" height="500" rx="16" fill="#2D1B69" opacity="0.5"/>
  <!-- Graph line -->
  <polyline points="${MOCKUP_X + 100},1100 ${MOCKUP_X + 250},1050 ${MOCKUP_X + 400},980 ${MOCKUP_X + 550},880 ${MOCKUP_X + 700},800 ${MOCKUP_X + 850},700" fill="none" stroke="#A78BFA" stroke-width="4" stroke-linecap="round"/>
  <!-- Graph dots -->
  ${[
    [100, 1100], [250, 1050], [400, 980], [550, 880], [700, 800], [850, 700]
  ].map(([dx, y]) => `<circle cx="${MOCKUP_X + dx}" cy="${y}" r="8" fill="#7C3AED"/>`).join('')}
  <!-- Level labels -->
  <text x="${MOCKUP_X + 100}" y="1140" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="20" fill="#A78BFA">Lv.1</text>
  <text x="${MOCKUP_X + 850}" y="680" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="24" fill="#E9D5FF" font-weight="bold">Lv.15</text>
  <!-- Month labels -->
  <text x="${MOCKUP_X + 100}" y="1180" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="20" fill="#7C7C9C">1월</text>
  <text x="${MOCKUP_X + 400}" y="1180" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="20" fill="#7C7C9C">2월</text>
  <text x="${MOCKUP_X + 700}" y="1180" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="20" fill="#7C7C9C">3월</text>
  <!-- Stats cards -->
  <rect x="${MOCKUP_X + 40}" y="1240" width="480" height="180" rx="20" fill="#3B2086"/>
  <text x="${MOCKUP_X + 80}" y="1300" font-family="Apple SD Gothic Neo, sans-serif" font-size="24" fill="#C4B5FD">총 작성 문장</text>
  <text x="${MOCKUP_X + 80}" y="1370" font-family="Apple SD Gothic Neo, sans-serif" font-size="48" fill="white" font-weight="bold">270문장</text>
  <rect x="${MOCKUP_X + 560}" y="1240" width="480" height="180" rx="20" fill="#3B2086"/>
  <text x="${MOCKUP_X + 600}" y="1300" font-family="Apple SD Gothic Neo, sans-serif" font-size="24" fill="#C4B5FD">평균 점수 변화</text>
  <text x="${MOCKUP_X + 600}" y="1370" font-family="Apple SD Gothic Neo, sans-serif" font-size="48" fill="#34D399" font-weight="bold">5.2 → 8.7</text>
  <!-- Review mode -->
  <rect x="${MOCKUP_X + 40}" y="1470" width="${MOCKUP_W - 80}" height="200" rx="20" fill="#3B2086" stroke="#7C3AED" stroke-width="2"/>
  <text x="${MOCKUP_X + 80}" y="1530" font-family="Apple SD Gothic Neo, sans-serif" font-size="28" fill="#E9D5FF" font-weight="bold">🔄 복습 모드</text>
  <text x="${MOCKUP_X + 80}" y="1580" font-family="Apple SD Gothic Neo, sans-serif" font-size="24" fill="#A78BFA">틀렸던 문장만 모아서 다시 연습</text>
  <text x="${MOCKUP_X + 80}" y="1630" font-family="Apple SD Gothic Neo, sans-serif" font-size="24" fill="#A78BFA">스마트 복습으로 완벽하게 마스터!</text>
  <!-- CTA Button -->
  <rect x="${MOCKUP_X + 100}" y="1750" width="${MOCKUP_W - 200}" height="100" rx="50" fill="#7C3AED"/>
  <text x="${CX}" y="1815" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="36" fill="white" font-weight="bold">무료로 시작하기</text>
  <!-- App icon small -->
  <rect x="${CX - 50}" y="1900" width="100" height="100" rx="22" fill="#4F46E5"/>
  <text x="${CX}" y="1965" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="36" fill="white" font-weight="bold">쓰</text>
  <text x="${CX}" y="2040" text-anchor="middle" font-family="Apple SD Gothic Neo, sans-serif" font-size="26" fill="#C4B5FD">쓰잉 - 영어 작문 학습</text>
  `
};

const screens = [screen1, screen2, screen3, screen4, screen5];

screens.forEach((screen, i) => {
  const idx = i + 1;
  const svgContent = generateSVG(idx, screen);
  const svgPath = path.join(OUTPUT_DIR, `screenshot_${idx}.svg`);

  // For screens 2, 3, 4 that override the background, we need special handling
  // The generateSVG already puts white bg + default text, but screens 2-4 override with their own rect+text
  fs.writeFileSync(svgPath, svgContent);
  console.log(`[${idx}/5] SVG saved: ${svgPath}`);

  // Convert SVG → PNG via qlmanage
  try {
    execSync(`qlmanage -t -s ${SQUARE} -o "${OUTPUT_DIR}/" "${svgPath}" 2>/dev/null`);

    // qlmanage creates file with .svg.png extension
    const qlOutput = path.join(OUTPUT_DIR, `screenshot_${idx}.svg.png`);
    const pngPath = path.join(OUTPUT_DIR, `screenshot_${idx}.png`);

    if (fs.existsSync(qlOutput)) {
      fs.renameSync(qlOutput, pngPath);
      // Crop to 1290x2796
      execSync(`sips --cropToHeightWidth ${H} ${W} "${pngPath}"`);
      console.log(`[${idx}/5] PNG created and cropped: ${pngPath}`);
    } else {
      console.error(`[${idx}/5] qlmanage output not found`);
    }
  } catch (err) {
    console.error(`[${idx}/5] Error: ${err.message}`);
  }
});

console.log('\nDone! Verifying dimensions...');
for (let i = 1; i <= 5; i++) {
  const pngPath = path.join(OUTPUT_DIR, `screenshot_${i}.png`);
  if (fs.existsSync(pngPath)) {
    const info = execSync(`sips -g pixelWidth -g pixelHeight "${pngPath}"`).toString();
    console.log(`screenshot_${i}.png: ${info.trim()}`);
  }
}
