import { create } from 'zustand';
import type { Sentence, CorrectionResult, Theme } from '../types';

interface PracticeState {
  theme: Theme | null;
  sentences: Sentence[];
  currentIndex: number;
  corrections: Record<string, CorrectionResult>;
  drafts: Record<string, string>;
  completionShown: boolean;
  /** corrections를 캐시에서 불러왔는지 여부 — practice 화면이 fetch 전에 hydrate를 강제하기 위함 */
  correctionsHydrated: boolean;

  setTheme: (theme: Theme) => void;
  setSentences: (sentences: Sentence[]) => void;
  setCurrentIndex: (index: number) => void;
  setCorrection: (sentenceId: string, result: CorrectionResult) => void;
  setDraft: (sentenceId: string, text: string) => void;
  setCompletionShown: (shown: boolean) => void;
  resetForTheme: (newTheme: Theme) => void;
  /** 캐시(AsyncStorage)에서 불러온 corrections를 메모리 store에 병합 */
  hydrateCorrections: (corrections: Record<string, CorrectionResult>) => void;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  theme: null,
  sentences: [],
  currentIndex: 0,
  corrections: {},
  drafts: {},
  completionShown: false,
  correctionsHydrated: false,

  setTheme: (theme) => set({ theme }),
  setSentences: (sentences) => set({ sentences }),
  setCurrentIndex: (currentIndex) => set({ currentIndex }),
  setCorrection: (sentenceId, result) =>
    set((state) => ({
      corrections: { ...state.corrections, [sentenceId]: result },
    })),
  setDraft: (sentenceId, text) =>
    set((state) => ({
      drafts: { ...state.drafts, [sentenceId]: text },
    })),
  setCompletionShown: (completionShown) => set({ completionShown }),
  // Only reset if switching to a different theme — preserve state when re-entering same theme
  resetForTheme: (newTheme) => {
    const { theme: currentTheme } = get();
    if (currentTheme !== newTheme) {
      set({
        theme: newTheme,
        sentences: [],
        currentIndex: 0,
        corrections: {},
        drafts: {},
        completionShown: false,
        correctionsHydrated: false,
      });
    }
  },
  hydrateCorrections: (loaded) =>
    set((state) => ({
      // 메모리에 이미 있는 항목은 우선 (최신 작성 보존), 없으면 캐시값 사용
      corrections: { ...loaded, ...state.corrections },
      correctionsHydrated: true,
    })),
}));
