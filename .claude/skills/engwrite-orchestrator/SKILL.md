---
name: engwrite-orchestrator
description: "영어 작문 학습 앱(EngWrite)의 전체 개발 파이프라인을 조율하는 오케스트레이터. UX 디자인 → 프론트엔드/백엔드 병렬 개발 → QA 검증까지 에이전트 팀을 구성하고 조율한다. '앱 만들어줘', '개발 시작', '앱 빌드', 'EngWrite 구축' 요청 시 사용."
---

# EngWrite Orchestrator — 영어 작문 앱 개발 파이프라인

영어 작문 학습 앱의 전체 개발을 조율하는 오케스트레이터. 에이전트 팀을 구성하여 디자인부터 QA까지 파이프라인을 실행한다.

## 실행 모드: 에이전트 팀

## 아키텍처: 파이프라인 + 팬아웃

```
Phase 1: [ux-designer] 와이어프레임 + 스타일 가이드
            ↓
Phase 2: [frontend-dev] ←→ [backend-dev]  (병렬, SendMessage로 API 계약 조율)
            ↓                   ↓
Phase 3: [qa-inspector] 통합 정합성 검증 (incremental: Phase 2 중에도 점진적 검증)
            ↓
Phase 4: 통합 + 최종 검증
```

## 에이전트 구성

| 팀원 | 에이전트 타입 | 역할 | 스킬 | 출력 |
|------|-------------|------|------|------|
| ux-designer | 커스텀 | UX/UI 설계 | app-design | `_workspace/01_ux_*.md` |
| frontend-dev | 커스텀 | 프론트엔드 구현 | frontend-build | `src/` |
| backend-dev | 커스텀 | 백엔드 API 구현 | backend-build | `server/` |
| qa-inspector | 커스텀 (general-purpose) | QA 검증 | qa-verify | `_workspace/04_qa_report.md` |

## 워크플로우

### Phase 1: 준비
1. 사용자 입력 분석 — 앱 기능 요구사항 확인
2. 작업 디렉토리에 `_workspace/` 생성
3. 요구사항을 `_workspace/00_requirements.md`에 저장

### Phase 2: 팀 구성 + UX 설계

1. 팀 생성:
   ```
   TeamCreate(
     team_name: "engwrite-team",
     members: [
       {
         name: "ux-designer",
         agent_type: "ux-designer",
         model: "opus",
         prompt: "영어 작문 학습 앱의 UX/UI를 설계하라. _workspace/00_requirements.md를 읽고, .claude/skills/app-design/SKILL.md의 가이드를 따라 와이어프레임과 스타일 가이드를 생성하라. references/benchmarking.md도 참조하라. 산출물: _workspace/01_ux_wireframe.md, _workspace/01_ux_style_guide.md. 완료 후 리더에게 알리고, frontend-dev와 backend-dev에게도 SendMessage로 알려라."
       },
       {
         name: "frontend-dev",
         agent_type: "frontend-dev",
         model: "opus",
         prompt: "영어 작문 학습 앱의 프론트엔드를 React Native + Expo로 구현하라. ux-designer의 와이어프레임(_workspace/01_ux_wireframe.md)과 스타일 가이드(_workspace/01_ux_style_guide.md)가 완성되면 작업을 시작하라. .claude/skills/frontend-build/SKILL.md의 가이드를 따라라. backend-dev와 API 계약을 SendMessage로 합의한 후 구현하라. 각 화면 완성 시 qa-inspector에게 알려라."
       },
       {
         name: "backend-dev",
         agent_type: "backend-dev",
         model: "opus",
         prompt: "영어 작문 학습 앱의 백엔드 API를 Node.js + Express + Prisma로 구현하라. .claude/skills/backend-build/SKILL.md의 가이드를 따라라. ux-designer의 데이터 구조 요구를 반영하고, frontend-dev와 API 계약(엔드포인트, 요청/응답 shape)을 SendMessage로 합의한 후 구현하라. API 명세를 _workspace/02_api_spec.md에 저장하라. 각 API 완성 시 qa-inspector에게 알려라."
       },
       {
         name: "qa-inspector",
         agent_type: "qa-inspector",
         model: "opus",
         prompt: "영어 작문 학습 앱의 품질을 검증하라. .claude/skills/qa-verify/SKILL.md의 가이드를 따라라. 각 모듈이 완성될 때마다 점진적으로 검증하라 (incremental QA). 특히 API 응답 shape ↔ 프론트 훅 타입의 경계면 교차 비교를 최우선으로 수행하라. 문제 발견 시 해당 에이전트에게 구체적 수정 지시(파일:라인 + 수정 방법)를 SendMessage로 전달하라. 최종 리포트를 _workspace/04_qa_report.md에 저장하라."
       }
     ]
   )
   ```

2. 작업 등록:
   ```
   TaskCreate(tasks: [
     { title: "UX 와이어프레임 설계", description: "벤치마킹 분석 + 화면별 와이어프레임 + 스타일 가이드 생성", assignee: "ux-designer" },
     { title: "API 계약 합의", description: "frontend-dev와 backend-dev가 엔드포인트, 요청/응답 shape을 합의", assignee: "backend-dev", depends_on: ["UX 와이어프레임 설계"] },
     { title: "DB 스키마 + Prisma 설정", description: "Prisma 스키마 생성 + 시드 데이터", assignee: "backend-dev", depends_on: ["UX 와이어프레임 설계"] },
     { title: "문장 조회 API 구현", description: "GET /sentences/daily, GET /sentences/:id", assignee: "backend-dev", depends_on: ["DB 스키마 + Prisma 설정"] },
     { title: "교정 API + LLM 연동", description: "POST /corrections + Claude API 프롬프트", assignee: "backend-dev", depends_on: ["DB 스키마 + Prisma 설정"] },
     { title: "학습 기록 API 구현", description: "GET/POST /history + 통계", assignee: "backend-dev", depends_on: ["DB 스키마 + Prisma 설정"] },
     { title: "인증 API 구현", description: "POST /auth/register, /auth/login + JWT", assignee: "backend-dev" },
     { title: "프로젝트 셋업", description: "Expo 프로젝트 초기화, 네비게이션, 상수", assignee: "frontend-dev", depends_on: ["UX 와이어프레임 설계"] },
     { title: "HomeScreen 구현", description: "테마 선택 화면", assignee: "frontend-dev", depends_on: ["프로젝트 셋업"] },
     { title: "PracticeScreen + 스와이프 구현", description: "문장 카드, 스와이프, 힌트, 작문 입력, 교정 결과", assignee: "frontend-dev", depends_on: ["프로젝트 셋업", "API 계약 합의"] },
     { title: "HistoryScreen 구현", description: "학습 기록 목록 + 상세", assignee: "frontend-dev", depends_on: ["프로젝트 셋업", "API 계약 합의"] },
     { title: "API 연동 훅 구현", description: "useDailySentences, useCorrection, useHistory 훅", assignee: "frontend-dev", depends_on: ["API 계약 합의"] },
     { title: "API ↔ 프론트 경계면 검증", description: "응답 shape과 훅 타입 교차 비교", assignee: "qa-inspector", depends_on: ["문장 조회 API 구현", "API 연동 훅 구현"] },
     { title: "핵심 플로우 통합 검증", description: "테마→문장→작문→교정→기록 전체 플로우", assignee: "qa-inspector", depends_on: ["교정 API + LLM 연동", "PracticeScreen + 스와이프 구현"] },
     { title: "UI 스펙 검증", description: "스타일 가이드 대비 코드 일치 확인", assignee: "qa-inspector", depends_on: ["HomeScreen 구현", "PracticeScreen + 스와이프 구현"] },
     { title: "최종 QA 리포트", description: "전체 통합 검증 + 리포트 생성", assignee: "qa-inspector", depends_on: ["API ↔ 프론트 경계면 검증", "핵심 플로우 통합 검증", "UI 스펙 검증"] }
   ])
   ```

### Phase 3: 개발 + 점진적 QA

**실행 방식:** 팀원들이 자체 조율

1. ux-designer가 와이어프레임/스타일 가이드 완성 → frontend-dev, backend-dev에게 알림
2. backend-dev가 frontend-dev에게 API 계약 제안 → 합의 후 병렬 개발 시작
3. 각 API/화면 완성 시 qa-inspector에게 알림 → 점진적 검증
4. qa-inspector가 경계면 불일치 발견 시 양쪽 에이전트에게 수정 요청
5. 수정 반영 후 qa-inspector가 재검증

**팀원 간 통신 규칙:**
- ux-designer → frontend-dev: 와이어프레임 완성 알림 + 컴포넌트 스펙
- ux-designer → backend-dev: 필요한 데이터 구조 (한글 문장, 힌트 단어 등)
- backend-dev ↔ frontend-dev: API 계약 합의 (엔드포인트, 요청/응답 shape)
- backend-dev → qa-inspector: 각 API 완성 알림
- frontend-dev → qa-inspector: 각 화면 완성 알림
- qa-inspector → frontend-dev: UI 버그, 타입 불일치 수정 요청
- qa-inspector → backend-dev: API 응답 shape 불일치 수정 요청

**산출물 저장:**

| 팀원 | 출력 경로 |
|------|----------|
| ux-designer | `_workspace/01_ux_wireframe.md`, `_workspace/01_ux_style_guide.md` |
| backend-dev | `server/`, `_workspace/02_api_spec.md` |
| frontend-dev | `src/`, `package.json`, `app.json` |
| qa-inspector | `_workspace/04_qa_report.md` |

**리더 모니터링:**
- 팀원이 유휴 상태가 되면 자동 알림 수신
- ux-designer 완료 후 frontend-dev/backend-dev가 작업 시작했는지 확인
- Phase 3 전체 소요 시간 모니터링 — 특정 팀원 지연 시 개입

### Phase 4: 통합 + 최종 검증
1. 모든 팀원 작업 완료 대기 (TaskGet으로 상태 확인)
2. qa-inspector의 최종 리포트 Read
3. FAIL 항목이 있으면 해당 에이전트에게 수정 요청 → 재검증 (최대 2회)
4. 최종 산출물 확인:
   - `src/` — 프론트엔드 전체 코드
   - `server/` — 백엔드 전체 코드
   - `_workspace/` — 설계 문서, API 명세, QA 리포트

### Phase 5: 정리
1. 팀원들에게 종료 요청 (SendMessage)
2. 팀 정리 (TeamDelete)
3. `_workspace/` 보존
4. 사용자에게 결과 요약 보고:
   - 생성된 화면 목록
   - API 엔드포인트 목록
   - QA 검증 결과 요약
   - 실행 방법 안내 (Expo, 서버 시작)

## 데이터 흐름

```
[리더] → TeamCreate → [ux-designer]
                           │
                    wireframe + style guide
                           │
              ┌────────────┼────────────┐
              ↓                         ↓
        [frontend-dev] ←SendMessage→ [backend-dev]
              │           API계약          │
              ↓                         ↓
           src/ 코드               server/ 코드
              │                         │
              └──────────┬──────────────┘
                         ↓
                   [qa-inspector]
                   (점진적 검증)
                         ↓
                  QA 리포트 + 수정 요청
                         ↓
                   [리더: 통합]
                         ↓
                    최종 산출물
```

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| ux-designer 실패 | 리더가 기본 와이어프레임을 직접 생성하고 진행 |
| frontend-dev 실패 | 리더가 SendMessage로 상태 확인 → 재시작 |
| backend-dev 실패 | 리더가 SendMessage로 상태 확인 → 재시작 |
| qa-inspector 실패 | 리더가 직접 기본 정합성 검증 수행 |
| 팀원 과반 실패 | 사용자에게 알리고 진행 여부 확인 |
| API 계약 불일치 | qa-inspector가 양쪽에 수정 요청, 최대 2회 반복 |
| LLM API 키 미설정 | 사용자에게 ANTHROPIC_API_KEY 설정 안내 |

## 테스트 시나리오

### 정상 흐름
1. 사용자가 "영어 작문 앱 만들어줘" 요청
2. Phase 1: 요구사항 정리 → `_workspace/00_requirements.md`
3. Phase 2: 팀 구성 (4명 + 16개 작업)
4. Phase 3:
   - ux-designer: 와이어프레임 + 스타일 가이드 (10~15분)
   - frontend-dev + backend-dev: 병렬 개발, API 계약 합의 (20~30분)
   - qa-inspector: 점진적 검증 (개발과 병행)
5. Phase 4: 최종 QA 리포트 — 모든 항목 PASS
6. Phase 5: 팀 정리, 결과 보고
7. 예상 결과: `src/` + `server/` + `_workspace/` 생성

### 에러 흐름
1. Phase 3에서 qa-inspector가 API 응답 shape 불일치 발견
2. backend-dev에게 수정 요청: "GET /sentences/daily 응답이 { sentences: [] }인데 프론트 훅은 { data: [] } 기대"
3. backend-dev가 응답 형식을 { data: [] }로 수정
4. qa-inspector 재검증 → PASS
5. 최종 QA 리포트에 "1차 검증 FAIL → 수정 후 PASS" 이력 기록
