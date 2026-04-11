---
name: stability-check
description: "EngWrite 앱의 안정성을 종합 점검하는 스킬. API↔프론트 경계면 교차 비교, 웹 호환성 검증, 런타임 에러 탐지, 게이미피케이션 로직 정합성, 엣지 케이스 검증을 수행한다. 'QA', '안정성 점검', '에러 확인', '버그 찾기', '테스트', '점검' 요청 시 사용."
---

# Stability Check — 앱 안정성 종합 점검

EngWrite 앱의 안정성을 체계적으로 검증한다.

## 점검 순서

### Step 1: 경계면 교차 비교 (최우선)
양쪽 코드를 동시에 열어 비교:

1. **API 응답 ↔ 프론트 타입**
   - server/src/routes/*.ts의 res.json() shape
   - src/hooks/use*.ts의 기대 타입
   - 특히: gamification, review, corrections API

2. **DB 스키마 ↔ API 변환**
   - prisma/schema.prisma 필드명 (snake_case)
   - API 응답 필드명 (camelCase)
   - 변환 누락 없는지

3. **백엔드 타입 ↔ 프론트 타입**
   - server/src/types/index.ts
   - src/types/index.ts
   - 동일한 인터페이스가 양쪽에서 일치하는지

### Step 2: 웹 호환성
- `grep -r "GestureDetector\|Gesture\.Pan" src/` → 0건이어야 함
- `grep -r "SecureStore" src/` → Platform 분기 확인
- reanimated: entering/exiting만 사용, useSharedValue는 웹에서 주의

### Step 3: 핵심 플로우 코드 추적
데이터 흐름을 코드로 추적:
```
HomeScreen → 테마 선택 → API /sentences/daily → PracticeScreen
→ 작문 입력 → API /corrections → CorrectionResult
→ XP/업적 처리 → gamification 업데이트
```

### Step 4: 게이미피케이션 정합성
- XP 계산: 백엔드 calculateXP()와 프론트 표시가 일치
- 레벨 공식: calculateLevel()이 올바르게 동작
- 스트릭: 날짜 변경 시 올바르게 증가/리셋
- 업적: 모든 11개 타입이 실제로 트리거 가능

### Step 5: 엣지 케이스
- 빈 작문 제출 (10자 미만 비활성화 확인)
- LLM 응답 실패 시 에러 처리
- 문장 DB가 빈 카테고리일 때 fallback
- 동일 문장 중복 교정 방지

## 리포트 형식
`_workspace/stability_report.md`:
```
# 안정성 점검 리포트
| 항목 | 상태 | 세부 |
|------|------|------|
| API↔프론트 정합성 | PASS/FAIL | ... |
| 웹 호환성 | PASS/FAIL | ... |
...

## FAIL 항목 수정 지시
1. [파일:라인] 현재값 → 수정값
```
