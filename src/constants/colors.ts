export const colors = {
  // Brand
  primary: '#4A90D9',
  primaryLight: '#E8F1FB',
  primaryDark: '#2E6DB3',
  secondary: '#7C4DFF',
  secondaryLight: '#EFE9FF',
  secondaryDark: '#5E35CC',

  // Status
  success: '#22C55E',
  successLight: '#E6F7EC',
  warning: '#F59E0B',
  warningLight: '#FEF3DC',
  error: '#EF4444',
  errorLight: '#FDECEC',

  // Surface
  background: '#FAFBFC',
  card: '#FFFFFF',
  surfaceAlt: '#F4F5F7',
  border: '#EAECEF',
  borderStrong: '#D7DBE0',
  disabled: '#D1D5DB',

  // Text
  text: {
    primary: '#1A1A2E',
    secondary: '#6B7280',
    hint: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  // Theme
  theme: {
    daily: '#4A90D9',
    dailySoft: '#E8F1FB',
    biz: '#7C4DFF',
    bizSoft: '#EFE9FF',
    travel: '#10B981',
    travelSoft: '#DCF5EC',
  },

  // Onboarding
  onboarding: {
    purple: '#4F46E5',
    green: '#10B981',
    amber: '#F59E0B',
  },

  // Score (100점 기준)
  score: {
    high: '#22C55E',
    medium: '#F59E0B',
    low: '#EF4444',
  },

  // Legacy aliases
  primarySoft: '#E8F1FB',
  borderFocus: '#4A90D9',
  travelPrimary: '#10B981',
  hint: {
    background: '#EFE9FF',
    border: '#D7DBE0',
  },
} as const;

export function getScoreColor(score: number): string {
  if (score >= 8) return colors.score.high;
  if (score >= 5) return colors.score.medium;
  return colors.score.low;
}

export function getScoreColor100(score: number): string {
  if (score >= 80) return colors.score.high;
  if (score >= 60) return colors.score.medium;
  return colors.score.low;
}
