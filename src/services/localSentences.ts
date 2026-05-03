import AsyncStorage from '@react-native-async-storage/async-storage';
import allSentences from '../data/sentences.json';
import type { LocalSentence } from '../data/types';
import type { Sentence, Theme, Difficulty, CorrectionResult } from '../types';

const DAILY_COUNT = 3;
const RECYCLE_AFTER_DAYS = 30;

/**
 * 날짜 문자열 기반 시드로 결정적 셔플을 수행한다.
 * 같은 날짜 + 같은 배열이면 항상 같은 순서를 반환한다.
 */
function seededShuffle<T>(arr: T[], seed: string): T[] {
  const copy = [...arr];
  // 간단한 해시 함수: 날짜 문자열을 숫자 시드로 변환
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  // Fisher-Yates shuffle with seeded PRNG (mulberry32)
  let state = hash >>> 0;
  const random = (): number => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * 테마/난이도 조건에 맞는 문장 중 하루 3문장을 선택한다.
 * - 오늘 이미 선정된 문장이 있으면 캐시에서 반환
 * - 최근 30일 사용 문장은 중복 방지
 * - 날짜 기반 시드로 결정적 셔플
 */
/**
 * 작문 결과(corrections)를 영속 저장.
 * 학습 화면 재진입 시 이전 작성 내역을 복원하기 위해 사용.
 * 키: corrections_${theme}_${difficulty}_${today}
 */
function correctionsKey(theme: Theme, difficulty: Difficulty): string {
  const today = getTodayString();
  return `corrections_${theme}_${difficulty}_${today}`;
}

function dailyKey(theme: Theme, difficulty: Difficulty): string {
  const today = getTodayString();
  return `daily_${theme}_${difficulty}_${today}`;
}

/**
 * 특정 문장의 완료 상태를 캐시에 반영한다.
 * 작문 완료 시 호출하여 홈 화면 진행률을 유지.
 *
 * BUG FIX: 캐시가 없는 경우 early return하지 않고 호출자가 보장하도록 함
 * (기존엔 캐시 미존재 시 silently 누락되어 진행률 영속성이 깨졌음)
 */
export async function markSentenceCompleted(
  theme: Theme,
  difficulty: Difficulty,
  sentenceId: string,
): Promise<void> {
  const cacheKey = dailyKey(theme, difficulty);
  const cached = await AsyncStorage.getItem(cacheKey);
  if (!cached) return;

  const sentences: Sentence[] = JSON.parse(cached);
  const updated = sentences.map((s) =>
    s.id === sentenceId ? { ...s, isCompleted: true } : s,
  );
  await AsyncStorage.setItem(cacheKey, JSON.stringify(updated));
}

export async function saveCorrection(
  theme: Theme,
  difficulty: Difficulty,
  sentenceId: string,
  result: CorrectionResult,
): Promise<void> {
  const key = correctionsKey(theme, difficulty);
  const raw = await AsyncStorage.getItem(key);
  const map: Record<string, CorrectionResult> = raw ? JSON.parse(raw) : {};
  map[sentenceId] = result;
  await AsyncStorage.setItem(key, JSON.stringify(map));
}

/**
 * 작문 완료를 단일 트랜잭션으로 영속화한다.
 * - daily_* 캐시(isCompleted 플래그) + corrections_* 캐시(작문 내용) 동시 갱신
 * - 호출자는 이 함수를 await하여, 홈 화면이 새로고침되기 전에 두 캐시가 모두 갱신됨을 보장해야 한다.
 *
 * BUG FIX: 기존엔 markSentenceCompleted + saveCorrection을 fire-and-forget으로 호출해
 *  - 두 캐시 중 한쪽만 갱신되어 홈/practice 진행률 불일치 발생
 *  - router.back() 직후 홈 useFocusEffect가 stale 캐시를 읽음
 */
export async function recordCompletion(
  theme: Theme,
  difficulty: Difficulty,
  sentenceId: string,
  result: CorrectionResult,
): Promise<void> {
  await Promise.all([
    markSentenceCompleted(theme, difficulty, sentenceId),
    saveCorrection(theme, difficulty, sentenceId, result),
  ]);
}

export async function loadCorrections(
  theme: Theme,
  difficulty: Difficulty,
): Promise<Record<string, CorrectionResult>> {
  const key = correctionsKey(theme, difficulty);
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * 캐시된 sentences 배열의 구조 유효성을 검증.
 * 빈 koreanText, 누락된 hintWords 등 손상된 데이터를 걸러낸다.
 *
 * BUG FIX: 이전 버전에서 빈 객체가 캐싱돼 한글 문장/힌트가 화면에 표시 안 되는
 * 사용자가 발생. 캐시 hit 시 무조건 반환하던 로직에 검증을 추가.
 */
function isValidCachedSentences(parsed: unknown): parsed is Sentence[] {
  if (!Array.isArray(parsed) || parsed.length === 0) return false;
  return parsed.every(
    (s) =>
      s &&
      typeof s === 'object' &&
      typeof (s as Sentence).id === 'string' &&
      typeof (s as Sentence).koreanText === 'string' &&
      (s as Sentence).koreanText.length > 0 &&
      Array.isArray((s as Sentence).hintWords),
  );
}

export async function getDailySentences(
  theme: Theme,
  difficulty: Difficulty = 'beginner',
): Promise<Sentence[]> {
  const today = getTodayString();
  const cacheKey = `daily_${theme}_${difficulty}_${today}`;

  // 1. 오늘 이미 선정된 문장이 있으면 반환 (단, 데이터 유효성 검증 후)
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (isValidCachedSentences(parsed)) {
        return parsed;
      }
      // 손상된 캐시: 제거 후 새로 생성
      await AsyncStorage.removeItem(cacheKey);
    } catch {
      await AsyncStorage.removeItem(cacheKey);
    }
  }

  // 2. 테마/난이도 필터링
  const typed = allSentences as LocalSentence[];
  const filtered = typed.filter(
    (s) => s.theme === theme && s.difficulty === difficulty,
  );

  // 해당 테마/난이도에 문장이 없으면 빈 배열 (travel 등 아직 없는 테마 대응)
  if (filtered.length === 0) {
    return [];
  }

  // 3. 최근 30일 사용 문장 ID 조회
  const recentKey = `recent_sentences_${theme}_${difficulty}`;
  const recentRaw = await AsyncStorage.getItem(recentKey);
  const recentUsed: { id: string; date: string }[] = recentRaw
    ? JSON.parse(recentRaw)
    : [];

  // 30일 지난 항목 제거
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RECYCLE_AFTER_DAYS);
  const activeRecent = recentUsed.filter(
    (r) => new Date(r.date) >= cutoff,
  );
  const usedIds = new Set(activeRecent.map((r) => r.id));

  // 4. 후보: 최근 30일에 사용하지 않은 문장
  let candidates = filtered.filter((s) => !usedIds.has(s.id));

  // 후보 부족 시 전체에서 선택 (중복 허용)
  if (candidates.length < DAILY_COUNT) {
    candidates = filtered;
  }

  // 5. 날짜 기반 시드 셔플 후 3개 선택
  const seed = `${today}_${theme}_${difficulty}`;
  const shuffled = seededShuffle(candidates, seed);
  const selected = shuffled.slice(0, DAILY_COUNT);

  // 6. Sentence 타입으로 변환
  const sentences: Sentence[] = selected.map((s, i) => ({
    id: s.id,
    koreanText: s.koreanText,
    theme: s.theme as Theme,
    difficulty: s.difficulty === 'beginner' ? 0 : 1,
    hintWords: s.hintWords,
    order: i + 1,
    isCompleted: false,
  }));

  // 7. 오늘 선정 결과 캐시
  await AsyncStorage.setItem(cacheKey, JSON.stringify(sentences));

  // 8. 최근 사용 목록 업데이트
  const newRecent = [
    ...activeRecent,
    ...selected.map((s) => ({ id: s.id, date: today })),
  ];
  await AsyncStorage.setItem(recentKey, JSON.stringify(newRecent));

  return sentences;
}
