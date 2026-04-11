# QA 검증 리포트

> 검증일: 2026-04-04 (3차 최종 검증)
> 검증 대상: Backend API + Frontend (React Native/Expo)

---

## 1. 통합 정합성 (API <-> Frontend)

| 항목 | 상태 | 세부 |
|------|------|------|
| 문장 조회 API <-> useDailySentences 훅 | **PASS** | GET /sentences/daily 응답 `{ data: Sentence[] }`, 훅에서 `res.data.data`로 unwrap. 필드명 일치: `id`, `koreanText`, `theme`, `difficulty`, `hintWords`, `order`, `isCompleted` |
| 교정 API <-> useCorrection 훅 | **PASS** | POST /corrections 응답 `{ data: CorrectionResult }`, 훅에서 `res.data.data as CorrectionResult`. 필드명 일치: `id`, `sentenceId`, `userWriting`, `correctedSentence`, `explanation`, `score`, `highlights`, `createdAt` |
| 교정 결과 <-> CorrectionResult 컴포넌트 | **PASS** | 컴포넌트가 `result.correctedSentence`, `result.score`, `result.highlights`, `result.explanation` 모두 올바르게 접근 |
| 학습 기록 API <-> useHistory 훅 | **PASS** | GET /history 응답 `{ data: HistoryRecord[], pagination }`, 훅에서 page 1은 교체, page 2+는 append. pagination 분리 정상 |
| 기록 상세 API <-> HistoryDetail 타입 | **PASS** | GET /history/:id 응답에 `explanation`, `highlights` 포함. `HistoryDetail extends HistoryRecord` 구조와 일치 |
| 통계 API <-> HomeScreen | **PASS** | GET /history/stats 응답 `{ data: LearningStats }`, HomeScreen에서 `streakDays`, `totalCorrections`, `averageScore` 올바르게 사용 |
| snake_case(DB) -> camelCase(API) 변환 | **PASS** | 모든 라우트에서 `korean_text` -> `koreanText`, `hint_words` -> `hintWords`, `user_writing` -> `userWriting`, `corrected_sentence` -> `correctedSentence`, `sentence_id` -> `sentenceId`, `created_at` -> `createdAt` 변환 일관됨 |
| 에러 응답 형식 | **PASS** | 서버: `{ error: { code, message } }` 형식. 프론트 api.ts 인터셉터: `error.response?.data?.error?.message` 올바르게 추출 |
| HintWord 타입 일치 | **PASS** | 서버 `HintWord { english, korean }` = 프론트 `HintWord { english, korean }` |
| Highlight 타입 일치 | **PASS** | 서버 `CorrectionHighlight { original, corrected, reason }` = 프론트 `Highlight { original, corrected, reason }` (이름만 다르고 shape 동일) |

## 2. 핵심 플로우

| 플로우 | 상태 | 세부 |
|--------|------|------|
| 테마 선택 -> 문장 로드 | **PASS** | HomeScreen에서 `router.push('/practice/${theme}')`, PracticeScreen에서 `useLocalSearchParams<{ theme }>` 수신 후 `fetchSentences(theme)` 호출 |
| 문장 표시 + 힌트 접기/펼치기 | **PASS** | SentenceCard -> HintWords 컴포넌트 체인, `expanded` 상태 + LayoutAnimation |
| 스와이프 전환 + dot indicator | **PASS** | SwipeableCards에 `totalCount` prop 전달, `Array.from({ length: totalCount })` 기반 dots 렌더링. 3개 dot 정상 표시 |
| 작문 입력 -> 교정 요청 | **PASS** | WritingInput에서 MIN_CHARS=10 체크, handleSubmit -> `submit(sentenceId, userWriting)` -> POST /corrections |
| LLM 교정 결과 표시 | **PASS** | 서버에서 Claude API 호출 -> JSON 파싱 -> 응답, CorrectionResult 컴포넌트에서 점수/교정문장/하이라이트/설명 표시 |
| 교정 결과 자동 저장 | **PASS** | corrections.ts에서 `prisma.correction.create()` 후 즉시 응답, 별도 저장 단계 불필요 |
| 기록 조회 + 무한 스크롤 | **PASS** | useHistory에서 `page === 1 ? newRecords : [...prev, ...newRecords]` 처리. FlatList onEndReached로 다음 페이지 append |
| 기록 상세 조회 | **PASS** | `router.push('/history/${item.id}')` -> HistoryDetailScreen -> `fetchDetail(id)` -> GET /history/:id |
| 하루 3문장 제한 | **PASS** | sentenceSelector.ts `DAILY_COUNT = 3`, DailySentence 모델 `@@unique([user_id, date, order])` 제약 |
| 일상/비지니스 테마 전환 | **PASS** | getDailySentences에서 theme으로 필터링, HomeScreen에서 두 테마 각각 별도 hook 인스턴스로 로드 |
| 3문장 완료 -> 축하 모달 | **PASS** | PracticeScreen에서 `completedCount >= sentences.length` 시 CompletionModal 표시, 평균 점수 계산 포함 |

## 3. UI 스펙 (요구사항 기반)

| 항목 | 상태 | 세부 |
|------|------|------|
| 색상 팔레트 | **PASS** | Primary #4A90D9, Secondary #7C4DFF, Success #4CAF50, Warning #FF9800, Error #F44336, Background #FAFBFC, Card #FFFFFF -- colors.ts에 정확히 정의. 추가 semantic colors 확장됨 |
| 타이포그래피 체계 | **PASS** | h1(28/700), h2(22/700), h3(18/600), body(16/400), bodyBold(16/600), caption(13/400), button(16/600), score(48/800) |
| 카드 UI 디자인 | **PASS** | borderRadius: 20, padding: 24, shadow 적용 |
| 스와이프 threshold | **PASS** | SCREEN_WIDTH * 0.4 (40%), spring config damping: 20, stiffness: 200 |
| 키보드 회피 | **PASS** | WritingInput에서 `KeyboardAvoidingView` 사용, iOS: 'padding', Android: 'height' |
| 점수 시각화 | **PASS** | ScoreDisplay에서 원형 테두리 + 색상 분기 + 카운트업 애니메이션 |
| 빈 목록 UI | **PASS** | HistoryScreen에서 `ListEmptyComponent` 구현 |
| 진행률 표시 | **PASS** | ThemeCard progressBar + PracticeScreen 상단 progress bar |
| 학습 완료 축하 UI | **PASS** | CompletionModal -- 축하 이모지 + 평균 점수 + streak |
| 학습 통계 표시 | **PASS** | HomeScreen streak 배지 + 총 교정 수 / 평균 점수 카드 |
| Dot indicator | **PASS** | SwipeableCards에서 totalCount 기반 3개 dot 정상 렌더링 |

## 4. 엣지 케이스

| 항목 | 상태 | 세부 |
|------|------|------|
| 빈 작문 입력 방지 | **PASS** | WritingInput: MIN_CHARS=10 |
| 긴 작문 입력 제한 | **PASS** | Zod: max(1000), WritingInput: maxHeight: 150 |
| LLM API 에러 처리 | **PASS** | MAX_RETRIES=2, AppError(502), 프론트 재시도 버튼 |
| 네트워크 에러 처리 | **PASS** | api.ts 인터셉터 에러 메시지 추출 |
| 401 토큰 만료 처리 | **PASS** | 401 시 토큰 삭제 |
| 3문장 완료 후 UI | **PASS** | CompletionModal 표시 |
| 이미 교정된 문장 재작문 방지 | **PASS** | `disabled={!!currentCorrection}` |
| 교정 요청 중복 방지 | **PASS** | loading 상태 비활성화 |
| 무한 스크롤 데이터 누적 | **PASS** | page 1 교체, page 2+ append |

## 5. 발견 사항

### FAIL 항목

**없음**

### WARNING 항목

1. **[낮은 우선순위] useSwipe.ts -- useCallback + worklet 혼용**
   - 파일: `src/hooks/useSwipe.ts:26-28`
   - `handleGestureEnd`가 `useCallback` + `'worklet'` 지시자 동시 사용
   - 현재 동작에는 문제 없으나, 코드 명확성을 위해 정리 권장

### 검증 이력

| 차수 | 날짜 | 결과 | 비고 |
|------|------|------|------|
| 1차 | 2026-04-04 | PASS (WARNING 6) | 초기 검증 |
| 2차 | 2026-04-04 | PASS (WARNING 3) | CompletionModal 추가, HomeScreen 개선 후 |
| 3차 | 2026-04-04 | PASS (WARNING 1) | useHistory append + SwipeableCards dots 수정 후 |

---

## 6. 종합 요약

| 카테고리 | PASS | FAIL | WARNING |
|----------|------|------|---------|
| 통합 정합성 | 10 | 0 | 0 |
| 핵심 플로우 | 11 | 0 | 0 |
| UI 스펙 | 11 | 0 | 0 |
| 엣지 케이스 | 9 | 0 | 0 |

**전체 결과: PASS (WARNING 1건, FAIL 0건)**

모든 핵심 통합 경계면이 올바르게 매칭되었습니다. API 응답 shape과 프론트엔드 타입 정합성, snake_case -> camelCase 변환, 에러 처리 프로토콜 모두 완벽합니다. 1차 검증에서 발견된 6건의 WARNING 중 5건이 해결되었으며, 남은 1건(useSwipe worklet 혼용)은 동작에 영향을 주지 않는 코드 스타일 이슈입니다. 출시 가능한 상태입니다.
