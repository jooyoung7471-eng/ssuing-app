# EngWrite 콘텐츠 품질 종합 검토 리포트

**검토일:** 2026-04-04
**검토자:** 영어 교육 콘텐츠 전문가 (content-expert)

---

## 1. 수량 요약

### 전체 현황
| 항목 | 수량 |
|------|------|
| 전체 문장 | 1,762개 |
| daily 테마 | 956개 (54.3%) |
| business 테마 | 806개 (45.7%) |
| beginner 난이도 | 873개 (49.5%) |
| intermediate 난이도 | 889개 (50.5%) |

### 카테고리별 문장 수 분포

| 카테고리 | beginner | intermediate | 합계 | 비고 |
|---------|----------|-------------|------|------|
| 기업동향/뉴스 | 75 | 82 | 157 | **과다** |
| 주식/투자 | 75 | 75 | 150 | **과다** |
| 여행 | 48 | 55 | 103 | 약간 과다 |
| 음식/카페 | 50 | 52 | 102 | 약간 과다 |
| 감정표현 | 51 | 50 | 101 | 약간 과다 |
| 쇼핑 | 50 | 50 | 100 | 약간 과다 |
| 기타 21개 카테고리 | 각 25 | 각 25 | 각 50 | 균형 |
| 협상/계약 | 24 | 25 | 49 | 1개 부족 |

**평가:** 테마 간 균형은 양호(daily 54% vs business 46%). 난이도 균형도 거의 완벽(50:50). 다만 주식/투자(150)와 기업동향/뉴스(157)가 다른 카테고리(50개)의 3배로 편중됨. 협상/계약은 1개 부족.

---

## 2. 품질 문제 목록

### 2.1 초급인데 너무 어려운 문장 (24개 발견)

주로 **주식/투자** 카테고리에 집중. 초급 학습자가 영어로 쓰기 불가능한 전문 용어와 복합문 구조.

| 문장 | 글자수 | 문제점 | 수정 제안 |
|------|--------|--------|-----------|
| "투자자는 주식을 매수하여 기업의 주인이 될 수 있습니다." | 31 | 전문 용어 과다 (매수, 투자자), 복합문 | intermediate로 재분류 |
| "배당금은 회사의 순이익을 주주들에게 나누어 주는 것입니다." | 32 | 전문 개념 설명문, 초급 부적합 | intermediate로 재분류 |
| "시가총액은 회사의 주식 가격에 발행주식수를 곱한 값입니다." | 32 | 극도 전문적 | intermediate로 재분류 |
| "회사의 가치를 판단하기 위해서는 재무제표를 분석해야 합니다." | 33 | 재무 전문 용어 | intermediate로 재분류 |
| "유니콘 기업이란 가치가 10억 달러 이상인 비상장 스타트업을 의미한다." | 39 | 정의문, 전문 용어 밀집 | intermediate로 재분류 |
| "전기차 배터리 기술은 자동차 산업의 미래를 결정할 중요한 요소다." | 36 | 추상적/복합적 | intermediate로 재분류 |
| "글로벌 무역 분쟁으로 인해 공급망 재구성이 가속화되고 있다." | 33 | 시사 전문 용어 | intermediate로 재분류 |
| "중앙은행이 기준금리를 인상하면서 금융 시장에 변화가 생겼다." | 33 | 경제 전문 용어 | intermediate로 재분류 |
| "분할 매수는 정기적으로 일정 금액을 투자하는 방식입니다." | 31 | 전문 투자 전략 | intermediate로 재분류 |
| "차익실현은 수익이 나면 주식을 팔아 이익을 확정하는 것입니다." | 34 | 전문 투자 용어 정의문 | intermediate로 재분류 |

**조치 권고:** 주식/투자 및 기업동향/뉴스 카테고리의 초급 문장 중 30자 이상 + 전문 용어 포함 문장을 일괄 intermediate로 재분류 (약 24개).

### 2.2 교과서적/비자연스러운 문장 (43개 발견)

초급 문장 중 `~합니다/~것입니다` 어미의 설명적 문체가 43개. 일상 대화체가 아닌 교과서 정의문.

| 문장 | 카테고리 | 문제점 | 수정 제안 |
|------|---------|--------|-----------|
| "나는 영화를 좋아합니다." | 취미 | 경직된 교과서체 | "영화 좋아해." 또는 "영화 보는 거 좋아해." |
| "아침에 운동을 합니다." | 취미 | 교과서체 | "아침마다 운동해." |
| "주식은 회사의 소유권을 나누어 판매하는 증권입니다." | 주식/투자 | 사전 정의문 | 초급 제거, intermediate에서 "주식이 뭔지 알아?" 같은 구어체로 |
| "포트폴리오는 투자자가 보유한 여러 자산의 모음입니다." | 주식/투자 | 백과사전 문체 | 삭제 또는 "여러 가지 주식에 나눠서 투자했어." |
| "환율은 두 나라 통화의 교환 비율입니다." | 주식/투자 | 교과서 정의문 | "달러 환율이 올랐어." |

### 2.3 hintWords에 불필요한 기본 단어 포함 (30건)

| 기본 단어 | 출현 횟수 | 예시 문장 |
|-----------|----------|-----------|
| "I" | 14 | "저는 김철수입니다.", "저는 학생입니다." 등 |
| "is" | 9 | "이 머핀 뭐예요?", "숙소가 어디야?" 등 |
| "my" | 4 | "제 이름은 박영희예요." 등 |
| "to" | 2 | (각종 문장) |
| "are" | 1 | "어떻게 지내세요?" |

**조치 권고:** "I", "is", "am", "are", "a", "the", "my", "to" 같은 기본 기능어는 hintWords에서 제거하고, 학습 가치가 있는 내용어(명사/동사/형용사)로 교체해야 함.

### 2.4 유사 문장 (21쌍 발견)

학습 효과 측면에서 문제되는 주요 유사 쌍:

| 문장 1 | 문장 2 | 평가 |
|--------|--------|------|
| "배송 추적 번호를 받았으니 곧 도착할 거야." | "배송 추적 번호를 받았으니 언제쯤 도착할지 확인할 수 있어." | 거의 동일, 학습 효과 겹침 |
| "이 안건은 다음 회의에서 다루기로 하겠습니다." | "이 안건은 다음 회의에서 집중 논의하겠습니다." | 핵심 구조 동일 |
| "고객 피드백을 반영하여 제품을 개선하고 있습니다." | "고객 피드백을 반영해서 상품을 개선했어요." | 난이도 차이로 유지 가능 |
| "고객님의 피드백을 기다립니다." | "고객님의 피드백을 정말 소중히 생각합니다." | 유지 가능 (다른 표현 학습) |

완전 중복 문장은 **0개** (양호).

---

## 3. 핵심 단어(tags) 반복 분석

### TOP 20 빈출 태그

| 순위 | 태그 | 출현 횟수 | 평가 |
|------|------|----------|------|
| 1 | shopping | 56 | **과다** (목표 3-8회 대비 7배) |
| 2 | investment | 31 | **과다** |
| 3 | meeting | 26 | **과다** |
| 4 | stocks | 23 | **과다** |
| 5 | hobby | 22 | **과다** |
| 6 | strategy | 22 | **과다** |
| 7 | price | 21 | **과다** |
| 8 | review | 21 | **과다** |
| 9 | cafe | 20 | **과다** |
| 10 | market | 20 | **과다** |
| 11 | analysis | 18 | 과다 |
| 12 | delivery | 17 | 과다 |
| 13 | health | 17 | 과다 |
| 14 | feedback | 17 | 과다 |
| 15 | risk | 16 | 과다 |
| 16 | semiconductor | 16 | 과다 |
| 17 | payment | 15 | 과다 |
| 18 | return | 15 | 과다 |
| 19 | call | 15 | 과다 |
| 20 | travel | 15 | 과다 |

**문제:** TOP 20 태그가 모두 목표 빈도(3-8회)를 크게 초과. 카테고리명을 태그로 그대로 쓴 것이 원인. 태그가 카테고리 분류 역할을 하고 있으며, 핵심 학습 단어로서의 기능을 못함.

### 1회만 등장 태그

총 **786개** (전체 태그 중 다수)

예시: `doing`, `student`, `polite`, `from`, `place`, `age`, `old`, `dream`, `doctor`, `nationality`, `Korean`, `English`, `study`, `alone`, `dog`, `nowadays`, `day off`, `developer`, `pleased`, `expertise`, `fluent`, `problem-solving`, `leader`, `introduction`, `myself`, `roles`, `strength`, `meticulous`, `attitude`, `interpersonal`

**문제:** 786개 태그가 1회만 등장. 간격 반복(spaced repetition) 원리에 따르면 핵심 단어가 3-8회 다른 맥락에서 반복되어야 학습 효과가 있음. 현재 태그 체계는 학습 도구로서 기능하지 못함.

---

## 4. LLM 교정 테스트 결과

### 테스트 1: 초급 - 일상 대화

**입력:**
- 한글: "오늘 날씨가 좋아서 산책했어"
- 학습자: "Today weather good so I walked"

**LLM 응답:**
```json
{
  "correctedSentence": "The weather was nice today, so I went for a walk.",
  "nativeExpressions": [
    "The weather was nice, so I took a walk.",
    "Since the weather was good today, I went out for a walk."
  ],
  "explanation": "관사 'the'가 필요하고, be동사 'was'를 사용해야 합니다. '산책하다'는 'walk'보다 'go for a walk'가 더 자연스럽습니다.",
  "keyExpression": {
    "english": "go for a walk",
    "korean": "산책하다",
    "example": "Let's go for a walk in the park."
  },
  "score": 6,
  "highlights": [
    {
      "original": "Today weather good",
      "corrected": "The weather was nice",
      "reason": "관사 'the'와 be동사 'was'가 필요합니다."
    },
    {
      "original": "so I walked",
      "corrected": "so I went for a walk",
      "reason": "'walked'보다 'went for a walk'가 '산책했다'는 의미로 더 자연스럽습니다."
    }
  ]
}
```

**평가:**
- 교정 자연스러움: **우수** - "go for a walk"는 원어민 표현. 직역체 없음.
- nativeExpressions: **우수** - "took a walk", "went out for a walk" 모두 적절한 대안.
- keyExpression: **우수** - "go for a walk"는 초급자가 반드시 알아야 할 표현.
- 점수(6/10): **적절** - 의미 전달은 되지만 문법 오류 다수로 6점 합당.
- 개선점: 한국어 설명이 조금 더 상세하면 좋음 (왜 be동사가 필요한지).

### 테스트 2: 중급 - 일상/경제

**입력:**
- 한글: "요즘 물가가 많이 올라서 외식을 줄이고 있다"
- 학습자: "These days price go up a lot so I reduce eating out"

**LLM 응답:**
```json
{
  "correctedSentence": "Prices have gone up a lot these days, so I've been eating out less.",
  "nativeExpressions": [
    "With prices climbing these days, I'm cutting back on eating out",
    "Prices are going up so much, I've reduced eating out"
  ],
  "explanation": "동사 활용과 표현이 부자연스럽습니다. 'price'는 복수형 'prices'가 필요하고, 'go up'은 'have gone up'으로 현재완료형이 더 자연스럽습니다. 'reduce eating out' 대신 'eating out less' 또는 'cut back on eating out'이 훨씬 더 native합니다.",
  "keyExpression": {
    "english": "cut back on",
    "korean": "~을 줄이다, 덜하다",
    "example": "I'm cutting back on sugar to stay healthy."
  },
  "score": 6,
  "highlights": [
    {
      "original": "price go up",
      "corrected": "prices have gone up",
      "reason": "복수명사 'prices'와 현재완료형 'have gone up'으로 최근의 변화를 자연스럽게 표현합니다"
    },
    {
      "original": "I reduce eating out",
      "corrected": "I've been eating out less / I'm cutting back on",
      "reason": "진행 중인 습관을 표현할 때 이 구조가 훨씬 더 자연스럽습니다"
    }
  ]
}
```

**평가:**
- 교정 자연스러움: **매우 우수** - 직역 없이 완벽한 원어민 표현.
- nativeExpressions: **매우 우수** - "cut back on"은 중급자에게 딱 맞는 phrasal verb.
- keyExpression: **매우 우수** - "cut back on"은 다양한 맥락에서 활용 가능한 핵심 표현.
- 점수(6/10): **적절** - 의미 전달되나 시제/수 오류 반영.
- 개선점: 없음. 중급 레벨에 맞는 이상적인 교정.

### 테스트 3: 비즈니스 중급

**입력:**
- 한글: "이번 분기 매출이 전년 대비 15% 증가했다"
- 학습자: "This quarter sales increased 15% compared to last year"

**LLM 응답:**
```json
{
  "correctedSentence": "Sales grew 15% year-over-year this quarter.",
  "nativeExpressions": [
    "This quarter's sales increased by 15% compared to last year.",
    "We saw a 15% sales increase quarter-over-quarter."
  ],
  "explanation": "'This quarter sales'는 문법적으로 어색합니다. 'This quarter's sales' 또는 'Sales this quarter'로 수정해야 합니다. 'increased 15%'보다 'increased by 15%'가 더 자연스럽습니다. 비즈니스 맥락에서는 'year-over-year'(전년 동기 대비)가 더 전문적입니다.",
  "keyExpression": {
    "english": "increase by X% / grow X% year-over-year",
    "korean": "X% 증가하다 / 전년 동기 대비 X% 성장하다",
    "example": "Revenue grew 25% year-over-year."
  },
  "score": 6,
  "highlights": [
    {
      "original": "This quarter sales",
      "corrected": "This quarter's sales / Sales this quarter",
      "reason": "소유 관계를 명확히 해야 합니다."
    },
    {
      "original": "increased 15%",
      "corrected": "grew 15% / increased by 15%",
      "reason": "'increased by'가 정확한 표현이고, 캐주얼하게는 'grew'를 사용합니다."
    },
    {
      "original": "compared to last year",
      "corrected": "year-over-year",
      "reason": "비즈니스 커뮤니케이션에서 'year-over-year(YoY)'가 더 전문적이고 간결합니다."
    }
  ]
}
```

**평가:**
- 교정 자연스러움: **매우 우수** - "year-over-year"는 실무에서 실제 사용하는 표현.
- nativeExpressions: **우수** - 다만 두 번째 대안 "quarter-over-quarter"는 "전년 대비"가 아닌 "전 분기 대비"이므로 의미가 다름. **경미한 오류**.
- keyExpression: **우수** - "year-over-year"는 비즈니스 필수 표현.
- 점수(6/10): **다소 관대** - 학습자 문장이 상당히 잘 작성되어 7점이 더 적절.
- 개선점: nativeExpressions에서 의미가 달라지는 대안 제시 주의 필요.

### LLM 교정 종합 평가

| 항목 | 평가 | 점수 |
|------|------|------|
| 직역 방지 | 3건 모두 원어민 표현으로 교정 | A |
| keyExpression 학습 가치 | 3건 모두 실용적 표현 선정 | A |
| nativeExpressions 다양성 | 적절한 대안 제시 | A- |
| 점수 일관성 | 3건 모두 6점 (차별화 부족) | B |
| 한국어 설명 명확성 | 초급은 더 상세 필요 | B+ |
| JSON 형식 준수 | markdown 코드블록 포함 (파싱 시 주의) | B |

**주의:** LLM이 JSON을 markdown 코드블록(```)으로 감싸서 반환. 현재 `parseResponse`에서 `text.match(/\{[\s\S]*\}/)`로 추출하므로 정상 작동하지만, 프롬프트에 "No markdown" 지시가 있음에도 무시됨.

---

## 5. 최종 개선 제안 (우선순위순)

### P0 (즉시 조치)

1. **난이도 재분류 (24개):** 주식/투자, 기업동향/뉴스의 초급 문장 중 30자 이상 + 전문 용어 포함 문장을 intermediate로 재분류
2. **hintWords 기본 단어 제거 (30건):** "I", "is", "my", "are", "to" 등을 제거하고 내용어로 교체

### P1 (1주 내)

3. **교과서체 문장 구어체 전환 (43개):** "~합니다/~것입니다" 종결의 설명적 문장을 실제 한국어 구어체로 수정
4. **태그 체계 재설계:** 현재 태그는 카테고리명 반복이거나 1회용. 학습 핵심 단어 기반으로 재설계하여 주요 단어가 3-8회 반복되도록 조정
5. **유사 문장 차별화 (21쌍):** 핵심 구조가 겹치는 문장쌍 중 학습 효과가 중복되는 것은 다른 표현으로 교체

### P2 (2주 내)

6. **카테고리 균형 조정:** 주식/투자(150), 기업동향/뉴스(157)가 과다. 부족한 카테고리(인사/소개, 교통, 날씨 등 각 50개)에 추가 문장 생성하여 균형 맞추기
7. **LLM 프롬프트 개선:**
   - 점수 차별화 가이드 추가 (현재 모든 응답이 6점으로 수렴)
   - 난이도별 한국어 설명 상세도 차등화 (초급: 더 상세, 중급: 간결)
   - "No markdown" 강화 또는 파서에서 코드블록 제거 로직 보강

### P3 (지속)

8. **핵심 단어 반복 노출 전략:** 고빈도 학습 단어 100개 선정 후, 각 단어가 3-8개 문장에서 다른 맥락으로 등장하도록 문장 설계
9. **시사/트렌드 문장 갱신:** 기업동향/뉴스 카테고리의 시의성 있는 문장 분기별 업데이트
