import { useEffect, useState } from 'react'

const PINK = '#FFF0F2'
const BLUE = '#3B82F6'
const DARK = '#111111'

const FEATURES = [
  {
    title: 'Event',
    desc: "Don't know where to go this week? Find your options here",
    subs: [
      { icon: 'plus', label: 'Create' },
      { icon: 'ticket', label: 'Tickets' },
    ],
  },
  {
    title: 'Create',
    desc: 'You can create your own events, invite your friends and manage their RSVPs',
    subs: [
      { icon: 'ticket', label: 'Tickets' },
    ],
  },
  {
    title: 'Tickets',
    desc: 'Track event details, ticket types, and the number of entries available.',
    subs: [],
  },
]

// Icons arranged around a circle — angle in degrees, radius from center
const SPIN_RING = [
  { angle: 0,   r: 72, icon: 'pan' },
  { angle: 30,  r: 80, icon: 'books' },
  { angle: 60,  r: 68, icon: 'guitar' },
  { angle: 90,  r: 78, icon: 'plant' },
  { angle: 120, r: 72, icon: 'people' },
  { angle: 150, r: 80, icon: 'badge' },
  { angle: 180, r: 68, icon: 'party' },
  { angle: 210, r: 78, icon: 'glasses' },
  { angle: 240, r: 72, icon: 'yoga' },
  { angle: 270, r: 80, icon: 'camera' },
  { angle: 300, r: 68, icon: 'plane' },
  { angle: 330, r: 76, icon: 'mic' },
]

function SpinIcon({ name }: { name: string }) {
  const s = 18
  const props = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: '#333', strokeWidth: '1.3', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  switch (name) {
    case 'pan':
      return <svg {...props}><path d="M3 11h14a2 2 0 0 1 0 4H3l-1-2 1-2z"/><path d="M19 13h2"/><path d="M8 11V6"/></svg>
    case 'books':
      return <svg {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    case 'guitar':
      return <svg {...props}><path d="M9 18a4 4 0 1 0 4-4"/><path d="M12 12l4-4"/><circle cx="18" cy="6" r="1.5"/><path d="M15 9l-6 6"/></svg>
    case 'plant':
      return <svg {...props}><path d="M12 22V12"/><path d="M12 12C12 7 17 4 17 4s0 5-5 8"/><path d="M12 12C12 7 7 4 7 4s0 5 5 8"/></svg>
    case 'people':
      return <svg {...props}><circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="19" cy="7" r="2"/><path d="M22 21v-2a3 3 0 0 0-2-2.83"/></svg>
    case 'badge':
      return <svg {...props}><circle cx="12" cy="8" r="6"/><path d="M15.5 12l-4 6-2.5-3-3 3"/></svg>
    case 'party':
      return <svg {...props}><path d="M5.8 11.3L2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2l3.36 7.36L22 10l-7 .9L14 18l-2.7-5.4L5 14l4.5-3.5z"/></svg>
    case 'glasses':
      return <svg {...props}><circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M10 15h4"/><path d="M2 15h.01"/><path d="M22 15h.01"/></svg>
    case 'yoga':
      return <svg {...props}><circle cx="12" cy="5" r="2"/><path d="M12 7v4l3 3"/><path d="M9 10l-2 3"/><path d="M9 17l-1 3"/><path d="M15 17l1 3"/></svg>
    case 'camera':
      return <svg {...props}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
    case 'plane':
      return <svg {...props}><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>
    case 'mic':
      return <svg {...props}><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><path d="M12 18v4"/><path d="M9 22h6"/></svg>
    default:
      return null
  }
}

function FeatureIcon({ title }: { title: string }) {
  if (title === 'Event') return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={BLUE} stroke="none">
      <rect x="3" y="4" width="18" height="18" rx="2" fill={BLUE} opacity="0.15"/>
      <rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke={BLUE} strokeWidth="1.8"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke={BLUE} strokeWidth="1.8"/>
      <rect x="7" y="14" width="3" height="3" rx="0.5" fill={BLUE}/>
    </svg>
  )
  if (title === 'Create') return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={BLUE} opacity="0.12" stroke={BLUE} strokeWidth="1.8"/>
      <line x1="12" y1="7" x2="12" y2="17" stroke={BLUE} strokeWidth="2" strokeLinecap="round"/>
      <line x1="7" y1="12" x2="17" y2="12" stroke={BLUE} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="8" width="20" height="14" rx="2" fill={BLUE} opacity="0.12" stroke={BLUE} strokeWidth="1.8"/>
      <path d="M8 8V6a4 4 0 0 1 8 0v2" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="9" y1="12" x2="9" y2="16" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 2"/>
      <line x1="15" y1="12" x2="15" y2="16" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 2"/>
    </svg>
  )
}

function SubIcon({ type }: { type: string }) {
  if (type === 'plus') return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  )
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M8 7V5a4 4 0 0 1 8 0v2"/>
    </svg>
  )
}

export function UzekaOnboardingScreen() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setActive(p => (p + 1) % FEATURES.length)
        setFading(false)
      }, 300)
    }, 2800)
    return () => clearInterval(id)
  }, [])

  const feat = FEATURES[active]

  return (
    <div style={{ width: '100%', height: '100%', background: PINK, position: 'relative', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>

      {/* ── Logo ── */}
      <div style={{
        position: 'absolute', top: 36, left: 28,
        width: 46, height: 46, borderRadius: 12,
        background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <span style={{ color: '#fff', fontSize: 18, fontWeight: 900, lineHeight: 1, letterSpacing: '-1px' }}>J</span>
        <span style={{ color: '#e85d2c', fontSize: 8, fontWeight: 700, letterSpacing: '0.04em', marginTop: 1 }}>ユ乃</span>
      </div>

      {/* ── Spinning icon ring ── */}
      <div style={{
        position: 'absolute',
        top: '8%',
        right: '-8%',
        width: 220,
        height: 220,
        animation: 'uzeka-spin 28s linear infinite',
      }}>
        {SPIN_RING.map(({ angle, r, icon }) => {
          const rad = (angle * Math.PI) / 180
          const x = 110 + r * Math.cos(rad) - 9
          const y = 110 + r * Math.sin(rad) - 9
          return (
            <div key={icon + angle} style={{ position: 'absolute', left: x, top: y, opacity: 0.65 }}>
              <SpinIcon name={icon} />
            </div>
          )
        })}
      </div>

      {/* counter-spin so icons stay upright */}
      <style>{`
        @keyframes uzeka-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes uzeka-spin-rev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        .uzeka-icon-inner { animation: uzeka-spin-rev 28s linear infinite; }
      `}</style>

      {/* ── Animated feature panel ── */}
      <div style={{
        position: 'absolute',
        top: '14%',
        left: 28,
        width: 170,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        opacity: fading ? 0 : 1,
        transform: fading ? 'translateY(8px)' : 'translateY(0)',
      }}>
        {/* Feature icon */}
        <div style={{ marginBottom: 8 }}>
          <FeatureIcon title={feat.title} />
        </div>

        {/* Title */}
        <p style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: DARK, lineHeight: 1.15, letterSpacing: '-0.03em' }}>
          {feat.title}
        </p>

        {/* Description */}
        <p style={{ margin: '0 0 14px', fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>
          {feat.desc}
        </p>

        {/* Sub items */}
        {feat.subs.map(sub => (
          <div key={sub.label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
            <SubIcon type={sub.icon} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>{sub.label}</span>
          </div>
        ))}
      </div>

      {/* ── Bottom card ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderRadius: '28px 28px 0 0',
        padding: '28px 24px 36px',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.06)',
      }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 900, color: DARK, lineHeight: 1.15, letterSpacing: '-0.03em', textAlign: 'center' }}>
          Discover Events Around You
        </h2>
        <p style={{ margin: '0 0 22px', fontSize: 13, color: '#8b8fa3', lineHeight: 1.5, textAlign: 'center' }}>
          Don't know where to go this week?<br />Find your options here
        </p>

        {/* CTA: Email */}
        <button style={{
          width: '100%', padding: '14px 20px', marginBottom: 12,
          border: '1.5px solid #e0e2e8', borderRadius: 14,
          background: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontSize: 14, fontWeight: 700, color: DARK,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          Continue with Email
        </button>

        {/* CTA: Phone */}
        <button style={{
          width: '100%', padding: '14px 20px',
          border: '1.5px solid #e0e2e8', borderRadius: 14,
          background: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontSize: 14, fontWeight: 700, color: DARK,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.77 19 19.5 19.5 0 0 1 5 12.23 19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          Get Started With Phone Number
        </button>
      </div>
    </div>
  )
}
