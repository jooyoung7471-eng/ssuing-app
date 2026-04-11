const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SQUARE = 2796;
const W = 1290;
const H = 2796;
const CX = SQUARE / 2; // 1398 - text center
const LEFT = (SQUARE - W) / 2; // 753

const outDir = path.resolve(__dirname, '../screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function generatePNG(svgContent, name) {
  const svgPath = path.join(outDir, `${name}.svg`);
  const pngPath = path.join(outDir, `${name}.png`);

  fs.writeFileSync(svgPath, svgContent);

  // qlmanage produces file named like "SC1.svg.png"
  try {
    execSync(`qlmanage -t -s ${SQUARE} -o "${outDir}/" "${svgPath}" 2>/dev/null`);
  } catch(e) {
    console.error(`qlmanage failed for ${name}, trying alternative...`);
  }

  const qlOutput = path.join(outDir, `${name}.svg.png`);
  if (fs.existsSync(qlOutput)) {
    fs.renameSync(qlOutput, pngPath);
  }

  // Crop to 1290x2796
  if (fs.existsSync(pngPath)) {
    execSync(`sips --cropToHeightWidth ${H} ${W} "${pngPath}"`);
    console.log(`Generated: ${pngPath}`);
  } else {
    console.error(`Failed to generate: ${pngPath}`);
  }

  // Clean up svg
  if (fs.existsSync(svgPath)) fs.unlinkSync(svgPath);
}

// ==================== SC1: Hero ====================
function sc1() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SQUARE}" height="${SQUARE}" viewBox="0 0 ${SQUARE} ${SQUARE}">
  <defs>
    <linearGradient id="purpleCard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366F1"/>
      <stop offset="100%" style="stop-color:#818CF8"/>
    </linearGradient>
    <linearGradient id="dailyCard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6"/>
      <stop offset="100%" style="stop-color:#60A5FA"/>
    </linearGradient>
    <linearGradient id="bizCard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366F1"/>
      <stop offset="100%" style="stop-color:#A78BFA"/>
    </linearGradient>
    <filter id="shadow1">
      <feDropShadow dx="0" dy="8" stdDeviation="20" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${SQUARE}" height="${SQUARE}" fill="#1B2838"/>

  <!-- Top copy area -->
  <text x="${CX}" y="200" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="82" font-weight="bold" fill="white">쓰면, 늘어요</text>
  <text x="${CX}" y="290" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="40" fill="white" opacity="0.8">하루 3문장, AI가 원어민처럼 고쳐줘요</text>

  <!-- Phone mockup -->
  <rect x="${LEFT + 60}" y="420" width="${W - 120}" height="2200" rx="40" ry="40" fill="#FAFBFC" filter="url(#shadow1)"/>

  <!-- App title -->
  <text x="${CX}" y="530" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="52" font-weight="bold" fill="#1A1A2E">쓰잉</text>

  <!-- Level card -->
  <rect x="${LEFT + 110}" y="580" width="${W - 220}" height="380" rx="24" ry="24" fill="url(#purpleCard)"/>
  <text x="${LEFT + 160}" y="650" font-family="-apple-system, SF Pro Display, sans-serif" font-size="56" font-weight="bold" fill="white">Lv.5</text>

  <!-- Stats row -->
  <text x="${LEFT + 160}" y="720" font-family="-apple-system, SF Pro Display, sans-serif" font-size="30" fill="white" opacity="0.9">15 완료 문장</text>
  <text x="${LEFT + 460}" y="720" font-family="-apple-system, SF Pro Display, sans-serif" font-size="30" fill="white" opacity="0.9">2 만점</text>
  <text x="${LEFT + 700}" y="720" font-family="-apple-system, SF Pro Display, sans-serif" font-size="30" fill="white" opacity="0.9">5일 최장 연속</text>

  <!-- XP bar background -->
  <rect x="${LEFT + 160}" y="780" width="${W - 380}" height="20" rx="10" fill="white" opacity="0.3"/>
  <!-- XP bar fill (250/500 = 50%) -->
  <rect x="${LEFT + 160}" y="780" width="${(W - 380) * 0.5}" height="20" rx="10" fill="white"/>
  <text x="${LEFT + 160}" y="840" font-family="-apple-system, SF Pro Display, sans-serif" font-size="24" fill="white" opacity="0.8">250 / 500 XP</text>

  <!-- Difficulty toggle -->
  <rect x="${LEFT + 110}" y="1000" width="300" height="60" rx="30" fill="#6366F1"/>
  <text x="${LEFT + 260}" y="1040" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="28" font-weight="600" fill="white">초급 Beginner</text>
  <rect x="${LEFT + 430}" y="1000" width="300" height="60" rx="30" fill="#E8E8F0"/>
  <text x="${LEFT + 580}" y="1040" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="28" font-weight="600" fill="#666">중급 Intermediate</text>

  <!-- Daily English card -->
  <rect x="${LEFT + 110}" y="1110" width="${W - 220}" height="260" rx="20" ry="20" fill="url(#dailyCard)"/>
  <text x="${LEFT + 160}" y="1180" font-family="-apple-system, SF Pro Display, sans-serif" font-size="38" font-weight="bold" fill="white">일상 영어</text>
  <text x="${LEFT + 160}" y="1225" font-family="-apple-system, SF Pro Display, sans-serif" font-size="26" fill="white" opacity="0.8">Daily English</text>
  <text x="${LEFT + 160}" y="1310" font-family="-apple-system, SF Pro Display, sans-serif" font-size="28" fill="white" opacity="0.9">오늘의 문장 ●●○  2/3 완료</text>

  <!-- Business English card -->
  <rect x="${LEFT + 110}" y="1410" width="${W - 220}" height="260" rx="20" ry="20" fill="url(#bizCard)"/>
  <text x="${LEFT + 160}" y="1480" font-family="-apple-system, SF Pro Display, sans-serif" font-size="38" font-weight="bold" fill="white">비즈니스 영어</text>
  <text x="${LEFT + 160}" y="1525" font-family="-apple-system, SF Pro Display, sans-serif" font-size="26" fill="white" opacity="0.8">Business English</text>
  <text x="${LEFT + 160}" y="1610" font-family="-apple-system, SF Pro Display, sans-serif" font-size="28" fill="white" opacity="0.9">오늘의 문장 ○○○  0/3 완료</text>
</svg>`;
}

// ==================== SC2: AI Correction ====================
function sc2() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SQUARE}" height="${SQUARE}" viewBox="0 0 ${SQUARE} ${SQUARE}">
  <defs>
    <linearGradient id="topBar" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5"/>
      <stop offset="100%" style="stop-color:#6366F1"/>
    </linearGradient>
    <filter id="shadow2">
      <feDropShadow dx="0" dy="8" stdDeviation="20" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${SQUARE}" height="350" fill="url(#topBar)"/>
  <rect y="350" width="${SQUARE}" height="${SQUARE - 350}" fill="#F0F0F8"/>

  <!-- Top copy -->
  <text x="${CX}" y="150" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="82" font-weight="bold" fill="white">AI가 원어민 표현으로</text>
  <text x="${CX}" y="240" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="40" fill="white" opacity="0.85">틀린 이유까지 설명해줍니다</text>

  <!-- Phone mockup -->
  <rect x="${LEFT + 60}" y="380" width="${W - 120}" height="2300" rx="40" ry="40" fill="#FAFBFC" filter="url(#shadow2)"/>

  <!-- Navigation bar -->
  <text x="${LEFT + 130}" y="470" font-family="-apple-system, SF Pro Display, sans-serif" font-size="36" fill="#6366F1">←</text>
  <text x="${LEFT + 200}" y="470" font-family="-apple-system, SF Pro Display, sans-serif" font-size="32" fill="#1A1A2E">일상 영어</text>
  <text x="${LEFT + 900}" y="470" font-family="-apple-system, SF Pro Display, sans-serif" font-size="30" fill="#666">1/3</text>

  <!-- Korean sentence card -->
  <rect x="${LEFT + 110}" y="520" width="${W - 220}" height="120" rx="16" fill="#F3F4F6"/>
  <text x="${LEFT + 160}" y="595" font-family="-apple-system, SF Pro Display, sans-serif" font-size="34" fill="#1A1A2E">나는 매일 아침 커피를 마신다.</text>

  <!-- Score badge -->
  <circle cx="${CX}" cy="750" r="70" fill="none" stroke="#22C55E" stroke-width="8"/>
  <text x="${CX}" y="730" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="48" font-weight="bold" fill="#22C55E">8</text>
  <text x="${CX}" y="780" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="24" fill="#22C55E">/10</text>

  <!-- Correction section -->
  <rect x="${LEFT + 110}" y="870" width="${W - 220}" height="320" rx="16" fill="white" stroke="#E5E7EB" stroke-width="2"/>
  <text x="${LEFT + 160}" y="930" font-family="-apple-system, SF Pro Display, sans-serif" font-size="28" font-weight="600" fill="#1A1A2E">교정 결과</text>

  <!-- Original (red) -->
  <rect x="${LEFT + 140}" y="960" width="${W - 290}" height="50" rx="8" fill="#FEE2E2"/>
  <text x="${LEFT + 170}" y="995" font-family="-apple-system, SF Pro Display, sans-serif" font-size="28" fill="#DC2626">I drink coffee every morning.</text>

  <!-- Corrected (green) -->
  <text x="${LEFT + 160}" y="1060" font-family="-apple-system, SF Pro Display, sans-serif" font-size="22" fill="#666">↓</text>
  <rect x="${LEFT + 140}" y="1070" width="${W - 290}" height="50" rx="8" fill="#DCFCE7"/>
  <text x="${LEFT + 170}" y="1105" font-family="-apple-system, SF Pro Display, sans-serif" font-size="28" fill="#16A34A">I have coffee every morning.</text>

  <!-- Explanation -->
  <rect x="${LEFT + 110}" y="1240" width="${W - 220}" height="160" rx="16" fill="#EEF2FF"/>
  <text x="${LEFT + 160}" y="1300" font-family="-apple-system, SF Pro Display, sans-serif" font-size="28" font-weight="600" fill="#4F46E5">💡 설명</text>
  <text x="${LEFT + 160}" y="1355" font-family="-apple-system, SF Pro Display, sans-serif" font-size="26" fill="#374151">have를 사용하면 더 자연스럽습니다.</text>

  <!-- Key expression -->
  <rect x="${LEFT + 110}" y="1450" width="${W - 220}" height="100" rx="16" fill="#F0FDF4"/>
  <text x="${LEFT + 160}" y="1500" font-family="-apple-system, SF Pro Display, sans-serif" font-size="26" fill="#15803D">핵심 표현</text>
  <text x="${LEFT + 420}" y="1500" font-family="-apple-system, SF Pro Display, sans-serif" font-size="30" font-weight="bold" fill="#16A34A">have coffee</text>
</svg>`;
}

// ==================== SC3: Gamification ====================
function sc3() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SQUARE}" height="${SQUARE}" viewBox="0 0 ${SQUARE} ${SQUARE}">
  <defs>
    <linearGradient id="orangeBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#FF6B35"/>
      <stop offset="100%" style="stop-color:#FFB347"/>
    </linearGradient>
    <linearGradient id="purpleCard3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366F1"/>
      <stop offset="100%" style="stop-color:#818CF8"/>
    </linearGradient>
    <filter id="shadow3">
      <feDropShadow dx="0" dy="8" stdDeviation="20" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${SQUARE}" height="${SQUARE}" fill="url(#orangeBg)"/>

  <!-- Top copy -->
  <text x="${CX}" y="200" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="82" font-weight="bold" fill="white">매일 쓰는 게 실력</text>
  <text x="${CX}" y="290" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="40" fill="white" opacity="0.85">스트릭 깨기 싫어서 또 열게 돼요</text>

  <!-- Phone mockup -->
  <rect x="${LEFT + 60}" y="420" width="${W - 120}" height="2200" rx="40" ry="40" fill="#FAFBFC" filter="url(#shadow3)"/>

  <!-- Level card -->
  <rect x="${LEFT + 110}" y="500" width="${W - 220}" height="200" rx="24" ry="24" fill="url(#purpleCard3)"/>
  <text x="${LEFT + 160}" y="580" font-family="-apple-system, SF Pro Display, sans-serif" font-size="48" font-weight="bold" fill="white">Lv.12</text>
  <!-- XP bar -->
  <rect x="${LEFT + 160}" y="620" width="${W - 380}" height="16" rx="8" fill="white" opacity="0.3"/>
  <rect x="${LEFT + 160}" y="620" width="${(W - 380) * 0.7}" height="16" rx="8" fill="white"/>
  <text x="${LEFT + 160}" y="670" font-family="-apple-system, SF Pro Display, sans-serif" font-size="22" fill="white" opacity="0.8">1750 / 2500 XP</text>

  <!-- Streak banner -->
  <rect x="${LEFT + 110}" y="740" width="${W - 220}" height="100" rx="16" fill="#FFF7ED" stroke="#FB923C" stroke-width="2"/>
  <text x="${CX}" y="805" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="40" font-weight="bold" fill="#EA580C">🔥 7일 연속 스트릭!</text>

  <!-- Achievements section -->
  <text x="${LEFT + 130}" y="920" font-family="-apple-system, SF Pro Display, sans-serif" font-size="32" font-weight="bold" fill="#1A1A2E">업적 배지</text>

  <!-- Badge row 1 -->
  <rect x="${LEFT + 110}" y="950" width="240" height="140" rx="16" fill="#EEF2FF" stroke="#6366F1" stroke-width="2"/>
  <text x="${LEFT + 230}" y="1010" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="36">✍️</text>
  <text x="${LEFT + 230}" y="1060" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="22" fill="#4F46E5">첫 작문</text>

  <rect x="${LEFT + 380}" y="950" width="240" height="140" rx="16" fill="#EEF2FF" stroke="#6366F1" stroke-width="2"/>
  <text x="${LEFT + 500}" y="1010" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="36">💯</text>
  <text x="${LEFT + 500}" y="1060" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="22" fill="#4F46E5">만점</text>

  <rect x="${LEFT + 650}" y="950" width="240" height="140" rx="16" fill="#EEF2FF" stroke="#6366F1" stroke-width="2"/>
  <text x="${LEFT + 770}" y="1010" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="36">📅</text>
  <text x="${LEFT + 770}" y="1060" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="22" fill="#4F46E5">7일 연속</text>

  <rect x="${LEFT + 920}" y="950" width="240" height="140" rx="16" fill="#EEF2FF" stroke="#6366F1" stroke-width="2"/>
  <text x="${LEFT + 1040}" y="1010" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="36">🚀</text>
  <text x="${LEFT + 1040}" y="1060" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="22" fill="#4F46E5">Lv.10</text>

  <!-- Weekly report -->
  <text x="${LEFT + 130}" y="1180" font-family="-apple-system, SF Pro Display, sans-serif" font-size="32" font-weight="bold" fill="#1A1A2E">주간 리포트</text>
  <rect x="${LEFT + 110}" y="1210" width="${W - 220}" height="180" rx="16" fill="white" stroke="#E5E7EB" stroke-width="2"/>
  <text x="${LEFT + 200}" y="1290" font-family="-apple-system, SF Pro Display, sans-serif" font-size="44" font-weight="bold" fill="#6366F1">21</text>
  <text x="${LEFT + 280}" y="1290" font-family="-apple-system, SF Pro Display, sans-serif" font-size="28" fill="#666">문장 완료</text>
  <text x="${LEFT + 600}" y="1290" font-family="-apple-system, SF Pro Display, sans-serif" font-size="44" font-weight="bold" fill="#6366F1">8.2</text>
  <text x="${LEFT + 700}" y="1290" font-family="-apple-system, SF Pro Display, sans-serif" font-size="28" fill="#666">평균 점수</text>
</svg>`;
}

// ==================== SC4: Hint ====================
function sc4() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SQUARE}" height="${SQUARE}" viewBox="0 0 ${SQUARE} ${SQUARE}">
  <defs>
    <filter id="shadow4">
      <feDropShadow dx="0" dy="8" stdDeviation="20" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${SQUARE}" height="${SQUARE}" fill="#E8F8F5"/>

  <!-- Top copy -->
  <text x="${CX}" y="200" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="82" font-weight="bold" fill="#1A1A2E">막히면 힌트 한 번</text>
  <text x="${CX}" y="290" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="40" fill="#1A1A2E" opacity="0.7">단어 몰라도 포기 안 해요</text>

  <!-- Phone mockup -->
  <rect x="${LEFT + 60}" y="420" width="${W - 120}" height="2200" rx="40" ry="40" fill="#FAFBFC" filter="url(#shadow4)"/>

  <!-- Korean sentence -->
  <rect x="${LEFT + 110}" y="520" width="${W - 220}" height="120" rx="16" fill="#F3F4F6"/>
  <text x="${LEFT + 160}" y="595" font-family="-apple-system, SF Pro Display, sans-serif" font-size="32" fill="#1A1A2E">그 영화는 내 기대보다 훨씬 좋았다.</text>

  <!-- English input area -->
  <rect x="${LEFT + 110}" y="690" width="${W - 220}" height="160" rx="16" fill="white" stroke="#D1D5DB" stroke-width="2"/>
  <text x="${LEFT + 160}" y="760" font-family="-apple-system, SF Pro Display, sans-serif" font-size="32" fill="#1A1A2E">The movie was much...</text>
  <line x1="${LEFT + 610}" y1="740" x2="${LEFT + 612}" y2="780" stroke="#6366F1" stroke-width="2"/>

  <!-- Hint button (expanded) -->
  <rect x="${LEFT + 110}" y="900" width="${W - 220}" height="60" rx="30" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/>
  <text x="${CX}" y="940" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="28" font-weight="600" fill="#D97706">💡 힌트 보기</text>

  <!-- Hint chips -->
  <rect x="${LEFT + 110}" y="1000" width="${W - 220}" height="300" rx="16" fill="#FFFBEB"/>

  <rect x="${LEFT + 140}" y="1040" width="320" height="56" rx="28" fill="white" stroke="#F59E0B" stroke-width="1.5"/>
  <text x="${LEFT + 300}" y="1076" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="26" fill="#92400E">better than  ~보다 좋은</text>

  <rect x="${LEFT + 490}" y="1040" width="300" height="56" rx="28" fill="white" stroke="#F59E0B" stroke-width="1.5"/>
  <text x="${LEFT + 640}" y="1076" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="26" fill="#92400E">expectation  기대</text>

  <rect x="${LEFT + 140}" y="1120" width="260" height="56" rx="28" fill="white" stroke="#F59E0B" stroke-width="1.5"/>
  <text x="${LEFT + 270}" y="1156" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="26" fill="#92400E">much/far  훨씬</text>

  <!-- Hint notice -->
  <rect x="${LEFT + 110}" y="1340" width="${W - 220}" height="70" rx="12" fill="#FEF2F2"/>
  <text x="${CX}" y="1385" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="26" fill="#DC2626">힌트 사용 시 최대 점수: 8점 (감점 -2)</text>
</svg>`;
}

// ==================== SC5: CTA ====================
function sc5() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SQUARE}" height="${SQUARE}" viewBox="0 0 ${SQUARE} ${SQUARE}">
  <defs>
    <linearGradient id="purpleCard5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366F1"/>
      <stop offset="100%" style="stop-color:#818CF8"/>
    </linearGradient>
    <filter id="shadow5">
      <feDropShadow dx="0" dy="8" stdDeviation="20" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${SQUARE}" height="${SQUARE}" fill="#2D1B69"/>

  <!-- Top copy -->
  <text x="${CX}" y="200" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="82" font-weight="bold" fill="white">3개월 후, 다른 영어</text>
  <text x="${CX}" y="290" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="40" fill="white" opacity="0.8">지금 시작하세요</text>

  <!-- Phone mockup -->
  <rect x="${LEFT + 60}" y="420" width="${W - 120}" height="2200" rx="40" ry="40" fill="#FAFBFC" filter="url(#shadow5)"/>

  <!-- Growth graph -->
  <text x="${LEFT + 130}" y="530" font-family="-apple-system, SF Pro Display, sans-serif" font-size="32" font-weight="bold" fill="#1A1A2E">나의 성장</text>

  <rect x="${LEFT + 110}" y="560" width="${W - 220}" height="360" rx="16" fill="white" stroke="#E5E7EB" stroke-width="2"/>

  <!-- Graph axes labels -->
  <text x="${LEFT + 220}" y="870" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="24" fill="#666">1월</text>
  <text x="${LEFT + 540}" y="870" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="24" fill="#666">2월</text>
  <text x="${LEFT + 860}" y="870" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="24" fill="#666">3월</text>

  <!-- Graph line (upward) -->
  <polyline points="${LEFT + 220},800 ${LEFT + 540},700 ${LEFT + 860},580" fill="none" stroke="#6366F1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${LEFT + 220}" cy="800" r="8" fill="#6366F1"/>
  <circle cx="${LEFT + 540}" cy="700" r="8" fill="#6366F1"/>
  <circle cx="${LEFT + 860}" cy="580" r="8" fill="#6366F1"/>

  <!-- Level labels on graph -->
  <text x="${LEFT + 220}" y="780" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="22" fill="#6366F1">Lv.1</text>
  <text x="${LEFT + 540}" y="680" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="22" fill="#6366F1">Lv.7</text>
  <text x="${LEFT + 860}" y="560" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="22" fill="#6366F1">Lv.15</text>

  <!-- Stats cards -->
  <text x="${LEFT + 130}" y="980" font-family="-apple-system, SF Pro Display, sans-serif" font-size="32" font-weight="bold" fill="#1A1A2E">학습 통계</text>

  <rect x="${LEFT + 110}" y="1010" width="470" height="140" rx="16" fill="#EEF2FF"/>
  <text x="${LEFT + 160}" y="1070" font-family="-apple-system, SF Pro Display, sans-serif" font-size="26" fill="#666">총 작문 문장</text>
  <text x="${LEFT + 160}" y="1120" font-family="-apple-system, SF Pro Display, sans-serif" font-size="42" font-weight="bold" fill="#4F46E5">270문장</text>

  <rect x="${LEFT + 610}" y="1010" width="470" height="140" rx="16" fill="#EEF2FF"/>
  <text x="${LEFT + 660}" y="1070" font-family="-apple-system, SF Pro Display, sans-serif" font-size="26" fill="#666">평균 점수</text>
  <text x="${LEFT + 660}" y="1120" font-family="-apple-system, SF Pro Display, sans-serif" font-size="42" font-weight="bold" fill="#4F46E5">5.2 → 8.7</text>

  <!-- Review mode card -->
  <rect x="${LEFT + 110}" y="1190" width="${W - 220}" height="130" rx="16" fill="#F0FDF4" stroke="#86EFAC" stroke-width="2"/>
  <text x="${LEFT + 160}" y="1250" font-family="-apple-system, SF Pro Display, sans-serif" font-size="30" font-weight="600" fill="#15803D">🔄 복습 모드</text>
  <text x="${LEFT + 160}" y="1295" font-family="-apple-system, SF Pro Display, sans-serif" font-size="24" fill="#166534">틀렸던 문장 모아서 다시 연습</text>

  <!-- CTA button -->
  <rect x="${LEFT + 200}" y="1380" width="${W - 400}" height="80" rx="40" fill="#6366F1"/>
  <text x="${CX}" y="1430" text-anchor="middle" font-family="-apple-system, SF Pro Display, sans-serif" font-size="32" font-weight="bold" fill="white">무료로 시작하기</text>
</svg>`;
}

// Generate all screenshots
console.log('Generating screenshots...');
generatePNG(sc1(), 'SC1');
generatePNG(sc2(), 'SC2');
generatePNG(sc3(), 'SC3');
generatePNG(sc4(), 'SC4');
generatePNG(sc5(), 'SC5');
console.log('Done!');
