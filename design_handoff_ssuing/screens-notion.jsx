// Notion-flavored screens — minimal, typography-focused, generous whitespace.

const NT = window.TOKENS;

const NScreen = ({ children, bg = '#FFFFFF' }) => (
  <div style={{
    width: 390, height: 780, background: bg,
    position: 'relative', overflow: 'hidden',
    color: NT.notionInk, fontFamily: NT.font,
  }}>
    <NStatusBar dark={false}/>
    {children}
  </div>
);

const NStatusBar = ({ dark }) => (
  <div style={{ height: 58 }}/>
);

// ═════════════════════════════════════════════════════════════════════════
// 1. Onboarding — editorial, big serif-ish numbers
// ═════════════════════════════════════════════════════════════════════════
const NOnboarding = () => (
  <NScreen bg={NT.notionPaper}>
    <div style={{ padding: '8px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: NT.notionMuted }}>1 / 3</span>
      <span style={{ fontSize: 14, color: NT.notionMuted }}>건너뛰기</span>
    </div>

    <div style={{ padding: '60px 32px 0' }}>
      <div style={{
        width: 72, height: 72, borderRadius: 16,
        background: NT.notionBg, border: `1px solid ${NT.notionBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, marginBottom: 40,
      }}>✏️</div>

      <div style={{ fontSize: 13, fontWeight: 600, color: NT.notionAccent, marginBottom: 12, letterSpacing: 0.3 }}>
        ONE · 매일의 습관
      </div>
      <h1 style={{ fontSize: 44, fontWeight: 800, margin: '0 0 20px', letterSpacing: -1.5, lineHeight: 1.1 }}>
        쓰면,<br/>늘어요.
      </h1>
      <p style={{ fontSize: 16, color: NT.notionMuted, lineHeight: 1.6, margin: 0, maxWidth: 300 }}>
        한글 문장을 영어로 직접 써보며 
        사고하는 힘을 기릅니다. 하루 3문장으로 충분해요.
      </p>

      {/* callout */}
      <div style={{
        marginTop: 36, padding: 14, borderRadius: 8,
        background: '#FFF8E7', border: `1px solid #F4E4A8`,
        display: 'flex', gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>💡</span>
        <div style={{ fontSize: 13, color: NT.notionInk, lineHeight: 1.5 }}>
          단어를 외우는 것보다 <b>직접 문장을 쓰는 연습</b>이 훨씬 효과적이에요.
        </div>
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <span style={{ width: 20, height: 4, borderRadius: 2, background: NT.notionInk }}/>
        <span style={{ width: 4, height: 4, borderRadius: 2, background: NT.notionBorder }}/>
        <span style={{ width: 4, height: 4, borderRadius: 2, background: NT.notionBorder }}/>
      </div>
      <span style={{ flex: 1 }}/>
      <button style={{
        background: NT.notionInk, color: '#fff', border: 'none',
        padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
        fontFamily: NT.font, cursor: 'pointer',
      }}>다음 →</button>
    </div>
  </NScreen>
);

// ═════════════════════════════════════════════════════════════════════════
// 2. Login
// ═════════════════════════════════════════════════════════════════════════
const NLogin = () => (
  <NScreen bg={NT.notionPaper}>
    <div style={{ padding: '60px 32px 0' }}>
      <div style={{ fontSize: 44, marginBottom: 24 }}>🪶</div>
      <h1 style={{ fontSize: 34, fontWeight: 800, margin: '0 0 10px', letterSpacing: -1 }}>쓰잉</h1>
      <p style={{ fontSize: 15, color: NT.notionMuted, margin: 0, lineHeight: 1.5 }}>
        매일의 영어 작문 습관을 만듭니다.<br/>
        AI가 당신의 문장을 섬세하게 다듬어요.
      </p>
    </div>

    <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <NSocial bg="#000" color="#fff" label="Apple로 계속하기"/>
      <NSocial bg="#fff" color={NT.notionInk} label="Google로 계속하기" border/>
      <NSocial bg="#FEE500" color={NT.notionInk} label="카카오로 계속하기"/>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 6px' }}>
        <div style={{ flex: 1, height: 1, background: NT.notionBorder }}/>
        <span style={{ fontSize: 12, color: NT.notionMuted }}>또는</span>
        <div style={{ flex: 1, height: 1, background: NT.notionBorder }}/>
      </div>

      <button style={{
        background: 'transparent', color: NT.notionInk,
        border: `1px solid ${NT.notionBorder}`,
        borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600,
        cursor: 'pointer', fontFamily: NT.font,
      }}>게스트로 시작</button>
      <p style={{ fontSize: 11, color: NT.notionMuted, margin: '6px 0 0', textAlign: 'center', lineHeight: 1.4 }}>
        게스트 모드: 학습 기록이 기기에만 저장됩니다
      </p>
    </div>
  </NScreen>
);

const NSocial = ({ bg, color, label, border }) => (
  <button style={{
    background: bg, color, border: border ? `1px solid ${NT.notionBorder}` : 'none',
    borderRadius: 8, padding: '13px', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', fontFamily: NT.font,
  }}>{label}</button>
);

// ═════════════════════════════════════════════════════════════════════════
// 3. Terms
// ═════════════════════════════════════════════════════════════════════════
const NTerms = () => {
  const items = [
    { req: true, label: '이용약관 동의', on: true },
    { req: true, label: '개인정보처리방침 동의', on: true },
    { req: true, label: '만 14세 이상입니다', on: true },
    { req: false, label: '마케팅 정보 수신', on: false },
    { req: false, label: '푸시 알림 수신', on: true },
  ];
  return (
    <NScreen>
      <div style={{ padding: '0 24px 20px', display: 'flex', alignItems: 'center', gap: 8, color: NT.notionMuted }}>
        <span style={{ fontSize: 18, cursor: 'pointer' }}>←</span>
        <span style={{ fontSize: 13 }}>돌아가기</span>
      </div>
      <div style={{ padding: '0 32px 24px' }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 10px', letterSpacing: -0.8 }}>약관 동의</h2>
        <p style={{ fontSize: 14, color: NT.notionMuted, margin: 0 }}>
          쓰잉 이용을 위해 아래 내용을 확인해주세요.
        </p>
      </div>

      <div style={{ padding: '0 32px', marginBottom: 16 }}>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: 14, borderRadius: 8, background: NT.notionBg,
          border: `1px solid ${NT.notionBorder}`, cursor: 'pointer',
        }}>
          <NCheck on/>
          <span style={{ fontSize: 15, fontWeight: 700 }}>전체 동의</span>
          <span style={{ flex: 1 }}/>
          <span style={{ fontSize: 12, color: NT.notionMuted }}>선택 포함</span>
        </label>
      </div>

      <div style={{ padding: '0 32px' }}>
        {items.map((it, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 4px', borderTop: i > 0 ? `1px solid ${NT.notionBorder}` : 'none',
          }}>
            <NCheck on={it.on}/>
            <span style={{ fontSize: 14, flex: 1 }}>
              <span style={{ color: it.req ? NT.notionRed : NT.notionMuted, marginRight: 6, fontWeight: 600 }}>
                {it.req ? '필수' : '선택'}
              </span>
              {it.label}
            </span>
            <span style={{ fontSize: 12, color: NT.notionMuted, textDecoration: 'underline' }}>보기</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24 }}>
        <button style={{
          width: '100%', background: NT.notionInk, color: '#fff', border: 'none',
          borderRadius: 8, padding: '14px', fontSize: 15, fontWeight: 700,
          cursor: 'pointer', fontFamily: NT.font,
        }}>동의하고 시작하기</button>
      </div>
    </NScreen>
  );
};

const NCheck = ({ on }) => (
  <span style={{
    width: 20, height: 20, borderRadius: 4,
    background: on ? NT.notionInk : '#fff',
    border: `1.5px solid ${on ? NT.notionInk : NT.notionBorder}`,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }}>
    {on && (
      <svg width="12" height="12" viewBox="0 0 12 12">
        <path d="M2 6 L5 9 L10 3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    )}
  </span>
);

// ═════════════════════════════════════════════════════════════════════════
// 4. HOME ★ — doc-page feel
// ═════════════════════════════════════════════════════════════════════════
const NHome = () => (
  <NScreen bg={NT.notionPaper}>
    {/* Top bar */}
    <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>🪶</span>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>쓰잉</span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{
          fontSize: 12, fontWeight: 600, color: NT.notionInk,
          background: '#FFF8E7', padding: '4px 10px', borderRadius: 6,
          border: `1px solid #F4E4A8`,
        }}>🔥 12일</span>
        <span style={{ fontSize: 18, color: NT.notionMuted }}>⋯</span>
      </div>
    </div>

    {/* Page header, doc-style */}
    <div style={{ padding: '0 24px 20px' }}>
      <div style={{ fontSize: 42, marginBottom: 8 }}>📝</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 4px', letterSpacing: -1 }}>오늘의 작문</h1>
      <p style={{ fontSize: 13, color: NT.notionMuted, margin: 0 }}>
        2026년 4월 20일 · 김쓰잉 · <span style={{ color: NT.notionAccent }}>중급</span>
      </p>
    </div>

    {/* Properties block (notion-style table) */}
    <div style={{ margin: '0 24px 20px', border: `1px solid ${NT.notionBorder}`, borderRadius: 4 }}>
      <NPropRow k="🎯 레벨" v={<span style={{ color: NT.notionInk, fontWeight: 600 }}>Lv.8 · 780 XP</span>}/>
      <NPropRow k="✅ 완료 문장" v="147"/>
      <NPropRow k="🏅 만점" v="23"/>
      <NPropRow k="🔥 최장 연속" v="18일"/>
      <NPropRow last k="📌 난이도" v={
        <div style={{ display: 'flex', gap: 4 }}>
          <NPill label="초급"/><NPill label="중급" active/>
        </div>
      }/>
    </div>

    {/* Today's themes as toggle list */}
    <div style={{ padding: '0 24px', marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: NT.notionMuted, textTransform: 'uppercase', letterSpacing: 0.8, padding: '0 0 8px' }}>
        오늘의 테마
      </div>
      <NThemeRow emoji="📝" title="일상 영어" sub="아침 루틴, 카페, 쇼핑" done={2} accent={NT.notionAccent}/>
      <NThemeRow emoji="💼" title="비즈니스" sub="이메일, 회의, 보고" done={1} accent={NT.notionPurple}/>
      <NThemeRow emoji="✈️" title="여행 영어" sub="공항, 호텔, 레스토랑" done={3} accent={NT.notionGreen}/>
    </div>

    {/* Quick links */}
    <div style={{ padding: '6px 24px 0', display: 'flex', gap: 12, fontSize: 13, color: NT.notionMuted }}>
      <span>📚 오답복습 <b style={{ color: NT.notionInk }}>4</b></span>
      <span>·</span>
      <span>📊 주간리포트</span>
      <span>·</span>
      <span>🏆 업적</span>
    </div>
  </NScreen>
);

const NPropRow = ({ k, v, last }) => (
  <div style={{
    display: 'flex', alignItems: 'center', padding: '8px 12px',
    borderBottom: last ? 'none' : `1px solid ${NT.notionBorder}`,
    fontSize: 13,
  }}>
    <span style={{ width: 110, color: NT.notionMuted, fontWeight: 500 }}>{k}</span>
    <span>{v}</span>
  </div>
);

const NPill = ({ label, active }) => (
  <span style={{
    fontSize: 11, padding: '3px 9px', borderRadius: 999,
    background: active ? '#D3E5EF' : NT.notionBg,
    color: active ? '#183347' : NT.notionMuted,
    fontWeight: 600,
  }}>{label}</span>
);

const NThemeRow = ({ emoji, title, sub, done, accent }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 4px', borderRadius: 4,
    borderBottom: `1px solid ${NT.notionBorder}`,
  }}>
    <span style={{ color: NT.notionMuted, fontSize: 10 }}>▸</span>
    <span style={{ fontSize: 22 }}>{emoji}</span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 11, color: NT.notionMuted, marginTop: 1 }}>{sub}</div>
    </div>
    <div style={{ display: 'flex', gap: 3 }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: i < done ? accent : NT.notionBorder,
        }}/>
      ))}
    </div>
    <span style={{ fontSize: 11, color: NT.notionMuted, minWidth: 24, textAlign: 'right' }}>{done}/3</span>
  </div>
);

// ═════════════════════════════════════════════════════════════════════════
// 5. Practice
// ═════════════════════════════════════════════════════════════════════════
const NPractice = () => (
  <NScreen>
    <div style={{ padding: '0 24px 16px', display: 'flex', alignItems: 'center', gap: 8, color: NT.notionMuted }}>
      <span style={{ fontSize: 18, cursor: 'pointer' }}>←</span>
      <span style={{ fontSize: 13 }}>오늘의 작문</span>
      <span style={{ flex: 1 }}/>
      <span style={{ fontSize: 13, fontWeight: 600 }}>2 / 3</span>
    </div>

    <div style={{ padding: '0 24px 14px' }}>
      <span style={{ fontSize: 12, color: NT.notionAccent, fontWeight: 600 }}>📝 일상 영어</span>
      <h2 style={{ fontSize: 22, fontWeight: 800, margin: '4px 0 0', letterSpacing: -0.5, lineHeight: 1.3 }}>
        어제 친구와 카페에<br/>갔어요.
      </h2>
      <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['went', 'cafe', 'yesterday', 'friend'].map(w => (
          <span key={w} style={{
            fontSize: 12, padding: '4px 10px', borderRadius: 999,
            background: '#D3E5EF', color: '#183347', fontWeight: 500,
          }}>{w}</span>
        ))}
      </div>
    </div>

    {/* Score block */}
    <div style={{ margin: '0 24px 12px', padding: 14, background: NT.notionBg, borderRadius: 6, border: `1px solid ${NT.notionBorder}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>85</span>
        <span style={{ fontSize: 12, color: NT.notionMuted }}>/ 100 · 잘했어요</span>
      </div>
      <div style={{ height: 4, background: NT.notionBorder, borderRadius: 2, marginTop: 8 }}>
        <div style={{ width: '85%', height: '100%', background: NT.notionGreen, borderRadius: 2 }}/>
      </div>
    </div>

    {/* Diff blocks */}
    <div style={{ padding: '0 24px' }}>
      <NQuote tint="red" label="내 작문">I am go to cafe with my friend yesterday.</NQuote>
      <NQuote tint="green" label="교정 문장">I <b>went</b> to <b>a</b> cafe with my friend yesterday.</NQuote>

      <div style={{
        marginTop: 10, padding: 12, borderRadius: 6,
        background: '#FFF8E7', border: `1px solid #F4E4A8`, fontSize: 13, lineHeight: 1.55,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>💡 설명</div>
        과거(yesterday)에 일어난 일이므로 <b>went</b>를 써요. 셀 수 있는 명사 앞에는 <b>a</b>를 붙입니다.
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
      <button style={{
        background: '#fff', border: `1px solid ${NT.notionBorder}`, borderRadius: 6,
        padding: '10px 16px', fontSize: 13, color: NT.notionMuted, fontFamily: NT.font, cursor: 'pointer',
      }}>← 이전</button>
      <span style={{ flex: 1 }}/>
      <button style={{
        background: NT.notionInk, color: '#fff', border: 'none', borderRadius: 6,
        padding: '10px 20px', fontSize: 13, fontWeight: 600, fontFamily: NT.font, cursor: 'pointer',
      }}>다음 →</button>
    </div>
  </NScreen>
);

const NQuote = ({ tint, label, children }) => {
  const c = tint === 'red'
    ? { bar: NT.notionRed, bg: '#FBEAEA' }
    : { bar: NT.notionGreen, bg: '#EEF3ED' };
  return (
    <div style={{
      borderLeft: `3px solid ${c.bar}`, background: c.bg,
      padding: '8px 12px', marginBottom: 8, borderRadius: '0 4px 4px 0',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: NT.notionMuted, marginBottom: 2, letterSpacing: 0.3 }}>{label}</div>
      <div style={{ fontSize: 14, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// 6. History
// ═════════════════════════════════════════════════════════════════════════
const NHistory = () => {
  const items = [
    { ko: '어제 친구와 카페에 갔어요.', score: 85, date: '4. 20', theme: '일상' },
    { ko: '회의는 오후 3시에 시작됩니다.', score: 92, date: '4. 20', theme: '비즈니스' },
    { ko: '공항까지 택시로 얼마나 걸리나요?', score: 78, date: '4. 19', theme: '여행' },
    { ko: '이메일을 보내드리겠습니다.', score: 100, date: '4. 19', theme: '비즈니스' },
    { ko: '커피 한 잔 주문할게요.', score: 65, date: '4. 18', theme: '일상' },
    { ko: '숙소를 예약하고 싶습니다.', score: 88, date: '4. 17', theme: '여행' },
  ];
  const scoreColor = s => s >= 85 ? NT.notionGreen : s >= 70 ? NT.notionYellow : NT.notionRed;
  return (
    <NScreen>
      <div style={{ padding: '0 24px 20px' }}>
        <span style={{ fontSize: 13, color: NT.notionMuted, cursor: 'pointer' }}>← 돌아가기</span>
      </div>
      <div style={{ padding: '0 24px 16px' }}>
        <div style={{ fontSize: 32, marginBottom: 6 }}>📖</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 4px', letterSpacing: -0.8 }}>학습 기록</h1>
        <p style={{ fontSize: 13, color: NT.notionMuted, margin: 0 }}>전체 147개 · 평균 82점</p>
      </div>

      {/* Table header */}
      <div style={{ padding: '0 24px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', padding: '6px 0',
          borderBottom: `1.5px solid ${NT.notionBorder}`,
          fontSize: 11, color: NT.notionMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5,
        }}>
          <span style={{ flex: 1 }}>문장</span>
          <span style={{ width: 50, textAlign: 'center' }}>점수</span>
          <span style={{ width: 44, textAlign: 'right' }}>날짜</span>
        </div>
        {items.map((it, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', padding: '11px 0',
            borderBottom: `1px solid ${NT.notionBorder}`,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: NT.notionInk, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {it.ko}
              </div>
              <div style={{ fontSize: 10, color: NT.notionMuted, marginTop: 2 }}>{it.theme}</div>
            </div>
            <span style={{
              width: 40, textAlign: 'center', fontSize: 12, fontWeight: 700,
              color: scoreColor(it.score), padding: '2px 6px',
              background: scoreColor(it.score) + '20', borderRadius: 4,
            }}>{it.score}</span>
            <span style={{ width: 44, textAlign: 'right', fontSize: 11, color: NT.notionMuted }}>{it.date}</span>
          </div>
        ))}
      </div>
    </NScreen>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// 7. Settings
// ═════════════════════════════════════════════════════════════════════════
const NSettings = () => (
  <NScreen>
    <div style={{ padding: '0 24px 16px', fontSize: 13, color: NT.notionMuted }}>← 돌아가기</div>
    <div style={{ padding: '0 24px 16px' }}>
      <div style={{ fontSize: 32, marginBottom: 6 }}>⚙️</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: -0.8 }}>설정</h1>
    </div>

    <div style={{ margin: '0 24px 20px', padding: 14, background: NT.notionBg, borderRadius: 6, border: `1px solid ${NT.notionBorder}`, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 8, background: NT.notionInk, color: '#fff', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>쓰</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>김쓰잉</div>
        <div style={{ fontSize: 12, color: NT.notionMuted }}>ssuing@kakao.com</div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: NT.notionMuted, background: '#fff', padding: '3px 8px', border: `1px solid ${NT.notionBorder}`, borderRadius: 4 }}>카카오</span>
    </div>

    <NSettingGroup title="알림">
      <NSettingRow k="푸시 알림" v={<NToggle on/>}/>
      <NSettingRow k="리마인더 시간" v={<span style={{ color: NT.notionMuted, fontSize: 13 }}>오후 9:00</span>}/>
    </NSettingGroup>
    <NSettingGroup title="정보">
      <NSettingRow k="개인정보처리방침" v="›"/>
      <NSettingRow k="이용약관" v="›"/>
      <NSettingRow k="문의하기" v="›"/>
      <NSettingRow k="버전" v={<span style={{ color: NT.notionMuted, fontSize: 13 }}>1.2.3</span>}/>
    </NSettingGroup>

    <div style={{ padding: '8px 24px 0', display: 'flex', gap: 8 }}>
      <button style={{
        flex: 1, background: 'transparent', border: `1px solid ${NT.notionBorder}`,
        padding: '10px', borderRadius: 6, fontSize: 13, fontFamily: NT.font, cursor: 'pointer',
      }}>로그아웃</button>
      <button style={{
        flex: 1, background: 'transparent', border: `1px solid ${NT.notionRed}30`,
        color: NT.notionRed, padding: '10px', borderRadius: 6, fontSize: 13,
        fontFamily: NT.font, cursor: 'pointer',
      }}>회원 탈퇴</button>
    </div>
  </NScreen>
);

const NSettingGroup = ({ title, children }) => (
  <div style={{ padding: '0 24px 14px' }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: NT.notionMuted, textTransform: 'uppercase', letterSpacing: 0.8, padding: '0 0 6px' }}>{title}</div>
    <div style={{ border: `1px solid ${NT.notionBorder}`, borderRadius: 6, overflow: 'hidden' }}>{children}</div>
  </div>
);

const NSettingRow = ({ k, v }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '11px 12px', borderBottom: `1px solid ${NT.notionBorder}`, fontSize: 14,
  }}>
    <span>{k}</span>{typeof v === 'string' ? <span style={{ color: NT.notionMuted }}>{v}</span> : v}
  </div>
);

const NToggle = ({ on }) => (
  <span style={{
    width: 36, height: 22, borderRadius: 999, background: on ? NT.notionGreen : NT.notionBorder,
    position: 'relative', display: 'inline-block',
  }}>
    <span style={{ position: 'absolute', top: 2, left: on ? 16 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff' }}/>
  </span>
);

window.NotionScreens = {
  Onboarding: NOnboarding, Login: NLogin, Terms: NTerms,
  Home: NHome, Practice: NPractice, History: NHistory, Settings: NSettings,
};
