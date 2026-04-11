const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const ASSETS_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(ASSETS_DIR, 'screenshots');

// 디렉토리 생성
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

// === 유틸: SVG → PNG 변환 ===
function svgToPng(svgContent, svgName, pngName, size) {
  const svgPath = path.join(ASSETS_DIR, svgName);
  const pngPath = path.join(ASSETS_DIR, pngName);

  fs.writeFileSync(svgPath, svgContent);

  try { fs.unlinkSync(pngPath); } catch(e) {}

  execSync(`qlmanage -t -s ${size} -o "${ASSETS_DIR}/" "${svgPath}" 2>/dev/null`);

  const files = fs.readdirSync(ASSETS_DIR).filter(f => f.startsWith(svgName) && f.endsWith('.png'));
  if (files.length > 0) {
    fs.renameSync(path.join(ASSETS_DIR, files[0]), pngPath);
    fs.unlinkSync(svgPath); // SVG 정리
    return true;
  }
  return false;
}

function svgToPngScreenshot(svgContent, svgName, pngName, size) {
  const svgPath = path.join(SCREENSHOTS_DIR, svgName);
  const pngPath = path.join(SCREENSHOTS_DIR, pngName);

  fs.writeFileSync(svgPath, svgContent);

  try { fs.unlinkSync(pngPath); } catch(e) {}

  execSync(`qlmanage -t -s ${size} -o "${SCREENSHOTS_DIR}/" "${svgPath}" 2>/dev/null`);

  const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.startsWith(svgName) && f.endsWith('.png'));
  if (files.length > 0) {
    fs.renameSync(path.join(SCREENSHOTS_DIR, files[0]), pngPath);
    fs.unlinkSync(svgPath);
    return true;
  }
  return false;
}

// ============================================================
// 1. 앱 아이콘 (1024x1024)
// ============================================================
console.log('1/3 앱 아이콘 생성 중...');

const iconSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5"/>
      <stop offset="100%" style="stop-color:#7C3AED"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="224" ry="224" fill="url(#bg)"/>
  <!-- 연필 몸체 -->
  <rect x="392" y="180" width="240" height="340" rx="16" ry="16"
        fill="rgba(255,255,255,0.15)" stroke="white" stroke-width="8"/>
  <!-- 연필 팁 -->
  <polygon points="392,520 632,520 512,620"
           fill="rgba(255,255,255,0.25)" stroke="white" stroke-width="8" stroke-linejoin="round"/>
  <!-- 글줄 3개 -->
  <rect x="442" y="280" width="140" height="10" rx="5" fill="white"/>
  <rect x="442" y="350" width="140" height="10" rx="5" fill="white"/>
  <rect x="462" y="420" width="100" height="10" rx="5" fill="white"/>
  <!-- 쓰잉 텍스트 -->
  <text x="512" y="810" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif"
        font-size="160" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="8">쓰잉</text>
</svg>`;

if (svgToPng(iconSVG, '_icon.svg', 'icon.png', 1024)) {
  console.log('   icon.png 완료 (1024x1024)');
} else {
  console.log('   icon.png 실패!');
}

// ============================================================
// 2. 스플래시 화면 (1024x1024, Expo가 자동 리사이즈)
// ============================================================
console.log('2/3 스플래시 화면 생성 중...');

const splashSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#5B4FE5"/>
  <!-- 연필 심볼 -->
  <rect x="412" y="200" width="200" height="280" rx="14" ry="14"
        fill="rgba(255,255,255,0.15)" stroke="white" stroke-width="7"/>
  <polygon points="412,480 612,480 512,560"
           fill="rgba(255,255,255,0.25)" stroke="white" stroke-width="7" stroke-linejoin="round"/>
  <!-- 글줄 -->
  <rect x="462" y="290" width="100" height="8" rx="4" fill="white"/>
  <rect x="462" y="350" width="100" height="8" rx="4" fill="white"/>
  <rect x="475" y="410" width="74" height="8" rx="4" fill="white"/>
  <!-- 앱 이름 -->
  <text x="512" y="710" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif"
        font-size="120" font-weight="bold" fill="white" text-anchor="middle">쓰잉</text>
  <text x="512" y="780" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif"
        font-size="44" fill="rgba(255,255,255,0.7)" text-anchor="middle">영어 작문 트레이너</text>
</svg>`;

if (svgToPng(splashSVG, '_splash.svg', 'splash.png', 1024)) {
  console.log('   splash.png 완료 (1024x1024)');
} else {
  console.log('   splash.png 실패!');
}

// ============================================================
// 3. 앱스토어 스크린샷 5장 (1290x2796 → 정사각형 2796 생성 후 크롭)
// ============================================================
console.log('3/3 앱스토어 스크린샷 생성 중...');

const W = 1290, H = 2796;

// 스크린샷 공통 요소
function makeScreenshot(title, subtitle, mockupContent, index) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sbg${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5"/>
      <stop offset="100%" style="stop-color:#7C3AED"/>
    </linearGradient>
  </defs>
  <!-- 배경 -->
  <rect width="${W}" height="${H}" fill="url(#sbg${index})"/>

  <!-- 상단 텍스트 영역 -->
  <text x="${W/2}" y="320" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif"
        font-size="88" font-weight="bold" fill="white" text-anchor="middle">${title}</text>
  <text x="${W/2}" y="420" font-family="Apple SD Gothic Neo, Malgun Gothic, sans-serif"
        font-size="48" fill="rgba(255,255,255,0.8)" text-anchor="middle">${subtitle}</text>

  <!-- 폰 목업 배경 (둥근 사각형) -->
  <rect x="145" y="560" width="1000" height="2000" rx="50" ry="50" fill="white" opacity="0.95"/>

  <!-- 폰 내부 콘텐츠 -->
  ${mockupContent}
</svg>`;
}

// 스크린샷 1: 홈 화면
const ss1 = makeScreenshot("하루 3문장으로", "영어 작문 실력 UP!", `
  <!-- 상단바 -->
  <text x="645" y="660" font-family="Apple SD Gothic Neo, sans-serif" font-size="56" font-weight="bold" fill="#1A1A2E" text-anchor="middle">쓰잉</text>
  <rect x="195" y="700" width="900" height="2" fill="#E5E7EB"/>

  <!-- 일상 영어 카드 -->
  <rect x="215" y="750" width="860" height="280" rx="24" fill="#F0EEFF"/>
  <text x="265" y="830" font-family="sans-serif" font-size="44" font-weight="bold" fill="#4F46E5">일상 영어</text>
  <text x="265" y="890" font-family="sans-serif" font-size="32" fill="#6B7280">Daily English</text>
  <text x="265" y="960" font-family="sans-serif" font-size="32" fill="#4F46E5">오늘의 문장 3/3</text>
  <rect x="810" y="800" width="200" height="60" rx="30" fill="#4F46E5"/>
  <text x="910" y="842" font-family="sans-serif" font-size="28" fill="white" text-anchor="middle">시작하기</text>

  <!-- 비즈니스 영어 카드 -->
  <rect x="215" y="1080" width="860" height="280" rx="24" fill="#FFF4E6"/>
  <text x="265" y="1160" font-family="sans-serif" font-size="44" font-weight="bold" fill="#E67E22">비즈니스 영어</text>
  <text x="265" y="1220" font-family="sans-serif" font-size="32" fill="#6B7280">Business English</text>
  <text x="265" y="1290" font-family="sans-serif" font-size="32" fill="#E67E22">오늘의 문장 0/3</text>
  <rect x="810" y="1130" width="200" height="60" rx="30" fill="#E67E22"/>
  <text x="910" y="1172" font-family="sans-serif" font-size="28" fill="white" text-anchor="middle">시작하기</text>

  <!-- 학습 현황 -->
  <rect x="215" y="1430" width="860" height="200" rx="24" fill="#F9FAFB"/>
  <text x="645" y="1510" font-family="sans-serif" font-size="36" font-weight="bold" fill="#1A1A2E" text-anchor="middle">오늘의 학습 현황</text>
  <text x="380" y="1580" font-family="sans-serif" font-size="56" font-weight="bold" fill="#4F46E5" text-anchor="middle">3</text>
  <text x="380" y="1615" font-family="sans-serif" font-size="24" fill="#6B7280" text-anchor="middle">완료 문장</text>
  <text x="645" y="1580" font-family="sans-serif" font-size="56" font-weight="bold" fill="#4CAF50" text-anchor="middle">8.2</text>
  <text x="645" y="1615" font-family="sans-serif" font-size="24" fill="#6B7280" text-anchor="middle">평균 점수</text>
  <text x="910" y="1580" font-family="sans-serif" font-size="56" font-weight="bold" fill="#FF9800" text-anchor="middle">5일</text>
  <text x="910" y="1615" font-family="sans-serif" font-size="24" fill="#6B7280" text-anchor="middle">연속 학습</text>
`, 1);

// 스크린샷 2: 작문 입력 화면
const ss2 = makeScreenshot("한글 문장을 보고", "영어로 써보세요", `
  <!-- 상단바 -->
  <text x="300" y="660" font-family="sans-serif" font-size="36" fill="#6B7280">← 일상 영어</text>
  <text x="1000" y="660" font-family="sans-serif" font-size="36" fill="#6B7280">1/3</text>
  <rect x="195" y="700" width="900" height="2" fill="#E5E7EB"/>

  <!-- 한글 문장 -->
  <rect x="215" y="750" width="860" height="300" rx="24" fill="#F9FAFB"/>
  <text x="645" y="870" font-family="Apple SD Gothic Neo, sans-serif" font-size="44" font-weight="bold" fill="#1A1A2E" text-anchor="middle">나는 어제 친구와</text>
  <text x="645" y="940" font-family="Apple SD Gothic Neo, sans-serif" font-size="44" font-weight="bold" fill="#1A1A2E" text-anchor="middle">카페에서 커피를 마셨다</text>

  <!-- 힌트 영역 -->
  <rect x="215" y="1100" width="860" height="200" rx="20" fill="#F0EEFF"/>
  <text x="265" y="1155" font-family="sans-serif" font-size="32" font-weight="bold" fill="#7C3AED">💡 힌트 단어</text>
  <text x="265" y="1210" font-family="sans-serif" font-size="30" fill="#4F46E5">yesterday 어제  ·  café 카페  ·  coffee 커피</text>
  <text x="265" y="1260" font-family="sans-serif" font-size="30" fill="#4F46E5">friend 친구  ·  drank 마셨다</text>

  <!-- 작문 입력 -->
  <rect x="215" y="1370" width="860" height="300" rx="20" fill="white" stroke="#D1D5DB" stroke-width="3"/>
  <text x="265" y="1440" font-family="sans-serif" font-size="38" fill="#1A1A2E">I had coffee with my friend</text>
  <text x="265" y="1500" font-family="sans-serif" font-size="38" fill="#1A1A2E">at a café yesterday.</text>
  <line x1="265" y1="1510" x2="680" y2="1510" stroke="#4F46E5" stroke-width="2"/>

  <!-- 제출 버튼 -->
  <rect x="215" y="1730" width="860" height="100" rx="20" fill="#4F46E5"/>
  <text x="645" y="1800" font-family="sans-serif" font-size="40" font-weight="bold" fill="white" text-anchor="middle">작문 완료 ✓</text>
`, 2);

// 스크린샷 3: AI 교정 결과
const ss3 = makeScreenshot("AI가 원어민 표현으로", "바로 교정해줍니다", `
  <rect x="195" y="700" width="900" height="2" fill="#E5E7EB"/>

  <!-- 점수 -->
  <circle cx="645" cy="880" r="100" fill="none" stroke="#4CAF50" stroke-width="12"/>
  <text x="645" y="900" font-family="sans-serif" font-size="72" font-weight="bold" fill="#4CAF50" text-anchor="middle">8</text>
  <text x="645" y="945" font-family="sans-serif" font-size="28" fill="#6B7280" text-anchor="middle">/10</text>

  <!-- 교정 결과 카드 -->
  <rect x="215" y="1030" width="860" height="320" rx="24" fill="#F0FFF4"/>
  <text x="265" y="1095" font-family="sans-serif" font-size="32" font-weight="bold" fill="#4CAF50">✅ 교정된 문장</text>
  <text x="265" y="1160" font-family="sans-serif" font-size="36" fill="#1A1A2E">I had coffee with my friend</text>
  <text x="265" y="1215" font-family="sans-serif" font-size="36" fill="#1A1A2E">at a café yesterday.</text>
  <rect x="265" y="1250" width="780" height="2" fill="#C6F6D5"/>
  <text x="265" y="1300" font-family="sans-serif" font-size="28" fill="#4CAF50">🎯 핵심 표현: "had coffee" (커피를 마시다)</text>

  <!-- 설명 카드 -->
  <rect x="215" y="1400" width="860" height="400" rx="24" fill="#F9FAFB"/>
  <text x="265" y="1470" font-family="sans-serif" font-size="32" font-weight="bold" fill="#1A1A2E">📝 교정 포인트</text>
  <text x="265" y="1540" font-family="sans-serif" font-size="30" fill="#6B7280">• "drank coffee" → "had coffee"</text>
  <text x="290" y="1590" font-family="sans-serif" font-size="26" fill="#9CA3AF">원어민은 음료를 마실 때 had를 더 자주 씁니다</text>
  <text x="265" y="1660" font-family="sans-serif" font-size="30" fill="#6B7280">• 문장 구조가 자연스럽습니다 👍</text>

  <!-- 대안 표현 -->
  <rect x="215" y="1840" width="860" height="200" rx="24" fill="#FFF8E1"/>
  <text x="265" y="1910" font-family="sans-serif" font-size="32" font-weight="bold" fill="#E67E22">💬 대안 표현</text>
  <text x="265" y="1975" font-family="sans-serif" font-size="30" fill="#6B7280">My friend and I grabbed coffee at a café yesterday.</text>
`, 3);

// 스크린샷 4: 게이미피케이션 (XP/레벨/업적)
const ss4 = makeScreenshot("쓸수록 레벨업!", "매일이 성취", `
  <rect x="195" y="700" width="900" height="2" fill="#E5E7EB"/>

  <!-- 레벨 & XP -->
  <rect x="215" y="750" width="860" height="300" rx="24" fill="#F0EEFF"/>
  <text x="645" y="830" font-family="sans-serif" font-size="36" fill="#7C3AED" text-anchor="middle">Level 5</text>
  <text x="645" y="910" font-family="sans-serif" font-size="72" font-weight="bold" fill="#4F46E5" text-anchor="middle">1,250 XP</text>
  <!-- XP 바 -->
  <rect x="295" y="960" width="700" height="20" rx="10" fill="#E0E7FF"/>
  <rect x="295" y="960" width="450" height="20" rx="10" fill="#4F46E5"/>
  <text x="645" y="1020" font-family="sans-serif" font-size="24" fill="#6B7280" text-anchor="middle">다음 레벨까지 250 XP</text>

  <!-- 스트릭 -->
  <rect x="215" y="1100" width="860" height="180" rx="24" fill="#FFF4E6"/>
  <text x="645" y="1180" font-family="sans-serif" font-size="56" font-weight="bold" fill="#E67E22" text-anchor="middle">🔥 5일 연속 학습!</text>
  <text x="645" y="1240" font-family="sans-serif" font-size="28" fill="#6B7280" text-anchor="middle">7일 달성하면 주간왕 업적을 받아요</text>

  <!-- 업적 배지들 -->
  <text x="265" y="1380" font-family="sans-serif" font-size="36" font-weight="bold" fill="#1A1A2E">🏆 업적</text>

  <rect x="215" y="1420" width="270" height="270" rx="20" fill="#F0FFF4"/>
  <text x="350" y="1530" font-family="sans-serif" font-size="64" text-anchor="middle">✍️</text>
  <text x="350" y="1600" font-family="sans-serif" font-size="26" font-weight="bold" fill="#1A1A2E" text-anchor="middle">첫 작문</text>
  <text x="350" y="1640" font-family="sans-serif" font-size="22" fill="#4CAF50" text-anchor="middle">달성!</text>

  <rect x="510" y="1420" width="270" height="270" rx="20" fill="#F0FFF4"/>
  <text x="645" y="1530" font-family="sans-serif" font-size="64" text-anchor="middle">💯</text>
  <text x="645" y="1600" font-family="sans-serif" font-size="26" font-weight="bold" fill="#1A1A2E" text-anchor="middle">만점 달성</text>
  <text x="645" y="1640" font-family="sans-serif" font-size="22" fill="#4CAF50" text-anchor="middle">달성!</text>

  <rect x="805" y="1420" width="270" height="270" rx="20" fill="#F9FAFB"/>
  <text x="940" y="1530" font-family="sans-serif" font-size="64" text-anchor="middle">📅</text>
  <text x="940" y="1600" font-family="sans-serif" font-size="26" font-weight="bold" fill="#1A1A2E" text-anchor="middle">주간왕</text>
  <text x="940" y="1640" font-family="sans-serif" font-size="22" fill="#9CA3AF" text-anchor="middle">2일 남음</text>

  <!-- 주간 리포트 미리보기 -->
  <rect x="215" y="1750" width="860" height="280" rx="24" fill="#F9FAFB"/>
  <text x="265" y="1830" font-family="sans-serif" font-size="36" font-weight="bold" fill="#1A1A2E">📊 이번 주 리포트</text>
  <text x="380" y="1920" font-family="sans-serif" font-size="48" font-weight="bold" fill="#4F46E5" text-anchor="middle">15</text>
  <text x="380" y="1960" font-family="sans-serif" font-size="24" fill="#6B7280" text-anchor="middle">작문 수</text>
  <text x="645" y="1920" font-family="sans-serif" font-size="48" font-weight="bold" fill="#4CAF50" text-anchor="middle">7.8</text>
  <text x="645" y="1960" font-family="sans-serif" font-size="24" fill="#6B7280" text-anchor="middle">평균 점수</text>
  <text x="910" y="1920" font-family="sans-serif" font-size="48" font-weight="bold" fill="#FF9800" text-anchor="middle">+0.5</text>
  <text x="910" y="1960" font-family="sans-serif" font-size="24" fill="#6B7280" text-anchor="middle">점수 변화</text>
`, 4);

// 스크린샷 5: 복습 모드
const ss5 = makeScreenshot("약점 문장을 다시 도전!", "복습으로 실력을 굳히세요", `
  <rect x="195" y="700" width="900" height="2" fill="#E5E7EB"/>

  <text x="645" y="780" font-family="sans-serif" font-size="40" font-weight="bold" fill="#1A1A2E" text-anchor="middle">복습 모드</text>
  <text x="645" y="830" font-family="sans-serif" font-size="28" fill="#6B7280" text-anchor="middle">점수가 낮았던 문장을 다시 연습하세요</text>

  <!-- 복습 문장 카드 1 -->
  <rect x="215" y="880" width="860" height="340" rx="24" fill="white" stroke="#FFD6D6" stroke-width="3"/>
  <rect x="215" y="880" width="860" height="60" rx="0" fill="#FFF5F5"/>
  <rect x="215" y="880" width="860" height="60" rx="24" fill="#FFF5F5"/>
  <rect x="215" y="910" width="860" height="30" fill="#FFF5F5"/>
  <text x="265" y="920" font-family="sans-serif" font-size="28" fill="#F44336">이전 점수: 4/10</text>
  <text x="265" y="1010" font-family="Apple SD Gothic Neo, sans-serif" font-size="36" font-weight="bold" fill="#1A1A2E">그 회의는 예상보다 길었다</text>
  <text x="265" y="1070" font-family="sans-serif" font-size="28" fill="#9CA3AF">The meeting was longer than expected.</text>
  <rect x="730" y="1120" width="300" height="60" rx="30" fill="#4F46E5"/>
  <text x="880" y="1162" font-family="sans-serif" font-size="28" fill="white" text-anchor="middle">다시 도전</text>

  <!-- 복습 문장 카드 2 -->
  <rect x="215" y="1270" width="860" height="340" rx="24" fill="white" stroke="#FFE0B2" stroke-width="3"/>
  <rect x="215" y="1270" width="860" height="60" rx="24" fill="#FFF8E1"/>
  <rect x="215" y="1300" width="860" height="30" fill="#FFF8E1"/>
  <text x="265" y="1310" font-family="sans-serif" font-size="28" fill="#FF9800">이전 점수: 6/10</text>
  <text x="265" y="1400" font-family="Apple SD Gothic Neo, sans-serif" font-size="36" font-weight="bold" fill="#1A1A2E">주말에 뭐 할 거야?</text>
  <text x="265" y="1460" font-family="sans-serif" font-size="28" fill="#9CA3AF">What are you going to do this weekend?</text>
  <rect x="730" y="1510" width="300" height="60" rx="30" fill="#4F46E5"/>
  <text x="880" y="1552" font-family="sans-serif" font-size="28" fill="white" text-anchor="middle">다시 도전</text>

  <!-- 성장 그래프 -->
  <rect x="215" y="1680" width="860" height="300" rx="24" fill="#F0EEFF"/>
  <text x="645" y="1760" font-family="sans-serif" font-size="32" font-weight="bold" fill="#4F46E5" text-anchor="middle">복습 후 평균 점수 변화</text>
  <!-- 간단한 그래프 -->
  <line x1="315" y1="1900" x2="975" y2="1900" stroke="#D1D5DB" stroke-width="2"/>
  <circle cx="415" cy="1880" r="12" fill="#F44336"/>
  <circle cx="575" cy="1850" r="12" fill="#FF9800"/>
  <circle cx="735" cy="1820" r="12" fill="#4CAF50"/>
  <circle cx="895" cy="1790" r="12" fill="#4F46E5"/>
  <line x1="415" y1="1880" x2="575" y2="1850" stroke="#7C3AED" stroke-width="3"/>
  <line x1="575" y1="1850" x2="735" y2="1820" stroke="#7C3AED" stroke-width="3"/>
  <line x1="735" y1="1820" x2="895" y2="1790" stroke="#7C3AED" stroke-width="3"/>
  <text x="415" y="1940" font-family="sans-serif" font-size="22" fill="#6B7280" text-anchor="middle">1회차</text>
  <text x="575" y="1940" font-family="sans-serif" font-size="22" fill="#6B7280" text-anchor="middle">2회차</text>
  <text x="735" y="1940" font-family="sans-serif" font-size="22" fill="#6B7280" text-anchor="middle">3회차</text>
  <text x="895" y="1940" font-family="sans-serif" font-size="22" fill="#6B7280" text-anchor="middle">4회차</text>
`, 5);

// 스크린샷 생성 (정사각형으로 만든 뒤 크롭)
const screenshots = [
  { svg: ss1, name: 'screenshot_01' },
  { svg: ss2, name: 'screenshot_02' },
  { svg: ss3, name: 'screenshot_03' },
  { svg: ss4, name: 'screenshot_04' },
  { svg: ss5, name: 'screenshot_05' }
];

for (const ss of screenshots) {
  const svgPath = path.join(SCREENSHOTS_DIR, `_${ss.name}.svg`);
  const pngPath = path.join(SCREENSHOTS_DIR, `${ss.name}.png`);

  fs.writeFileSync(svgPath, ss.svg);
  try { fs.unlinkSync(pngPath); } catch(e) {}

  // H(2796) 크기로 정사각형 생성 후 크롭
  execSync(`qlmanage -t -s ${H} -o "${SCREENSHOTS_DIR}/" "${svgPath}" 2>/dev/null`);

  const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.startsWith(`_${ss.name}.svg`) && f.endsWith('.png'));
  if (files.length > 0) {
    fs.renameSync(path.join(SCREENSHOTS_DIR, files[0]), pngPath);
    // 정사각형 → 1290x2796으로 크롭
    execSync(`sips --cropToHeightWidth ${H} ${W} "${pngPath}"`);
    console.log(`   ${ss.name}.png 완료`);
  }

  fs.unlinkSync(svgPath);
}

// 최종 검증
console.log('\n=== 최종 검증 ===');
const allFiles = [
  { path: path.join(ASSETS_DIR, 'icon.png'), expected: '1024x1024' },
  { path: path.join(ASSETS_DIR, 'splash.png'), expected: '1024x1024' },
  ...screenshots.map(s => ({ path: path.join(SCREENSHOTS_DIR, `${s.name}.png`), expected: '1290x2796' }))
];

for (const f of allFiles) {
  try {
    const info = execSync(`sips -g pixelWidth -g pixelHeight "${f.path}"`).toString();
    const w = info.match(/pixelWidth:\s*(\d+)/)[1];
    const h = info.match(/pixelHeight:\s*(\d+)/)[1];
    const status = `${w}x${h}` === f.expected ? '✓' : `✗ (${w}x${h})`;
    console.log(`${status} ${path.basename(f.path)} — ${w}x${h}`);
  } catch(e) {
    console.log(`✗ ${path.basename(f.path)} — 파일 없음`);
  }
}

console.log('\n완료!');
