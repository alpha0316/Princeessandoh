import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import HomeScreen from './HomeScreen'
import GasStatusBar from '../components/GasStatusBar'
import ShuttleMap from '../../shuttle/screens/ShuttleMap'

// ── Phase machine ─────────────────────────────────────────────────────────────

type PhaseId =
  | 'home'
  | 'scroll-dn'
  | 'scroll-up'
  | 'pre-tap'
  | 'tapping'
  | 'nav-out'
  | 'location'
  | 'search-open'

const PHASES: Array<{ id: PhaseId; dur: number; scrollTo?: number }> = [
  { id: 'home',        dur: 700 },
  { id: 'scroll-dn',   dur: 3200, scrollTo: 120 },
  { id: 'scroll-up',   dur: 2800, scrollTo: 60 },
  { id: 'pre-tap',     dur: 480 },
  { id: 'tapping',     dur: 820 },
  { id: 'nav-out',     dur: 340 },
  { id: 'location',    dur: 2600 },
  { id: 'search-open', dur: 4200 },
]

// ── Animation CSS ─────────────────────────────────────────────────────────────

const ANIM_CSS = `
  @keyframes gasSimSlideInRight {
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
  }
  @keyframes gasSimTapRipple {
    0%   { transform: translate(-50%,-50%) scale(0.2); opacity: 0.55; }
    65%  { transform: translate(-50%,-50%) scale(1.1); opacity: 0.18; }
    100% { transform: translate(-50%,-50%) scale(1.5); opacity: 0; }
  }
  @keyframes gasSimResultFade {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes gasSimCursor {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes gasSimSheetExpand {
    from { top: 64%; }
    to   { top: 88px; }
  }
`

// ── Root simulation component ─────────────────────────────────────────────────

export default function GasHomeFlowSimulation() {
  const [phaseId, setPhaseId] = useState<PhaseId>('home')
  const homeScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let idx = 0
    let timeout: number
    let raf: number | undefined

    const animateScroll = (target: number, dur: number) => {
      if (!homeScrollRef.current) return
      if (raf !== undefined) cancelAnimationFrame(raf)
      const el = homeScrollRef.current
      const start = el.scrollTop
      const dist = target - start
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min((t - t0) / dur, 1)
        const e = -(Math.cos(Math.PI * p) - 1) / 2
        el.scrollTop = start + dist * e
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const advance = () => {
      const phaseIdx = idx % PHASES.length
      const phase = PHASES[phaseIdx]
      setPhaseId(phase.id)
      if (phase.scrollTo !== undefined) animateScroll(phase.scrollTo, phase.dur)
      idx++
      timeout = window.setTimeout(advance, phase.dur)
    }

    advance()
    return () => {
      clearTimeout(timeout)
      if (raf !== undefined) cancelAnimationFrame(raf)
    }
  }, [])

  const onHome =
    phaseId === 'home' ||
    phaseId === 'scroll-dn' ||
    phaseId === 'scroll-up' ||
    phaseId === 'pre-tap' ||
    phaseId === 'tapping' ||
    phaseId === 'nav-out'

  const onLocation = phaseId === 'location' || phaseId === 'search-open'

  return (
    <div style={s.root}>
      <style>{ANIM_CSS}</style>

      {/* Home layer */}
      {onHome && (
        <div
          style={{
            ...s.layer,
            transform: phaseId === 'nav-out' ? 'translateX(-100%)' : 'translateX(0)',
            transition: phaseId === 'nav-out' ? 'transform 330ms cubic-bezier(0.4,0,0.6,1)' : 'none',
          }}
        >
          <HomeScreen ref={homeScrollRef} />
          {(phaseId === 'tapping') && <TapRipple />}
        </div>
      )}

      {/* Location layer */}
      {onLocation && (
        <div
          style={{
            ...s.layer,
            animation: 'gasSimSlideInRight 330ms cubic-bezier(0.0,0,0.2,1)',
          }}
        >
          <LocationPhase isSearchOpen={phaseId === 'search-open'} />
        </div>
      )}
    </div>
  )
}

// ── Tap ripple overlay ────────────────────────────────────────────────────────

function TapRipple() {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '57%',
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.22)',
        animation: 'gasSimTapRipple 800ms ease-out forwards',
        pointerEvents: 'none',
      }}
    />
  )
}

// ── Location phase ────────────────────────────────────────────────────────────

const KNUST_RESULTS = [
  { id: 'main', name: 'KNUST Main Gate', subtitle: 'Kumasi, Ghana' },
  { id: 'hosp', name: 'KNUST Hospital', subtitle: 'Kumasi, Ghana' },
  { id: 'src',  name: 'SRC Secretariat', subtitle: 'KNUST, Kumasi' },
]

function LocationPhase({ isSearchOpen }: { isSearchOpen: boolean }) {
  const [typedText, setTypedText] = useState('')
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (!isSearchOpen) {
      setTypedText('')
      setShowResults(false)
      return
    }

    let interval: number
    const timeout = window.setTimeout(() => {
      let i = 0
      const target = 'KNUST'
      interval = window.setInterval(() => {
        i++
        setTypedText(target.slice(0, i))
        if (i >= target.length) {
          clearInterval(interval)
          window.setTimeout(() => setShowResults(true), 200)
        }
      }, 260)
    }, 500)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [isSearchOpen])

  const sheetTop = isSearchOpen ? 88 : undefined

  return (
    <div style={ls.screen}>
      <GasStatusBar />

      {/* Back button */}
      <div style={ls.backWrap}>
        <button type="button" style={ls.backBtn} aria-label="Back">
          <LocBackIcon />
        </button>
      </div>

      {/* Map */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <ShuttleMap
          initialCenter={[-1.5719, 6.6735]}
          initialZoom={15.5}
          dropPoints={[[-1.5719, 6.6735]]}
          busRoutes={[]}
        />
      </div>

      {/* Bottom sheet */}
      <div
        style={{
          ...ls.sheet,
          top: sheetTop,
          borderTopLeftRadius: isSearchOpen ? 0 : 24,
          borderTopRightRadius: isSearchOpen ? 0 : 24,
          transition: 'top 380ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Expanded header */}
        {isSearchOpen && (
          <div style={ls.sheetHeader}>
            <div style={{ width: 28 }} />
            <span style={ls.sheetTitle}>Your Route</span>
            <button type="button" style={ls.closeBtn}><CloseIcon /></button>
          </div>
        )}

        {/* Search row */}
        <div style={{ ...ls.searchRow, borderColor: isSearchOpen ? '#111111' : 'rgba(0,0,0,0.12)' }}>
          <SearchIcon />
          <div style={ls.searchText}>
            {typedText
              ? <>{typedText}{isSearchOpen && <span style={ls.cursor}>|</span>}</>
              : <span style={ls.placeholder}>Search for a pickup point</span>
            }
          </div>
        </div>

        {/* Collapsed: current location + continue */}
        {!isSearchOpen && (
          <>
            <button type="button" style={{ ...ls.optionRow, ...ls.optionSelected }}>
              <div style={ls.optionIcon}><HomeLocIcon /></div>
              <div style={ls.optionText}>
                <div style={ls.optionTitle}>Use Current Location</div>
                <div style={ls.optionSub}>Kumasi, Ghana</div>
              </div>
              <RadioDot selected />
            </button>
            <button type="button" style={ls.continueBtn}>Continue</button>
          </>
        )}

        {/* Expanded: results */}
        {isSearchOpen && showResults && (
          <div style={ls.resultsList}>
            {KNUST_RESULTS.map((r, i) => (
              <div
                key={r.id}
                style={{
                  ...ls.resultItem,
                  animation: `gasSimResultFade 260ms ease ${i * 80}ms both`,
                }}
              >
                <div style={ls.resultIcon}><PinResultIcon /></div>
                <div>
                  <div style={ls.resultTitle}>{r.name}</div>
                  <div style={ls.resultSub}>{r.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expanded: current location option when not yet showing results */}
        {isSearchOpen && !showResults && (
          <button type="button" style={ls.optionRow}>
            <div style={ls.optionIcon}><HomeLocIcon /></div>
            <div style={ls.optionText}>
              <div style={ls.optionTitle}>Use Current Location</div>
              <div style={ls.optionSub}>Save time by selecting your current location</div>
            </div>
            <RadioDot selected />
          </button>
        )}
      </div>
    </div>
  )
}

// ── RadioDot ──────────────────────────────────────────────────────────────────

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: 999,
        border: `1.5px solid ${selected ? '#111111' : 'rgba(0,0,0,0.18)'}`,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
      }}
    >
      {selected && (
        <div style={{ width: 10, height: 10, borderRadius: 999, background: '#111111' }} />
      )}
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function LocBackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M11.667 15L6.667 10l5-5" stroke="#4F4F4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M17.03 17.79c.46.46 1.17-.25.71-.7L13.99 13.33a7.96 7.96 0 1 0-.71.71l3.75 3.75zM1.11 8.02a6.96 6.96 0 1 1 13.92 0 6.96 6.96 0 0 1-13.92 0z" fill="rgba(0,0,0,0.5)" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6.4 19L5 17.6 10.6 12 5 6.4 6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19z" fill="#1D1B20" />
    </svg>
  )
}

function HomeLocIcon() {
  return (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
      <path d="M16 15.375V6.875a1 1 0 0 0-.4-.8l-7-5.25a1 1 0 0 0-1.2 0l-7 5.25A1 1 0 0 0 0 6.875v8.5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1z" fill="#00000060" />
    </svg>
  )
}

function PinResultIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M13.747 5.8c-.694-3.087-3.387-4.467-5.747-4.467S2.253 2.713 1.56 5.793c-.787 3.44 1.32 6.353 3.227 8.193.706.68 1.613 1.02 2.52 1.02s1.813-.34 2.513-1.02c1.907-1.84 4.013-4.747 3.233-8.187z" fill="#111111" />
    </svg>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  layer: {
    position: 'absolute',
    inset: 0,
  },
}

const ls: Record<string, CSSProperties> = {
  screen: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: '#E8EFF5',
  },
  backWrap: {
    position: 'absolute',
    left: 14,
    top: 48,
    zIndex: 5,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    border: '1px solid rgba(0,0,0,0.07)',
    background: 'rgba(255,255,255,0.92)',
    display: 'grid',
    placeItems: 'center',
    padding: 0,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    background: '#FFFFFF',
    borderTop: '1px solid rgba(0,0,0,0.08)',
    padding: '14px 16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    zIndex: 3,
    boxShadow: '0 -8px 28px rgba(0,0,0,0.07)',
  },
  sheetHeader: {
    display: 'grid',
    gridTemplateColumns: '28px 1fr 28px',
    alignItems: 'center',
    marginBottom: 2,
  },
  sheetTitle: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 700,
    color: '#111111',
  },
  closeBtn: {
    width: 28,
    height: 28,
    border: 'none',
    background: 'transparent',
    display: 'grid',
    placeItems: 'center',
    padding: 0,
    cursor: 'pointer',
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '11px 14px',
    borderRadius: 22,
    border: '1px solid rgba(0,0,0,0.12)',
    background: '#FAFAFA',
    minHeight: 44,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: '#111111',
    lineHeight: 1.4,
  },
  placeholder: {
    color: 'rgba(0,0,0,0.38)',
  },
  cursor: {
    display: 'inline-block',
    animation: 'gasSimCursor 0.9s step-start infinite',
    marginLeft: 1,
    color: '#111111',
    fontWeight: 100,
  },
  optionRow: {
    width: '100%',
    border: '1px solid rgba(0,0,0,0.10)',
    background: '#FAFAFA',
    borderRadius: 14,
    padding: '11px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textAlign: 'left',
    cursor: 'pointer',
  },
  optionSelected: {
    borderColor: '#111111',
    background: '#FFFFFF',
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: '#F0F0F0',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
  },
  optionText: {
    flex: 1,
    minWidth: 0,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: '#111111',
  },
  optionSub: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.55)',
    marginTop: 2,
    lineHeight: 1.3,
  },
  continueBtn: {
    width: '100%',
    height: 50,
    borderRadius: 999,
    border: 'none',
    background: '#111111',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    overflowY: 'auto',
    maxHeight: 300,
  },
  resultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 14,
    border: '1px solid rgba(0,0,0,0.08)',
    background: '#FFFFFF',
    cursor: 'pointer',
  },
  resultIcon: {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: '#F4F4F4',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#111111',
  },
  resultSub: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.50)',
    marginTop: 2,
  },
}

