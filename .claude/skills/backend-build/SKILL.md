---
name: backend-build
description: "영어 작문 학습 앱의 백엔드 API를 Node.js + Express + Prisma로 구현하는 스킬. LLM API 연동(작문 교정), 문장 관리, 학습 기록 CRUD, 하루 3문장 선정 로직을 포함한다. 'API 구현', '백엔드 개발', '서버 구현', 'DB 설계' 요청 시 사용."
---

# Backend Build — Node.js 백엔드 API 구현

영어 작문 교정 API와 학습 데이터 관리 서버를 구현한다.

## 프로젝트 구조

```
server/
├── prisma/
│   ├── schema.prisma       # DB 스키마
│   ├── seed.ts              # 초기 문장 데이터 시딩
│   └── migrations/
├── src/
│   ├── index.ts             # Express 앱 엔트리
│   ├── routes/
│   │   ├── auth.ts          # 인증 (register, login)
│   │   ├── sentences.ts     # 문장 조회 (daily, detail)
│   │   ├── corrections.ts   # 작문 교정 (LLM 연동)
│   │   └── history.ts       # 학습 기록 CRUD
│   ├── services/
│   │   ├── llm.ts           # LLM API 클라이언트 (Claude)
│   │   ├── sentenceSelector.ts # 하루 3문장 선정 로직
│   │   └── auth.ts          # 인증 서비스 (JWT)
│   ├── middleware/
│   │   ├── auth.ts          # JWT 검증 미들웨어
│   │   └── errorHandler.ts  # 글로벌 에러 핸들러
│   ├── validators/
│   │   └── schemas.ts       # zod 입력 검증 스키마
│   └── types/
│       └── index.ts         # 공유 타입
├── package.json
└── tsconfig.json
```

## Prisma 스키마

```prisma
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  password    String
  createdAt   DateTime @default(now())
  dailySentences DailySentence[]
  corrections    Correction[]
}

model Sentence {
  id          String   @id @default(uuid())
  koreanText  String
  theme       String   // "daily" | "business"
  difficulty  Int      @default(1) // 1-5
  hintWords   Json     // [{ english: "coffee", korean: "커피" }]
  createdAt   DateTime @default(now())
  dailySentences DailySentence[]
  corrections    Correction[]
}

model DailySentence {
  id          String   @id @default(uuid())
  userId      String
  sentenceId  String
  date        DateTime @db.Date
  order       Int      // 1, 2, 3
  user        User     @relation(fields: [userId], references: [id])
  sentence    Sentence @relation(fields: [sentenceId], references: [id])
  @@unique([userId, date, order])
}

model Correction {
  id                String   @id @default(uuid())
  userId            String
  sentenceId        String
  userWriting       String
  correctedSentence String
  explanation       String
  score             Int      // 1-10
  highlights        Json     // [{ original: "...", corrected: "...", reason: "..." }]
  createdAt         DateTime @default(now())
  user              User     @relation(fields: [userId], references: [id])
  sentence          Sentence @relation(fields: [sentenceId], references: [id])
}
```

## LLM 교정 서비스

`services/llm.ts`에서 Anthropic Claude API를 호출한다.

### 시스템 프롬프트 핵심
```
당신은 한국인 영어 학습자를 위한 영어 작문 교정 전문가입니다.
- 주어진 한글 원문의 의미를 정확히 전달하는 자연스러운 영어 문장을 제안하세요.
- 학습자의 작문에서 문법 오류, 부자연스러운 표현, 뉘앙스 차이를 한국어로 설명하세요.
- 점수는 1-10점으로 매기되, 의미 전달(40%), 문법(30%), 자연스러움(30%)을 기준으로 합니다.
- 반드시 JSON 형식으로 응답하세요.
```

### 응답 JSON 형식
```json
{
  "correctedSentence": "I had coffee with my friend at a café yesterday.",
  "explanation": "• 'drank coffee' → 'had coffee': 'have coffee'가 더 자연스러운 표현입니다.\n• 어순: 시간 부사(yesterday)는 문장 끝에 배치하는 것이 일반적입니다.",
  "score": 7,
  "highlights": [
    { "original": "drank", "corrected": "had", "reason": "'have coffee'가 관용적 표현" },
    { "original": "yesterday I", "corrected": "... yesterday", "reason": "시간 부사 위치 수정" }
  ]
}
```

## 하루 3문장 선정 로직

`services/sentenceSelector.ts`:
1. 해당 날짜 + 테마로 이미 선정된 문장이 있으면 반환
2. 없으면 사용자가 아직 풀지 않은 문장 중 랜덤 3개 선정
3. DailySentence 테이블에 저장
4. 문장 풀이 모두 소진되면 이전 문장 재활용 (30일 이상 경과한 것 우선)

## API 응답 형식 규칙

- 성공: `{ data: T }` 또는 `{ data: T[], pagination: { page, limit, total } }`
- 에러: `{ error: { code: string, message: string } }`
- DB 필드명(snake_case) → API 응답(camelCase) 변환 일관성 유지
- 날짜는 ISO 8601 형식

## 시드 데이터

`prisma/seed.ts`에 최소 20개의 일상영어 + 20개의 비지니스영어 한글 문장과 힌트 단어를 포함한다. 상세 목록은 `references/seed-sentences.md`를 참조한다.

## 산출물

`server/` 디렉토리에 전체 백엔드 코드를 생성한다.
