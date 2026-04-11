const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const dir = '/Users/jj/Documents/하네스설치/assets';

function createIcon(svgContent, filename) {
  const svgPath = path.join(dir, '_temp.svg');
  const pngPath = path.join(dir, filename);
  fs.writeFileSync(svgPath, svgContent);
  try { fs.unlinkSync(pngPath); } catch(e) {}
  execSync(`qlmanage -t -s 1024 -o "${dir}/" "${svgPath}" 2>/dev/null`);
  const files = fs.readdirSync(dir).filter(f => f.startsWith('_temp.svg') && f.endsWith('.png'));
  if (files.length > 0) {
    fs.renameSync(path.join(dir, files[0]), pngPath);
    console.log(`  -> ${filename} created`);
  } else {
    console.log(`  !! ${filename} FAILED - no PNG generated`);
  }
  try { fs.unlinkSync(svgPath); } catch(e) {}
}

// ============================================================
// icon_v1.png: 타이포 온리 - "쓰" 한 글자
// ============================================================
const svg_v1 = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="224" ry="224" fill="url(#bg)"/>
  <text x="512" y="560" text-anchor="middle" dominant-baseline="central"
        font-family="'Apple SD Gothic Neo', 'Helvetica Neue', Arial, sans-serif"
        font-size="500" font-weight="bold" fill="white">쓰</text>
</svg>`;

// ============================================================
// icon_v2.png: 말풍선 + 펜
// ============================================================
const svg_v2 = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="224" ry="224" fill="url(#bg)"/>
  <!-- 말풍선 -->
  <rect x="262" y="220" width="500" height="400" rx="40" ry="40" fill="white" opacity="0.9"/>
  <!-- 말풍선 꼬리 -->
  <polygon points="420,620 480,620 440,700" fill="white" opacity="0.9"/>
  <!-- 기울어진 펜 (45도 회전) -->
  <g transform="translate(512, 420) rotate(-45)">
    <!-- 펜 몸통 -->
    <line x1="0" y1="-120" x2="0" y2="80" stroke="#4F46E5" stroke-width="18" stroke-linecap="round"/>
    <!-- 펜 촉 -->
    <line x1="0" y1="80" x2="0" y2="120" stroke="#4F46E5" stroke-width="10" stroke-linecap="round"/>
    <!-- 펜 촉 끝 -->
    <polygon points="-8,80 8,80 0,130" fill="#4F46E5"/>
    <!-- 펜 상단 장식 -->
    <rect x="-12" y="-120" width="24" height="20" rx="4" fill="#4F46E5"/>
    <!-- 펜 클립 -->
    <line x1="12" y1="-120" x2="12" y2="-60" stroke="#7C3AED" stroke-width="6" stroke-linecap="round"/>
  </g>
</svg>`;

// ============================================================
// icon_v3.png: A → A+ (성장)
// ============================================================
const svg_v3 = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="224" ry="224" fill="url(#bg)"/>
  <!-- 왼쪽 A (빨간색, 취소선) -->
  <text x="240" y="560" text-anchor="middle" dominant-baseline="central"
        font-family="'Apple SD Gothic Neo', 'Helvetica Neue', Arial, sans-serif"
        font-size="300" fill="#F44336">A</text>
  <line x1="130" y1="530" x2="350" y2="530" stroke="#F44336" stroke-width="12" stroke-linecap="round"/>
  <!-- 화살표 -->
  <text x="470" y="540" text-anchor="middle" dominant-baseline="central"
        font-family="'Helvetica Neue', Arial, sans-serif"
        font-size="180" fill="white" opacity="0.8">→</text>
  <!-- 오른쪽 A+ (초록색, bold) -->
  <text x="720" y="560" text-anchor="middle" dominant-baseline="central"
        font-family="'Apple SD Gothic Neo', 'Helvetica Neue', Arial, sans-serif"
        font-size="350" font-weight="bold" fill="#4CAF50">A+</text>
</svg>`;

// ============================================================
// icon_v4.png: 필기체 "S"
// ============================================================
const svg_v4 = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="224" ry="224" fill="url(#bg)"/>
  <!-- 큰 S -->
  <text x="512" y="480" text-anchor="middle" dominant-baseline="central"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="550" font-style="italic" fill="white">S</text>
  <!-- 아래쪽 "쓰잉" -->
  <text x="512" y="760" text-anchor="middle" dominant-baseline="central"
        font-family="'Apple SD Gothic Neo', 'Helvetica Neue', Arial, sans-serif"
        font-size="100" fill="white" opacity="0.7">쓰잉</text>
</svg>`;

// ============================================================
// icon_v6.png: 글줄 + 체크마크
// ============================================================
const svg_v6 = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="224" ry="224" fill="url(#bg)"/>
  <!-- 세 줄의 수평선 -->
  <line x1="262" y1="300" x2="762" y2="300" stroke="white" stroke-width="20" stroke-linecap="round"/>
  <line x1="262" y1="420" x2="712" y2="420" stroke="white" stroke-width="20" stroke-linecap="round"/>
  <line x1="262" y1="540" x2="612" y2="540" stroke="white" stroke-width="20" stroke-linecap="round"/>
  <!-- 체크마크 (세번째 줄 오른쪽) -->
  <polyline points="660,540 710,600 790,470" fill="none" stroke="#4CAF50" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// ============================================================
// 실행
// ============================================================
console.log('Generating app icons...\n');

console.log('1/5: icon_v1.png (타이포 온리 - 쓰)');
createIcon(svg_v1, 'icon_v1.png');

console.log('2/5: icon_v2.png (말풍선 + 펜)');
createIcon(svg_v2, 'icon_v2.png');

console.log('3/5: icon_v3.png (A → A+)');
createIcon(svg_v3, 'icon_v3.png');

console.log('4/5: icon_v4.png (필기체 S)');
createIcon(svg_v4, 'icon_v4.png');

console.log('5/5: icon_v6.png (글줄 + 체크마크)');
createIcon(svg_v6, 'icon_v6.png');

console.log('\nDone! All icons generated in:', dir);
