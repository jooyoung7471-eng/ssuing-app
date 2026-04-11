# 07. LLM 교정 프롬프트 및 복습 기능 설계

## 1. LLM 교정 프롬프트

### 1-1. 시스템 프롬프트

```
You are an English writing tutor for Korean learners.
Your role: correct the learner's English writing and suggest natural, native-like expressions.

Rules:
1. NEVER produce translationese. Rewrite into what a native speaker would actually say in daily life.
2. Adjust vocabulary complexity to the learner's level:
   - beginner: simple words (get, make, go), short sentences
   - intermediate: allow phrasal verbs, idiomatic expressions, varied structures
3. Provide 1-2 alternative native expressions that convey the same meaning but sound more natural or colloquial.
4. Pick ONE key expression from the correction that the learner should memorize.
5. Respond ONLY with the JSON object below. No markdown, no wrapping.

JSON schema:
{
  "correctedSentence": "corrected version based on learner's attempt",
  "nativeExpressions": ["alternative 1", "alternative 2"],
  "explanation": "교정 설명 (한국어로 작성)",
  "keyExpression": {
    "english": "핵심 표현 영어",
    "korean": "한국어 뜻",
    "example": "해당 표현을 사용한 예문"
  },
  "score": 7,
  "highlights": [
    {"original": "원래 표현", "corrected": "교정 표현", "reason": "이유(한국어)"}
  ]
}
```

### 1-2. 사용자 메시지 템플릿

```
난이도: {DIFFICULTY}
한글 원문: {KOREAN_TEXT}
학습자 작문: {USER_WRITING}
```

### 1-3. 호출 코드 (server/src/services/llm.ts)

```typescript
export async function correctWriting(
  koreanText: string,
  userWriting: string,
  difficulty: "beginner" | "intermediate"
): Promise<CorrectionResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `난이도: ${difficulty}\n한글 원문: ${koreanText}\n학습자 작문: ${userWriting}`,
      },
    ],
  });
  return JSON.parse(response.choices[0].message.content!);
}
```

### 1-4. 응답 타입

```typescript
interface CorrectionResult {
  correctedSentence: string;
  nativeExpressions: string[];
  explanation: string;
  keyExpression: {
    english: string;
    korean: string;
    example: string;
  };
  score: number;
  highlights: { original: string; corrected: string; reason: string }[];
}
```

---

## 2. 복습 기능

### 2-1. UI 플로우

**설정 화면 (ReviewSettingScreen)**
- 테마 선택: 일상 / 비즈니스 / 전체 (칩 버튼)
- 문장 수: 5 | 10 | 15 | 20 (버튼 그룹)
- "복습 시작" CTA

**퀴즈 화면 (ReviewQuizScreen)**
- PracticeScreen과 동일한 카드 UI 재사용
- 상단 진행률 바 + "3/10" 텍스트
- 한글 문장 표시 → 영작 입력 → 제출 → 교정 결과 → 다음

**결과 화면 (ReviewResultScreen)**
- 평균 점수 (원형 차트)
- Best / Worst 문장 하이라이트
- 핵심 표현 리스트 (카드 스크롤)

### 2-2. 복습 문장 선택 로직

```
우선순위 가중치:
  w = (10 - score) * 2          # 낮은 점수일수록 높은 가중치
    + daysSinceLastPractice     # 오래될수록 높은 가중치
    + (sameKeywordBonus ? 3 : 0) # 같은 핵심단어 묶음 보너스

필터:
  - theme 일치 (전체면 필터 없음)
  - difficulty 일치

정렬: w DESC → 상위 N개 선택 후 셔플
```

### 2-3. API

```
POST /api/review/start
  Body: { theme?: string, difficulty?: string, count: 5|10|15|20 }
  Response: { sessionId: string, sentences: ReviewSentence[] }

POST /api/review/submit
  Body: { sessionId: string, sentenceId: string, userWriting: string }
  Response: CorrectionResult

GET /api/review/result/:sessionId
  Response: {
    averageScore: number,
    best: { sentence: string, score: number },
    worst: { sentence: string, score: number },
    keyExpressions: KeyExpression[],
    details: DetailItem[]
  }
```

### 2-4. DB 스키마 추가

```sql
CREATE TABLE review_sessions (
  id          UUID PRIMARY KEY,
  user_id     UUID REFERENCES users(id),
  theme       VARCHAR(20),
  difficulty  VARCHAR(20),
  total_count INT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE review_answers (
  id            UUID PRIMARY KEY,
  session_id    UUID REFERENCES review_sessions(id),
  sentence_id   UUID REFERENCES sentences(id),
  user_writing  TEXT,
  score         INT,
  correction    JSONB,
  answered_at   TIMESTAMPTZ DEFAULT now()
);
```

---

## 3. 난이도 선택

### 3-1. HomeScreen 변경

테마 카드 상단에 난이도 토글 배치:

```
[초급 Beginner] [중급 Intermediate]   ← SegmentedControl
```

선택값은 AsyncStorage에 저장, 앱 재시작 시 복원.

### 3-2. API 변경

```
GET /api/sentences/daily?theme=daily&difficulty=beginner
```

서버: sentences 테이블에 `difficulty` 컬럼 추가, 필터 적용.

---

## 4. CorrectionResult 화면 변경

기존 레이아웃 하단에 두 섹션 추가:

### 4-1. 원어민 표현 카드

```
┌─────────────────────────────────┐
│  이렇게도 말할 수 있어요          │  배경: #E8F5E9 (연두)
│                                 │
│  • I'm on my way home.          │
│  • Heading home now.            │
└─────────────────────────────────┘
```

### 4-2. 오늘의 핵심 표현 박스

```
┌─────────────────────────────────┐
│  오늘의 핵심 표현                 │  배경: #E3F2FD (연파랑)
│                                 │
│  on my way                      │  ← 볼드
│  ~로 가는 중                     │
│                                 │
│  예문: I'm on my way to work.   │
└─────────────────────────────────┘
```

### 4-3. 컴포넌트 구조

```
CorrectionResultScreen
  ├── ScoreCard              (기존)
  ├── CorrectedSentence      (기존)
  ├── HighlightList           (기존)
  ├── NativeExpressionsCard   (신규)
  └── KeyExpressionCard       (신규)
```
