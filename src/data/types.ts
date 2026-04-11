import type { HintWord } from '../types';

/**
 * 로컬 JSON 번들에 저장되는 문장 데이터 구조.
 * seed-sentences.json 의 각 항목에 고유 id가 추가된 형태.
 */
export interface LocalSentence {
  id: string;
  koreanText: string;
  theme: string;
  difficulty: string;
  category: string;
  hintWords: HintWord[];
  tags: string[];
}
