// Design tokens — refined from the SSuing brand spec.
// Three style variants share the same semantic scale but apply it differently.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#4A90D9"
}/*EDITMODE-END*/;

// ── Pretendard webfont ─────────────────────────────────────
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
document.head.appendChild(fontLink);

// ── Base tokens ────────────────────────────────────────────
window.TOKENS = {
  // Refined palette — slightly desaturated for a premium feel
  primary:       '#4A90D9',   // blue (hero)
  primarySoft:   '#E8F1FB',
  primaryDeep:   '#2E6DB3',

  secondary:     '#7C4DFF',
  secondarySoft: '#EFE9FF',
  secondaryDeep: '#5E35CC',

  success:       '#22C55E',
  successSoft:   '#E6F7EC',
  warning:       '#F59E0B',
  warningSoft:   '#FEF3DC',
  error:         '#EF4444',
  errorSoft:     '#FDECEC',

  travel:        '#10B981',
  travelSoft:    '#DCF5EC',

  daily:         '#4A90D9',
  dailySoft:     '#E8F1FB',
  biz:           '#7C4DFF',
  bizSoft:       '#EFE9FF',

  bg:            '#FAFBFC',
  surface:       '#FFFFFF',
  surfaceAlt:    '#F4F5F7',
  border:        '#EAECEF',
  borderStrong:  '#D7DBE0',

  text:          '#1A1A2E',
  textSec:       '#6B7280',
  textHint:      '#9CA3AF',

  // Onboarding accents (from spec)
  onbPurple:     '#4F46E5',
  onbGreen:      '#10B981',
  onbAmber:      '#F59E0B',

  // Duolingo-flavor accents for the playful variant
  duoGreen:      '#58CC02',
  duoGreenDeep:  '#58A700',
  duoBlue:       '#1CB0F6',
  duoYellow:     '#FFC800',
  duoOrange:     '#FF9600',
  duoRed:        '#FF4B4B',
  duoPurple:     '#CE82FF',
  duoInk:        '#3C3C3C',
  duoGray:       '#E5E5E5',

  // Notion-flavor
  notionInk:     '#37352F',
  notionPaper:   '#FFFFFF',
  notionBg:      '#F7F6F3',
  notionBorder:  '#E9E9E7',
  notionMuted:   '#787774',
  notionAccent:  '#2383E2',
  notionGreen:   '#0F7B6C',
  notionYellow:  '#CB912F',
  notionRed:     '#E03E3E',
  notionPurple:  '#6940A5',

  font: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
};

window.applyPrimary = function(color) {
  window.TOKENS.primary = color;
  window.TOKENS.daily = color;
  document.documentElement.style.setProperty('--primary', color);
  // force a re-render
  window.dispatchEvent(new CustomEvent('tokens:changed'));
};

document.documentElement.style.setProperty('--primary', TWEAK_DEFAULTS.primaryColor);

// ── Global base styles ─────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  :root { --primary: ${TWEAK_DEFAULTS.primaryColor}; }
  body, html { margin: 0; padding: 0; font-family: ${window.TOKENS.font}; }
  * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
  button { font-family: inherit; }
`;
document.head.appendChild(style);

window.TWEAK_DEFAULTS = TWEAK_DEFAULTS;
