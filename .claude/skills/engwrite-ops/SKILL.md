---
name: engwrite-ops
description: "EngWrite 영어 작문 앱의 운영/개선 에이전트 팀을 조율하는 오케스트레이터. 콘텐츠 검토, 게이미피케이션 개선, 기능 구현, 안정성 점검을 조율한다. '앱 개선', '앱 점검', '운영 팀 실행', '품질 개선', '기능 추가해줘', '버그 고쳐', '콘텐츠 추가' 요청 시 사용."
---

# EngWrite Ops — 운영/개선 오케스트레이터

EngWrite 앱의 지속적 개선과 안정적 운영을 조율하는 에이전트 팀 오케스트레이터.

## 실행 모드: 에이전트 팀

## 아키텍처: 팬아웃/팬인 + 생성-검증

```
[리더]
  ├── content-expert ←→ fullstack-dev (콘텐츠 개선 → 구현)
  ├── gamification-designer ←→ fullstack-dev (설계 → 구현)
  └── stability-inspector ←→ 전체 (검증 → 수정 요청)
```

## 에이전트 구성

| 팀원 | 에이전트 타입 | 역할 | 스킬 |
|------|-------------|------|------|
| content-expert | 커스텀 | 문장 DB + LLM 프롬프트 | content-review |
| gamification-designer | 커스텀 | 리텐션 + 보상 시스템 | gamification-improve |
| fullstack-dev | 커스텀 | 프론트/백엔드 구현 | app-develop |
| stability-inspector | 커스텀 (general-purpose) | QA + 경계면 검증 | stability-check |

## 워크플로우

### Phase 1: 준비
1. 사용자 요청 분석 — 개선/버그/추가 중 어떤 유형인지 파악
2. `_workspace/` 확인 (이전 리포트 참조)
3. 요청을 작업 항목으로 분해

### Phase 2: 팀 구성

```
TeamCreate(
  team_name: "engwrite-ops-team",
  members: [
    { name: "content-expert", agent_type: "content-expert", model: "opus",
      prompt: "EngWrite 앱의 콘텐츠를 점검하고 개선하라. .claude/skills/content-review/SKILL.md를 읽고 따라라. [구체적 작업 지시]" },
    { name: "gamification-designer", agent_type: "gamification-designer", model: "opus",
      prompt: "EngWrite 앱의 게이미피케이션을 분석하고 개선안을 제시하라. .claude/skills/gamification-improve/SKILL.md를 읽고 따라라. [구체적 작업 지시]" },
    { name: "fullstack-dev", agent_type: "fullstack-dev", model: "opus",
      prompt: "다른 에이전트의 설계안을 받아 구현하고, 발견된 버그를 수정하라. .claude/skills/app-develop/SKILL.md를 읽고 따라라. [구체적 작업 지시]" },
    { name: "stability-inspector", agent_type: "stability-inspector", model: "opus",
      prompt: "EngWrite 앱의 안정성을 종합 점검하라. .claude/skills/stability-check/SKILL.md를 읽고 따라라. 각 에이전트의 작업이 완료되면 점진적으로 검증하라." }
  ]
)
```

### Phase 3: 병렬 작업 + 점진적 검증

**팀원 간 통신 규칙:**
- content-expert → fullstack-dev: 프롬프트/문장 변경 시 구현 요청
- gamification-designer → fullstack-dev: 새 기능 스펙 전달
- fullstack-dev → stability-inspector: 구현 완료 알림
- stability-inspector → fullstack-dev: 버그/불일치 발견 시 수정 요청
- stability-inspector → content-expert: 교정 품질 이슈 전달

**산출물 경로:**

| 팀원 | 출력 |
|------|------|
| content-expert | `_workspace/content_report.md`, seed-sentences.json |
| gamification-designer | `_workspace/gamification_proposal.md` |
| fullstack-dev | `src/`, `server/` 소스 코드 |
| stability-inspector | `_workspace/stability_report.md` |

### Phase 4: 통합 검증
1. stability-inspector의 최종 리포트 확인
2. FAIL 항목이 있으면 해당 에이전트에게 수정 요청 (최대 2회)
3. 서버 재시작: `cd server && rm -f prisma/dev.db && npx prisma migrate dev && npm run dev`
4. Expo 재시작: `npx expo start --web --clear`

### Phase 5: 정리
1. 팀원 종료 (SendMessage shutdown_request)
2. TeamDelete
3. 사용자에게 결과 요약

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| 팀원 실패 | SendMessage로 상태 확인 → 재시작 |
| DB 마이그레이션 실패 | dev.db 삭제 후 재생성 |
| Expo 번들 실패 | 캐시 클리어 후 재시작 |
| LLM 호출 실패 | haiku 모델 사용, timeout 20초 |
| 경계면 불일치 | 양쪽 에이전트 모두에게 알림 |

## 테스트 시나리오

### 정상 흐름
1. 사용자가 "앱 전체 점검하고 개선해줘" 요청
2. 4명 팀 구성, 병렬 작업
3. content-expert: 문장 20개 추가, 프롬프트 개선
4. gamification-designer: 새 업적 3개 제안
5. fullstack-dev: 제안된 기능 구현
6. stability-inspector: 전체 검증 PASS
7. 결과 요약 보고

### 에러 흐름
1. stability-inspector가 API 응답 shape 불일치 발견
2. fullstack-dev에게 수정 요청
3. fullstack-dev가 수정
4. stability-inspector 재검증 → PASS
