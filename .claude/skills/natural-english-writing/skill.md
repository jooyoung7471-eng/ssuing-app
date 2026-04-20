---
name: natural-english-writing
description: "한국인 학습자를 위한 자연스러운 영어 작문 교육 스킬. 직역체 진단, 원어민 표현 변환, LLM 교정 프롬프트 최적화, 문장 DB 품질 관리. '영어 교정', '자연스러운 영어', '직역', '원어민 표현', '프롬프트 개선', '문장 추가' 요청 시 사용."
---

# Natural English Writing — 자연스러운 영어 작문 교육

한국인 학습자가 "한국어를 영어로 번역"하는 게 아니라 "영어로 생각하고 표현"하도록 교육하는 스킬.

## 핵심 원칙: 직역은 적이다

### 한국인이 반복하는 10대 직역 패턴

| # | 한국어 | 직역 (X) | 자연스러운 영어 (O) |
|---|--------|----------|---------------------|
| 1 | 나는 ~하고 싶다 | I want to ~ | I'd love to ~ / I feel like ~ing |
| 2 | ~하는 것이 좋다 | It is good to ~ | You should ~ / I'd recommend ~ing |
| 3 | ~할 수 있다 | I can ~ | I'm able to ~ / I know how to ~ |
| 4 | 나는 ~라고 생각한다 | I think that ~ | I'd say ~ / In my opinion ~ / To me ~ |
| 5 | 매우/정말 | very | super / really / incredibly / so |
| 6 | ~하기 때문에 | because ~ | since ~ / as ~ / that's why ~ |
| 7 | 그것은 ~이다 | It is ~ | That's ~ / Looks like ~ |
| 8 | 나는 ~에 관심이 있다 | I have interest in ~ | I'm into ~ / I'm interested in ~ |
| 9 | ~해야 한다 | I have to ~ | I need to ~ / I should ~ / I gotta ~ |
| 10 | 좋은/나쁜 | good/bad | great/awful/amazing/terrible/decent |

### 자연스러운 영어의 5가지 특징

1. **구동사 (Phrasal Verbs) 선호**
   - investigate → look into
   - tolerate → put up with
   - postpone → put off
   - discover → find out
   - cancel → call off

2. **축약형 사용**
   - I am → I'm
   - I will → I'll
   - I would → I'd
   - It is → It's
   - Do not → Don't

3. **콜로케이션 (자연스러운 단어 조합)**
   - make a mistake (O) / do a mistake (X)
   - take a shower (O) / do a shower (X)
   - heavy traffic (O) / strong traffic (X)
   - strong coffee (O) / heavy coffee (X)
   - catch a cold (O) / get a cold (△)

4. **감정 표현의 다양성**
   - happy → thrilled, ecstatic, over the moon, stoked
   - sad → bummed, heartbroken, devastated, down
   - angry → furious, irritated, frustrated, ticked off
   - surprised → shocked, stunned, blown away, caught off guard

5. **필러/연결어 (Discourse Markers)**
   - Well, / Actually, / I mean, / You know, / Honestly,
   - By the way, / Speaking of which, / That being said,

## LLM 교정 프롬프트 가이드

### 채점 기준 (10점 만점)
- **자연스러움 (4점)**: 원어민이 실제로 이렇게 말하는가?
- **문법 정확성 (3점)**: 관사, 전치사, 시제, 주어-동사 일치
- **표현 다양성 (2점)**: 같은 패턴만 반복하지 않는가?
- **의미 전달 (1점)**: 원래 한국어의 의도를 전달하는가?

### 교정 시 반드시 체크할 항목
1. 학습자가 직역했는가? → 완전히 다시 쓴다
2. be동사/have를 과다 사용했는가? → 더 생동감 있는 동사로
3. 한 문장이 너무 긴가? → 짧게 쪼갠다
4. 격식체를 과도하게 쓰는가? → 상황에 맞는 톤으로 조절
5. 콜로케이션이 어색한가? → 자연스러운 조합으로 교체

### 프롬프트 최적화 체크리스트
- [ ] 직역체 입력 → 자연스러운 교정이 나오는가?
- [ ] 초급/중급 난이도에 맞는 어휘를 쓰는가?
- [ ] 한국어 설명이 학습자에게 도움이 되는가?
- [ ] 핵심 표현이 실제로 유용한가?
- [ ] 대안 표현이 2개 이상 제공되는가?
- [ ] 채점이 너무 관대하거나 엄격하지 않은가?

## 문장 DB 품질 기준

### 좋은 한글 원문
```
초급:
- "오늘 날씨 좋다!" → 학습: 감탄문, 날씨 표현
- "커피 한 잔 주세요" → 학습: 주문 표현, 수량
- "주말에 뭐 했어?" → 학습: 과거 시제, 의문문

중급:
- "요즘 일이 너무 많아서 번아웃 올 것 같아" → 학습: 구동사, 감정 표현
- "그 드라마 결말이 좀 허무했어" → 학습: 형용사 뉘앙스, 의견 표현
- "이번 분기 매출이 전년 대비 15% 늘었습니다" → 학습: 비즈니스 수치 표현
```

### 나쁜 한글 원문 (교체 대상)
```
- "나는 학교에 갑니다" → 너무 교과서적
- "그 물건의 가격은 얼마입니까?" → 실제로 이렇게 안 말함
- "환경 보호는 우리 모두의 의무입니다" → 작문 연습보다 번역 느낌
```

### 힌트 단어 선정 기준
1. 학습자가 모를 가능성이 높은 핵심 단어 2~3개
2. 정답에 반드시 포함되는 단어
3. 다른 문장에서도 재등장하는 고빈도 단어 우선
4. 구동사는 통째로 힌트 (예: "look into" = "조사하다")

## 카테고리별 표현 가이드

### 일상 (Daily)
- 인사/안부: "What's up?" "How's it going?" "Long time no see!"
- 음식/식사: "I'm craving ~" "Let's grab a bite" "I'll treat you"
- 날씨/계절: "It's freezing out" "Perfect weather for ~" "Looks like rain"
- 감정/의견: "I'm not feeling it" "That's a bummer" "I'm pumped!"

### 비즈니스 (Business)
- 회의: "Let's circle back on this" "Can we table this?" "I'll loop you in"
- 이메일: "Just a heads-up" "Per our conversation" "Looking forward to hearing from you"
- 성과: "We exceeded our target" "Sales are up by ~%" "Revenue hit a record high"
- 협상: "That's a dealbreaker" "We can meet in the middle" "Let me run it by my team"

### 여행 (Travel)
- 교통: "How do I get to ~?" "Is this the right platform?" "Drop me off here"
- 숙소: "I have a reservation under ~" "Is checkout at 11?" "Could I get a late checkout?"
- 관광: "What are the must-sees?" "Is it within walking distance?" "Can you take a photo of us?"
- 문제상황: "I lost my passport" "My luggage didn't arrive" "Is there a pharmacy nearby?"

## 작업 파일
- 프롬프트: `server/src/services/llm.ts`
- 문장 DB: `src/data/sentences.json`, `server/prisma/seed-sentences.json`
- 리포트: `_workspace/content_report.md`
