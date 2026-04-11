---
name: appstore-design
description: "EngWrite 앱의 앱스토어 비주얼 에셋을 코드로 생성하는 스킬. 앱 아이콘(1024x1024), 스크린샷(6.7인치/6.5인치 최소 3장), 스플래시 화면을 SVG→PNG 파이프라인으로 만든다. '아이콘 디자인', '스크린샷', '앱스토어 이미지', '비주얼 에셋', '앱 디자인' 요청 시 사용."
---

# App Store Design — 앱스토어 비주얼 에셋 생성

EngWrite 앱의 App Store 제출에 필요한 모든 이미지를 코드(SVG→PNG)로 생성한다.

## 이미지 생성 파이프라인

외부 디자인 도구 없이 macOS 기본 도구만으로 이미지를 만든다:

```
Node.js (SVG 문자열 생성)
  → fs.writeFileSync (SVG 파일 저장)
  → qlmanage -t -s {size} -o {dir} {file} (PNG 변환)
  → sips (리사이즈/크롭 후처리)
```

**주의:** qlmanage는 정사각형으로 렌더링한다. 세로형 이미지는 정사각형 SVG 내에 세로 레이아웃으로 디자인하거나, 큰 정사각형 생성 후 sips --cropToHeightWidth로 크롭한다.

## 디자인 시스템

기존 앱 스타일 가이드를 따른다. 작업 전 반드시 `_workspace/01_ux_style_guide.md`를 읽는다.

**기본 색상 (스타일 가이드에서 가져옴):**
- Primary Gradient: #4F46E5 → #7C3AED (인디고→바이올렛)
- Background: #FAFBFC
- Text: #1A1A2E
- White: #FFFFFF

**폰트 (SVG에서 사용):**
- 한글: "Apple SD Gothic Neo", "Malgun Gothic", sans-serif
- 영어: "SF Pro Display", "Helvetica Neue", Arial, sans-serif

## 워크플로우

### Step 1: 앱 컨셉 확인

1. appstore-planner의 앱 이름/컨셉 확인 (SendMessage 또는 `_workspace/08_appstore_metadata.md`)
2. `_workspace/01_ux_style_guide.md` 읽기
3. 기존 에셋 확인: `assets/` 디렉토리

### Step 2: 앱 아이콘 (1024x1024)

**디자인 원칙:**
- 단순한 심볼 1개 + 그라데이션 배경
- 텍스트는 최소화 (16px 축소 시 안 보임)
- SVG에서 rx/ry로 둥근 모서리를 넣지 않는다 — iOS가 자동 적용
- 후보 2~3개를 만들어 리더에게 선택 요청

**생성 스크립트 패턴:**
```javascript
const iconSVG = `<svg width="1024" height="1024" ...>
  <defs><linearGradient id="bg">...</linearGradient></defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <!-- 심볼 -->
</svg>`;
fs.writeFileSync('assets/icon.svg', iconSVG);
execSync('qlmanage -t -s 1024 -o assets/ assets/icon.svg 2>/dev/null');
// 출력 파일명 정리
```

### Step 3: 앱스토어 스크린샷 (최소 3장)

**규격:**
| 디바이스 | 해상도 |
|---------|--------|
| iPhone 6.7" | 1290 x 2796 |
| iPhone 6.5" | 1284 x 2778 |

**스크린샷 구성 (5장 권장):**

| # | 내용 | 설명 텍스트 예시 |
|---|------|----------------|
| 1 | 홈 화면 | "하루 3문장으로 영어 작문 실력 UP" |
| 2 | 작문 입력 화면 | "한글 문장을 보고 영어로 써보세요" |
| 3 | AI 교정 결과 | "AI가 원어민 표현으로 교정해줍니다" |
| 4 | 힌트 기능 | "모르는 단어는 힌트로 확인하세요" |
| 5 | 학습 기록/업적 | "매일 쌓이는 학습 기록과 업적" |

**스크린샷 레이아웃:**
```
┌──────────────────────┐
│   배경 그라데이션      │
│                      │
│  "설명 텍스트"        │  ← 상단 25%: 굵은 한글 텍스트
│  "부가 설명"          │
│                      │
│  ┌────────────────┐  │
│  │                │  │
│  │  앱 화면 목업   │  │  ← 하단 70%: 앱 UI 재현
│  │  (둥근 모서리)  │  │
│  │                │  │
│  │                │  │
│  │                │  │
│  └────────────────┘  │
│                      │
└──────────────────────┘
```

**목업 생성 방식:** 실제 앱 화면을 SVG로 재현한다. `src/` 코드를 읽고 실제 UI 요소(카드, 버튼, 텍스트)를 SVG 도형으로 그린다.

### Step 4: 스플래시 화면

- 1024x1024 PNG (Expo가 자동 리사이즈)
- 앱 아이콘과 동일한 심볼 + 앱 이름 텍스트
- 배경색은 app.json의 splash.backgroundColor과 일치

### Step 5: 생성 & 검증

1. `assets/scripts/generate-all.js`에 전체 생성 스크립트 저장 (재생성 가능)
2. `node assets/scripts/generate-all.js` 실행
3. `sips -g pixelWidth -g pixelHeight`로 모든 이미지 규격 검증
4. Read 도구로 생성된 이미지 시각적 확인

## 산출물

| 파일 | 규격 | 용도 |
|------|------|------|
| `assets/icon.png` | 1024x1024 | 앱스토어 아이콘 |
| `assets/splash.png` | 1024x1024 | Expo 스플래시 화면 |
| `assets/screenshots/screenshot_01.png` | 1290x2796 | 앱스토어 스크린샷 |
| `assets/screenshots/screenshot_02.png` | 1290x2796 | 앱스토어 스크린샷 |
| `assets/screenshots/screenshot_03.png` | 1290x2796 | 앱스토어 스크린샷 |
| `assets/screenshots/screenshot_04.png` | 1290x2796 | 앱스토어 스크린샷 (선택) |
| `assets/screenshots/screenshot_05.png` | 1290x2796 | 앱스토어 스크린샷 (선택) |
| `assets/scripts/generate-all.js` | - | 재생성 스크립트 |
