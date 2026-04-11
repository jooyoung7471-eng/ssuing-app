import { create } from 'zustand';
import type { Sentence, CorrectionResult, Theme } from '../types';

interface PracticeState {
  theme: Theme | null;
  sentences: Sentence[];
  currentIndex: number;
  corrections: Record<string, CorrectionResult>;
  drafts: Record<string, string>;
  completionShown: boolean;

  setTheme: (theme: Theme) => void;
  setSentences: (sentences: Sentence[]) => void;
  setCurrentIndex: (index: number) => void;
  setCorrection: (sentenceId: string, result: CorrectionResult) => void;
  setDraft: (sentenceId: string, text: string) => void;
  setCompletionShown: (shown: boolean) => void;
  resetForTheme: (newTheme: Theme) => void;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  theme: null,
  sentences: [],
  currentIndex: 0,
  corrections: {},
  drafts: {},
  completionShown: false,

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
      });
    }
  },
}));
