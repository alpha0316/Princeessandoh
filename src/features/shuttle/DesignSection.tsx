import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { MOCK_ROUTES } from '../../data/mockRoutes'
import SelectionBirdViewScreen from './screens/SelectionBirdViewScreen'
import HomeScreen from './screens/HomeScreen'
import RouteShowcaseScreen from './screens/RouteShowcaseScreen'
import TrackingShowcaseScreen from './screens/TrackingShowcaseScreen'
import ShuttleScreenBase from './screens/ShuttleScreenBase'
import { ShuttleWidget } from './screens/HomeScreen'
import './design-section.css'
import { TrackingModalBusIcon } from './components/TrackingModalBusIcon'
import { TrackingCard } from './screens/TrackingShowcaseScreen'
import { RouteProgressCard } from './components/RouteProgressCard'
import { PhoneMockupFrame } from './components/PhoneMockupFrame'
import { StopNotification } from './components/StopNotification'
import heatmapImg from '../../assets/shuttle/HEATMAP.png'

// ── Shared micro-icons ────────────────────────────────────────────────────────

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 36 36" fill="none">
    <g clipPath="url(#bi)">
      <path d="M31 8H23V10H31V31H23V33H33V10c0-.53-.21-1.04-.59-1.41A2 2 0 0031 8z" fill="black" fillOpacity="0.5" />
      <path d="M19.88 3H6.12A2.12 2.12 0 004 5.12V33h18V5.12A2.12 2.12 0 0019.88 3zM20 31h-3v-3H9v3H6V5.12c0-.07.03-.13.07-.17.04-.04.1-.07.17-.07h13.74c.07 0 .13.03.17.07.04.04.07.1.07.17V31z" fill="black" fillOpacity="0.5" />
      <path d="M8 8h2v2H8zM12 8h2v2h-2zM16 8h2v2h-2z" fill="black" fillOpacity="0.5" />
    </g>
    <defs><clipPath id="bi"><rect width="36" height="36" fill="white" /></clipPath></defs>
  </svg>
)


// ── Selection screen (mirrors desktop panel + map) ────────────────────────────

function SelectionPhoneContent() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <RouteShowcaseScreen />
    </div>
  )
}

// ── Tracking screen (mirrors actual tracking panel) ───────────────────────────

function TrackingPhoneContent() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <TrackingShowcaseScreen />
    </div>
  )
}

// ── Bus overview screen ───────────────────────────────────────────────────────

function BusOverviewPhoneContent() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <SelectionBirdViewScreen />
    </div>
  )
}

// ── iOS home with Shuttle widgets ─────────────────────────────────────────────

function IOSHomeContent() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <HomeScreen shuttleTapping={false} />
    </div>
  )
}

// ── Notification screen ───────────────────────────────────────────────────────

function NotificationPhoneContent() {
  const stops = [
    // No roundabout stops here (only named bus stops students care about).
    { name: 'Brunei', away: '5m away', dot: '#34A853', waiting: '10+', left: '22%', top: '64%', size: 130 },
    { name: 'Main Library', away: '15m away', dot: '#FFCC00', waiting: '30+', left: '38%', top: '49%', size: 150 },
    { name: 'SRC Busstop', away: '20m away', dot: '#EA4335', waiting: '65+', left: '62%', top: '44%', size: 170 },
    { name: 'KSB', away: '30m away', dot: '#EA4335', waiting: '50+', left: '74%', top: '30%', size: 180 },
  ]
  return (
    <ShuttleScreenBase
      title="Overview"
      showPanel={false}
      busRoutes={[]}
      visibleBusIds={[]}
      skipRouteFitBounds
      initialCenter={[-1.5706, 6.6718]}
      initialZoom={15.2}
      overlayContent={
        <>
          <div className="ds-heat-layer" aria-hidden="true">
            {stops.map((stop) => (
              <div
                key={stop.name}
                className="ds-heat-spot"
                style={{
                  left: stop.left,
                  top: stop.top,
                  width: stop.size,
                  height: stop.size,
                }}
              >
                <img
                  src={heatmapImg}
                  alt=""
                  aria-hidden="true"
                  className="ds-heat-img"
                  style={{
                    // Sync heat intensity to the modal dot color.
                    filter:
                      stop.dot === '#34A853'
                        ? 'hue-rotate(115deg) saturate(1.2)'
                        : stop.dot === '#FFCC00'
                          ? 'hue-rotate(-18deg) saturate(1.15) brightness(1.05)'
                          : 'none',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Crowding notification */}
          <div className="ds-notif-banner" style={{ top: 54, zIndex: 5 }}>
            <div className="ds-notif-icon-wrap" style={{ borderRadius: 999 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="ds-notif-app" style={{ marginBottom: 6 }}>
                KNUST <span style={{ color: '#34A853' }}>Shuttle</span><span style={{ color: '#FFCE31' }}>App</span>
              </p>
              <p className="ds-notif-body" style={{ margin: '0 0 2px', fontSize: 11.5, lineHeight: 1.25 }}>
                <span style={{ color: '#EA4335', fontWeight: 700 }}>High student crowding</span>{' '}
                <span style={{ color: 'rgba(0,0,0,0.55)', fontWeight: 600 }}>at</span>{' '}
                <span style={{ color: 'rgba(0,0,0,0.7)', fontWeight: 700 }}>KSB!</span>
              </p>
              <p className="ds-notif-body" style={{ margin: 0, fontSize: 10.5, lineHeight: 1.25 }}>
                Please proceed to the stop if you're nearby.
              </p>
            </div>
            <span className="ds-notif-close">×</span>
          </div>

          {/* Bottom sheet */}
          <div className="ds-panel" style={{ zIndex: 6 }}>
            <p className="ds-panel-title">Bus Stop Overview</p>
            {stops.map((stop) => (
              <div key={stop.name} className="ds-stop-row">
                <div className="ds-bus-dot" style={{ background: stop.dot }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ds-stop-top">
                    <p className="ds-stop-name">{stop.name}</p>
                    <span className="ds-stop-away">{stop.away}</span>
                  </div>
                </div>
                <div className="ds-waiting">
                  <div className="ds-avatar-stack" aria-hidden="true">
                    {(['#93C5FD', '#A7F3D0', '#FDE68A'] as const).map((c, i) => (
                      <div key={i} className="ds-avatar" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="ds-waiting-num">{stop.waiting}</span>
                  <span className="ds-waiting-label">waiting</span>
                </div>
              </div>
            ))}
          </div>
        </>
      }
    />
  )
}

function NotificationCardLoop() {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setExpanded(prev => !prev)
    }, 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="ds-comp-card">
      <div className="ds-comp-stage">
        <div className="ds-map-bg" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.58), rgba(255,255,255,0.9))' }} />

        {[0, 1, 2].map((layer) => (
          <div
            key={layer}
            style={{
              position: 'absolute',
              left: 54 + layer * 10,
              right: 54 + layer * 10,
              top: 116 + layer * 18,
              height: 84,
              borderRadius: 28,
              background: 'rgba(255,255,255,0.78)',
              boxShadow: '0 6px 22px rgba(15,23,42,0.05)',
              opacity: 1 - layer * 0.18,
            }}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            left: 26,
            right: 26,
            top: expanded ? 22 : 32,
            transform: expanded ? 'scale(1)' : 'scale(0.985)',
            transition: 'top 480ms ease, transform 480ms ease',
          }}
        >
          <StopNotification
            stopName="KSB"
            waitingCount={54}
            duration={60}
            position="static"
            variant="crowding"
            compact={!expanded}
            showProgressBar={false}
            showCrowdingPill={expanded}
            style={{
              borderRadius: 30,
              boxShadow: '0 18px 34px rgba(15,23,42,0.10)',
            }}
          />
        </div>
      </div>
      {/* <div className="ds-comp-card__footer"><span className="ds-comp-card__title">Crowding Notification</span><span className="ds-comp-card__tag">Alert</span></div> */}
    </div>
  )
}

// ── Desktop artboard content (1280×720, panel top-right) ─────────────────────

// ── Desktop selection panel — used as hero overlay AND inside artboard ────────

const DESKTOP_STOPS = [
  { name: 'Brunei', sub: 'New Brunei, Complex, Katanga' },
  { name: 'Commercial Area', sub: 'Bomso, Central Bus stop' },
  { name: 'Conti Busstop', sub: 'Halls, Campus, Unity' },
  { name: 'Gaza', sub: 'Off Campus' },
  { name: 'Hall 7', sub: 'Halls, Campus, Unity' },
  { name: 'KSB', sub: 'Campus' },
]

type TrackingStop = { name: string; role: 'pickup' | 'dropoff' | 'current' | null }
type TrackingScenario = { from: string; to: string; busCount: number; stops: TrackingStop[] }

const TRACKING_SCENARIOS: TrackingScenario[] = [
  {
    from: 'Brunei', to: 'KSB', busCount: 2,
    stops: [
      { name: 'Brunei', role: 'pickup' },
      { name: 'Conti Busstop', role: 'current' },
      { name: 'Hall 7', role: null },
      { name: 'KSB', role: 'dropoff' },
    ],
  },
  {
    from: 'KSB', to: 'Commercial Area', busCount: 1,
    stops: [
      { name: 'KSB', role: 'pickup' },
      { name: 'Hall 7', role: 'current' },
      { name: 'Conti Busstop', role: null },
      { name: 'Brunei', role: null },
      { name: 'Commercial Area', role: 'dropoff' },
    ],
  },
]

const PANEL_STYLE: React.CSSProperties = {
  position: 'absolute', top: 16, left: 12,
  width: 380, background: 'white',
  borderRadius: 20, border: '1px solid rgba(0,0,0,0.08)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
  padding: '16px 16px 12px',
  display: 'flex', flexDirection: 'column', gap: 10,
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
  transition: 'opacity 0.28s ease',
}

// ── Map state lifted from hero overlay ───────────────────────────────────────
type HeroMapState = {
  flyToCoord?: [number, number]
  flyToZoom?: number
  focusBusId?: string
  focusZoom?: number
  focusDelayMs?: number
  dropPoints?: [number, number][]
  routeCoords?: [number, number][]
  routeColor?: string
}

const BRUNEI_COORD: [number, number] = [-1.5741574445526254, 6.670465091472612]
const OVERVIEW_CENTER: [number, number] = [-1.5725, 6.672]
const OVERVIEW_ZOOM = 14.1
const PICKUP_WORD = 'brunei'

const DROP_LOCS = [
  { name: 'Main Library',      sub: 'Prempeh Library, Administration' },
  { name: 'Pentecost Busstop', sub: 'On Campus' },
  { name: 'KSB',               sub: 'Business School' },
]

type HeroPhase = 'idle' | 'typing' | 'pickup-done' | 'dropoff-done' | 'tracking'

// ── Desktop tracking overlay (live hero) ─────────────────────────────────────

function DesktopTrackingPanel({ scenario, busProgress, opacity = 1 }: {
  scenario: TrackingScenario; busProgress: number; opacity?: number
}) {
  const currentIdx = scenario.stops.findIndex(s => s.role === 'current')
  const markerPct = Math.max(3, Math.min(busProgress, 95))

  return (
    <div style={{ ...PANEL_STYLE, opacity }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700 }}>
            <span style={{ color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{scenario.from}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{ color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{scenario.to}</span>
          </div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{scenario.busCount} bus{scenario.busCount !== 1 ? 'es' : ''} on route</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '4px 2px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1F2937' }}>{scenario.from}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1F2937' }}>{scenario.to}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap' }}>Start</span>
          <div style={{ flex: 1, height: 4, borderRadius: 999, background: '#E5E7EB', position: 'relative', overflow: 'visible' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${busProgress}%`, borderRadius: 999, background: 'linear-gradient(90deg, #34A853, #86EFAC)', transition: 'width 80ms linear' }} />
            <div style={{ position: 'absolute', left: `${markerPct}%`, top: '50%', transform: 'translate(-50%,-50%)', width: 44, height: 24, borderRadius: 999, background: 'white',  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'left 80ms linear' }}>
              <TrackingModalBusIcon width={32} height={16} />
            </div>
          </div>
          <span style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap' }}>Arriving</span>
        </div>
      </div>

      {/* Stop timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #F3F4F6', paddingTop: 10, }}>
        {scenario.stops.map((stop, idx) => {
          const isLast = idx === scenario.stops.length - 1
          const isPast = idx < currentIdx
          const isCurrent = stop.role === 'current'
          const dotColor = isCurrent ? '#34A853' : isPast ? '#D1D5DB' : stop.role === 'pickup' ? '#3B82F6' : stop.role === 'dropoff' ? '#F59E0B' : '#D1D5DB'
          return (
            <div key={stop.name} style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, border: `2px solid ${dotColor}`, background: isCurrent ? '#34A853' : stop.role === 'pickup' ? '#EFF6FF' : stop.role === 'dropoff' ? '#FFFBEB' : '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, boxShadow: isCurrent ? `0 0 0 4px ${dotColor}22` : 'none' }}>
                  {isCurrent
                    ? <div style={{ width: 8, height: 8, borderRadius: 4, background: 'white' }} />
                    : <div style={{ width: 7, height: 7, borderRadius: 3.5, background: dotColor, opacity: isPast ? 0.4 : 0.8 }} />}
                </div>
                {!isLast && <div style={{ width: 2, flexGrow: 1, background: '#E5E7EB', minHeight: 24 }} />}
              </div>
              <div style={{ paddingBottom: isLast ? 0 : 14, paddingTop: 2, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: isCurrent || stop.role === 'pickup' || stop.role === 'dropoff' ? 700 : 400, color: isPast ? '#9CA3AF' : '#111', textDecoration: isPast ? 'line-through' : 'none' }}>{stop.name}</span>
                  {isCurrent && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 6, background: '#DCFCE7', color: '#15803D' }}>Bus here</span>}
                  {stop.role === 'pickup' && !isCurrent && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 6, background: '#DBEAFE', color: '#1D4ED8' }}>Pickup</span>}
                  {stop.role === 'dropoff' && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 6, background: '#FEF3C7', color: '#92400E' }}>Drop-off</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Hero overlay — types "brunei", selects KSB, flies to Brunei, tracks bus ──

function DesktopHeroOverlay({ onMapState }: { onMapState: (s: HeroMapState) => void }) {
  const [phase, setPhase] = useState<HeroPhase>('idle')
  const [typedText, setTypedText] = useState('')
  const [showDropOff, setShowDropOff] = useState(false)
  const [showDropLocs, setShowDropLocs] = useState(false)
  const [selectedDrop, setSelectedDrop] = useState<string | null>(null)
  const [busProgress, setBusProgress] = useState(22)
  const [panelOpacity, setPanelOpacity] = useState(1)
  const onMapRef = useRef(onMapState)
  useEffect(() => { onMapRef.current = onMapState }, [onMapState])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    let rafId = 0
    let cancelled = false

    const add = (ms: number, fn: () => void) => {
      timers.push(setTimeout(() => { if (!cancelled) fn() }, ms))
    }

    const run = () => {
      if (cancelled) return

      // Reset UI
      setPhase('idle')
      setTypedText('')
      setShowDropOff(false)
      setShowDropLocs(false)
      setSelectedDrop(null)
      setPanelOpacity(1)

      // Return map to campus overview
      onMapRef.current({ flyToCoord: OVERVIEW_CENTER, flyToZoom: OVERVIEW_ZOOM, focusBusId: undefined, dropPoints: [], routeCoords: [] })

      // T=1 000: begin typing "brunei"
      add(1000, () => {
        setPhase('typing')
        PICKUP_WORD.split('').forEach((_, i) =>
          add(1000 + i * 210, () => setTypedText(PICKUP_WORD.slice(0, i + 1)))
        )
      })

      // T=2 560: pickup selected
      add(2560, () => { setPhase('pickup-done'); setShowDropOff(true) })

      // T=3 200: show drop-off list
      add(3200, () => setShowDropLocs(true))

      // T=3 900: select KSB
      add(3900, () => { setSelectedDrop('KSB'); setPhase('dropoff-done') })

      // T=4 500: fly map to Brunei + pin marker
      add(4500, () =>
        onMapRef.current({ flyToCoord: BRUNEI_COORD, flyToZoom: 16.5, focusBusId: undefined, dropPoints: [BRUNEI_COORD] })
      )

      // T=6 300: fade out → switch to tracking panel
      add(6300, () => setPanelOpacity(0))
      add(6580, () => {
        setPhase('tracking')
        setBusProgress(22)
        setPanelOpacity(1)
        onMapRef.current({
          flyToCoord: BRUNEI_COORD, focusBusId: 'bus-1', focusZoom: 17, focusDelayMs: 0, dropPoints: [],
          routeCoords: MOCK_ROUTES[0].path, routeColor: '#34A853',
        })

        cancelAnimationFrame(rafId)
        const t0 = performance.now()
        const tick = (now: number) => {
          if (cancelled) return
          const p = 22 + 58 * Math.min((now - t0) / 6000, 1)
          setBusProgress(Math.round(p))
          if (now - t0 < 6000) rafId = requestAnimationFrame(tick)
        }
        rafId = requestAnimationFrame(tick)
      })

      // T=13 000: next cycle
      add(13000, run)
    }

    run()
    return () => { cancelled = true; timers.forEach(clearTimeout); cancelAnimationFrame(rafId) }
  }, [])

  const pickupSelected = phase === 'pickup-done' || phase === 'dropoff-done'
  const filteredStops = !typedText
    ? DESKTOP_STOPS
    : DESKTOP_STOPS.filter(s => s.name.toLowerCase().includes(typedText.toLowerCase()))
  const listItems = showDropLocs ? DROP_LOCS : filteredStops.map(s => ({ name: s.name, sub: s.sub }))

  if (phase === 'tracking') {
    return <DesktopTrackingPanel scenario={TRACKING_SCENARIOS[0]} busProgress={busProgress} opacity={panelOpacity} />
  }

  return (
    <div style={{ ...PANEL_STYLE, opacity: panelOpacity }}>
      <p style={{ fontSize: 20, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
        Welcome to KNUST{' '}
        <span style={{ color: '#34A853' }}>Shuttle</span>
        <span style={{ color: '#FFCE31', fontWeight: 400 }}>App</span>
      </p>

      {/* Input area */}
      <div style={{ background: '#F9FAFB', borderRadius: 14, padding: '12px 12px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Starting point */}
        <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)', margin: 0, fontWeight: 400 }}>Starting Point</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, border: `1.5px dashed rgba(0,0,0,${pickupSelected ? '1' : '0.8'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: pickupSelected ? 'black' : 'white', flexShrink: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none">
              <path d="M11.6667 4.466C10.9667 1.386 8.28005 0 5.92005 0C5.92005 0 5.92005 0 5.91335 0C3.56005 0 0.86665 1.38002 0.16665 4.46002C-0.61335 7.90002 1.49335 10.813 3.40005 12.646C4.10665 13.326 5.01335 13.666 5.92005 13.666C6.82665 13.666 7.73335 13.326 8.43335 12.646C10.3401 10.813 12.4467 7.906 11.6667 4.466ZM5.92005 7.80603C4.76005 7.80603 3.82005 6.86599 3.82005 5.70599C3.82005 4.54599 4.76005 3.60602 5.92005 3.60602C7.08005 3.60602 8.02005 4.54599 8.02005 5.70599C8.02005 6.86599 7.08005 7.80603 5.92005 7.80603Z" fill={pickupSelected ? 'white' : 'black'} fillOpacity={pickupSelected ? 1 : 0.5} />
            </svg>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'white', borderRadius: 10, padding: '12px 14px', border: `1px solid rgba(0,0,0,${pickupSelected ? '0.8' : '0.4'})` }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M11.2798 11.82C11.5868 12.127 12.0598 11.653 11.7538 11.353L9.2538 8.84704C10.1308 7.87605 10.6148 6.61501 10.6138 5.30701C10.6138 2.38001 8.2338 0 5.30669 0C2.37999 0 0 2.38001 0 5.30701C0 8.23301 2.37999 10.613 5.30669 10.613C6.62669 10.613 7.84669 10.127 8.77979 9.32001L11.2798 11.82ZM0.665993 5.30701C0.665993 2.74701 2.7527 0.666992 5.306 0.666992C7.866 0.666992 9.94579 2.74701 9.94579 5.30701C9.94579 7.86701 7.866 9.94702 5.306 9.94702C2.7527 9.94702 0.665993 7.86701 0.665993 5.30701Z" fill="black" fillOpacity="0.6" />
            </svg>
            <span style={{ flex: 1, fontSize: 14, color: pickupSelected ? '#111' : 'rgba(0,0,0,0.38)' }}>
              {pickupSelected ? 'Brunei' : (typedText || 'Select Pickup Bus Stop')}
            </span>
            {phase === 'typing' && (
              <span style={{ display: 'inline-block', width: 2, height: 14, background: '#111', verticalAlign: 'text-bottom', animation: 'ds-blink 1s step-end infinite' }} />
            )}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4.267 12.667L3.333 11.733 7.067 8 3.333 4.267 4.267 3.333 8 7.067l3.733-3.734.934.934L8.933 8l3.734 3.733-.934.934L8 8.933l-3.733 3.734z" fill="rgba(0,0,0,0.4)" />
            </svg>
          </div>
        </div>

        {/* Drop-off field */}
        {showDropOff && (
          <>
            <div style={{ width: 0, height: 20, borderLeft: '1px dashed rgba(0,0,0,0.7)', marginLeft: 19 }} />
            <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)', margin: 0, fontWeight: 400 }}>Drop Off Point</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, border: '1px dashed rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', flexShrink: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none">
                  <path d="M11.6667 4.466C10.9667 1.386 8.28005 0 5.92005 0C5.92005 0 5.92005 0 5.91335 0C3.56005 0 0.86665 1.38002 0.16665 4.46002C-0.61335 7.90002 1.49335 10.813 3.40005 12.646C4.10665 13.326 5.01335 13.666 5.92005 13.666C6.82665 13.666 7.73335 13.326 8.43335 12.646C10.3401 10.813 12.4467 7.906 11.6667 4.466ZM5.92005 7.80603C4.76005 7.80603 3.82005 6.86599 3.82005 5.70599C3.82005 4.54599 4.76005 3.60602 5.92005 3.60602C7.08005 3.60602 8.02005 4.54599 8.02005 5.70599C8.02005 6.86599 7.08005 7.80603 5.92005 7.80603Z" fill="black" fillOpacity="0.6" />
                </svg>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'white', borderRadius: 10, padding: '12px 14px', border: `1px solid rgba(0,0,0,${selectedDrop ? '0.8' : '0.1'})` }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M11.2798 11.82C11.5868 12.127 12.0598 11.653 11.7538 11.353L9.2538 8.84704C10.1308 7.87605 10.6148 6.61501 10.6138 5.30701C10.6138 2.38001 8.2338 0 5.30669 0C2.37999 0 0 2.38001 0 5.30701C0 8.23301 2.37999 10.613 5.30669 10.613C6.62669 10.613 7.84669 10.127 8.77979 9.32001L11.2798 11.82ZM0.665993 5.30701C0.665993 2.74701 2.7527 0.666992 5.306 0.666992C7.866 0.666992 9.94579 2.74701 9.94579 5.30701C9.94579 7.86701 7.866 9.94702 5.306 9.94702C2.7527 9.94702 0.665993 7.86701 0.665993 5.30701Z" fill="black" fillOpacity="0.6" />
                </svg>
                <span style={{ flex: 1, fontSize: 14, color: selectedDrop ? '#111' : 'rgba(0,0,0,0.38)' }}>
                  {selectedDrop ?? 'Select Drop Point'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4.267 12.667L3.333 11.733 7.067 8 3.333 4.267 4.267 3.333 8 7.067l3.733-3.734.934.934L8.933 8l3.734 3.733-.934.934L8 8.933l-3.733 3.734z" fill="rgba(0,0,0,0.4)" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Location list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #F3F4F6', paddingTop: 10, maxHeight: 280, overflowY: 'auto' }}>
        {listItems.map(s => {
          const highlight = showDropLocs ? s.name === selectedDrop : (pickupSelected && s.name === 'Brunei') || (!pickupSelected && typedText.toLowerCase() === 'brunei' && s.name === 'Brunei')
          return (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.07)', background: highlight ? '#F0FDF4' : '#FAFAFA', cursor: 'default' }}>
              <BuildingIcon />
              <div>
                <p style={{ fontSize: 15, fontWeight: highlight ? 600 : 500, margin: 0, lineHeight: 1.3 }}>{s.name}</p>
                <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', margin: 0 }}>{s.sub}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Section icon ─────────────────────────────────────────────────────────────

const EngineeringPageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9.4 7.4 4.8 12l4.6 4.6" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m14.6 7.4 4.6 4.6-4.6 4.6" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ── Section ───────────────────────────────────────────────────────────────────

const MemoSelectionBirdView = memo(SelectionBirdViewScreen)


const SECTION_TRANSITION_THRESHOLD = 360

// Scroll depth (px) on each side of the hero sticky zone.
// User must scroll up through HERO_BUFFER to exit back to product.
const HERO_BUFFER = 200

export type DesignEntryPoint = 'hero' | 'end'

export default function DesignSection({
  onScrollUpAtTop,
  onScrollDownAtBottom,
  entryPoint = 'hero',
}: {
  onScrollUpAtTop?: () => void
  onScrollDownAtBottom?: () => void
  entryPoint?: DesignEntryPoint
}) {
  const [heroMap, setHeroMap] = useState<HeroMapState>({})

  const handleHeroMap = useCallback((update: HeroMapState) => {
    setHeroMap(prev => ({ ...prev, ...update }))
  }, [])

  const heroOverlay = useMemo(() => (
    <DesktopHeroOverlay onMapState={handleHeroMap} />
  ), [handleHeroMap])

  const compSectionRef = useRef<HTMLDivElement>(null)
  const paraCol1Ref = useRef<HTMLDivElement>(null)
  const paraCol2Ref = useRef<HTMLDivElement>(null)
  const paraCol3Ref = useRef<HTMLDivElement>(null)
  const sectionEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const section = compSectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      if (rect.top > window.innerHeight || rect.bottom < 0) return
      const progress = -rect.top
      // Scroll progress for component previews (0→1 as user scrolls through the grid).
      const scroll01 = Math.min(Math.max(progress / 900, 0), 1)
      section.style.setProperty('--ds-scroll', scroll01.toFixed(3))
      const speed = 0.08
      if (paraCol1Ref.current) paraCol1Ref.current.style.transform = `translateY(${-progress * speed}px)`
      if (paraCol2Ref.current) paraCol2Ref.current.style.transform = `translateY(${progress * speed}px)`
      if (paraCol3Ref.current) paraCol3Ref.current.style.transform = `translateY(${-progress * speed}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Land at the most relevant point for the transition:
  // entering from Product starts at the hero, returning from Engineering resumes near the end.
  useLayoutEffect(() => {
    const targetTop = entryPoint === 'end'
      ? Math.max(document.documentElement.scrollHeight - window.innerHeight - 1, 0)
      : HERO_BUFFER

    requestAnimationFrame(() => {
      window.scrollTo({ top: targetTop, behavior: 'instant' })
    })
  }, [entryPoint])

  // Fire when the user gives an extra upward push at the top of the hero zone.
  useEffect(() => {
    if (!onScrollUpAtTop) return
    let accum = 0
    let fired = false

    const onWheel = (e: WheelEvent) => {
      if (fired) return

      const atTop = window.scrollY <= 0

      if (e.deltaY < 0 && atTop) {
        accum += Math.abs(e.deltaY)
        if (accum >= SECTION_TRANSITION_THRESHOLD) {
          fired = true
          onScrollUpAtTop()
        }
      } else if (!atTop || e.deltaY > 0) {
        accum = 0
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [onScrollUpAtTop])

  // Fire when the user gives an extra downward push at the Engineering handoff.
  useEffect(() => {
    if (!onScrollDownAtBottom) return
    let fired = false
    let accum = 0

    const onWheel = (e: WheelEvent) => {
      if (fired) return

      const sectionEnd = sectionEndRef.current
      if (!sectionEnd) return

      const rect = sectionEnd.getBoundingClientRect()
      const inHandoffZone = rect.top <= window.innerHeight && rect.bottom >= window.innerHeight * 0.45

      if (e.deltaY > 0 && inHandoffZone) {
        accum += e.deltaY
        if (accum >= SECTION_TRANSITION_THRESHOLD) {
          fired = true
          onScrollDownAtBottom()
        }
      } else if (!inHandoffZone || e.deltaY < 0) {
        accum = 0
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [onScrollDownAtBottom])

  return (
    <div className="ds-page">

      {/* Hero sticky zone — pins the live map while user scrolls through the buffer */}
      <div style={{ height: `calc(100vh + ${2 * HERO_BUFFER}px)`, position: 'relative', borderRadius: 0 }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          <MemoSelectionBirdView
            overlayOverride={heroOverlay}
            hideStatusBar
            flyToCoord={heroMap.flyToCoord}
            flyToZoom={heroMap.flyToZoom}
            focusBusId={heroMap.focusBusId}
            focusZoom={heroMap.focusZoom}
            focusDelayMs={heroMap.focusDelayMs}
            dropPoints={heroMap.dropPoints}
            routeCoords={heroMap.routeCoords}
            routeColor={heroMap.routeColor}
          />
        </div>
      </div>

      {/* ── Components & Interactions ── */}
      <div className="ds-comp-section" ref={compSectionRef}>
        <div className="ds-comp-section__header">
          <p className="ds-comp-section__title">Components &amp; Interactions</p>
          <p className="ds-comp-section__sub">UI building blocks powering the KNUST ShuttleApp experience</p>
        </div>

        <div className="ds-para-grid">

          {/* ── Column 1 — scrolls up ── */}
          <div className="ds-para-col" ref={paraCol1Ref}>

            {/* iOS Home Screen */}
            <PhoneMockupFrame width={300}>
              <IOSHomeContent />
            </PhoneMockupFrame>

            <NotificationCardLoop />

            {/* Notification phone */}
            <PhoneMockupFrame width={300}>
              <NotificationPhoneContent />
            </PhoneMockupFrame>

          </div>

          {/* ── Column 2 — scrolls down (starts lower) ── */}
          <div className="ds-para-col ds-para-col--mid" ref={paraCol2Ref}>

            {/* Selection phone */}
            <PhoneMockupFrame width={300}>
              <SelectionPhoneContent />
            </PhoneMockupFrame>



            <ShuttleWidget />

            {/* Bus Overview phone */}
            <PhoneMockupFrame width={300}>
              <BusOverviewPhoneContent />
            </PhoneMockupFrame>

          </div>

          {/* ── Column 3 — scrolls up ── */}
          <div className="ds-para-col" ref={paraCol3Ref}>

            {/* Tracking modal card */}
            <div 
            className="ds-comp-card"
            style={{ 
              padding: 0, border: 'none', borderRadius: 42, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' 
            }}
            >
              <div style={{ position: 'relative', height: 296, overflow: 'hidden' }}>
                <TrackingCard />
              </div>
            </div>

            {/* Tracking phone */}
            <PhoneMockupFrame width={300}>
              <TrackingPhoneContent />
            </PhoneMockupFrame>

            {/* Route Progress Cards — light + dark */}
            <div className="ds-comp-card">
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <RouteProgressCard />
                <RouteProgressCard dark />
              </div>
              {/* <div className="ds-comp-card__footer">
                <span className="ds-comp-card__title">Route Progress</span>
              </div> */}
            </div>

          </div>

        </div>  {/* end ds-para-grid */}
      </div>  {/* end ds-comp-section */}

      {/* Section-end hint — visible just before Engineering auto-transition fires */}
      <div className="ds-section-end" ref={sectionEndRef}>
        <EngineeringPageIcon />
        <span className="ds-section-end__label">Engineering</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

    </div>
  )
}
