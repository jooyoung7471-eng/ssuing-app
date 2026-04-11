# EngWrite — 영어 작문 학습 앱 요구사항

## 앱 개요
한글 문장을 보고 영어로 작문하면 LLM이 교정해주는 영어 작문 학습 앱.

## 핵심 기능
1. **테마 선택**: 일상 영어 / 비지니스 영어 2가지 테마
2. **한글 문장 제시**: 테마에 맞는 한글 문장을 화면에 표시
3. **힌트 단어**: 한글 문장과 작문 입력 사이에 주요 영어 단어 + 한글 뜻 표시 (접기/펼치기)
4. **영어 작문 입력**: 하단 입력 박스에서 사용자가 영어 문장 작성
5. **LLM 교정**: 작문 완료 시 LLM API가 올바른 영어 문장을 제안 + 설명 + 점수
6. **하루 3문장**: 각 테마별로 하루에 3개 문장씩 제안
7. **스와이프 전환**: 문장 카드를 좌우 스와이프로 넘김
8. **학습 기록 관리**: 내가 쓴 문장과 교정 문장 기록 저장 + 조회

## UX/UI 벤치마킹
- 말해보카: 카드 스와이프, 힌트 시스템, 미니멀 디자인
- 듀오링고: 즉시 피드백, 게이미피케이션, 일일 루틴
- 케이크: 카드 UI, 색상 활용
- Grammarly: 인라인 교정, 수정 포인트 하이라이트

## 기술 스택
- Frontend: React Native + Expo (모바일)
- Backend: Node.js + Express + Prisma
- Database: SQLite (MVP)
- LLM: Anthropic Claude API
- Language: TypeScript

## 색상 팔레트
- Primary: #4A90D9 (블루)
- Secondary: #7C4DFF (보라)
- Success: #4CAF50 / Warning: #FF9800 / Error: #F44336
- Background: #FAFBFC / Card: #FFFFFF
