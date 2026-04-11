# 쓰잉 v1.1 - 문장 DB 난이도 분류 검토 결과

## 검토 기준

| 구분 | 초급 (beginner) | 중급 (intermediate) |
|------|-----------------|---------------------|
| 문장 길이 | 짧은 문장 (한글 15자 이내) | 긴 문장 (20자 이상) |
| 문법 | 기본 문법 (단문, 현재/과거 시제) | 복합 문법 (관계대명사, 가정법, 수동태) |
| 어휘 | 일상 단어 (hello, eat, go) | 비즈니스/전문 어휘 (dividend, portfolio, acquisition) |
| 주제 | 일상, 감정, 음식, 쇼핑 | 금융, 협상, 기업 뉴스 |

## 통계

- 전체 문장 수: 1,762개 (beginner 849 / intermediate 913)
- 수정된 문장: **37개**
  - beginner -> intermediate: 35개
  - intermediate -> beginner: 2개
- 수정 후: beginner 816 / intermediate 946

---

## beginner -> intermediate로 변경한 문장 (35개)

### 주식/투자 카테고리 (25개)

주식/투자 카테고리 문장들 중 dividend, portfolio, securities, volatility, investment strategy 등 금융 전문 용어가 힌트에 포함된 문장은 초급 학습자에게 부적절하다. 영작 시 전문 어휘를 영어로 표현해야 하므로 중급 이상이 적합하다.

| # | 문장 | 변경 사유 |
|---|------|----------|
| 1 | "배당금이 얼마예요?" | dividend (금융 전문 용어) |
| 2 | "투자 위험이 크네요." | investment (전문 어휘) |
| 3 | "포트폴리오를 관리하세요." | portfolio, allocation |
| 4 | "배당 수익률이 높아요." | dividend, yield |
| 5 | "장기 투자를 할 거야." | long-term investment |
| 6 | "배당금을 받았습니다." | dividend |
| 7 | "증시가 변동했어요." | fluctuate, volatility |
| 8 | "자산 배분이 필요해." | allocation, diversify |
| 9 | "배당금을 받았다." | dividend, payout |
| 10 | "포트폴리오를 다양화했다." | portfolio, diversify, allocation |
| 11 | "장기 투자가 낫다." | investment, strategy |
| 12 | "주가 차트를 분석했다." | analyze, technical analysis |
| 13 | "증권사에서 주식을 샀다." | securities company, broker |
| 14 | "펀드에 투자했다." | mutual fund, investment, allocation |
| 15 | "시장 변동성이 크다." | market volatility, fluctuation |
| 16 | "주식은 회사의 소유권을 나누어 판매하는 증권입니다." | ownership, securities, 교과서식 설명문 |
| 17 | "포트폴리오는 투자자가 보유한 여러 자산의 모음입니다." | portfolio, investor, assets |
| 18 | "장기 투자는 수 년 이상 주식을 보유하는 전략입니다." | investment, strategy |
| 19 | "분산 투자를 통해 리스크를 줄일 수 있습니다." | diversification, investment |
| 20 | "주식 시장은 주식이 사고팔리는 장소입니다." | securities, stock market |
| 21 | "주가는 수급에 따라 지속적으로 변동합니다." | fluctuate, supply, demand |
| 22 | "투자 전략은 개인의 목표에 맞게 수립해야 합니다." | investment strategy |
| 23 | "실적 발표는 기업이 분기별 성과를 공개하는 날입니다." | earnings announcement, quarterly |

### 기업동향/뉴스 카테고리 (6개)

| # | 문장 | 변경 사유 |
|---|------|----------|
| 24 | "매출이 30% 증가했다." | revenue |
| 25 | "투자금 1000억을 받았다." | investment, funding |
| 26 | "배당금이 지급되었다." | dividend |
| 27 | "경쟁사가 인수되었다." | acquisition |
| 28 | "기술 개발에 투자한다." | investment |
| 29 | "구글이 AI 기술 개발에 투자를 늘렸다." | investment |
| 30 | "메타의 광고 수익이 증가했다." | revenue |
| 31 | "디지털 전환이 비즈니스 전략의 핵심 요소가 되었다." | business strategy, digital transformation |

### 쇼핑/협상 카테고리 (4개)

| # | 문장 | 변경 사유 |
|---|------|----------|
| 32 | "이 가격은 협상 가능한가요?" | negotiate |
| 33 | "가격을 좀 깎아 주실 수 있을까요?" | negotiate |
| 34 | "더 좋은 조건으로 협상할 수 있을까요?" | negotiate, terms |
| 35 | "할인을 좀 더 주실 수 있을까요?" | negotiate |

---

## intermediate -> beginner로 변경한 문장 (2개)

| # | 문장 | 카테고리 | 변경 사유 |
|---|------|----------|----------|
| 1 | "오늘 하루가 정말 피곤했어." | 감정표현 | 15자 이하, 기본 감정 표현, 힌트도 단순 |
| 2 | "고마워서 말로 다 못해." | 감정표현 | 13자, 일상적 감사 표현 |

---

## 추가 관찰 사항

1. **주식/투자 카테고리 비중 과다**: beginner 65개 + intermediate 85개 = 150개로 전체의 8.5%. 초급 학습자에게 금융 주제가 과하게 노출될 수 있음.
2. **감정표현 intermediate에 단순 문장 다수**: "친구가 일찍 간다니 정말 아쉬워", "일이 자꾸만 꼬이니까 화가 나" 등은 한글은 짧지만 영어 표현이 중급 수준(frustrated, heartache 등)이므로 intermediate 유지가 적절.
3. **기업동향/뉴스 beginner**: 수정 후에도 일부 남아있으나 ("테슬라 주가가 올라갔다" 등), 힌트 단어가 고유명사 위주라 초급으로 유지 가능.

---

## 적용 완료

`server/prisma/seed-sentences.json` 파일에서 위 37개 문장의 `difficulty` 값을 직접 수정 완료.
