// v3 — Practice flow (5 steps) + reward screens + level-up modals
// Relies on O (window.TOKENS), OScreen, OStatus from screens-c-v2's shared globals —
// but since Babel scripts have isolated scope, we re-declare what we need.

const V3 = window.TOKENS;

// Shared screen + status bar spacer (identical to C v2)
const VScreen = ({ children, bg = V3.bg }) => (
  <div style={{
    width: 390, height: 780, background: bg, position: 'relative', overflow: 'hidden',
    color: V3.text, fontFamily: V3.font,
  }}>
    <div style={{ height: 58 }}/>
    {children}
  </div>
);

// ── Reusable practice header (gradient top bar, identical across all steps) ─
const VPracticeHeader = ({ step, score }) => (
  <div style={{
    background: `linear-gradient(135deg, var(--primary), ${V3.primaryDeep})`,
    padding: '0 20px 22px', marginTop: -58, paddingTop: 58,
    borderRadius: '0 0 28px 28px', position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ position: 'absolute', top: 30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
    <div style={{ position: 'absolute', top: 80, right: 50, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
      <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', width: 36, height: 36, borderRadius: 10, color: '#fff', fontSize: 18, cursor: 'pointer' }}>←</button>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>📝</span> 일상 영어
        </div>
        <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 500 }}>2 / 3 문장 · {step}</div>
      </div>
      {score != null ? (
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 900,
          boxShadow: '0 4px 12px -2px rgba(0,0,0,0.15)',
        }}>{score}</div>
      ) : (
        <div style={{
          padding: '6px 12px', borderRadius: 999,
          background: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700,
          letterSpacing: 0.5,
        }}>+80 XP</div>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────
// 5.1 — EMPTY state: prompt shown, input is empty
// ─────────────────────────────────────────────────────────────────────────
const VPracticeEmpty = () => (
  <VScreen>
    <VPracticeHeader step="작성 전"/>

    <div style={{ padding: '16px 18px 0' }}>
      {/* Korean prompt */}
      <div style={{
        background: '#fff', border: `1px solid ${V3.border}`, borderRadius: 18, padding: 16, marginBottom: 12,
        boxShadow: '0 2px 10px -4px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: V3.primary, letterSpacing: 1.2 }}>KOREAN · 오늘의 문장</div>
          <button style={{ background: 'transparent', border: 'none', fontSize: 13, color: V3.textSec, cursor: 'pointer', fontWeight: 600 }}>🔊</button>
        </div>
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.45 }}>
          어제 친구와 카페에 갔어요.
        </div>
        <div style={{ fontSize: 12, color: V3.textSec, marginTop: 8, lineHeight: 1.5 }}>
          💡 과거형 · 장소 표현 연습
        </div>
      </div>

      {/* Input card (empty) */}
      <div style={{
        background: '#fff', border: `2px dashed ${V3.primary}40`, borderRadius: 18, padding: 18,
        minHeight: 140, position: 'relative',
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: V3.textSec, letterSpacing: 1.2, marginBottom: 10 }}>
          MY ENGLISH
        </div>
        <div style={{ fontSize: 15, color: V3.textHint, fontStyle: 'italic', lineHeight: 1.5 }}>
          영어로 작문해보세요...
        </div>
        <div style={{
          position: 'absolute', bottom: 12, right: 14, display: 'flex', gap: 6,
        }}>
          <button style={{
            width: 32, height: 32, borderRadius: 10, background: V3.surfaceAlt,
            border: `1px solid ${V3.border}`, fontSize: 14, cursor: 'pointer',
          }}>🎤</button>
          <button style={{
            width: 32, height: 32, borderRadius: 10, background: V3.surfaceAlt,
            border: `1px solid ${V3.border}`, fontSize: 14, cursor: 'pointer',
          }}>💭</button>
        </div>
      </div>

      {/* Hint chips */}
      <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
        <VChip>📖 단어 힌트</VChip>
        <VChip>🏗 문장 구조</VChip>
        <VChip>✨ 예시 보기</VChip>
      </div>
    </div>

    <button disabled style={{
      position: 'absolute', bottom: 20, left: 20, right: 20, height: 52, borderRadius: 16,
      background: V3.border, color: V3.textHint, border: 'none',
      fontSize: 15, fontWeight: 800, cursor: 'not-allowed', fontFamily: V3.font,
    }}>작문을 입력해주세요</button>
  </VScreen>
);

const VChip = ({ children }) => (
  <span style={{
    padding: '6px 12px', borderRadius: 999, background: V3.surfaceAlt,
    border: `1px solid ${V3.border}`, fontSize: 11, fontWeight: 600, color: V3.textSec,
    cursor: 'pointer',
  }}>{children}</span>
);

// ─────────────────────────────────────────────────────────────────────────
// 5.2 — TYPING: user is actively writing
// ─────────────────────────────────────────────────────────────────────────
const VPracticeTyping = () => (
  <VScreen>
    <VPracticeHeader step="작성 중"/>
    <div style={{ padding: '16px 18px 0' }}>
      <div style={{
        background: '#fff', border: `1px solid ${V3.border}`, borderRadius: 18, padding: 16, marginBottom: 12,
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: V3.primary, letterSpacing: 1.2, marginBottom: 8 }}>KOREAN</div>
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.45 }}>
          어제 친구와 카페에 갔어요.
        </div>
      </div>

      {/* Active input */}
      <div style={{
        background: '#fff', border: `2px solid var(--primary)`, borderRadius: 18, padding: 16,
        boxShadow: `0 0 0 4px ${V3.primary}15`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: V3.primary, letterSpacing: 1.2 }}>MY ENGLISH</div>
          <div style={{ fontSize: 10, color: V3.textSec, fontWeight: 600 }}>34 / 120</div>
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.55, color: V3.text, letterSpacing: -0.2 }}>
          I went to cafe with my friend yesterday<span style={{
            display: 'inline-block', width: 2, height: 18, background: V3.primary,
            verticalAlign: 'middle', marginLeft: 1,
            animation: 'blink 1s step-end infinite',
          }}/>
        </div>
        <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
      </div>

      {/* Live assists */}
      <div style={{
        marginTop: 10, padding: '10px 14px', background: '#FFF9E6', borderRadius: 12,
        border: `1px solid ${V3.warning}40`, display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <span style={{ fontSize: 14 }}>💡</span>
        <div style={{ fontSize: 11, color: '#8B6300', lineHeight: 1.5, fontWeight: 500 }}>
          <b>"a cafe"</b>처럼 관사를 붙이면 더 자연스러워요
        </div>
      </div>
    </div>

    <button style={{
      position: 'absolute', bottom: 20, left: 20, right: 20, height: 52, borderRadius: 16,
      background: `linear-gradient(135deg, var(--primary), ${V3.primaryDeep})`,
      color: '#fff', border: 'none',
      fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: V3.font,
      boxShadow: '0 8px 20px -6px rgba(74,144,217,0.5)',
    }}>제출하기 →</button>
  </VScreen>
);

// ─────────────────────────────────────────────────────────────────────────
// 5.3 — GRADING: AI is analyzing (loading state)
// ─────────────────────────────────────────────────────────────────────────
const VPracticeGrading = () => (
  <VScreen>
    <VPracticeHeader step="AI 분석 중…"/>
    <div style={{ padding: '16px 18px 0' }}>
      <div style={{
        background: '#fff', border: `1px solid ${V3.border}`, borderRadius: 18, padding: 14, marginBottom: 10,
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: V3.primary, letterSpacing: 1.2, marginBottom: 6 }}>KOREAN</div>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>어제 친구와 카페에 갔어요.</div>
      </div>
      <div style={{
        background: '#fff', border: `1px solid ${V3.border}`, borderRadius: 18, padding: 14, marginBottom: 16, opacity: 0.6,
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: V3.textSec, letterSpacing: 1.2, marginBottom: 6 }}>MY ENGLISH</div>
        <div style={{ fontSize: 15, color: V3.text }}>I went to cafe with my friend yesterday</div>
      </div>

      {/* Loading pulse */}
      <div style={{
        background: '#fff', border: `1px solid ${V3.border}`, borderRadius: 18, padding: 20,
        textAlign: 'center',
      }}>
        <div style={{
          width: 64, height: 64, margin: '0 auto 16px',
          borderRadius: '50%',
          background: `conic-gradient(var(--primary) 0deg, var(--primary) 220deg, ${V3.primary}20 220deg)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'spin 1.2s linear infinite',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>🤖</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3, marginBottom: 6 }}>
          AI가 문장을 분석하고 있어요
        </div>
        <div style={{ fontSize: 12, color: V3.textSec, lineHeight: 1.5 }}>
          문법 · 어순 · 자연스러움<br/>세 가지 관점으로 교정 중입니다
        </div>

        {/* Steps */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 8,
          marginTop: 16, textAlign: 'left',
        }}>
          <VStep label="문법 구조 분석" state="done"/>
          <VStep label="어휘 적합성 검토" state="active"/>
          <VStep label="자연스러움 평가" state="pending"/>
        </div>
      </div>
    </div>
  </VScreen>
);

const VStep = ({ label, state }) => {
  const done = state === 'done';
  const active = state === 'active';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', borderRadius: 10,
      background: active ? V3.primarySoft : 'transparent',
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%',
        background: done ? V3.success : (active ? V3.primary : V3.border),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 10, fontWeight: 800,
        flexShrink: 0,
      }}>{done ? '✓' : (active ? '' : '')}</div>
      <span style={{
        fontSize: 12, fontWeight: active ? 700 : 500,
        color: done ? V3.textSec : (active ? V3.primary : V3.textHint),
      }}>{label}</span>
      {active && <span style={{ marginLeft: 'auto', fontSize: 11, color: V3.primary, fontWeight: 700 }}>…</span>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// 5.4 — RESULT: AI feedback with diff highlighting
// ─────────────────────────────────────────────────────────────────────────
const VPracticeResult = () => (
  <VScreen>
    <VPracticeHeader step="교정 완료" score="85"/>

    <div style={{ padding: '14px 18px 90px', height: 'calc(100% - 58px - 110px)', overflow: 'auto' }}>
      {/* Score card */}
      <div style={{
        background: `linear-gradient(135deg, ${V3.successSoft || '#E8F7ED'}, #fff)`,
        border: `1px solid ${V3.success}40`,
        borderRadius: 18, padding: 14, marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ fontSize: 32 }}>🎉</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F7B34', marginBottom: 2 }}>좋은 시도예요!</div>
          <div style={{ fontSize: 11, color: V3.textSec, lineHeight: 1.45 }}>
            핵심 문법은 맞았고, 관사 사용만 보완하면 완벽해요.
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: V3.textSec, fontWeight: 600 }}>+85</div>
          <div style={{ fontSize: 10, color: V3.primary, fontWeight: 700 }}>XP</div>
        </div>
      </div>

      {/* Original vs corrected */}
      <div style={{
        background: '#fff', border: `1px solid ${V3.border}`, borderRadius: 18, padding: 14, marginBottom: 10,
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: V3.textSec, letterSpacing: 1.2, marginBottom: 8 }}>YOUR ANSWER</div>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: V3.text }}>
          I went to <span style={{
            background: '#FEE2E2', color: '#B91C1C', padding: '1px 4px', borderRadius: 4,
            textDecoration: 'line-through', textDecorationColor: '#B91C1C',
            fontWeight: 600,
          }}>cafe</span> with my friend yesterday
          <span style={{ color: V3.error, fontWeight: 700 }}>.</span>
        </div>
      </div>

      <div style={{
        background: '#F0FDF4', border: `1px solid ${V3.success}40`, borderRadius: 18, padding: 14, marginBottom: 10,
        position: 'relative',
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#0F7B34', letterSpacing: 1.2, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          ✨ CORRECTED
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: V3.text }}>
          I went to <span style={{
            background: '#DCFCE7', color: '#0F7B34', padding: '1px 5px', borderRadius: 4,
            fontWeight: 700,
          }}>a cafe</span> with my friend yesterday.
        </div>
        <button style={{
          position: 'absolute', top: 12, right: 12,
          background: 'transparent', border: 'none', fontSize: 16, cursor: 'pointer',
        }}>🔊</button>
      </div>

      {/* Explanation */}
      <div style={{
        background: '#fff', border: `1px solid ${V3.border}`, borderRadius: 18, padding: 14, marginBottom: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 16 }}>📖</span>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: -0.2 }}>왜 이렇게 바뀌었나요?</span>
        </div>
        <div style={{ fontSize: 12, color: V3.textSec, lineHeight: 1.6 }}>
          영어에서 셀 수 있는 명사는 처음 언급할 때 <b style={{ color: V3.text }}>a/an</b> 관사를 붙입니다.
          여기서 카페는 "어떤 한 카페"를 의미하므로 <b style={{ color: V3.success }}>a cafe</b>가 자연스러워요.
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <VTag color={V3.primary}>문법</VTag>
        <VTag color={V3.secondary}>관사</VTag>
        <VTag color={V3.travel}>초급</VTag>
      </div>
    </div>

    {/* Action bar */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 20px 20px',
      background: '#fff', borderTop: `1px solid ${V3.border}`,
      display: 'flex', gap: 8,
    }}>
      <button style={{
        flex: 1, height: 48, borderRadius: 14, background: V3.surfaceAlt,
        border: `1px solid ${V3.border}`, color: V3.text,
        fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: V3.font,
      }}>다시 쓰기</button>
      <button style={{
        flex: 2, height: 48, borderRadius: 14,
        background: `linear-gradient(135deg, var(--primary), ${V3.primaryDeep})`,
        border: 'none', color: '#fff',
        fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: V3.font,
        boxShadow: '0 6px 16px -4px rgba(74,144,217,0.5)',
      }}>다음 문장 →</button>
    </div>
  </VScreen>
);

const VTag = ({ children, color }) => (
  <span style={{
    padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700,
    background: color + '15', color: color, letterSpacing: 0.3,
  }}>{children}</span>
);

// ─────────────────────────────────────────────────────────────────────────
// DAILY COMPLETE — finished all 3 sentences of the day
// ─────────────────────────────────────────────────────────────────────────
const VDailyComplete = () => (
  <VScreen bg="#fff">
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 320,
      background: `linear-gradient(160deg, var(--primary) 0%, ${V3.secondary} 100%)`,
      borderRadius: '0 0 40% 40% / 0 0 15% 15%',
      overflow: 'hidden',
    }}>
      {/* confetti */}
      {[
        { x: 40, y: 80, c: '#FFD93D', r: -15 },
        { x: 310, y: 60, c: '#FF6B9D', r: 20 },
        { x: 80, y: 180, c: '#A8E6CF', r: 45 },
        { x: 290, y: 200, c: '#FFE08A', r: -30 },
        { x: 200, y: 40, c: '#FFB5E8', r: 60 },
        { x: 140, y: 220, c: '#B8D8FF', r: 15 },
      ].map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.x, top: d.y + 58, width: 12, height: 6,
          background: d.c, borderRadius: 2, transform: `rotate(${d.r}deg)`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}/>
      ))}
      <div style={{
        position: 'absolute', top: 58, left: 20, right: 20,
        display: 'flex', justifyContent: 'flex-end',
      }}>
        <button style={{ background: 'rgba(255,255,255,0.25)', border: 'none', width: 34, height: 34, borderRadius: 10, color: '#fff', fontSize: 16, cursor: 'pointer' }}>✕</button>
      </div>
    </div>

    <div style={{ position: 'relative', textAlign: 'center', paddingTop: 40 }}>
      {/* Medal */}
      <div style={{
        width: 120, height: 120, margin: '0 auto 20px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FFD93D, #F59E0B)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 56,
        boxShadow: '0 16px 40px -8px rgba(245,158,11,0.6), inset 0 -6px 12px rgba(0,0,0,0.15), inset 0 4px 8px rgba(255,255,255,0.4)',
        border: '4px solid #fff',
        position: 'relative',
      }}>
        🏆
        <div style={{
          position: 'absolute', bottom: -6, right: -4,
          width: 32, height: 32, borderRadius: '50%',
          background: V3.success, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 900,
          border: '3px solid #fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}>✓</div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: 1.5, marginBottom: 6 }}>
        DAILY COMPLETE · 4월 20일
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.8, margin: '0 0 8px', color: '#fff' }}>
        오늘도 해냈어요!
      </h1>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', margin: 0, fontWeight: 500 }}>
        3문장 완수 · 스트릭이 이어집니다
      </p>
    </div>

    {/* Stat cards */}
    <div style={{
      margin: '38px 20px 0',
      background: '#fff', borderRadius: 24, padding: 18,
      border: `1px solid ${V3.border}`,
      boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        <VStatBlock icon="🔥" v="13" l="스트릭" c={V3.warning}/>
        <VStatBlock icon="⭐" v="85" l="평균" c={V3.primary}/>
        <VStatBlock icon="⚡" v="+240" l="XP" c={V3.secondary}/>
      </div>

      {/* Sentences */}
      <div style={{ padding: '10px 4px 0', borderTop: `1px dashed ${V3.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: V3.textSec, letterSpacing: 1.2, marginBottom: 8, paddingTop: 10 }}>
          오늘의 3문장
        </div>
        <VDoneRow s="어제 친구와 카페에 갔어요." score="85"/>
        <VDoneRow s="아메리카노 한 잔 주세요." score="92"/>
        <VDoneRow s="창가 자리로 부탁드려요." score="78"/>
      </div>
    </div>

    <div style={{
      position: 'absolute', bottom: 20, left: 20, right: 20,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <button style={{
        height: 52, borderRadius: 16,
        background: `linear-gradient(135deg, var(--primary), ${V3.primaryDeep})`,
        color: '#fff', border: 'none',
        fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: V3.font,
        boxShadow: '0 10px 24px -6px rgba(74,144,217,0.5)',
      }}>공유하기 📤</button>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{
          flex: 1, height: 46, borderRadius: 14,
          background: '#fff', color: V3.text, border: `1px solid ${V3.border}`,
          fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: V3.font,
        }}>🏠 홈으로</button>
        <button style={{
          flex: 1, height: 46, borderRadius: 14,
          background: V3.primary + '15', color: V3.primary, border: 'none',
          fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: V3.font,
        }}>다음 문장 →</button>
      </div>
    </div>
  </VScreen>
);

const VStatBlock = ({ icon, v, l, c }) => (
  <div style={{ textAlign: 'center', padding: '10px 6px', background: c + '10', borderRadius: 12 }}>
    <div style={{ fontSize: 18, marginBottom: 2 }}>{icon}</div>
    <div style={{ fontSize: 20, fontWeight: 900, color: c, letterSpacing: -0.5, lineHeight: 1 }}>{v}</div>
    <div style={{ fontSize: 10, color: V3.textSec, fontWeight: 600, marginTop: 3 }}>{l}</div>
  </div>
);

const VDoneRow = ({ s, score }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
  }}>
    <span style={{ color: V3.success, fontSize: 14, fontWeight: 800 }}>✓</span>
    <span style={{ flex: 1, fontSize: 12, color: V3.text, fontWeight: 500 }}>{s}</span>
    <span style={{ fontSize: 11, fontWeight: 800, color: V3.primary }}>{score}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────
// LEVEL UP modal (shown on top of blurred home)
// ─────────────────────────────────────────────────────────────────────────
const VLevelUp = () => (
  <VScreen>
    {/* dimmed home backdrop (simplified) */}
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(180deg, ${V3.primarySoft}, #fff)`,
      filter: 'blur(6px)', opacity: 0.6,
    }}/>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }}/>

    {/* Radial light */}
    <div style={{
      position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
      width: 500, height: 500, borderRadius: '50%',
      background: `radial-gradient(circle, ${V3.secondary}40 0%, transparent 60%)`,
      pointerEvents: 'none',
    }}/>

    {/* Modal card */}
    <div style={{
      position: 'absolute', top: '50%', left: 24, right: 24, transform: 'translateY(-50%)',
      background: '#fff', borderRadius: 28, padding: '32px 24px 24px', textAlign: 'center',
      boxShadow: '0 40px 80px -20px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.8)',
    }}>
      {/* Burst */}
      <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 20px' }}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30) * Math.PI / 180;
            const x1 = 70 + Math.cos(angle) * 56;
            const y1 = 70 + Math.sin(angle) * 56;
            const x2 = 70 + Math.cos(angle) * 68;
            const y2 = 70 + Math.sin(angle) * 68;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={i % 2 ? '#FFD93D' : V3.secondary} strokeWidth="3" strokeLinecap="round"/>
            );
          })}
        </svg>
        <div style={{
          position: 'absolute', top: 14, left: 14, right: 14, bottom: 14,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFD93D, #F59E0B)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 -8px 16px rgba(0,0,0,0.15), inset 0 6px 10px rgba(255,255,255,0.4), 0 12px 30px -6px rgba(245,158,11,0.6)',
          border: '4px solid #fff',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#92400E', letterSpacing: 1.4 }}>LEVEL</div>
            <div style={{ fontSize: 42, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: -2, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>9</div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 800, color: V3.warning, letterSpacing: 1.5, marginBottom: 4 }}>
        LEVEL UP
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.6, margin: '0 0 8px' }}>
        레벨 9 달성! 🎉
      </h1>
      <p style={{ fontSize: 13, color: V3.textSec, margin: '0 0 20px', lineHeight: 1.55 }}>
        <b style={{ color: V3.text }}>중급 Ⅱ</b> 단계로 올라섰어요.<br/>
        더 복잡한 문장 표현에 도전해보세요.
      </p>

      {/* Unlocks */}
      <div style={{
        padding: '12px 14px', background: V3.surfaceAlt, borderRadius: 14, marginBottom: 16,
        textAlign: 'left',
      }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: V3.textSec, letterSpacing: 1.2, marginBottom: 8 }}>
          ✨ 새롭게 열린 기능
        </div>
        <VUnlockRow icon="🎯" label="비즈니스 영어 Ⅱ" sub="이메일·회의 실전 표현"/>
        <VUnlockRow icon="🎨" label="새 프로필 테마" sub="선셋 그라디언트"/>
      </div>

      <button style={{
        width: '100%', height: 50, borderRadius: 14,
        background: `linear-gradient(135deg, var(--primary), ${V3.primaryDeep})`,
        color: '#fff', border: 'none',
        fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: V3.font,
        boxShadow: '0 8px 20px -4px rgba(74,144,217,0.5)',
      }}>계속하기</button>
    </div>
  </VScreen>
);

const VUnlockRow = ({ icon, label, sub }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8, background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
      border: `1px solid ${V3.border}`,
    }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: V3.text }}>{label}</div>
      <div style={{ fontSize: 10, color: V3.textSec, fontWeight: 500 }}>{sub}</div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────
// STREAK +1 toast/screen — subtle celebration, not full-screen modal
// ─────────────────────────────────────────────────────────────────────────
const VStreakPlus = () => (
  <VScreen bg={V3.bg}>
    {/* Dimmed, simplified home content in background */}
    <div style={{ padding: '0 20px', opacity: 0.35, filter: 'blur(1px)' }}>
      <div style={{ height: 60, marginBottom: 14 }}/>
      <div style={{ height: 180, borderRadius: 24, background: V3.primary, marginBottom: 16 }}/>
      <div style={{ height: 80, borderRadius: 18, background: '#fff', border: `1px solid ${V3.border}`, marginBottom: 10 }}/>
      <div style={{ height: 80, borderRadius: 18, background: '#fff', border: `1px solid ${V3.border}` }}/>
    </div>

    {/* Toast banner from top */}
    <div style={{
      position: 'absolute', top: 70, left: 16, right: 16,
      background: 'linear-gradient(135deg, #FF8C42, #F59E0B)',
      borderRadius: 20, padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 20px 40px -8px rgba(245,158,11,0.5), 0 0 0 6px rgba(245,158,11,0.1)',
      border: '2px solid rgba(255,255,255,0.3)',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: 'rgba(255,255,255,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28,
        backdropFilter: 'blur(8px)',
      }}>🔥</div>
      <div style={{ flex: 1, color: '#fff' }}>
        <div style={{ fontSize: 10, fontWeight: 800, opacity: 0.9, letterSpacing: 1.4, marginBottom: 2 }}>
          STREAK · DAY 13
        </div>
        <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: -0.3, lineHeight: 1.2 }}>
          13일 연속 달성! 🎊
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.9, marginTop: 2 }}>
          이 페이스면 다음 주 <b>2주 배지</b> 획득!
        </div>
      </div>
    </div>

    {/* Animated flame plume ring */}
    <div style={{
      position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    }}>
      <svg width="260" height="260" viewBox="0 0 260 260">
        <defs>
          <radialGradient id="flame-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3"/>
            <stop offset="50%" stopColor="#FB923C" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#FB923C" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="130" cy="130" r="120" fill="url(#flame-glow)"/>
        {/* floating embers */}
        {[
          { x: 60, y: 90, r: 4, c: '#FFD93D' },
          { x: 200, y: 110, r: 3, c: '#FB923C' },
          { x: 90, y: 200, r: 5, c: '#F59E0B' },
          { x: 180, y: 190, r: 3, c: '#FFD93D' },
          { x: 140, y: 50, r: 4, c: '#FB923C' },
          { x: 220, y: 170, r: 3, c: '#FFD93D' },
        ].map((e, i) => <circle key={i} cx={e.x} cy={e.y} r={e.r} fill={e.c} opacity="0.7"/>)}
      </svg>
    </div>

    {/* Big flame center */}
    <div style={{
      position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)',
      fontSize: 96,
      filter: 'drop-shadow(0 20px 30px rgba(245,158,11,0.5))',
    }}>🔥</div>

    {/* 7-day calendar */}
    <div style={{
      position: 'absolute', bottom: 100, left: 20, right: 20,
      background: '#fff', borderRadius: 20, padding: 16,
      border: `1px solid ${V3.border}`,
      boxShadow: '0 12px 30px -8px rgba(0,0,0,0.12)',
    }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: V3.textSec, letterSpacing: 1.2, marginBottom: 10, textAlign: 'center' }}>
        이번 주
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
        {['월','화','수','목','금','토','일'].map((d, i) => {
          const active = i <= 6;
          const today = i === 6;
          return (
            <div key={d} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: V3.textSec, fontWeight: 700, marginBottom: 6 }}>{d}</div>
              <div style={{
                width: 32, height: 32, margin: '0 auto', borderRadius: 10,
                background: today ? 'linear-gradient(135deg, #FF8C42, #F59E0B)'
                         : (active ? '#FFF5E0' : V3.surfaceAlt),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
                border: today ? '2px solid #fff' : `1px solid ${active ? V3.warning + '40' : V3.border}`,
                boxShadow: today ? '0 6px 14px -4px rgba(245,158,11,0.5)' : 'none',
              }}>{active ? '🔥' : ''}</div>
            </div>
          );
        })}
      </div>
    </div>

    <button style={{
      position: 'absolute', bottom: 20, left: 20, right: 20,
      height: 50, borderRadius: 14, background: '#1A1A2E',
      color: '#fff', border: 'none',
      fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: V3.font,
    }}>확인</button>
  </VScreen>
);

window.CV3Screens = {
  PracticeEmpty: VPracticeEmpty,
  PracticeTyping: VPracticeTyping,
  PracticeGrading: VPracticeGrading,
  PracticeResult: VPracticeResult,
  DailyComplete: VDailyComplete,
  LevelUp: VLevelUp,
  StreakPlus: VStreakPlus,
};
