import { useEffect, useRef, useState } from 'react'

const BLUE = '#3B82F6'
const DARK = '#111111'
const SUB = '#8b8fa3'

// ── Dimmed OTP background ──────────────────────────────────────────────────
function OtpBg() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.35)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingTop: 90,
    }}>
      <p style={{ color: '#fff', fontSize: 18, fontWeight: 600, textAlign: 'center', margin: '0 0 4px' }}>
        An OTP PIN has been sent via<br />Whatsapp
      </p>
      <p style={{ color: '#f59e0b', fontSize: 14, fontWeight: 600, margin: '0 0 6px' }}>+233 55 941 8202</p>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Enter the one-time PIN</p>
      <div style={{ display: 'flex', gap: 18, marginTop: 18 }}>
        {['2','2','2','|','—','—'].map((c, i) => (
          <span key={i} style={{
            color: c === '—' ? 'rgba(255,255,255,0.3)' : '#fff',
            fontSize: 28, fontWeight: 700,
            borderBottom: '2px solid rgba(255,255,255,0.35)',
            paddingBottom: 2, minWidth: 18, textAlign: 'center',
          }}>{c}</span>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginTop: 14 }}>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>✏ Edit Mobile Number</span>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>↻ Resend OTP</span>
      </div>
    </div>
  )
}

// ── Converging lines SVG with animated dashes ──────────────────────────────
function MergeLines({ progress }: { progress: number }) {
  const drawn = Math.min(progress / 100, 1)
  // left line: from phone card (55, 5) to logo center (140, 95)
  // right line: from email card (225, 5) to logo center (140, 95)
  const L_LEN = 115  // approximate path lengths
  const R_LEN = 115

  return (
    <svg width="280" height="110" viewBox="0 0 280 110" style={{ display: 'block', overflow: 'visible' }}>
      {/* Yellow phone → logo */}
      <path
        d={`M 55 8 C 55 55, 140 40, 140 98`}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2"
        strokeDasharray="6 4"
        strokeDashoffset={L_LEN * (1 - drawn)}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.08s linear' }}
      />
      {/* Pink email → logo */}
      <path
        d={`M 225 8 C 225 55, 140 40, 140 98`}
        fill="none"
        stroke="#f43f5e"
        strokeWidth="2"
        strokeDasharray="6 4"
        strokeDashoffset={R_LEN * (1 - drawn)}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.08s linear' }}
      />
      {/* Vertical dashed from logo down */}
      <line
        x1="140" y1="98" x2="140" y2="110"
        stroke="#9ca3af"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
    </svg>
  )
}

// ── Merging phase ──────────────────────────────────────────────────────────
function MergingSheet({ progress }: { progress: number }) {
  return (
    <div style={{ padding: '22px 20px 24px' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: DARK }}>Merging your accounts</h2>
      <p style={{ margin: '0 0 20px', fontSize: 13, color: SUB, lineHeight: 1.5 }}>
        We're bringing everything together. This only takes a moment.
      </p>

      {/* Account cards row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0 }}>
        {/* Phone card */}
        <div style={{
          flex: 1, background: '#fff', borderRadius: 14,
          border: '1px solid #f0f1f3', padding: '12px 14px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}>
          <div style={{ color: '#f59e0b', marginBottom: 6 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.77 19 19.5 19.5 0 0 1 5 12.23 19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: DARK }}>0559488203</p>
          <p style={{ margin: '0 0 4px', fontSize: 11, color: SUB, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>🎟</span> 3 tickets
          </p>
          <p style={{ margin: 0, fontSize: 11, color: SUB, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>≡</span> 1 Guest List
          </p>
        </div>

        {/* Progress badge */}
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: '#EFF6FF', border: '2px solid #BFDBFE',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: BLUE }}>{Math.round(progress)}%</span>
        </div>

        {/* Email card */}
        <div style={{
          flex: 1, background: '#fff', borderRadius: 14,
          border: '1px solid #f0f1f3', padding: '12px 14px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}>
          <div style={{ color: '#f43f5e', marginBottom: 6, textAlign: 'right' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <p style={{ margin: '0 0 6px', fontSize: 10.5, fontWeight: 700, color: DARK }}>PeterParker@gmail.com</p>
          <p style={{ margin: '0 0 4px', fontSize: 11, color: SUB, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>🎟</span> 2 tickets
          </p>
          <p style={{ margin: 0, fontSize: 11, color: SUB, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>📅</span> 3 Events
          </p>
        </div>
      </div>

      {/* Lines + J logo */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <MergeLines progress={progress} />
        {/* J logo at center of lines */}
        <div style={{
          position: 'absolute',
          bottom: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 36, height: 36, borderRadius: 9,
          background: DARK, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column',
          boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
        }}>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.5px' }}>J</span>
          <span style={{ color: '#e85d2c', fontSize: 6, fontWeight: 700 }}>ユ乃</span>
        </div>
      </div>

      {/* Merged profile card */}
      <div style={{
        background: '#f9fafb', borderRadius: 16,
        border: '1px solid #f0f1f3', padding: '16px 16px 14px',
        marginTop: 8,
      }}>
        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #cbd5e1, #94a3b8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '3px solid #fff', boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
            fontSize: 22,
          }}>
            👤
          </div>
        </div>
        <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: DARK, textAlign: 'center' }}>Peter Parker</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 11, color: SUB }}>+ 244 945099125</span>
          <span style={{ color: '#d1d5db' }}>|</span>
          <span style={{ fontSize: 11, color: '#f43f5e', fontWeight: 600 }}>PeterParker@gmail.com</span>
        </div>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          {[['Tickets', '5'], ['Events', '3'], ['Guest Lists', '1']].map(([label, val]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 2px', fontSize: 11, color: SUB }}>{label}</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: DARK }}>{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Success phase ──────────────────────────────────────────────────────────
function SuccessSheet() {
  return (
    <div style={{ padding: '28px 20px 28px' }}>
      {/* Green checkmark */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: '#22c55e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(34,197,94,0.35)',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>

      <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 800, color: DARK, textAlign: 'center' }}>
        Accounts Merged Successfully
      </h2>

      {/* Profile card */}
      <div style={{
        background: '#f9fafb', borderRadius: 16,
        border: '1px solid #f0f1f3', padding: '16px 16px 14px',
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #cbd5e1, #94a3b8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '3px solid #fff', boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
            fontSize: 22,
          }}>
            👤
          </div>
        </div>
        <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: DARK, textAlign: 'center' }}>Peter Parker</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 11, color: SUB }}>+ 244 945099125</span>
          <span style={{ color: '#d1d5db' }}>|</span>
          <span style={{ fontSize: 11, color: '#f43f5e', fontWeight: 600 }}>PeterParker@gmail.com</span>
        </div>
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
            {[['Tickets', '5'], ['Events', '3'], ['Guest Lists', '1']].map(([label, val]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 2px', fontSize: 11, color: SUB }}>{label}</p>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: DARK }}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Done button */}
      <button style={{
        width: '100%', padding: '16px', border: 'none', borderRadius: 999,
        background: BLUE, color: '#fff', fontSize: 16, fontWeight: 700,
        cursor: 'pointer', boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
      }}>
        Done
      </button>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export function UzekaMergeScreen() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'merging' | 'success'>('merging')
  const [cycle, setCycle] = useState(0)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(0)
  const DURATION = 6000

  useEffect(() => {
    setProgress(0)
    setPhase('merging')
    startRef.current = performance.now()

    function tick(now: number) {
      const elapsed = now - startRef.current
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setPhase('success')
          setTimeout(() => setCycle(c => c + 1), 3000)
        }, 400)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [cycle])

  const sheetVisible = phase === 'success'

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#e5e7eb', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>

      {/* ── Status bar ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 24px 0', fontSize: 13, fontWeight: 700, color: '#fff', zIndex: 10,
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 11 }}>
          <span>●●●</span><span>▲</span><span>▋</span>
        </div>
      </div>

      {/* ── Dimmed OTP background ── */}
      <OtpBg />

      {/* ── Bottom sheet ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
        // Slide in from bottom
        transform: 'translateY(0)',
        transition: 'none',
        // Handle indicator
        paddingTop: 8,
        maxHeight: '72%',
        overflowY: 'auto',
      }}>
        {/* Pull handle */}
        <div style={{
          width: 36, height: 4, borderRadius: 999,
          background: '#e0e2e8', margin: '0 auto 4px',
        }} />

        {/* Content transitions */}
        <div style={{
          opacity: phase === 'merging' ? 1 : 0,
          transform: phase === 'merging' ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          position: phase === 'success' ? 'absolute' : 'relative',
          width: '100%',
        }}>
          <MergingSheet progress={progress} />
        </div>

        <div style={{
          opacity: sheetVisible ? 1 : 0,
          transform: sheetVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
          position: phase === 'merging' ? 'absolute' : 'relative',
          width: '100%',
          pointerEvents: sheetVisible ? 'auto' : 'none',
        }}>
          <SuccessSheet />
        </div>
      </div>
    </div>
  )
}
