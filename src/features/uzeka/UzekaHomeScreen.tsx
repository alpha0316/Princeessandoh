import { useEffect, useState } from 'react'

const PINK   = '#FFF0F2'
const GREEN  = '#22c55e'
const BLUE   = '#3B82F6'
const DARK   = '#111111'
const SUB    = '#8b8fa3'
const RED    = '#f43f5e'

// ── Placeholder image for event cards ─────────────────────────────────────
function EventImg() {
  return (
    <div style={{
      width: '100%', aspectRatio: '4/3', borderRadius: 12,
      overflow: 'hidden', position: 'relative', flexShrink: 0,
      background: 'linear-gradient(145deg, #6b4c1e 0%, #a07230 40%, #8b6030 70%, #5a3a15 100%)',
    }}>
      {/* warm ambient blobs */}
      <div style={{ position: 'absolute', top: 10, left: 10, width: 50, height: 50, borderRadius: 8, background: 'rgba(255,220,120,0.12)' }} />
      <div style={{ position: 'absolute', bottom: 28, right: 36, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,180,60,0.10)' }} />
      <div style={{ position: 'absolute', top: 20, right: 12, width: 30, height: 60, borderRadius: 4, background: 'rgba(0,0,0,0.15)' }} />
      {/* Date badge */}
      <div style={{
        position: 'absolute', bottom: 7, right: 7,
        background: 'rgba(0,0,0,0.80)', borderRadius: 6,
        padding: '3px 9px', textAlign: 'center', minWidth: 38,
      }}>
        <p style={{ margin: 0, fontSize: 7, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>May</p>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>30</p>
      </div>
    </div>
  )
}

// ── Single event card ──────────────────────────────────────────────────────
function EventCard() {
  return (
    <div style={{ width: '100%' }}>
      <EventImg />
      <p style={{ margin: '7px 0 2px', fontSize: 12, fontWeight: 700, color: DARK, lineHeight: 1.3 }}>Apex Company Brunch</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ fontSize: 10, color: SUB }}>📍 Alist Restaurant</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: '#16a34a', background: '#dcfce7', borderRadius: 999, padding: '2px 7px' }}>Available</span>
      </div>
      <span style={{ fontSize: 10, color: SUB }}>🕙 10 AM</span>
      <div style={{ borderTop: '1.5px dashed #e5e7eb', margin: '7px 0' }} />
      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: DARK }}>
        35.000 <span style={{ fontWeight: 500, color: SUB }}>Kz p/ pessoa</span>
      </p>
    </div>
  )
}

// ── Category tabs ──────────────────────────────────────────────────────────
const CATS = [
  { label: 'All Events', icon: 'J', active: true },
  { label: 'Corporate',  icon: '🏢', active: false },
  { label: 'Party',      icon: '🎉', active: false },
  { label: 'Social Event', icon: '🥂', active: false },
  { label: 'Sports',     icon: '⚽', active: false },
]

function CategoryTabs() {
  return (
    <div style={{ display: 'flex', gap: 20, padding: '10px 20px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
      {CATS.map(({ label, icon, active }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0, cursor: 'pointer' }}>
          {icon === 'J' ? (
            <div style={{ width: 30, height: 30, borderRadius: 8, background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 900, lineHeight: 1 }}>J</span>
              <span style={{ color: RED, fontSize: 5, fontWeight: 700 }}>ユ乃</span>
            </div>
          ) : (
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#f5f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
              {icon}
            </div>
          )}
          <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: active ? DARK : SUB, whiteSpace: 'nowrap' }}>{label}</span>
          {active && <div style={{ width: '100%', height: 2, background: DARK, borderRadius: 1, marginTop: -2 }} />}
        </div>
      ))}
    </div>
  )
}

// ── Green promo banner ─────────────────────────────────────────────────────
function PromoBanner() {
  return (
    <div style={{
      margin: '18px 20px 0', background: GREEN, borderRadius: 18,
      padding: '20px 16px', display: 'flex', alignItems: 'center',
      overflow: 'hidden', position: 'relative', minHeight: 118,
    }}>
      <div style={{ flex: 1, paddingRight: 90, zIndex: 1 }}>
        <p style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>Crave Something New?</p>
        <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
          Explore trending recipes from chefs around the world.
        </p>
      </div>
      {/* Food emoji placeholder — user replaces with real image */}
      <div style={{
        position: 'absolute', right: -14, bottom: -8,
        width: 118, height: 118, borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 35%, #a7f3d0, #22c55e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44,
      }}>
        🥗
      </div>
    </div>
  )
}

// ── Bottom nav ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Explore',       icon: '🔍', active: true },
  { label: 'Events',        icon: '📅' },
  { label: 'Create Event',  icon: '+' },
  { label: 'Tickets',       icon: '🎟' },
  { label: 'Profile',       icon: '👤' },
]

function BottomNav() {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: '#fff', borderTop: '1px solid #f0f1f3',
      padding: '8px 0 24px', display: 'flex', justifyContent: 'space-around',
    }}>
      {NAV_ITEMS.map(({ label, icon, active }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{
            width: active ? 34 : 26, height: active ? 34 : 26,
            borderRadius: '50%', background: active ? RED : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: icon === '+' ? 18 : 13, color: active ? '#fff' : SUB, fontWeight: 700,
          }}>
            {icon}
          </div>
          <span style={{ fontSize: 8.5, fontWeight: active ? 700 : 500, color: active ? RED : SUB, textAlign: 'center' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
// phase 0 = Default (pink header, tabs)
// phase 1 = First scroll (white, UZEKA title, tabs)
// phase 2 = Second scroll (compact header, tabs scrolled away)
export function UzekaHomeScreen() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0)

  useEffect(() => {
    const durations = [3000, 3000, 3000]
    let idx = 0
    const tick = () => {
      idx = (idx + 1) % 3
      setPhase(idx as 0 | 1 | 2)
    }
    let id = setInterval(tick, durations[0])
    const unsub = () => clearInterval(id)

    // Re-schedule with correct duration for each phase
    const schedule = () => {
      clearInterval(id)
      id = setInterval(() => { tick(); schedule() }, durations[phase])
    }
    schedule()
    return unsub
  }, [])

  // How far content has "scrolled" per phase
  const SCROLL = [0, 56, 138]
  const scrollY = SCROLL[phase]

  // Header: pink at 0, white+title at 1, white compact at 2
  const headerBg   = phase === 0 ? PINK : '#fff'
  const showTitle  = phase === 1
  const headerPadT = phase === 1 ? 10 : 8

  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden', position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      background: '#fff',
    }}>

      {/* ── Status bar ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 22px 0', fontSize: 13, fontWeight: 700, color: DARK,
        background: headerBg, transition: 'background 0.38s ease',
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 5, fontSize: 11 }}>
          <span>●●●</span><span>▲</span><span>▋</span>
        </div>
      </div>

      {/* ── Header ── */}
      <div style={{
        background: headerBg,
        transition: 'background 0.38s ease, padding 0.38s ease',
        paddingTop: headerPadT,
        paddingBottom: 10,
      }}>
        {/* UZEKA title (phase 1 only) */}
        <div style={{
          overflow: 'hidden',
          maxHeight: showTitle ? 36 : 0,
          opacity: showTitle ? 1 : 0,
          transform: showTitle ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'max-height 0.35s ease, opacity 0.35s ease, transform 0.35s ease',
          textAlign: 'center',
          marginBottom: showTitle ? 8 : 0,
        }}>
          <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '0.22em', color: DARK }}>UZEKA</span>
        </div>

        {/* Search row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px' }}>
          <span style={{ fontSize: 18, color: DARK, cursor: 'pointer', flexShrink: 0 }}>☰</span>
          <div style={{
            flex: 1, background: '#f5f6f8', borderRadius: 999,
            padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={SUB} strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span style={{ fontSize: 13, color: '#c0c4d0' }}>Search Events</span>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div style={{
        transform: `translateY(${-scrollY}px)`,
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        paddingBottom: 80,
      }}>
        {/* Category tabs */}
        <CategoryTabs />

        {/* Popular events */}
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: DARK }}>Popular Events</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 12, color: BLUE, fontWeight: 600 }}>See More</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <EventCard /><EventCard />
          </div>
        </div>

        {/* Promo banner */}
        <PromoBanner />

        {/* New This Week */}
        <div style={{ padding: '18px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: DARK }}>New This Week</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 12, color: BLUE, fontWeight: 600 }}>See More</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <EventCard /><EventCard />
          </div>
        </div>
      </div>

      {/* ── Bottom nav ── */}
      <BottomNav />
    </div>
  )
}
