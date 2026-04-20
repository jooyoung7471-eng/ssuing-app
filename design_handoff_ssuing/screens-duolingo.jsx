// Duolingo-flavored screens — playful, rounded, chunky shadows, illustrated mascots.
// All 7 screens rendered inside 390×780 viewports (fits iPhone 15 Pro inner area).

const T = window.TOKENS;

// ─── Illustrations (inline SVG, custom flat-cute style) ─────────────────
const Mascot = ({ size = 96, mood = 'happy' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    {/* owl body */}
    <ellipse cx="60" cy="74" rx="42" ry="38" fill="#58CC02"/>
    <ellipse cx="60" cy="74" rx="42" ry="38" fill="none" stroke="#58A700" strokeWidth="3"/>
    {/* belly */}
    <ellipse cx="60" cy="82" rx="26" ry="22" fill="#E8F5D4"/>
    {/* wings */}
    <path d="M22 70 Q14 82 22 96 Q30 90 28 78 Z" fill="#58A700"/>
    <path d="M98 70 Q106 82 98 96 Q90 90 92 78 Z" fill="#58A700"/>
    {/* eyes */}
    <circle cx="46" cy="54" r="14" fill="#fff"/>
    <circle cx="74" cy="54" r="14" fill="#fff"/>
    <circle cx="46" cy="54" r="14" fill="none" stroke="#58A700" strokeWidth="2.5"/>
    <circle cx="74" cy="54" r="14" fill="none" stroke="#58A700" strokeWidth="2.5"/>
    <circle cx="48" cy="56" r="6" fill="#1a1a1a"/>
    <circle cx="76" cy="56" r="6" fill="#1a1a1a"/>
    <circle cx="50" cy="54" r="2" fill="#fff"/>
    <circle cx="78" cy="54" r="2" fill="#fff"/>
    {/* beak */}
    <path d="M54 68 L60 76 L66 68 Q60 72 54 68 Z" fill="#FFC800" stroke="#E0A800" strokeWidth="1.5"/>
    {/* feet */}
    <path d="M48 110 L44 116 M48 110 L48 117 M48 110 L52 116" stroke="#FF9600" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M72 110 L68 116 M72 110 L72 117 M72 110 L76 116" stroke="#FF9600" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const IconPencil = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="20" y="32" width="56" height="22" rx="4" transform="rotate(-20 50 50)" fill="#FFC800" stroke="#E0A800" strokeWidth="3"/>
    <path d="M24 60 L16 74 L30 68 Z" transform="rotate(-20 50 50)" fill="#FFE8A0" stroke="#E0A800" strokeWidth="3"/>
    <rect x="64" y="32" width="10" height="22" transform="rotate(-20 50 50)" fill="#FF9600" stroke="#E0A800" strokeWidth="3"/>
    <circle cx="78" cy="24" r="4" fill="#fff" opacity="0.6"/>
  </svg>
);

const IconCheck = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="36" fill="#fff"/>
    <circle cx="50" cy="50" r="36" fill="none" stroke="#0A8F3B" strokeWidth="4"/>
    <path d="M32 50 L44 62 L66 38" stroke="#0A8F3B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const IconFlame = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 14 Q30 36 30 58 Q30 80 50 86 Q70 80 70 58 Q70 40 58 30 Q54 40 48 40 Q44 30 50 14 Z"
          fill="#FFC800" stroke="#E0A800" strokeWidth="3"/>
    <path d="M50 42 Q38 56 42 70 Q50 78 58 70 Q60 58 50 42 Z" fill="#FF9600"/>
    <circle cx="48" cy="66" r="5" fill="#FFE8A0" opacity="0.9"/>
  </svg>
);

// ─── Duolingo UI primitives ──────────────────────────────────────────────
const DuoBtn = ({ children, color = T.duoGreen, dark, block, small, style = {} }) => (
  <button style={{
    background: color,
    color: dark ? T.duoInk : '#fff',
    border: 'none',
    borderRadius: 14,
    padding: small ? '10px 20px' : '15px 22px',
    fontWeight: 800,
    fontSize: small ? 13 : 15,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    boxShadow: `0 4px 0 ${shade(color, -12)}`,
    cursor: 'pointer',
    width: block ? '100%' : 'auto',
    fontFamily: T.font,
    ...style,
  }}>{children}</button>
);

function shade(hex, pct) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + pct;
  let g = ((n >> 8) & 0xff) + pct;
  let b = (n & 0xff) + pct;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

const DuoScreen = ({ children, bg = T.bg, pad = true }) => (
  <div style={{
    width: 390, height: 780,
    background: bg,
    position: 'relative',
    overflow: 'hidden',
    color: T.duoInk,
    fontFamily: T.font,
    fontWeight: 500,
  }}>
    <DuoStatusBar dark={typeof bg === 'string' && bg !== T.bg && bg !== '#FFFFFF' && bg !== T.surface} />
    {children}
  </div>
);

const DuoStatusBar = ({ dark }) => (
  <div style={{ height: 58 }}/>
);

// ═════════════════════════════════════════════════════════════════════════
// 1. ONBOARDING — 3장 스와이프 (duo style)
// ═════════════════════════════════════════════════════════════════════════
const DuoOnboarding = () => (
  <DuoScreen bg={T.onbPurple}>
    {/* decorative bubbles */}
    <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>
    <div style={{ position: 'absolute', top: 120, left: -60, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }}/>
    <div style={{ position: 'absolute', bottom: 140, right: -30, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>

    <div style={{ padding: '10px 24px', display: 'flex', justifyContent: 'flex-end' }}>
      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: 600 }}>건너뛰기</span>
    </div>

    <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', paddingTop: 80 }}>
      <div style={{
        width: 160, height: 160, margin: '0 auto 32px',
        borderRadius: '50%', background: 'rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '4px solid rgba(255,255,255,0.3)',
      }}>
        <IconPencil size={100}/>
      </div>
      <h1 style={{ color: '#fff', fontSize: 34, fontWeight: 900, margin: '0 0 16px', letterSpacing: -0.8 }}>
        쓰면, 늘어요
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, fontWeight: 500, padding: '0 40px', lineHeight: 1.5, margin: 0 }}>
        매일 영어 문장을 쓰며<br/>자연스럽게 영작 실력을 키워요
      </p>
    </div>

    {/* dots + CTA */}
    <div style={{ position: 'absolute', bottom: 40, left: 24, right: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
        <span style={{ width: 24, height: 8, borderRadius: 4, background: '#fff' }}/>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.4)' }}/>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.4)' }}/>
      </div>
      <DuoBtn color="#fff" dark block>다음</DuoBtn>
    </div>
  </DuoScreen>
);

// ═════════════════════════════════════════════════════════════════════════
// 2. LOGIN
// ═════════════════════════════════════════════════════════════════════════
const DuoLogin = () => (
  <DuoScreen bg="#fff">
    {/* purple gradient header */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 360,
      background: `linear-gradient(160deg, ${T.onbPurple} 0%, #7C3AED 100%)`,
      borderRadius: '0 0 32px 32px',
    }}>
      <div style={{ position: 'absolute', top: 40, right: 30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
      <div style={{ position: 'absolute', top: 120, left: 20, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>
    </div>

    <DuoStatusBar dark/>
    <div style={{ position: 'relative', textAlign: 'center', paddingTop: 60 }}>
      <div style={{
        width: 88, height: 88, margin: '0 auto 16px',
        background: '#fff', borderRadius: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      }}>
        <span style={{ fontSize: 42, fontWeight: 900, color: T.onbPurple }}>쓰</span>
      </div>
      <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 900, margin: '0 0 8px', letterSpacing: -1 }}>쓰잉</h1>
      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, margin: 0, fontWeight: 500 }}>매일 영어 작문 습관</p>
    </div>

    {/* social login */}
    <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <SocialBtn bg="#000" color="#fff" icon="" label="Apple로 계속하기" />
      <SocialBtn bg="#fff" color="#222" border icon="G" label="Google로 계속하기" iconBg="#4285F4" iconColor="#fff"/>
      <SocialBtn bg="#FEE500" color="#3A1D1D" icon="💬" label="카카오로 시작하기" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '10px 0 6px' }}>
        <div style={{ flex: 1, height: 1, background: T.border }}/>
        <span style={{ color: T.textSec, fontSize: 12, fontWeight: 600 }}>또는</span>
        <div style={{ flex: 1, height: 1, background: T.border }}/>
      </div>

      <button style={{
        background: 'transparent', color: T.textSec,
        border: `2px solid ${T.border}`, borderRadius: 14,
        padding: '14px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: T.font,
      }}>게스트로 둘러보기</button>
      <p style={{ fontSize: 11, color: T.textHint, textAlign: 'center', margin: '6px 0 0', lineHeight: 1.4 }}>
        게스트 모드에서는 학습 기록이 기기에만 저장됩니다
      </p>
    </div>
  </DuoScreen>
);

const SocialBtn = ({ bg, color, border, icon, label, iconBg, iconColor }) => (
  <button style={{
    background: bg, color,
    border: border ? `1.5px solid ${T.border}` : 'none',
    borderRadius: 14, padding: '14px 18px',
    fontSize: 15, fontWeight: 700, fontFamily: T.font,
    display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
  }}>
    <span style={{
      width: 24, height: 24, borderRadius: 6,
      background: iconBg || 'transparent', color: iconColor || color,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, fontWeight: 900,
    }}>{icon}</span>
    <span style={{ flex: 1, textAlign: 'center', marginRight: 24 }}>{label}</span>
  </button>
);

// ═════════════════════════════════════════════════════════════════════════
// 3. TERMS
// ═════════════════════════════════════════════════════════════════════════
const DuoTerms = () => {
  const items = [
    { req: true,  label: '이용약관 동의', checked: true },
    { req: true,  label: '개인정보처리방침 동의', checked: true },
    { req: true,  label: '만 14세 이상입니다', checked: true },
    { req: false, label: '마케팅 정보 수신 동의', checked: false },
    { req: false, label: '푸시 알림 수신 동의', checked: true },
  ];
  return (
    <DuoScreen bg="#fff">
      <div style={{ padding: '12px 24px 0' }}>
        <button style={{ background: 'transparent', border: 'none', fontSize: 24, color: T.duoInk, padding: 0, cursor: 'pointer' }}>←</button>
      </div>
      <div style={{ padding: '12px 24px 20px' }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 8px', letterSpacing: -0.5 }}>약관 동의</h2>
        <p style={{ color: T.textSec, fontSize: 14, margin: 0, lineHeight: 1.5 }}>
          쓰잉을 시작하기 위해<br/>약관을 확인하고 동의해주세요
        </p>
      </div>

      <div style={{ margin: '0 24px 16px', padding: 18, background: T.duoGreen + '15', border: `2px solid ${T.duoGreen}30`, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Checkbox checked big color={T.duoGreen}/>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: T.duoInk }}>전체 동의</div>
          <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>선택 항목 포함</div>
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        {items.map((it, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 4px',
            borderTop: i > 0 ? `1px solid ${T.border}` : 'none',
          }}>
            <Checkbox checked={it.checked} color={T.duoGreen}/>
            <span style={{ flex: 1, fontSize: 14, color: T.duoInk }}>
              <span style={{ color: it.req ? T.duoRed : T.textSec, fontWeight: 700, marginRight: 6 }}>
                [{it.req ? '필수' : '선택'}]
              </span>
              {it.label}
            </span>
            <span style={{ color: T.textSec, fontSize: 12, fontWeight: 600, textDecoration: 'underline' }}>보기</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24 }}>
        <DuoBtn color={T.duoGreen} block>동의하고 시작하기</DuoBtn>
      </div>
    </DuoScreen>
  );
};

const Checkbox = ({ checked, big, color = T.duoGreen }) => (
  <span style={{
    width: big ? 28 : 22, height: big ? 28 : 22,
    borderRadius: 8,
    background: checked ? color : '#fff',
    border: `2px solid ${checked ? color : T.borderStrong}`,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }}>
    {checked && (
      <svg width={big ? 16 : 12} height={big ? 16 : 12} viewBox="0 0 14 14">
        <path d="M2 7 L6 11 L12 3" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )}
  </span>
);

// ═════════════════════════════════════════════════════════════════════════
// 4. HOME ★★★ hero
// ═════════════════════════════════════════════════════════════════════════
const DuoHome = () => (
  <DuoScreen bg="#fff">
    {/* Header */}
    <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 900, fontSize: 18,
          boxShadow: `0 3px 0 ${T.primaryDeep}`,
        }}>쓰</div>
        <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>쓰잉</span>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 12px', background: '#FFF5E0', borderRadius: 999,
        border: `2px solid ${T.duoOrange}`,
      }}>
        <span style={{ fontSize: 16 }}>🔥</span>
        <span style={{ fontWeight: 900, color: T.duoOrange, fontSize: 14 }}>12일</span>
      </div>
    </div>

    {/* Profile card */}
    <div style={{ margin: '0 20px 20px', borderRadius: 20, overflow: 'hidden',
      background: `linear-gradient(135deg, var(--primary) 0%, ${T.primaryDeep} 100%)`,
      boxShadow: `0 4px 0 ${T.primaryDeep}`, color: '#fff', padding: 18,
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, position: 'relative' }}>
        <div style={{
          width: 50, height: 50, borderRadius: 14,
          background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 900,
        }}>Lv.8</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>김쓰잉님, 오늘도!</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>중급 학습자 · 목표: Lv.10</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <Stat k="완료" v="147"/>
        <Stat k="만점" v="23"/>
        <Stat k="최장" v="18일"/>
      </div>
      <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
        <span>Lv.8 진행도</span><span>780 / 1000 XP</span>
      </div>
      <div style={{ height: 10, background: 'rgba(0,0,0,0.2)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: '78%', height: '100%', background: T.duoYellow, borderRadius: 999, boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.15)' }}/>
      </div>
    </div>

    {/* Difficulty */}
    <div style={{ padding: '0 20px 14px', display: 'flex', gap: 8 }}>
      <DifficultyPill label="초급" />
      <DifficultyPill label="중급" active/>
    </div>

    {/* Theme cards */}
    <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <ThemeCard emoji="📝" title="일상 영어" sub="아침 루틴, 카페, 쇼핑" done={2} bg="var(--primary)" deep={T.primaryDeep}/>
      <ThemeCard emoji="💼" title="비즈니스" sub="이메일, 회의, 보고" done={1} bg={T.secondary} deep={T.secondaryDeep}/>
      <ThemeCard emoji="✈️" title="여행 영어" sub="공항, 호텔, 레스토랑" done={3} bg={T.travel} deep="#0A8F6A"/>
    </div>

    {/* Quick access */}
    <div style={{ padding: '16px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      <QuickItem icon="📚" label="오답 복습" count="4"/>
      <QuickItem icon="📊" label="주간 리포트"/>
      <QuickItem icon="🏆" label="업적" count="8/24"/>
      <QuickItem icon="📖" label="학습 기록"/>
    </div>
  </DuoScreen>
);

const Stat = ({ k, v }) => (
  <div style={{
    flex: 1, padding: '8px 4px', borderRadius: 12,
    background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.2)',
    textAlign: 'center',
  }}>
    <div style={{ fontSize: 18, fontWeight: 900 }}>{v}</div>
    <div style={{ fontSize: 10, opacity: 0.85, fontWeight: 600 }}>{k}</div>
  </div>
);

const DifficultyPill = ({ label, active }) => (
  <button style={{
    flex: 1, padding: '10px 14px', borderRadius: 999,
    background: active ? T.duoInk : '#fff',
    color: active ? '#fff' : T.duoInk,
    border: `2px solid ${active ? T.duoInk : T.border}`,
    fontSize: 14, fontWeight: 800,
    boxShadow: active ? `0 3px 0 #000` : `0 2px 0 ${T.border}`,
    cursor: 'pointer', fontFamily: T.font,
  }}>{label}</button>
);

const ThemeCard = ({ emoji, title, sub, done, bg, deep }) => (
  <div style={{
    borderRadius: 18, padding: 16,
    background: `linear-gradient(135deg, ${bg} 0%, ${deep} 100%)`,
    boxShadow: `0 4px 0 ${deep}`,
    color: '#fff',
    display: 'flex', alignItems: 'center', gap: 14,
    position: 'relative', overflow: 'hidden',
  }}>
    <div style={{
      width: 56, height: 56, borderRadius: 16,
      background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 28,
    }}>{emoji}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 8 }}>{sub}</div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width: 10, height: 10, borderRadius: '50%',
            background: i < done ? '#fff' : 'rgba(255,255,255,0.3)',
            border: i < done ? 'none' : '1.5px solid rgba(255,255,255,0.4)',
          }}/>
        ))}
        <span style={{ fontSize: 12, fontWeight: 700, marginLeft: 6 }}>{done}/3</span>
      </div>
    </div>
    <span style={{ fontSize: 20, opacity: 0.7 }}>›</span>
  </div>
);

const QuickItem = ({ icon, label, count }) => (
  <div style={{
    background: '#fff', borderRadius: 14, padding: 12,
    border: `2px solid ${T.border}`,
    boxShadow: `0 2px 0 ${T.border}`,
    display: 'flex', alignItems: 'center', gap: 10,
  }}>
    <span style={{ fontSize: 20 }}>{icon}</span>
    <span style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>{label}</span>
    {count && <span style={{ fontSize: 11, fontWeight: 800, color: T.duoOrange, background: '#FFF5E0', padding: '2px 6px', borderRadius: 6 }}>{count}</span>}
  </div>
);

// ═════════════════════════════════════════════════════════════════════════
// 5. PRACTICE (correction result)
// ═════════════════════════════════════════════════════════════════════════
const DuoPractice = () => (
  <DuoScreen bg={T.bg}>
    {/* Colored header */}
    <div style={{
      position: 'relative',
      background: `linear-gradient(135deg, var(--primary) 0%, ${T.primaryDeep} 100%)`,
      padding: '0 20px 22px',
      borderRadius: '0 0 24px 24px',
      marginTop: -50, paddingTop: 50,
    }}>
      <div style={{ position: 'absolute', top: 20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
      <div style={{ position: 'absolute', top: 70, right: 40, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }}/>
      <div style={{ position: 'absolute', top: 90, left: 30, width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }}/>
      <DuoStatusBar dark/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', marginTop: 6 }}>
        <span style={{ fontSize: 22 }}>📝</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>일상 영어</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>2026. 4. 20 (월)</div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.22)', padding: '6px 12px', borderRadius: 999,
          fontSize: 13, fontWeight: 800, border: '1.5px solid rgba(255,255,255,0.3)',
        }}>2 / 3</div>
      </div>
    </div>

    <div style={{ padding: '14px 18px 18px', overflow: 'hidden', maxHeight: 580 }}>
      {/* Score */}
      <div style={{
        background: '#fff', borderRadius: 18, padding: 14, marginBottom: 12,
        border: `2px solid ${T.border}`, boxShadow: `0 2px 0 ${T.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 36, fontWeight: 900, color: T.duoGreenDeep }}>85</span>
          <span style={{ fontSize: 14, color: T.textSec, fontWeight: 600 }}>/ 100점</span>
          <span style={{ flex: 1 }}/>
          <span style={{ fontSize: 12, fontWeight: 800, color: T.duoGreenDeep, background: T.duoGreen + '20', padding: '4px 10px', borderRadius: 999 }}>
            잘했어요! 💪
          </span>
        </div>
        <div style={{ height: 10, background: T.duoGray, borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: '85%', height: '100%',
            background: `linear-gradient(90deg, ${T.duoGreen}, ${T.duoGreenDeep})`,
            borderRadius: 999, boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.15)' }}/>
        </div>
      </div>

      {/* My writing */}
      <ResultCard
        tint="blue" label="내 작문"
        body="I am go to cafe with my friend yesterday."
      />
      <ResultCard
        tint="green" label="교정 문장"
        body="I went to a cafe with my friend yesterday."
      />

      {/* Correction point */}
      <div style={{
        background: '#FFF6E6', borderRadius: 14, padding: 12, marginBottom: 10,
        border: `2px solid ${T.duoOrange}40`,
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: T.duoOrange, marginBottom: 6, display: 'flex', gap: 6 }}>
          <span>⚡</span><span>수정 포인트</span>
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.6 }}>
          <span style={{ textDecoration: 'line-through', color: T.textHint }}>am go</span>
          <span style={{ color: T.duoGreenDeep, fontWeight: 800, marginLeft: 8 }}>→ went</span>
        </div>
      </div>

      {/* Explanation */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 12, border: `1.5px solid ${T.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: T.textSec, marginBottom: 4 }}>💡 설명</div>
        <div style={{ fontSize: 13, color: T.duoInk, lineHeight: 1.55 }}>
          과거(yesterday)에 일어난 일이므로 과거형 <b>went</b>를 써요.
        </div>
      </div>
    </div>

    {/* Nav */}
    <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
      <button style={{
        width: 48, height: 48, borderRadius: 14, background: '#fff',
        border: `2px solid ${T.border}`, boxShadow: `0 2px 0 ${T.border}`,
        fontSize: 20, cursor: 'pointer',
      }}>←</button>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.duoGreen }}/>
        <span style={{ width: 24, height: 8, borderRadius: 4, background: 'var(--primary)' }}/>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.duoGray }}/>
      </div>
      <DuoBtn color="var(--primary)" style={{ flex: 'unset', padding: '14px 26px' }}>다음 →</DuoBtn>
    </div>
  </DuoScreen>
);

const ResultCard = ({ tint, label, body }) => {
  const c = tint === 'blue'
    ? { bg: T.primarySoft, bar: 'var(--primary)', label: T.primaryDeep }
    : { bg: T.duoGreen + '15', bar: T.duoGreen, label: T.duoGreenDeep };
  return (
    <div style={{
      background: c.bg, borderRadius: 14, padding: 12, marginBottom: 10,
      borderLeft: `5px solid ${c.bar}`,
    }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: c.label, marginBottom: 4, letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, color: T.duoInk, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// 6. HISTORY
// ═════════════════════════════════════════════════════════════════════════
const DuoHistory = () => {
  const items = [
    { ko: '어제 친구와 카페에 갔어요.', score: 85, date: '오늘' },
    { ko: '회의는 오후 3시에 시작됩니다.', score: 92, date: '오늘' },
    { ko: '공항까지 택시로 얼마나 걸리나요?', score: 78, date: '어제' },
    { ko: '이메일을 보내드리겠습니다.', score: 100, date: '어제' },
    { ko: '커피 한 잔 주문할게요.', score: 65, date: '2일 전' },
    { ko: '숙소를 예약하고 싶습니다.', score: 88, date: '3일 전' },
  ];
  const scoreColor = (s) => s >= 85 ? T.duoGreen : s >= 70 ? T.duoOrange : T.duoRed;
  return (
    <DuoScreen bg={T.bg}>
      <div style={{ padding: '0 20px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={{ background: 'transparent', border: 'none', fontSize: 22, padding: 0, cursor: 'pointer' }}>←</button>
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: -0.5 }}>학습 기록</h2>
      </div>
      <div style={{ padding: '8px 20px 14px', display: 'flex', gap: 8 }}>
        <FilterChip label="전체" active/>
        <FilterChip label="일상"/>
        <FilterChip label="비즈니스"/>
        <FilterChip label="여행"/>
      </div>
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 14, padding: 14,
            border: `2px solid ${T.border}`, boxShadow: `0 2px 0 ${T.border}`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12,
              background: scoreColor(it.score),
              color: '#fff', fontWeight: 900, fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 2px 0 ${shade(scoreColor(it.score), -20)}`,
              flexShrink: 0,
            }}>{it.score}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.duoInk, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {it.ko}
              </div>
              <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>{it.date}</div>
            </div>
            <span style={{ color: T.textHint, fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>
    </DuoScreen>
  );
};

const FilterChip = ({ label, active }) => (
  <span style={{
    padding: '6px 14px', borderRadius: 999,
    background: active ? T.duoInk : '#fff',
    color: active ? '#fff' : T.textSec,
    border: `2px solid ${active ? T.duoInk : T.border}`,
    fontSize: 12, fontWeight: 800,
  }}>{label}</span>
);

// ═════════════════════════════════════════════════════════════════════════
// 7. SETTINGS
// ═════════════════════════════════════════════════════════════════════════
const DuoSettings = () => (
  <DuoScreen bg={T.bg}>
    <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <button style={{ background: 'transparent', border: 'none', fontSize: 22, padding: 0, cursor: 'pointer' }}>←</button>
      <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: -0.5 }}>설정</h2>
    </div>
    {/* User card */}
    <div style={{
      margin: '0 20px 14px', padding: 16, borderRadius: 18, background: '#fff',
      border: `2px solid ${T.border}`, boxShadow: `0 3px 0 ${T.border}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: `linear-gradient(135deg, var(--primary), ${T.primaryDeep})`,
        color: '#fff', fontSize: 22, fontWeight: 900,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>쓰</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 800 }}>김쓰잉</div>
        <div style={{ fontSize: 12, color: T.textSec }}>ssuing@kakao.com</div>
        <div style={{
          display: 'inline-block', marginTop: 4, padding: '2px 8px',
          background: '#FFF5E0', color: T.duoOrange, fontSize: 10, fontWeight: 800,
          borderRadius: 6,
        }}>카카오 로그인</div>
      </div>
    </div>

    <Section title="알림">
      <Row label="푸시 알림" right={<Toggle on/>} />
      <Row label="리마인더 시간" right={<span style={{ color: T.textSec, fontSize: 13, fontWeight: 600 }}>오후 9:00 ›</span>}/>
    </Section>

    <Section title="계정">
      <Row label="개인정보처리방침" right={<Arrow/>}/>
      <Row label="이용약관" right={<Arrow/>}/>
      <Row label="문의하기" right={<Arrow/>}/>
      <Row label="버전 정보" right={<span style={{ color: T.textHint, fontSize: 13 }}>v1.2.3</span>}/>
    </Section>

    <div style={{ padding: '12px 20px 0', display: 'flex', gap: 8 }}>
      <button style={{
        flex: 1, background: '#fff', color: T.duoInk,
        border: `2px solid ${T.border}`, boxShadow: `0 2px 0 ${T.border}`,
        borderRadius: 14, padding: '12px', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: T.font,
      }}>로그아웃</button>
      <button style={{
        flex: 1, background: '#fff', color: T.duoRed,
        border: `2px solid ${T.duoRed}30`, boxShadow: `0 2px 0 ${T.duoRed}30`,
        borderRadius: 14, padding: '12px', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: T.font,
      }}>회원 탈퇴</button>
    </div>
  </DuoScreen>
);

const Section = ({ title, children }) => (
  <div style={{ padding: '0 20px 14px' }}>
    <div style={{ fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: 'uppercase', letterSpacing: 0.8, padding: '0 4px 6px' }}>
      {title}
    </div>
    <div style={{ background: '#fff', borderRadius: 16, border: `2px solid ${T.border}`, boxShadow: `0 2px 0 ${T.border}`, overflow: 'hidden' }}>
      {children}
    </div>
  </div>
);

const Row = ({ label, right }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '13px 14px', borderBottom: `1px solid ${T.border}`,
    fontSize: 14, fontWeight: 600,
  }}>
    <span>{label}</span>
    {right}
  </div>
);

const Toggle = ({ on }) => (
  <span style={{
    width: 44, height: 26, borderRadius: 999,
    background: on ? T.duoGreen : T.duoGray,
    position: 'relative', display: 'inline-block',
    boxShadow: `inset 0 2px 0 ${on ? T.duoGreenDeep : '#CCC'}`,
  }}>
    <span style={{
      position: 'absolute', top: 2, left: on ? 20 : 2,
      width: 22, height: 22, borderRadius: '50%', background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
    }}/>
  </span>
);

const Arrow = () => <span style={{ color: T.textHint, fontSize: 16 }}>›</span>;

// ─── Export ──────────────────────────────────────────────────────────────
window.DuoScreens = {
  Onboarding: DuoOnboarding,
  Login: DuoLogin,
  Terms: DuoTerms,
  Home: DuoHome,
  Practice: DuoPractice,
  History: DuoHistory,
  Settings: DuoSettings,
};
