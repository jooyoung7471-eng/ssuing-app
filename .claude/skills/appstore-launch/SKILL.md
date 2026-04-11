---
name: appstore-launch
description: "EngWrite 앱의 앱스토어 출시를 위한 기획+디자인 에이전트 팀을 조율하는 오케스트레이터. 앱 이름/컨셉 기획 → 비주얼 에셋 디자인까지 순서대로 실행한다. '앱스토어 출시 준비', '출시 기획', '앱스토어 준비해줘', '스토어 등록 준비' 요청 시 사용."
---

# App Store Launch — 앱스토어 출시 준비 오케스트레이터

EngWrite 앱의 앱스토어 제출에 필요한 모든 메타데이터와 비주얼 에셋을 준비하는 에이전트 팀 오케스트레이터.

## 실행 모드: 서브 에이전트

기획 → 디자인 순서 의존성이 있으므로 파이프라인 패턴을 사용한다. 에이전트 간 직접 통신보다 결과 전달이 중요하므로 서브 에이전트 모드가 적합하다.

## 아키텍처: 파이프라인

```
[오케스트레이터]
  ├── Phase 1: appstore-planner (기획)
  │     └── 산출물: _workspace/08_appstore_metadata.md
  │                 _workspace/08_privacy_policy.md
  │
  ├── (사용자 확인: 앱 이름 선택)
  │
  └── Phase 2: appstore-designer (디자인)
        └── 산출물: assets/icon.png
                    assets/splash.png
                    assets/screenshots/*.png
```

## 워크플로우

### Phase 1: 기획 에이전트 실행

```
Agent(
  description: "앱스토어 메타데이터 기획",
  subagent_type: "appstore-planner",
  model: "opus",
  prompt: "EngWrite 영어 작문 학습 앱의 앱스토어 메타데이터를 기획하라. 
  .claude/skills/appstore-plan/SKILL.md를 읽고 워크플로우를 따라라.
  앱 이름 후보 3개, 부제목, 설명문, 키워드, 카테고리, 개인정보 처리방침을 생성하라.
  결과를 _workspace/08_appstore_metadata.md와 _workspace/08_privacy_policy.md에 저장하라."
)
```

### Phase 1.5: 사용자 확인

기획 결과를 사용자에게 보여주고 확인받는다:
1. 앱 이름 후보 3개 중 선택
2. 앱 설명문 검토
3. 키워드 검토

### Phase 2: 디자인 에이전트 실행

```
Agent(
  description: "앱스토어 비주얼 에셋 생성",
  subagent_type: "appstore-designer",
  model: "opus",
  prompt: "EngWrite 영어 작문 학습 앱의 앱스토어 비주얼 에셋을 생성하라.
  .claude/skills/appstore-design/SKILL.md를 읽고 워크플로우를 따라라.
  _workspace/08_appstore_metadata.md에서 확정된 앱 이름과 컨셉을 확인하라.
  앱 아이콘, 스플래시 화면, 스크린샷 5장을 생성하라."
)
```

### Phase 3: 통합 검증

1. 모든 이미지 규격 검증 (`sips -g pixelWidth -g pixelHeight`)
2. 메타데이터 글자 수 검증 (앱 이름 30자, 부제목 30자, 키워드 100자, 설명 4000자)
3. app.json의 icon/splash 경로가 올바른지 확인
4. 사용자에게 최종 결과 요약

## 산출물 전체 목록

| 카테고리 | 파일 | 설명 |
|---------|------|------|
| 기획 | `_workspace/08_appstore_metadata.md` | 앱 이름, 부제목, 설명문, 키워드, 카테고리, 등급 |
| 기획 | `_workspace/08_privacy_policy.md` | 개인정보 처리방침 |
| 디자인 | `assets/icon.png` | 앱 아이콘 1024x1024 |
| 디자인 | `assets/splash.png` | 스플래시 화면 |
| 디자인 | `assets/screenshots/*.png` | 앱스토어 스크린샷 3~5장 |
| 디자인 | `assets/scripts/generate-all.js` | 에셋 재생성 스크립트 |

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| 기획 에이전트 실패 | 1회 재실행, 재실패 시 기본 메타데이터로 진행 |
| 디자인 에이전트 이미지 생성 실패 | qlmanage 대신 sips 대체 경로 시도 |
| 사용자가 앱 이름 모두 거부 | 추가 후보 3개 재생성 |
| 스크린샷 규격 불일치 | sips로 리사이즈 후처리 |

## 테스트 시나리오

### 정상 흐름
1. "앱스토어 출시 준비해줘" 요청
2. appstore-planner가 메타데이터 기획 → 앱 이름 후보 3개
3. 사용자가 후보 1 선택
4. appstore-designer가 선택된 이름으로 아이콘 + 스크린샷 생성
5. 전체 에셋 규격 검증 PASS
6. 결과 요약 보고

### 에러 흐름
1. appstore-designer가 스크린샷 3번 생성 실패
2. 에러 로그 확인 → SVG 복잡도 문제
3. 심플한 레이아웃으로 재생성
4. 검증 PASS
