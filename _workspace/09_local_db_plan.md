# 쓰잉 v1.1 - 한글 문장 로컬 DB 전환 기획

## 현재 구조

```
[앱] --API 호출--> [서버] --DB 조회--> [PostgreSQL]
         GET /api/sentences/daily?theme=daily&difficulty=beginner
```

- 매번 앱 실행 시 서버에서 오늘의 3문장을 받아옴
- 서버가 다운되면 문장 자체를 표시할 수 없음
- 한글 문장, 힌트 단어, 카테고리 등 정적 데이터도 매번 네트워크 요청

## 변경 목표

한글 문장 데이터를 앱에 번들링하여 오프라인에서도 문장 표시 가능하게 하고, 서버 의존성을 교정/학습기록/게이미피케이션으로 한정한다.

---

## 데이터 분리 설계

### 로컬 저장 (앱 번들)
| 데이터 | 설명 |
|--------|------|
| koreanText | 한글 문장 본문 |
| theme | daily / business |
| difficulty | beginner / intermediate |
| category | 인사/소개, 음식/카페 등 |
| hintWords | 영어-한글 힌트 단어 쌍 |
| tags | 검색/필터용 태그 |

### 서버 유지
| 데이터 | 사유 |
|--------|------|
| 교정 결과 (corrections) | LLM API 호출 필요, 결과 저장 |
| 학습 기록 (history) | 기기 간 동기화 |
| XP/레벨/업적 | 게이미피케이션 상태 동기화 |
| 하루 문장 선택 기록 (daily_sentences) | 중복 방지, 서버와 동기화 |
| 주간 리포트 | 서버 집계 |

---

## 로컬 저장 방식 비교

| 방식 | 장점 | 단점 | 적합도 |
|------|------|------|--------|
| **JSON 번들** | 구현 간단, 빌드 시 포함, 타입 안전 | 업데이트 시 앱 재배포 필요 | **추천** |
| SQLite (expo-sqlite) | 쿼리 유연, 대량 데이터 처리 | 설정 복잡, 1,762개에는 과잉 | 비추천 |
| AsyncStorage | 기존 인프라 활용 | 대량 데이터 비효율적, 문자열만 저장 | 비추천 |

### 추천: JSON 번들 방식

**이유:**
1. 문장 데이터가 1,762개(약 875KB)로 적당한 크기
2. TypeScript 타입 시스템과 자연스럽게 통합
3. 빌드 타임에 포함되어 별도 다운로드 불필요
4. `import sentences from './data/sentences.json'`으로 즉시 사용

---

## 구현 설계

### 파일 구조

```
src/
  data/
    sentences.json          ← seed-sentences.json 복사 (빌드 시 포함)
    index.ts                ← 문장 접근 API
  hooks/
    useDailySentences.ts    ← 수정: 로컬 우선, 서버 폴백
  services/
    sentenceSelector.ts     ← 신규: 로컬 문장 선정 로직
```

### 로컬 문장 선정 로직

현재 서버의 `sentenceSelector.ts` 로직을 앱으로 이식한다.

```typescript
// src/services/sentenceSelector.ts

import sentences from '../data/sentences.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DAILY_COUNT = 3;
const RECYCLE_AFTER_DAYS = 30;

interface LocalSentence {
  koreanText: string;
  theme: string;
  difficulty: string;
  category: string;
  hintWords: { english: string; korean: string }[];
  tags: string[];
}

export async function selectDailySentences(
  theme: string,
  difficulty: string
): Promise<LocalSentence[]> {
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `daily_${theme}_${difficulty}_${today}`;

  // 1. 오늘 이미 선정된 문장이 있으면 반환
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. 최근 30일 사용 문장 인덱스 조회
  const recentKey = `recent_sentences_${theme}_${difficulty}`;
  const recentRaw = await AsyncStorage.getItem(recentKey);
  const recentUsed: { index: number; date: string }[] = recentRaw
    ? JSON.parse(recentRaw)
    : [];

  // 30일 지난 항목 제거
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RECYCLE_AFTER_DAYS);
  const activeRecent = recentUsed.filter(
    (r) => new Date(r.date) >= cutoff
  );
  const usedIndices = new Set(activeRecent.map((r) => r.index));

  // 3. 후보 필터링
  const candidates = sentences
    .map((s, i) => ({ ...s, _index: i }))
    .filter(
      (s) =>
        s.theme === theme &&
        s.difficulty === difficulty &&
        !usedIndices.has(s._index)
    );

  // 후보 부족 시 전체에서 선택
  const pool =
    candidates.length >= DAILY_COUNT
      ? candidates
      : sentences
          .map((s, i) => ({ ...s, _index: i }))
          .filter((s) => s.theme === theme && s.difficulty === difficulty);

  // 4. 셔플 후 3개 선택
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, DAILY_COUNT);

  // 5. 캐시 저장
  await AsyncStorage.setItem(cacheKey, JSON.stringify(selected));

  // 6. 최근 사용 목록 업데이트
  const newRecent = [
    ...activeRecent,
    ...selected.map((s) => ({ index: s._index, date: today })),
  ];
  await AsyncStorage.setItem(recentKey, JSON.stringify(newRecent));

  return selected;
}
```

### useDailySentences 수정

```typescript
// src/hooks/useDailySentences.ts (수정)

import { useState, useCallback } from 'react';
import { selectDailySentences } from '../services/sentenceSelector';
import api from '../services/api';
import type { Sentence, Theme, Difficulty } from '../types';

export function useDailySentences() {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (theme: Theme, difficulty?: Difficulty) => {
    setLoading(true);
    setError(null);
    try {
      // 1단계: 로컬에서 문장 선정
      const localSentences = await selectDailySentences(
        theme,
        difficulty || 'beginner'
      );

      // 2단계: 서버에 선정 결과 등록 (완료 상태 동기화용)
      try {
        const res = await api.post('/sentences/daily/sync', {
          theme,
          difficulty: difficulty || 'beginner',
          sentenceTexts: localSentences.map((s) => s.koreanText),
        });
        // 서버 응답에 isCompleted 정보 포함
        setSentences(res.data.data);
      } catch {
        // 서버 연결 실패 시 로컬 데이터만 사용
        setSentences(
          localSentences.map((s, i) => ({
            id: `local-${i}`,
            koreanText: s.koreanText,
            theme: s.theme as Theme,
            difficulty: 0,
            hintWords: s.hintWords,
            order: i + 1,
            isCompleted: false,
          }))
        );
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : '문장을 불러오지 못했습니다.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return { sentences, loading, error, fetch };
}
```

---

## 서버 변경사항

### 새 엔드포인트: POST /api/sentences/daily/sync

앱에서 선정한 문장을 서버에 등록하고, 완료 상태를 반환한다.

```
POST /api/sentences/daily/sync
Body: {
  theme: string,
  difficulty: string,
  sentenceTexts: string[]   // koreanText 배열
}
Response: {
  data: Sentence[]  // id, isCompleted 포함
}
```

서버는 koreanText로 DB에서 문장을 찾아 daily_sentences 레코드를 생성하고, 교정 완료 여부를 함께 반환한다.

### 기존 GET /api/sentences/daily 유지

하위 호환성을 위해 기존 엔드포인트는 유지한다. 앱 v1.0 사용자가 업데이트하지 않아도 동작한다.

---

## 문장 데이터 업데이트 전략

| 방법 | 시점 | 설명 |
|------|------|------|
| 앱 업데이트 | 버전 릴리스 시 | sentences.json을 새 버전에 포함 |
| OTA 업데이트 | EAS Update 시 | Expo OTA로 JS 번들 업데이트하면 JSON도 함께 갱신 |

Expo EAS Update를 사용하면 앱스토어 심사 없이 문장 데이터를 업데이트할 수 있으므로, 별도의 서버 기반 문장 다운로드 시스템은 불필요하다.

---

## 마이그레이션 단계

1. **Phase 1**: `src/data/sentences.json` 추가, `sentenceSelector.ts` 구현
2. **Phase 2**: `useDailySentences` 수정 (로컬 우선 + 서버 동기화)
3. **Phase 3**: 서버에 `/sentences/daily/sync` 엔드포인트 추가
4. **Phase 4**: 테스트 (오프라인 모드, 중복 방지, 서버 동기화)
5. **Phase 5**: 배포 후 모니터링, 기존 GET /sentences/daily 사용량 추적

---

## 오프라인 모드 동작

```
네트워크 O:  로컬 문장 선정 → 서버 동기화 → AI 교정 → 결과 저장
네트워크 X:  로컬 문장 선정 → 문장 표시 → 작문 입력 → "교정은 온라인 연결 후 가능합니다" 안내
```

오프라인에서 작성한 영작문은 로컬에 임시 저장하고, 온라인 복귀 시 자동으로 교정 API를 호출하는 것은 v1.2에서 고려한다.
