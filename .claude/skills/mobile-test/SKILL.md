---
name: mobile-test
description: "쓰잉 앱의 런타임 에러 탐지, 화면별 기능 검증, API 경계면 비교, 크래시 분석을 수행하는 스킬. 모든 화면과 사용자 플로우를 점검하고 버그를 수정한다. '테스트', 'QA', '앱 점검', '크래시', '에러 확인', '버그 찾기', '동작 확인', '앱 검증' 요청 시 사용."
---

# Mobile Test — 앱 QA & 버그 수정

쓰잉 앱의 런타임 에러 탐지, 화면별 검증, API 경계면 비교를 수행한다.

## 점검 워크플로우

### Step 1: TypeScript 컴파일 점검
```bash
cd /Users/jj/Documents/하네스설치
npx tsc --noEmit 2>&1
```
에러가 있으면 모두 수정한다.

### Step 2: undefined/null 크래시 패턴 탐지

모든 src/ 파일에서 다음 패턴을 검색하고, 가드가 없으면 추가:
- `변수.filter(` → `(변수 || []).filter(`
- `변수.map(` → `(변수 || []).map(`
- `변수.length` → `(변수 || []).length`
- `변수.sort(` → `(변수 || []).sort(`
- `변수.reduce(` → `(변수 || []).reduce(`
- `객체.속성` → `객체?.속성`

### Step 3: 훅 초기값 점검

src/hooks/ 의 모든 훅에서 useState 초기값 확인:
- 배열 데이터 → `useState<Type[]>([])` (undefined가 아닌 빈 배열)
- 객체 데이터 → `useState<Type | null>(null)`
- 숫자 → `useState(0)`
- API 응답에서 `res.data.data ?? []` 폴백 적용

### Step 4: API 경계면 비교

프론트엔드 타입(src/types/)과 백엔드 응답(server/src/routes/)을 교차 비교:
- 프론트가 기대하는 필드가 백엔드에 있는지
- 필드 타입이 일치하는지 (string vs number 등)
- 에러 응답 구조가 프론트의 catch 로직과 맞는지

### Step 5: 화면별 기능 검증

| 화면 | 검증 항목 |
|------|---------|
| 홈 (index.tsx) | 테마 선택, 난이도 전환, 통계 로드, 스트릭 표시 |
| 작문 (practice/[theme].tsx) | 문장 로드, 난이도별 필터, 작문 입력, 제출, 교정 결과 |
| 복습 (review.tsx) | 약점 문장 로드, 재도전, 이전 점수 비교 |
| 업적 (achievements.tsx) | 업적 목록 로드, 달성/미달성 표시 |
| 기록 (history/) | 교정 기록 로드, 상세 보기 |
| 주간 리포트 (weekly.tsx) | 리포트 데이터 로드, 차트 표시 |

### Step 6: 웹 호환성

Expo 웹 모드에서 문제가 되는 코드:
- `expo-secure-store` → 웹에서 localStorage로 폴백 필요
- `react-native-reanimated` → 웹 호환 확인
- `Platform.OS` 분기 처리 확인

## 산출물

수정한 파일 목록과 변경 내용을 정리하고, 발견된 모든 버그의 심각도를 분류한다:
- **Critical**: 앱 크래시 유발
- **High**: 기능 동작 불가
- **Medium**: UX 이슈
- **Low**: 개선 사항
