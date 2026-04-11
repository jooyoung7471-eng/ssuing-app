import AsyncStorage from '@react-native-async-storage/async-storage';
import allSentences from '../data/sentences.json';
import type { LocalSentence } from '../data/types';
import type { Sentence, Theme, Difficulty } from '../types';

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
export async function getDailySentences(
  theme: Theme,
  difficulty: Difficulty = 'beginner',
): Promise<Sentence[]> {
  const today = getTodayString();
  const cacheKey = `daily_${theme}_${difficulty}_${today}`;

  // 1. 오늘 이미 선정된 문장이 있으면 반환
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached) as Sentence[];
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
