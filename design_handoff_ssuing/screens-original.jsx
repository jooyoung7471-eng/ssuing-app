// Original — premium editorial brand with soft gradients and iconographic character.
// Less game-y than duolingo, more crafted than notion. Uses curved top surfaces.

const O = window.TOKENS;

const OScreen = ({ children, bg = O.bg }) => (
  <div style={{
    width: 390, height: 780, background: bg, position: 'relative', overflow: 'hidden',
    color: O.text, fontFamily: O.font,
  }}>
    <OStatus dark={false}/>{children}
  </div>
);

// The iOS frame draws the real status bar + Dynamic Island on top; this
// is just a transparent spacer so app content starts below the island (~y=58).
const OStatus = ({ dark }) => (
  <div style={{ height: 58 }}/>
);

// 1. Onboarding — split layout: big illustration frame + text
const OOnboarding = () => (
  <OScreen bg="#FFFFFF">
    <div style={{ padding: '8px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <span style={{ width: 24, height: 4, background: O.onbPurple, borderRadius: 2 }}/>
        <span style={{ width: 8, height: 4, background: O.border, borderRadius: 2 }}/>
        <span style={{ width: 8, height: 4, background: O.border, borderRadius: 2 }}/>
      </div>
      <span style={{ fontSize: 14, color: O.textSec, fontWeight: 500 }}>건너뛰기</span>
    </div>

    {/* illustration frame */}
    <div style={{
      margin: '28px 24px 0', height: 340, borderRadius: 28,
      background: `linear-gradient(160deg, ${O.onbPurple} 0%, #7C3AED 100%)`,
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 20px 40px -12px rgba(79,70,229,0.4)',
    }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>

      {/* large glyph */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="180" height="180" viewBox="0 0 200 200">
          <rect x="50" y="70" width="100" height="70" rx="8" fill="#fff" opacity="0.95"/>
          <rect x="60" y="84" width="60" height="4" rx="2" fill="#4F46E5" opacity="0.6"/>
          <rect x="60" y="96" width="75" height="4" rx="2" fill="#4F46E5" opacity="0.4"/>
          <rect x="60" y="108" width="50" height="4" rx="2" fill="#4F46E5" opacity="0.6"/>
          <rect x="60" y="120" width="70" height="4" rx="2" fill="#4F46E5" opacity="0.4"/>
          {/* pencil */}
          <g transform="rotate(35 140 60)">
            <rect x="100" y="48" width="70" height="18" rx="3" fill="#FFC800"/>
            <path d="M170 48 L184 57 L170 66 Z" fill="#FF9600"/>
            <rect x="100" y="48" width="12" height="18" fill="#CE82FF"/>
          </g>
          <circle cx="56" cy="56" r="5" fill="#FFC800"/>
          <circle cx="148" cy="150" r="4" fill="#fff" opacity="0.6"/>
        </svg>
      </div>
    </div>

    <div style={{ padding: '28px 28px 0' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: O.onbPurple, marginBottom: 8, letterSpacing: 1.2 }}>
        01 · DAILY HABIT
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px', letterSpacing: -0.8, lineHeight: 1.2 }}>
        쓰면서 <span style={{ color: O.onbPurple }}>자라는</span><br/>영어 문장력
      </h1>
      <p style={{ fontSize: 14, color: O.textSec, margin: 0, lineHeight: 1.6 }}>
        하루 3문장, 꾸준한 기록이<br/>진짜 실력이 되어 돌아옵니다.
      </p>
    </div>

    <button style={{
      position: 'absolute', bottom: 28, right: 24,
      width: 64, height: 64, borderRadius: '50%',
      background: O.onbPurple, color: '#fff', border: 'none',
      fontSize: 24, fontWeight: 700, cursor: 'pointer',
      boxShadow: '0 10px 24px -4px rgba(79,70,229,0.5)',
    }}>→</button>
  </OScreen>
);

// 2. Login — softer, brand gradient curve
const OLogin = () => (
  <OScreen bg="#fff">
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 380,
      background: `linear-gradient(155deg, ${O.onbPurple} 0%, #7C3AED 70%, #A78BFA 100%)`,
      borderRadius: '0 0 50% 50% / 0 0 80px 80px',
    }}>
      <div style={{ position: 'absolute', top: 40, right: 40, width: 12, height: 12, borderRadius: '50%', background: '#fff', opacity: 0.7 }}/>
      <div style={{ position: 'absolute', top: 80, left: 40, width: 6, height: 6, borderRadius: '50%', background: '#fff', opacity: 0.5 }}/>
      <div style={{ position: 'absolute', top: 140, right: 60, width: 8, height: 8, borderRadius: '50%', background: '#fff', opacity: 0.5 }}/>
    </div>
    <OStatus dark/>
    <div style={{ position: 'relative', textAlign: 'center', paddingTop: 60 }}>
      <div style={{
        width: 92, height: 92, margin: '0 auto 20px',
        background: '#fff', borderRadius: 26,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 16px 40px -10px rgba(0,0,0,0.25)',
        fontSize: 44, fontWeight: 900, color: O.onbPurple, letterSpacing: -2,
      }}>쓰</div>
      <h1 style={{ color: '#fff', fontSize: 40, fontWeight: 900, margin: '0 0 6px', letterSpacing: -1.2 }}>쓰잉</h1>
      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, margin: 0, fontWeight: 500 }}>
        매일의 영어 작문 습관 ✍
      </p>
    </div>

    <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <OSocial bg="#000" color="#fff" label="Apple로 계속하기"/>
      <OSocial bg="#fff" color={O.text} label="Google로 계속하기" border/>
      <OSocial bg="#FEE500" color="#3A1D1D" label="카카오로 계속하기"/>
      <div style={{ textAlign: 'center', margin: '8px 0' }}>
        <span style={{ fontSize: 13, color: O.textSec, fontWeight: 500, textDecoration: 'underline' }}>게스트로 둘러보기</span>
      </div>
    </div>
  </OScreen>
);

const OSocial = ({ bg, color, label, border }) => (
  <button style={{
    background: bg, color,
    border: border ? `1px solid ${O.border}` : 'none',
    borderRadius: 16, padding: '15px 18px',
    fontSize: 15, fontWeight: 700, fontFamily: O.font, cursor: 'pointer',
  }}>{label}</button>
);

// 3. Terms — cleaner variant
const OTerms = () => {
  const items = [
    { req: true, label: '이용약관', on: true },
    { req: true, label: '개인정보처리방침', on: true },
    { req: true, label: '만 14세 이상입니다', on: true },
    { req: false, label: '마케팅 정보 수신', on: false },
    { req: false, label: '푸시 알림', on: true },
  ];
  return (
    <OScreen>
      <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center' }}>
        <button style={{ background: 'transparent', border: 'none', fontSize: 24, padding: 0, cursor: 'pointer', color: O.text }}>←</button>
      </div>
      <div style={{ padding: '0 24px 24px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: -0.8 }}>시작하기 전에</h2>
        <p style={{ fontSize: 14, color: O.textSec, margin: 0 }}>약관을 확인하고 동의해주세요.</p>
      </div>

      <div style={{ margin: '0 24px 16px' }}>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 18px', borderRadius: 16,
          background: `linear-gradient(135deg, ${O.primarySoft}, ${O.secondarySoft})`,
          border: `1.5px solid ${O.primary}30`,
        }}>
          <OCheck on/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>전체 동의</div>
            <div style={{ fontSize: 11, color: O.textSec, marginTop: 2 }}>선택 항목을 포함한 모든 약관</div>
          </div>
        </label>
      </div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 4px',
            borderTop: i > 0 ? `1px solid ${O.border}` : 'none',
          }}>
            <OCheck on={it.on}/>
            <span style={{ flex: 1, fontSize: 14 }}>
              <span style={{ color: it.req ? O.error : O.textSec, fontWeight: 700, marginRight: 6, fontSize: 12 }}>
                {it.req ? '필수' : '선택'}
              </span>
              {it.label}
            </span>
            <span style={{ fontSize: 12, color: O.primary, fontWeight: 600 }}>보기</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24 }}>
        <button style={{
          width: '100%', background: `linear-gradient(135deg, var(--primary), ${O.primaryDeep})`,
          color: '#fff', border: 'none', borderRadius: 16, padding: '16px',
          fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: O.font,
          boxShadow: '0 8px 20px -6px rgba(74,144,217,0.5)',
        }}>동의하고 시작하기</button>
      </div>
    </OScreen>
  );
};

const OCheck = ({ on }) => (
  <span style={{
    width: 24, height: 24, borderRadius: 8,
    background: on ? `linear-gradient(135deg, var(--primary), ${O.primaryDeep})` : '#fff',
    border: on ? 'none' : `1.5px solid ${O.borderStrong}`,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, boxShadow: on ? '0 3px 8px -2px rgba(74,144,217,0.4)' : 'none',
  }}>
    {on && <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7 L6 11 L12 3" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>}
  </span>
);

// 4. HOME ★
const OHome = () => (
  <OScreen bg="#fff">
    <div style={{ padding: '0 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 12, color: O.textSec, fontWeight: 500 }}>4월 20일 월요일</div>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, marginTop: 2 }}>
          안녕하세요, 쓰잉님 <span style={{ display: 'inline-block' }}>👋</span>
        </div>
      </div>
      <div style={{
        width: 42, height: 42, borderRadius: 14,
        background: `linear-gradient(135deg, var(--primary), ${O.primaryDeep})`,
        color: '#fff', fontWeight: 800, fontSize: 15,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>쓰</div>
    </div>

    {/* Hero progress */}
    <div style={{
      margin: '0 20px 18px', borderRadius: 24, padding: 20,
      background: `linear-gradient(135deg, var(--primary) 0%, ${O.primaryDeep} 65%, ${O.secondary} 120%)`,
      color: '#fff', position: 'relative', overflow: 'hidden',
      boxShadow: '0 16px 32px -8px rgba(74,144,217,0.4)',
    }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.2), transparent 60%)' }}/>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.2)',
            padding: '3px 10px', borderRadius: 999, letterSpacing: 0.5,
          }}>LEVEL 8</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontWeight: 700,
            padding: '3px 10px', borderRadius: 999, background: 'rgba(255,180,40,0.25)',
            border: '1px solid rgba(255,200,80,0.5)',
          }}>🔥 12일 연속</span>
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8, marginBottom: 14 }}>
          780 <span style={{ fontSize: 15, fontWeight: 500, opacity: 0.75 }}>/ 1000 XP</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 999, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ width: '78%', height: '100%', background: '#fff', borderRadius: 999 }}/>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <OStat k="완료" v="147"/>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }}/>
          <OStat k="만점" v="23"/>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }}/>
          <OStat k="최장" v="18일"/>
        </div>
      </div>
    </div>

    {/* Difficulty segmented */}
    <div style={{ padding: '0 20px 16px' }}>
      <div style={{
        display: 'inline-flex', padding: 4, borderRadius: 999,
        background: O.surfaceAlt, border: `1px solid ${O.border}`,
      }}>
        <OSeg label="초급"/><OSeg label="중급" active/>
      </div>
    </div>

    {/* Themes — crafted cards */}
    <div style={{ padding: '0 20px 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>오늘의 테마</div>
        <span style={{ fontSize: 12, color: O.textSec, fontWeight: 600 }}>3개 중 1개 남음</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <OTheme emoji="📝" title="일상 영어" sub="카페에서, 아침 루틴" done={2} c1="var(--primary)" c2={O.primaryDeep}/>
        <OTheme emoji="💼" title="비즈니스" sub="이메일 · 회의" done={1} c1={O.secondary} c2={O.secondaryDeep}/>
        <OTheme emoji="✈️" title="여행 영어" sub="공항 · 호텔" done={3} c1={O.travel} c2="#0A8F6A"/>
      </div>
    </div>

    {/* Footer quick access */}
    <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20,
      padding: '10px 14px', background: '#fff', border: `1px solid ${O.border}`,
      borderRadius: 16, display: 'flex', gap: 4,
      boxShadow: '0 4px 16px -6px rgba(0,0,0,0.05)',
    }}>
      <OQuick icon="📚" label="복습" n="4"/>
      <OQuick icon="📊" label="리포트"/>
      <OQuick icon="🏆" label="업적"/>
      <OQuick icon="📖" label="기록"/>
    </div>
  </OScreen>
);

const OStat = ({ k, v }) => (
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>{v}</div>
    <div style={{ fontSize: 10, opacity: 0.75, fontWeight: 500 }}>{k}</div>
  </div>
);

const OSeg = ({ label, active }) => (
  <span style={{
    padding: '6px 18px', borderRadius: 999, fontSize: 13, fontWeight: 700,
    background: active ? '#fff' : 'transparent',
    color: active ? O.text : O.textSec,
    boxShadow: active ? '0 2px 6px -1px rgba(0,0,0,0.08)' : 'none',
  }}>{label}</span>
);

const OTheme = ({ emoji, title, sub, done, c1, c2 }) => (
  <div style={{
    background: '#fff', border: `1px solid ${O.border}`, borderRadius: 18, padding: 14,
    display: 'flex', alignItems: 'center', gap: 12, position: 'relative', overflow: 'hidden',
  }}>
    <div style={{
      width: 52, height: 52, borderRadius: 14,
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 24, flexShrink: 0,
      boxShadow: `0 6px 14px -4px ${c1}70`,
    }}>{emoji}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 12, color: O.textSec }}>{sub}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: i < done ? c1 : O.border,
          }}/>
        ))}
        <span style={{ fontSize: 10, color: O.textSec, marginLeft: 4, fontWeight: 600 }}>{done}/3</span>
      </div>
    </div>
    <span style={{ color: O.textHint, fontSize: 18 }}>›</span>
  </div>
);

const OQuick = ({ icon, label, n }) => (
  <div style={{
    flex: 1, textAlign: 'center', position: 'relative',
    padding: 4,
  }}>
    <div style={{ fontSize: 20, marginBottom: 2 }}>{icon}</div>
    <div style={{ fontSize: 10, color: O.textSec, fontWeight: 600 }}>{label}</div>
    {n && (
      <span style={{
        position: 'absolute', top: -2, right: 14,
        background: O.error, color: '#fff', fontSize: 9, fontWeight: 800,
        padding: '1px 5px', borderRadius: 999,
      }}>{n}</span>
    )}
  </div>
);

// 5. Practice
const OPractice = () => (
  <OScreen>
    <div style={{
      background: `linear-gradient(135deg, var(--primary), ${O.primaryDeep})`,
      padding: '0 20px 24px', marginTop: -58, paddingTop: 58,
      borderRadius: '0 0 28px 28px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
      <div style={{ position: 'absolute', top: 80, right: 50, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
      <OStatus dark/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
        <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', width: 36, height: 36, borderRadius: 10, color: '#fff', fontSize: 18, cursor: 'pointer' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📝</span> 일상 영어
          </div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>2 / 3 문장</div>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800,
        }}>85</div>
      </div>
    </div>

    <div style={{ padding: '14px 18px 80px' }}>
      {/* Korean source */}
      <div style={{
        background: '#fff', border: `1px solid ${O.border}`, borderRadius: 16, padding: 14, marginBottom: 10,
        boxShadow: '0 2px 10px -4px rgba(0,0,0,0.05)',
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: O.textSec, letterSpacing: 0.8, marginBottom: 6 }}>KOREAN</div>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3, marginBottom: 10 }}>
          어제 친구와 카페에 갔어요.
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {['went', 'cafe', 'yesterday', 'friend'].map(w => (
            <span key={w} style={{
              fontSize: 11, padding: '3px 9px', borderRadius: 999,
              background: O.primarySoft, color: O.primaryDeep, fontWeight: 600,
            }}>{w}</span>
          ))}
        </div>
      </div>

      {/* Score */}
      <div style={{
        background: `linear-gradient(135deg, ${O.successSoft}, #fff)`,
        border: `1px solid ${O.success}30`, borderRadius: 16, padding: 14, marginBottom: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 34, fontWeight: 900, color: O.success, letterSpacing: -1 }}>85</span>
          <span style={{ fontSize: 12, color: O.textSec, fontWeight: 600 }}>/ 100</span>
          <span style={{ flex: 1 }}/>
          <span style={{ fontSize: 11, fontWeight: 700, color: O.success }}>✨ 잘했어요!</span>
        </div>
        <div style={{ height: 6, background: '#fff', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: '85%', height: '100%', background: `linear-gradient(90deg, ${O.success}, #16A34A)`, borderRadius: 999 }}/>
        </div>
      </div>

      <OBlock tone="blue" label="MY ANSWER" body={<span>I am go to cafe with my friend yesterday.</span>}/>
      <OBlock tone="green" label="CORRECTED" body={<span>I <b style={{ color: O.success }}>went</b> to <b style={{ color: O.success }}>a</b> cafe with my friend yesterday.</span>}/>

      <div style={{
        background: O.warningSoft, border: `1px solid ${O.warning}30`, borderRadius: 14, padding: 12, marginBottom: 8,
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: O.warning, marginBottom: 4, letterSpacing: 0.5 }}>⚡ 수정 포인트</div>
        <div style={{ fontSize: 13 }}>
          <span style={{ textDecoration: 'line-through', color: O.textHint }}>am go</span>
          <span style={{ color: O.success, fontWeight: 700, marginLeft: 8 }}>→ went</span>
        </div>
      </div>

      <div style={{ fontSize: 12, color: O.textSec, padding: '4px 6px', lineHeight: 1.5 }}>
        💡 과거(yesterday)에 일어난 일이므로 <b style={{ color: O.text }}>went</b>를 써요.
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20, display: 'flex', gap: 8 }}>
      <button style={{
        width: 52, height: 52, borderRadius: 16, background: '#fff',
        border: `1px solid ${O.border}`, fontSize: 20, cursor: 'pointer', fontFamily: O.font,
      }}>←</button>
      <button style={{
        flex: 1, background: `linear-gradient(135deg, var(--primary), ${O.primaryDeep})`,
        color: '#fff', border: 'none', borderRadius: 16, fontSize: 15, fontWeight: 700,
        cursor: 'pointer', fontFamily: O.font,
        boxShadow: '0 6px 16px -4px rgba(74,144,217,0.5)',
      }}>다음 문장</button>
    </div>
  </OScreen>
);

const OBlock = ({ tone, label, body }) => {
  const c = tone === 'blue'
    ? { bg: O.primarySoft, bar: O.primary, label: O.primaryDeep }
    : { bg: O.successSoft, bar: O.success, label: '#0F7B34' };
  return (
    <div style={{
      background: c.bg, borderLeft: `4px solid ${c.bar}`,
      borderRadius: '0 14px 14px 0', padding: '10px 14px', marginBottom: 8,
    }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: c.label, marginBottom: 4, letterSpacing: 0.8 }}>{label}</div>
      <div style={{ fontSize: 14, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
};

// 6. History — premium timeline
const OHistory = () => {
  const items = [
    { ko: '어제 친구와 카페에 갔어요.', score: 85, date: '오늘 오후 2:14', theme: '📝', tc: O.primary },
    { ko: '회의는 오후 3시에 시작됩니다.', score: 92, date: '오늘 오전 9:30', theme: '💼', tc: O.secondary },
    { ko: '공항까지 택시로 얼마나?', score: 78, date: '어제 오후 7:20', theme: '✈️', tc: O.travel },
    { ko: '이메일을 보내드리겠습니다.', score: 100, date: '어제 오후 3:45', theme: '💼', tc: O.secondary },
    { ko: '커피 한 잔 주문할게요.', score: 65, date: '2일 전', theme: '📝', tc: O.primary },
  ];
  const color = s => s >= 85 ? O.success : s >= 70 ? O.warning : O.error;
  return (
    <OScreen>
      <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center' }}>
        <button style={{ background: 'transparent', border: 'none', fontSize: 22, padding: 0, cursor: 'pointer', color: O.text }}>←</button>
      </div>
      <div style={{ padding: '0 24px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: -0.8 }}>학습 기록</h1>
        <p style={{ fontSize: 13, color: O.textSec, margin: 0 }}>
          <b style={{ color: O.text }}>147개</b> 문장 · 평균 <b style={{ color: O.success }}>82점</b>
        </p>
      </div>

      {/* Summary chips */}
      <div style={{ padding: '0 24px 16px', display: 'flex', gap: 8 }}>
        <OSumChip v="23" k="만점" c={O.success}/>
        <OSumChip v="18" k="연속일" c={O.warning}/>
        <OSumChip v="4" k="오답" c={O.error}/>
      </div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 14, padding: 12,
            border: `1px solid ${O.border}`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: it.tc + '18', color: it.tc,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
            }}>{it.theme}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {it.ko}
              </div>
              <div style={{ fontSize: 11, color: O.textHint, marginTop: 2 }}>{it.date}</div>
            </div>
            <div style={{
              minWidth: 42, textAlign: 'center', padding: '4px 0', borderRadius: 8,
              background: color(it.score) + '18', color: color(it.score),
              fontSize: 13, fontWeight: 800,
            }}>{it.score}</div>
          </div>
        ))}
      </div>
    </OScreen>
  );
};

const OSumChip = ({ v, k, c }) => (
  <div style={{
    flex: 1, padding: 12, borderRadius: 14,
    background: c + '12', border: `1px solid ${c}25`,
  }}>
    <div style={{ fontSize: 20, fontWeight: 800, color: c, letterSpacing: -0.5 }}>{v}</div>
    <div style={{ fontSize: 10, color: O.textSec, fontWeight: 600, marginTop: 1 }}>{k}</div>
  </div>
);

// 7. Settings
const OSettings = () => (
  <OScreen>
    <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center' }}>
      <button style={{ background: 'transparent', border: 'none', fontSize: 22, padding: 0, cursor: 'pointer', color: O.text }}>←</button>
    </div>
    <div style={{ padding: '0 24px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: -0.8 }}>설정</h1>
    </div>

    <div style={{
      margin: '0 24px 16px', padding: 16, borderRadius: 20,
      background: `linear-gradient(135deg, var(--primary), ${O.primaryDeep})`,
      color: '#fff', display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 10px 24px -8px rgba(74,144,217,0.45)',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.35)',
        fontSize: 20, fontWeight: 900,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>쓰</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 800 }}>김쓰잉</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>ssuing@kakao.com</div>
      </div>
      <span style={{
        fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 999,
        background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
      }}>카카오</span>
    </div>

    <OGroup title="알림">
      <ORow k="푸시 알림" v={<OT on/>}/>
      <ORow k="리마인더 시간" v={<span style={{ color: O.textSec, fontSize: 13, fontWeight: 600 }}>21:00 ›</span>}/>
    </OGroup>
    <OGroup title="정보">
      <ORow k="개인정보처리방침" v="›"/>
      <ORow k="이용약관" v="›"/>
      <ORow k="문의하기" v="›"/>
      <ORow k="버전" v={<span style={{ color: O.textHint, fontSize: 13 }}>1.2.3</span>}/>
    </OGroup>

    <div style={{ padding: '8px 24px 0', display: 'flex', gap: 8 }}>
      <button style={{ flex: 1, background: O.surfaceAlt, border: 'none', borderRadius: 14,
        padding: '12px', fontSize: 13, fontWeight: 700, fontFamily: O.font, cursor: 'pointer' }}>로그아웃</button>
      <button style={{ flex: 1, background: '#fff', border: `1px solid ${O.error}30`,
        color: O.error, borderRadius: 14, padding: '12px',
        fontSize: 13, fontWeight: 700, fontFamily: O.font, cursor: 'pointer' }}>회원 탈퇴</button>
    </div>
  </OScreen>
);

const OGroup = ({ title, children }) => (
  <div style={{ padding: '0 24px 14px' }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: O.textSec, textTransform: 'uppercase', letterSpacing: 0.8, padding: '0 4px 6px' }}>{title}</div>
    <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${O.border}`, overflow: 'hidden' }}>{children}</div>
  </div>
);

const ORow = ({ k, v }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '13px 14px', borderBottom: `1px solid ${O.border}`, fontSize: 14, fontWeight: 500,
  }}>
    <span>{k}</span>
    {typeof v === 'string' ? <span style={{ color: O.textHint, fontSize: 16 }}>{v}</span> : v}
  </div>
);

const OT = ({ on }) => (
  <span style={{
    width: 42, height: 25, borderRadius: 999,
    background: on ? `linear-gradient(135deg, var(--primary), ${O.primaryDeep})` : O.borderStrong,
    position: 'relative', display: 'inline-block',
  }}>
    <span style={{ position: 'absolute', top: 2, left: on ? 19 : 2, width: 21, height: 21, borderRadius: '50%', background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}/>
  </span>
);

window.OrigScreens = {
  Onboarding: OOnboarding, Login: OLogin, Terms: OTerms,
  Home: OHome, Practice: OPractice, History: OHistory, Settings: OSettings,
};
