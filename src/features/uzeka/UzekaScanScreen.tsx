import { useEffect, useState } from 'react'

const PINK   = '#f43f5e'
const BLUE   = '#3B82F6'
const DARK   = '#111111'
const SUB    = '#8b8fa3'
const GREEN  = '#22c55e'
const ORANGE = '#f59e0b'

type Phase = 0 | 1 | 2

const DURATIONS: number[] = [2500, 2000, 3500]

// ── QR code SVG (deterministic, looks real) ────────────────────────────────
function QRCode({ size = 150 }: { size?: number }) {
  const N = 21
  const dark = new Set<string>()
  const mark = (c: number, r: number) => dark.add(`${c},${r}`)

  const finder = (ox: number, oy: number) => {
    for (let dr = 0; dr < 7; dr++) {
      for (let dc = 0; dc < 7; dc++) {
        const outer = dr === 0 || dr === 6 || dc === 0 || dc === 6
        const inner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4
        if (outer || inner) mark(ox + dc, oy + dr)
      }
    }
  }

  finder(0, 0); finder(14, 0); finder(0, 14)

  for (let i = 8; i <= 12; i += 2) { mark(i, 6); mark(6, i) }

  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      if (Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0))
        mark(16 + dc, 16 + dr)
    }
  }

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (dark.has(`${c},${r}`)) continue
      if ((r < 9 && c < 9) || (r < 9 && c > 12) || (r > 12 && c < 9)) continue
      if (r === 6 || c === 6) continue
      if ((c * 11 + r * 7 + c * r * 3) % 100 < 43) mark(c, r)
    }
  }

  const modules = [...dark].map(k => k.split(',').map(Number))

  return (
    <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} style={{ width: size, height: size, display: 'block' }}>
      <rect x="-1" y="-1" width={N + 2} height={N + 2} fill="white"/>
      {modules.map(([x, y]) => (
        <rect key={`${x},${y}`} x={x} y={y} width="1" height="1" fill="#111"/>
      ))}
    </svg>
  )
}

// ── L-bracket corner for phase 0 frame ────────────────────────────────────
function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const B = 3, S = 26, R = 10
  return (
    <div style={{
      position: 'absolute', width: S, height: S,
      top:    pos[0] === 't' ? 0 : undefined,
      bottom: pos[0] === 'b' ? 0 : undefined,
      left:   pos[1] === 'l' ? 0 : undefined,
      right:  pos[1] === 'r' ? 0 : undefined,
      borderTop:    pos[0] === 't' ? `${B}px solid #fff` : undefined,
      borderBottom: pos[0] === 'b' ? `${B}px solid #fff` : undefined,
      borderLeft:   pos[1] === 'l' ? `${B}px solid #fff` : undefined,
      borderRight:  pos[1] === 'r' ? `${B}px solid #fff` : undefined,
      borderRadius: [
        pos === 'tl' ? R : 0,
        pos === 'tr' ? R : 0,
        pos === 'br' ? R : 0,
        pos === 'bl' ? R : 0,
      ].map(v => `${v}px`).join(' '),
    }} />
  )
}

// ── Bottom nav ─────────────────────────────────────────────────────────────
function ScanBottomNav() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-around',
      padding: '10px 0 22px', background: '#fff', borderTop: '1px solid #f0f1f3',
    }}>
      {(['Scan', 'Analytics', 'Team', 'Scans', 'Settings'] as const).map(label => {
        const active = label === 'Scan'
        const c = active ? PINK : SUB
        return (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            {label === 'Scan' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                <rect x="7" y="7" width="3" height="3"/><rect x="14" y="7" width="3" height="3"/>
                <rect x="7" y="14" width="3" height="3"/>
              </svg>
            ) : label === 'Analytics' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            ) : label === 'Team' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
                <circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                <circle cx="19" cy="7" r="2"/><path d="M22 21v-2a3 3 0 0 0-2-2.83"/>
              </svg>
            ) : label === 'Scans' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="2"/>
                <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            )}
            <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: c }}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── Success info row ───────────────────────────────────────────────────────
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '11px 0', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
      <p style={{ margin: '0 0 3px', fontSize: 11, color: SUB }}>{label}</p>
      {children}
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export function UzekaScanScreen() {
  const [phase, setPhase] = useState<Phase>(0)

  useEffect(() => {
    const id = setTimeout(() => {
      setPhase(p => ((p + 1) % 3) as Phase)
    }, DURATIONS[phase])
    return () => clearTimeout(id)
  }, [phase])

  const frameBorder = phase === 0
    ? 'none'
    : phase === 1
      ? '2.5px solid rgba(255,255,255,0.95)'
      : `2.5px solid ${GREEN}`

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      background: '#fff', display: 'flex', flexDirection: 'column',
    }}>
      <style>{`
        @keyframes uzeka-scan {
          0%   { top: 6%; }
          50%  { top: 88%; }
          100% { top: 6%; }
        }
      `}</style>

      {/* Status bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 20px 0', fontSize: 13, fontWeight: 700, color: DARK, flexShrink: 0,
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 11 }}>
          <span>●●●</span><span>▲</span><span>▋</span>
        </div>
      </div>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 20px', flexShrink: 0,
      }}>
        <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '0.18em', color: DARK }}>UZEKA</span>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: '#f5f6f8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
      </div>

      {/* Event card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 20px 12px', flexShrink: 0,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0, overflow: 'hidden',
          background: 'linear-gradient(135deg, #7c2d12, #c2410c)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>🎵</div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: DARK }}>AfroBeats Takeover</p>
          <p style={{ margin: 0, fontSize: 12 }}>
            <span style={{ color: PINK, fontWeight: 700 }}>5</span>
            <span style={{ color: SUB }}> / 255 Scanned</span>
          </p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={SUB} strokeWidth="2.5" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {/* Camera view */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #4a6fa5 0%, #7ba3d4 50%, #3b5998 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Dark overlay (phase 0 - searching) */}
        <div style={{
          position: 'absolute', inset: 0, background: '#0c0c0c',
          opacity: phase === 0 ? 1 : 0, transition: 'opacity 0.6s ease',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Dim overlay (phase 2 - success) */}
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
          opacity: phase === 2 ? 1 : 0, transition: 'opacity 0.35s ease',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Scanner frame */}
        <div style={{
          width: '80%', aspectRatio: '1',
          position: 'relative', zIndex: 2,
          border: frameBorder,
          borderRadius: 20,
          overflow: phase >= 1 ? 'hidden' : 'visible',
          transition: 'border-color 0.3s ease',
          boxShadow: phase === 2 ? `0 0 0 4px ${GREEN}44` : 'none',
        }}>
          {/* Corner brackets — phase 0 only */}
          {phase === 0 && (['tl', 'tr', 'bl', 'br'] as const).map(pos => (
            <Corner key={pos} pos={pos} />
          ))}

          {/* QR code + camera background — phases 1 & 2 */}
          {phase >= 1 && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(160deg, #5b7fbf 0%, #8aaedd 50%, #4a6898 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ background: '#fff', padding: 12, borderRadius: 6 }}>
                <QRCode size={136} />
              </div>

              {/* Scanning line — phase 1 only */}
              {phase === 1 && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, height: 2.5, top: 0,
                  background: `linear-gradient(90deg, transparent 5%, ${ORANGE} 35%, ${ORANGE} 65%, transparent 95%)`,
                  boxShadow: `0 0 10px 3px ${ORANGE}88`,
                  animation: 'uzeka-scan 1.8s ease-in-out infinite',
                }} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ flexShrink: 0 }}>
        <ScanBottomNav />
      </div>

      {/* Success sheet — slides up over everything */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: '#fff', borderRadius: '24px 24px 0 0',
        boxShadow: '0 -4px 40px rgba(0,0,0,0.18)',
        transform: phase === 2 ? 'translateY(0)' : 'translateY(105%)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '10px 20px 36px',
        zIndex: 20,
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 999, background: '#e0e2e8', margin: '0 auto 18px' }} />

        {/* Checkmark */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: GREEN,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(34,197,94,0.4)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>

        <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 800, color: DARK, textAlign: 'center' }}>
          Check-In Successful
        </h2>

        {/* Info rows */}
        <div style={{ background: '#f9fafb', borderRadius: 14, overflow: 'hidden', marginBottom: 18 }}>
          <InfoRow label="Customer">
            <p style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 800, color: DARK }}>João Pereira</p>
            <p style={{ margin: 0, fontSize: 11, color: SUB }}>joaoapera@gmail.com</p>
          </InfoRow>
          <InfoRow label="Ticket Type">
            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: DARK }}>VIP</p>
          </InfoRow>
          <InfoRow label="Last Scan Time">
            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: DARK }}>08:21 PM</p>
          </InfoRow>
          <div style={{ padding: '11px 0', textAlign: 'center' }}>
            <p style={{ margin: '0 0 3px', fontSize: 11, color: SUB }}>Scans left</p>
            <p style={{ margin: 0 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: SUB }}>1</span>
              <span style={{ fontSize: 13, color: SUB, fontWeight: 500 }}> / 3 Remaining</span>
            </p>
          </div>
        </div>

        <button style={{
          width: '100%', padding: '15px', border: 'none', borderRadius: 999,
          background: BLUE, color: '#fff', fontSize: 15, fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
        }}>
          Done
        </button>
      </div>
    </div>
  )
}
