---
name: qa-verify
description: "영어 작문 학습 앱의 품질을 검증하는 스킬. API↔프론트 통합 정합성 교차 비교, UX 스펙 준수 확인, 핵심 플로우 검증, 경계면 버그 탐지를 수행한다. 'QA', '테스트', '검증', '품질 확인' 요청 시 사용."
---

# QA Verify — 통합 품질 검증

영어 작문 학습 앱의 통합 정합성과 기능 품질을 검증한다.

## 검증 수행 순서

### Step 1: API ↔ 프론트엔드 경계면 교차 비교

가장 중요한 검증. 양쪽 코드를 동시에 열어 비교한다.

**1-1. 문장 조회 API**
- `server/src/routes/sentences.ts`의 GET /daily 응답 shape
- `src/hooks/useDailySentences.ts`의 기대 타입
- 확인: 응답이 `{ data: Sentence[] }` 형태인지, 훅이 `.data`를 unwrap하는지

**1-2. 교정 API**
- `server/src/routes/corrections.ts`의 POST 응답 shape
- `src/hooks/useCorrection.ts`의 기대 타입
- `src/components/CorrectionResult.tsx`의 props
- 확인: `correctedSentence`, `explanation`, `score`, `highlights` 필드명 일치

**1-3. 학습 기록 API**
- `server/src/routes/history.ts`의 GET 응답 (pagination 포함)
- `src/hooks/useHistory.ts`의 기대 타입
- `src/app/history.tsx`의 렌더링 로직
- 확인: pagination 객체 shape, 빈 목록 처리

**1-4. 데이터 변환 일관성**
- Prisma 스키마 필드명 (snake_case)
- API 응답 필드명 (camelCase로 변환되었는지)
- 프론트 타입 정의 필드명
- 특히: `hintWords` / `hint_words`, `correctedSentence` / `corrected_sentence`

### Step 2: 핵심 플로우 검증

코드 추적으로 전체 데이터 흐름을 검증한다:

```
[HomeScreen] 테마 선택
  → [API] GET /sentences/daily?theme=daily
  → [PracticeScreen] 3개 문장 + 힌트 표시
  → [SwipeableCards] 스와이프로 문장 전환
  → [WritingInput] 사용자 작문 입력
  → [API] POST /corrections { sentenceId, userWriting, theme }
  → [LLM Service] Claude API 호출
  → [CorrectionResult] 교정 결과 표시
  → [API] 기록 자동 저장
  → [HistoryScreen] 기록 목록에 반영
```

각 전환점에서 데이터 shape이 일관되는지 추적한다.

### Step 3: UI 스펙 검증

`_workspace/01_ux_style_guide.md`의 스펙과 실제 코드를 비교:
- 색상 코드가 `constants/colors.ts`에 정확히 정의되었는지
- 폰트 크기/웨이트가 `constants/typography.ts`에 맞는지
- 카드 padding, border-radius, 섹션 간 간격
- 스와이프 threshold, 애니메이션 duration

### Step 4: 엣지 케이스 검증

- 빈 작문 입력으로 교정 요청 시 처리 (10자 미만 비활성화)
- 매우 긴 작문 입력 (500자 이상) 처리
- LLM API 타임아웃/에러 시 프론트 에러 표시
- 오프라인 상태에서 앱 동작
- 하루 3문장 모두 완료 후 UI 상태

## 리포트 형식

```markdown
# QA 검증 리포트

## 통합 정합성
| 항목 | 상태 | 세부 |
|------|------|------|
| 문장 조회 API ↔ 훅 | PASS/FAIL | [구체적 설명] |
| 교정 API ↔ 컴포넌트 | PASS/FAIL | [구체적 설명] |
| ...

## 핵심 플로우
| 플로우 | 상태 | 세부 |
|--------|------|------|
| 테마→문장→작문→교정 | PASS/FAIL | ... |
| ...

## UI 스펙
| 항목 | 상태 | 세부 |
|------|------|------|
| 색상 팔레트 | PASS/FAIL | ... |
| ...

## 발견 사항
### FAIL 항목 수정 지시
1. [파일:라인] 현재값 → 수정값, 이유
2. ...

### WARNING
1. ...
```

## 산출물

`_workspace/04_qa_report.md`에 검증 리포트를 저장한다.
