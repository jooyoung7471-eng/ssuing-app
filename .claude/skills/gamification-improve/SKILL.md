---
name: gamification-improve
description: "EngWrite 앱의 게이미피케이션을 개선하는 스킬. XP/레벨/업적/스트릭 밸런스 조정, 새로운 리텐션 메커니즘 설계, 복습 게이미피케이션 강화를 수행한다. '게이미피케이션', '리텐션', 'XP 밸런스', '업적 추가', '스트릭 개선', '동기 부여' 요청 시 사용."
---

# Gamification Improve — 게이미피케이션 개선

EngWrite 앱의 리텐션과 학습 동기를 높이는 게이미피케이션 시스템을 개선한다.

## 현재 시스템 분석 대상
- `server/src/services/gamification.ts` — XP/레벨/스트릭/업적 로직
- `server/src/routes/gamification.ts` — 통계 API
- `src/components/XpNotification.tsx`, `AchievementModal.tsx` — 보상 피드백 UI
- `src/app/review.tsx` — 복습 게이미피케이션

## 개선 영역

### 1. XP/레벨 밸런스
- 현재 공식: XP = 10 + score×3, Level = floor(sqrt(xp/50)) + 1
- 레벨업이 너무 빠르거나 느리지 않은지 시뮬레이션
- 복습 보너스 XP가 적절한지 (현재 5XP/문장)

### 2. 업적 확장
현재 11개 업적. 추가 제안:
- 카테고리별 업적 (음식 10문장, 여행 10문장 등)
- 점수 개선 업적 (같은 문장에서 3점 이상 향상)
- 복습 업적 (복습 5회, 10회)
- 시간대별 업적 (아침형 학습자, 야간형 학습자)

### 3. 리텐션 메커니즘
- 일일 보상 (로그인 보너스)
- 주간 챌린지 (이번 주 15문장 완료)
- 연속 만점 보너스
- 스트릭 프리즈 (1회 무료, 추가는 XP로 구매)

### 4. 복습 개선
- 타이머 모드 (30초 내 작문)
- 콤보 보너스 강화 (연속 7점 이상 시 XP 2배)
- 복습 랭킹 (이번 주 복습 왕)

## 산출물
- `_workspace/gamification_proposal.md` — 설계안 + 밸런스 시뮬레이션
- fullstack-dev에게 전달할 구현 스펙 (API + 프론트 변경사항)
