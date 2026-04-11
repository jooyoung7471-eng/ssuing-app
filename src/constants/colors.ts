export const colors = {
  primary: '#4A90D9',
  primaryLight: '#6BA3E0',
  primaryDark: '#3A7BC8',
  secondary: '#7C4DFF',
  secondaryLight: '#9B7BFF',
  success: '#4CAF50',
  successLight: '#E8F5E9',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  error: '#F44336',
  errorLight: '#FFEBEE',
  background: '#FAFBFC',
  card: '#FFFFFF',
  disabled: '#D1D5DB',
  text: {
    primary: '#1A1A2E',
    secondary: '#6B7280',
    hint: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  border: '#E5E7EB',
  borderFocus: '#4A90D9',
  hint: {
    background: '#F5F3FF',
    border: '#E8E0FF',
  },
  score: {
    high: '#4CAF50',
    medium: '#FF9800',
    low: '#F44336',
  },
} as const;

export function getScoreColor(score: number): string {
  if (score >= 8) return colors.score.high;
  if (score >= 5) return colors.score.medium;
  return colors.score.low;
}
