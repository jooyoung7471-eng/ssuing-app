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

// ═════════════════════════════════════════════════════════════════════════
// V2 ADDITIONS — C as base, merged with A's streak vibe + B's table density
// ═════════════════════════════════════════════════════════════════════════

// — Enhanced HOME: larger streak badge, animated XP bar, pressed theme state —
const OHomeV2 = () => {
  const [xpAnim, setXpAnim] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setXpAnim(78), 200);
    return () => clearTimeout(t);
  }, []);
  return (
    <OScreen bg="#fff">
      <div style={{ padding: '0 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: O.textSec, fontWeight: 500 }}>4월 20일 월요일</div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, marginTop: 2 }}>
            안녕하세요, 쓰잉님 👋
          </div>
        </div>
        {/* A-borrowed streak badge + settings gear */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', background: '#FFF5E0', borderRadius: 999,
            border: `1.5px solid ${O.warning}60`,
            boxShadow: `0 2px 8px -2px ${O.warning}40`,
          }}>
            <span style={{ fontSize: 15 }}>🔥</span>
            <span style={{ fontWeight: 800, color: '#C2680D', fontSize: 13 }}>12일</span>
          </div>
          <button style={{
            width: 38, height: 38, borderRadius: '50%',
            background: O.surfaceAlt, border: `1px solid ${O.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
          }} aria-label="설정">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={O.textSec} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        margin: '0 20px 16px', borderRadius: 24, padding: 18,
        background: `linear-gradient(135deg, var(--primary) 0%, ${O.primaryDeep} 65%, ${O.secondary} 120%)`,
        color: '#fff', position: 'relative', overflow: 'hidden',
        boxShadow: '0 16px 32px -8px rgba(74,144,217,0.4)',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.2), transparent 60%)' }}/>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.2)',
              padding: '3px 10px', borderRadius: 999, letterSpacing: 0.5,
            }}>LEVEL 8</span>
            <span style={{ fontSize: 11, opacity: 0.85, fontWeight: 600 }}>다음 레벨까지 220 XP</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8, marginBottom: 12 }}>
            780 <span style={{ fontSize: 15, fontWeight: 500, opacity: 0.75 }}>/ 1000 XP</span>
          </div>
          <div style={{ height: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 999, overflow: 'hidden', marginBottom: 12, position: 'relative' }}>
            <div style={{
              width: xpAnim + '%', height: '100%',
              background: `linear-gradient(90deg, #fff, #FFE8A0)`,
              borderRadius: 999,
              transition: 'width 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
              boxShadow: '0 0 12px rgba(255,232,160,0.5)',
            }}/>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <OStat k="완료" v="147"/>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.25)' }}/>
            <OStat k="만점" v="23"/>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.25)' }}/>
            <OStat k="최장" v="18일"/>
          </div>
        </div>
      </div>

      {/* Difficulty */}
      <div style={{ padding: '0 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          display: 'inline-flex', padding: 4, borderRadius: 999,
          background: O.surfaceAlt, border: `1px solid ${O.border}`,
        }}>
          <OSeg label="초급"/><OSeg label="중급" active/>
        </div>
        <span style={{ fontSize: 12, color: O.textSec, fontWeight: 600 }}>2개 완료 · 1개 남음</span>
      </div>

      {/* Themes */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <OThemeV2 emoji="📝" title="일상 영어" sub="카페에서, 아침 루틴" done={2} total={3} c1="var(--primary)" c2={O.primaryDeep} state="active"/>
        <OThemeV2 emoji="💼" title="비즈니스" sub="이메일 · 회의" done={1} total={3} c1={O.secondary} c2={O.secondaryDeep}/>
        <OThemeV2 emoji="✈️" title="여행 영어" sub="공항 · 호텔" done={3} total={3} c1={O.travel} c2="#0A8F6A" state="done"/>
      </div>

      {/* Quick access w/ badges (A-borrowed) */}
      <div style={{ position: 'absolute', bottom: 14, left: 20, right: 20,
        padding: '10px 8px', background: '#fff', border: `1px solid ${O.border}`,
        borderRadius: 18, display: 'flex',
        boxShadow: '0 4px 16px -6px rgba(0,0,0,0.06)',
      }}>
        <OQuick icon="📚" label="복습" n="4"/>
        <OQuick icon="📊" label="리포트"/>
        <OQuick icon="🏆" label="업적" n="8"/>
        <OQuick icon="📖" label="기록"/>
      </div>
    </OScreen>
  );
};

// Theme card with state (default / active / done)
const OThemeV2 = ({ emoji, title, sub, done, total, c1, c2, state }) => {
  const isDone = state === 'done';
  const isActive = state === 'active';
  return (
    <div style={{
      background: isDone ? O.surfaceAlt : '#fff',
      border: `1px solid ${isActive ? c1 + '50' : O.border}`,
      borderRadius: 18, padding: 14,
      display: 'flex', alignItems: 'center', gap: 12,
      position: 'relative', overflow: 'hidden',
      boxShadow: isActive ? `0 4px 14px -4px ${typeof c1 === 'string' && !c1.startsWith('var') ? c1 + '40' : 'rgba(74,144,217,0.3)'}` : 'none',
    }}>
      {isActive && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${c1}, ${c2})`,
        }}/>
      )}
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: isDone ? O.border : `linear-gradient(135deg, ${c1}, ${c2})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, flexShrink: 0,
        filter: isDone ? 'grayscale(0.6)' : 'none',
        boxShadow: isDone ? 'none' : `0 6px 14px -4px ${typeof c1 === 'string' && !c1.startsWith('var') ? c1 + '70' : 'rgba(74,144,217,0.5)'}`,
      }}>{emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: isDone ? O.textSec : O.text }}>{title}</span>
          {isDone && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: O.success + '20', color: '#0F7B34' }}>완료</span>}
          {isActive && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: c1 + '20', color: c2 }}>진행 중</span>}
        </div>
        <div style={{ fontSize: 12, color: O.textSec }}>{sub}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} style={{
              width: i < done ? 18 : 7, height: 7, borderRadius: 999,
              background: i < done ? c1 : O.border,
              transition: 'width 0.3s',
            }}/>
          ))}
          <span style={{ fontSize: 10, color: O.textSec, marginLeft: 4, fontWeight: 600 }}>{done}/{total}</span>
        </div>
      </div>
      <span style={{ color: O.textHint, fontSize: 18 }}>{isDone ? '✓' : '›'}</span>
    </div>
  );
};

// — Onboarding p2 (green) + p3 (amber) —
const OOnb2 = () => (
  <OScreen bg="#fff">
    <div style={{ padding: '8px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <span style={{ width: 8, height: 4, background: O.border, borderRadius: 2 }}/>
        <span style={{ width: 24, height: 4, background: O.onbGreen, borderRadius: 2 }}/>
        <span style={{ width: 8, height: 4, background: O.border, borderRadius: 2 }}/>
      </div>
      <span style={{ fontSize: 14, color: O.textSec, fontWeight: 500 }}>건너뛰기</span>
    </div>

    <div style={{
      margin: '28px 24px 0', height: 340, borderRadius: 28,
      background: `linear-gradient(160deg, ${O.onbGreen} 0%, #059669 100%)`,
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 20px 40px -12px rgba(16,185,129,0.4)',
    }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="180" height="180" viewBox="0 0 200 200">
          {/* chat bubbles with correction marks */}
          <rect x="30" y="50" width="110" height="60" rx="14" fill="#fff" opacity="0.95"/>
          <path d="M40 108 L36 122 L52 112 Z" fill="#fff" opacity="0.95"/>
          <rect x="44" y="64" width="52" height="4" rx="2" fill="#F87171"/>
          <rect x="44" y="74" width="80" height="4" rx="2" fill="#E5E7EB"/>
          <rect x="44" y="84" width="64" height="4" rx="2" fill="#E5E7EB"/>
          <path d="M44 64 L96 64" stroke="#F87171" strokeWidth="2" opacity="0.6"/>

          <rect x="60" y="120" width="110" height="50" rx="14" fill="#fff"/>
          <circle cx="148" cy="134" r="14" fill="#059669"/>
          <path d="M141 134 L146 139 L155 129" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="74" y="132" width="50" height="4" rx="2" fill="#059669"/>
          <rect x="74" y="144" width="64" height="4" rx="2" fill="#10B981" opacity="0.5"/>
          <rect x="74" y="156" width="40" height="4" rx="2" fill="#10B981" opacity="0.5"/>
        </svg>
      </div>
    </div>

    <div style={{ padding: '28px 28px 0' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: O.onbGreen, marginBottom: 8, letterSpacing: 1.2 }}>
        02 · INSTANT FEEDBACK
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px', letterSpacing: -0.8, lineHeight: 1.2 }}>
        AI가 바로<br/><span style={{ color: O.onbGreen }}>교정</span>해드려요
      </h1>
      <p style={{ fontSize: 14, color: O.textSec, margin: 0, lineHeight: 1.6 }}>
        문법·어순·자연스러움까지 세심하게<br/>설명과 함께 다듬어드립니다.
      </p>
    </div>

    <button style={{
      position: 'absolute', bottom: 28, right: 24,
      width: 64, height: 64, borderRadius: '50%',
      background: O.onbGreen, color: '#fff', border: 'none',
      fontSize: 24, fontWeight: 700, cursor: 'pointer',
      boxShadow: '0 10px 24px -4px rgba(16,185,129,0.5)',
    }}>→</button>
  </OScreen>
);

const OOnb3 = () => (
  <OScreen bg="#fff">
    <div style={{ padding: '8px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <span style={{ width: 8, height: 4, background: O.border, borderRadius: 2 }}/>
        <span style={{ width: 8, height: 4, background: O.border, borderRadius: 2 }}/>
        <span style={{ width: 24, height: 4, background: O.onbAmber, borderRadius: 2 }}/>
      </div>
      <span style={{ fontSize: 14, color: 'transparent', fontWeight: 500 }}>건너뛰기</span>
    </div>

    <div style={{
      margin: '28px 24px 0', height: 340, borderRadius: 28,
      background: `linear-gradient(160deg, ${O.onbAmber} 0%, #EA580C 100%)`,
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 20px 40px -12px rgba(245,158,11,0.4)',
    }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="180" height="180" viewBox="0 0 200 200">
          {/* flame calendar */}
          <rect x="40" y="54" width="120" height="110" rx="14" fill="#fff" opacity="0.95"/>
          <rect x="40" y="54" width="120" height="26" rx="14" fill="#FEF3DC"/>
          <rect x="40" y="70" width="120" height="10" fill="#FEF3DC"/>
          {Array.from({length: 21}).map((_, i) => {
            const row = Math.floor(i/7), col = i%7;
            const active = [0,1,2,3,4,6,7,8,9,11,12,13,14,15,17,18,19,20].includes(i);
            return (
              <circle key={i} cx={56 + col*15} cy={96 + row*15} r="5"
                fill={active ? '#F59E0B' : '#FDE68A'}/>
            );
          })}
          <g transform="translate(110, 140)">
            <path d="M12 0 Q0 16 0 30 Q0 44 12 48 Q24 44 24 30 Q24 18 18 12 Q16 20 12 20 Q10 14 12 0 Z"
                  fill="#F59E0B" stroke="#EA580C" strokeWidth="2"/>
            <path d="M12 22 Q4 32 8 42 Q12 46 16 42 Q18 32 12 22 Z" fill="#FDE68A"/>
          </g>
        </svg>
      </div>
    </div>

    <div style={{ padding: '28px 28px 0' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: O.onbAmber, marginBottom: 8, letterSpacing: 1.2 }}>
        03 · DAILY THREE
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px', letterSpacing: -0.8, lineHeight: 1.2 }}>
        하루 <span style={{ color: O.onbAmber }}>3문장</span>이면<br/>충분해요
      </h1>
      <p style={{ fontSize: 14, color: O.textSec, margin: 0, lineHeight: 1.6 }}>
        부담 없는 양으로 꾸준히.<br/>작은 습관이 큰 변화를 만듭니다.
      </p>
    </div>

    <button style={{
      position: 'absolute', bottom: 28, left: 24, right: 24,
      height: 56, borderRadius: 20,
      background: O.onbAmber, color: '#fff', border: 'none',
      fontSize: 16, fontWeight: 800, cursor: 'pointer',
      boxShadow: '0 10px 24px -4px rgba(245,158,11,0.5)',
    }}>시작하기</button>
  </OScreen>
);

// — Empty state (History) —
const OEmpty = () => (
  <OScreen>
    <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center' }}>
      <button style={{ background: 'transparent', border: 'none', fontSize: 22, padding: 0, cursor: 'pointer', color: O.text }}>←</button>
    </div>
    <div style={{ padding: '0 24px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: -0.8 }}>학습 기록</h1>
      <p style={{ fontSize: 13, color: O.textSec, margin: 0 }}>아직 작성한 문장이 없어요</p>
    </div>

    <div style={{
      margin: '60px 24px 0', padding: '40px 24px',
      borderRadius: 24, textAlign: 'center',
      background: `linear-gradient(135deg, ${O.primarySoft}, ${O.secondarySoft})`,
      border: `1px dashed ${O.primary}50`,
    }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
      <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6, letterSpacing: -0.3 }}>
        첫 문장을 써볼까요?
      </div>
      <p style={{ fontSize: 13, color: O.textSec, margin: '0 0 20px', lineHeight: 1.5 }}>
        오늘의 테마에서 한 문장씩<br/>AI와 함께 영작해보세요.
      </p>
      <button style={{
        background: `linear-gradient(135deg, var(--primary), ${O.primaryDeep})`,
        color: '#fff', border: 'none', borderRadius: 14,
        padding: '12px 28px', fontSize: 14, fontWeight: 700,
        cursor: 'pointer', fontFamily: O.font,
        boxShadow: '0 8px 20px -6px rgba(74,144,217,0.5)',
      }}>오늘의 테마 보기 →</button>
    </div>

    <div style={{ padding: '32px 24px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 1, background: O.border }}/>
      <span style={{ fontSize: 11, color: O.textHint, fontWeight: 600 }}>TIP</span>
      <div style={{ flex: 1, height: 1, background: O.border }}/>
    </div>
    <div style={{ padding: '14px 24px 0', display: 'flex', gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: '#FFF5E0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
      }}>💡</div>
      <div style={{ fontSize: 13, color: O.textSec, lineHeight: 1.55 }}>
        매일 같은 시간에 쓰면 <b style={{ color: O.text }}>습관이 되기 쉬워요.</b>
        설정에서 리마인더 시간을 조정할 수 있습니다.
      </div>
    </div>
  </OScreen>
);

// — Error state —
const OError = () => (
  <OScreen>
    <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center' }}>
      <button style={{ background: 'transparent', border: 'none', fontSize: 22, padding: 0, cursor: 'pointer', color: O.text }}>←</button>
    </div>

    <div style={{
      margin: '100px 24px 0', padding: '40px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        width: 96, height: 96, margin: '0 auto 20px',
        borderRadius: 28,
        background: `linear-gradient(135deg, ${O.errorSoft}, #FEE2E2)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 44,
        border: `1px solid ${O.error}30`,
      }}>
        <svg width="48" height="48" viewBox="0 0 48 48">
          <path d="M24 6 L44 40 L4 40 Z" fill="none" stroke={O.error} strokeWidth="3" strokeLinejoin="round"/>
          <rect x="22" y="18" width="4" height="12" rx="2" fill={O.error}/>
          <circle cx="24" cy="34" r="2.5" fill={O.error}/>
        </svg>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, letterSpacing: -0.5 }}>
        교정 요청이 실패했어요
      </div>
      <p style={{ fontSize: 14, color: O.textSec, margin: '0 0 28px', lineHeight: 1.55 }}>
        인터넷 연결을 확인한 뒤<br/>다시 시도해주세요.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button style={{
          background: `linear-gradient(135deg, var(--primary), ${O.primaryDeep})`,
          color: '#fff', border: 'none', borderRadius: 14, padding: '14px',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: O.font,
          boxShadow: '0 8px 20px -6px rgba(74,144,217,0.5)',
        }}>다시 시도</button>
        <button style={{
          background: 'transparent', color: O.textSec, border: 'none',
          padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: O.font,
        }}>내 작문 먼저 저장하기</button>
      </div>
    </div>

    <div style={{
      position: 'absolute', bottom: 20, left: 24, right: 24,
      padding: '12px 14px', background: O.surfaceAlt, borderRadius: 12,
      fontSize: 11, color: O.textSec, lineHeight: 1.5,
    }}>
      <b style={{ color: O.text }}>오프라인 저장</b> · 네트워크 복구 시 자동 동기화됩니다
    </div>
  </OScreen>
);

// — Dark mode Home —
const OHomeDark = () => {
  const bg = '#0F1115';
  const card = '#181B22';
  const border = '#272B35';
  const textSec = '#9CA3AF';
  return (
    <div style={{
      width: 390, height: 780, background: bg, position: 'relative', overflow: 'hidden',
      color: '#F3F4F6', fontFamily: O.font,
    }}>
      <OStatus dark/>
      <div style={{ padding: '0 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: textSec, fontWeight: 500 }}>4월 20일 월요일</div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, marginTop: 2 }}>
            안녕하세요, 쓰잉님 👋
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 12px', background: '#2A1F0A', borderRadius: 999,
          border: `1.5px solid ${O.warning}50`,
        }}>
          <span style={{ fontSize: 15 }}>🔥</span>
          <span style={{ fontWeight: 800, color: O.warning, fontSize: 13 }}>12일</span>
        </div>
      </div>

      <div style={{
        margin: '0 20px 16px', borderRadius: 24, padding: 18,
        background: `linear-gradient(135deg, var(--primary) 0%, ${O.primaryDeep} 65%, ${O.secondary} 120%)`,
        color: '#fff', position: 'relative', overflow: 'hidden',
        boxShadow: '0 16px 32px -8px rgba(74,144,217,0.35)',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.18), transparent 60%)' }}/>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: 999 }}>LEVEL 8</span>
            <span style={{ fontSize: 11, opacity: 0.85, fontWeight: 600 }}>다음 레벨까지 220 XP</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8, marginBottom: 12 }}>
            780 <span style={{ fontSize: 15, fontWeight: 500, opacity: 0.75 }}>/ 1000 XP</span>
          </div>
          <div style={{ height: 8, background: 'rgba(0,0,0,0.3)', borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #fff, #FFE8A0)', borderRadius: 999 }}/>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <OStat k="완료" v="147"/>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.25)' }}/>
            <OStat k="만점" v="23"/>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.25)' }}/>
            <OStat k="최장" v="18일"/>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'inline-flex', padding: 4, borderRadius: 999, background: card, border: `1px solid ${border}` }}>
          <span style={{ padding: '6px 18px', borderRadius: 999, fontSize: 13, fontWeight: 700, color: textSec }}>초급</span>
          <span style={{ padding: '6px 18px', borderRadius: 999, fontSize: 13, fontWeight: 700, background: '#2A2F3B', color: '#fff' }}>중급</span>
        </div>
        <span style={{ fontSize: 12, color: textSec, fontWeight: 600 }}>2개 완료 · 1개 남음</span>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { e: '📝', t: '일상 영어', s: '카페에서, 아침 루틴', done: 2, c1: 'var(--primary)', c2: O.primaryDeep, state: 'active' },
          { e: '💼', t: '비즈니스', s: '이메일 · 회의', done: 1, c1: O.secondary, c2: O.secondaryDeep },
          { e: '✈️', t: '여행 영어', s: '공항 · 호텔', done: 3, c1: O.travel, c2: '#0A8F6A', state: 'done' },
        ].map((th, i) => (
          <div key={i} style={{
            background: th.state === 'done' ? '#14171D' : card,
            border: `1px solid ${th.state === 'active' ? 'rgba(74,144,217,0.4)' : border}`,
            borderRadius: 18, padding: 14,
            display: 'flex', alignItems: 'center', gap: 12, position: 'relative', overflow: 'hidden',
          }}>
            {th.state === 'active' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${th.c1}, ${th.c2})` }}/>}
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: th.state === 'done' ? '#2A2F3B' : `linear-gradient(135deg, ${th.c1}, ${th.c2})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0,
              filter: th.state === 'done' ? 'grayscale(0.6)' : 'none',
            }}>{th.e}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 2, color: th.state === 'done' ? textSec : '#fff' }}>{th.t}</div>
              <div style={{ fontSize: 12, color: textSec }}>{th.s}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                {[0,1,2].map(j => (
                  <span key={j} style={{
                    width: j < th.done ? 18 : 7, height: 7, borderRadius: 999,
                    background: j < th.done ? th.c1 : border,
                  }}/>
                ))}
                <span style={{ fontSize: 10, color: textSec, marginLeft: 4, fontWeight: 600 }}>{th.done}/3</span>
              </div>
            </div>
            <span style={{ color: textSec, fontSize: 18 }}>{th.state === 'done' ? '✓' : '›'}</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 14, left: 20, right: 20,
        padding: '10px 8px', background: card, border: `1px solid ${border}`,
        borderRadius: 18, display: 'flex',
      }}>
        {[
          { i: '📚', l: '복습', n: '4' },
          { i: '📊', l: '리포트' },
          { i: '🏆', l: '업적', n: '8' },
          { i: '📖', l: '기록' },
        ].map((q, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', padding: 4, position: 'relative' }}>
            <div style={{ fontSize: 20, marginBottom: 2 }}>{q.i}</div>
            <div style={{ fontSize: 10, color: textSec, fontWeight: 600 }}>{q.l}</div>
            {q.n && <span style={{ position: 'absolute', top: -2, right: 14, background: O.error, color: '#fff', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 999 }}>{q.n}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

window.CV2Screens = {
  Onboarding: OOnboarding, Onb2: OOnb2, Onb3: OOnb3,
  Login: OLogin, Terms: OTerms,
  Home: OHomeV2, Practice: OPractice, History: OHistory, Settings: OSettings,
  Empty: OEmpty, Error: OError, HomeDark: OHomeDark,
};
