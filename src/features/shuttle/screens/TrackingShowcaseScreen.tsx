// TrackingShowcaseScreen — live tracking view for Commercial Area → KSB.
// Shows the map focused on bus-3 (ROUTE_B) with an animated tracking card below.
// Used as the "overview" phase of HomeShowcaseFrame and as phone-1 in the home grid.

import { useEffect, useRef, useState } from 'react'
import ShuttleScreenBase from './ShuttleScreenBase'
import { MOCK_ROUTES, ROUTE_B } from '../../../data/mockRoutes'
import { StopNotification } from '../components/StopNotification'
import { RouteProgressBar } from '../components/RouteProgressBar'
import { StopTimeline, type StopTimelineItem } from '../components/StopTimeline'
import { TrackingModalBusIcon } from '../components/TrackingModalBusIcon'
import { MOBILE_BOTTOM_SHEET_SURFACE } from './bottomSheetStyles'

// ── Bus timer ─────────────────────────────────────────────────────────────────
const JOURNEY_MS      = 600_000
const INIT_ELAPSED_MS = 90_000

const ROUTE_BUSES = MOCK_ROUTES.filter(r => r.id === 'bus-3' || r.id === 'bus-4')

// ── Stops for this route ──────────────────────────────────────────────────────
const STOPS = [
  { name: 'Commercial Area', sub: 'Pickup' },
  { name: 'Pentecost Stop',  sub: 'On Campus' },
  { name: 'KSB',             sub: 'Business School' },
]
const CUR_IDX = 0

type CrowdNotif = { stopName: string; waitingCount: number }

const NOTIFS: { atMs: number; payload: CrowdNotif }[] = [
  { atMs: 900,   payload: { stopName: 'Commercial Area',   waitingCount: 18 } },
  { atMs: 3_400, payload: { stopName: 'Pentecost Busstop', waitingCount: 31 } },
  { atMs: 6_600, payload: { stopName: 'KSB',               waitingCount: 54 } },
]

// ── Tracking card ─────────────────────────────────────────────────────────────
export function TrackingCard() {
  const startRef = useRef(Date.now() - INIT_ELAPSED_MS)
  const [elapsed, setElapsed] = useState(INIT_ELAPSED_MS)

  useEffect(() => {
    let raf: number
    const tick = () => {
      setElapsed(Date.now() - startRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const cycleMs  = elapsed % JOURNEY_MS
  const progress = cycleMs / JOURNEY_MS
  const pct      = Math.min(progress * 100, 100)
  const etaMin   = Math.ceil(((JOURNEY_MS - cycleMs) / 1000) / 60)

  const seg0Fill = Math.min(pct * 2, 100)
  const seg1Fill = Math.max((pct - 50) * 2, 0)

  const timelineItems: StopTimelineItem[] = STOPS.map((stop, idx) => ({
    name: stop.name,
    description: stop.sub,
    status: idx < CUR_IDX ? 'past' : idx === CUR_IDX ? 'current' : 'upcoming',
    isDest: idx === STOPS.length - 1,
    connectorFill: idx === 0 ? seg0Fill : seg1Fill,
  }))

  return (
    <div style={{
      position: 'absolute',
      ...MOBILE_BOTTOM_SHEET_SURFACE,
      zIndex: 20,
    }}>

      {/* Header */}
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid #F3F4F6' }}>

        {/* Route row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 4 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            border: '1.5px solid #E5E7EB', background: '#F9FAFB',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600 }}>
              <span style={{ color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Commercial Area
              </span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                KSB
              </span>
            </div>
            <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>
              {etaMin} min · 2 buses on route
            </div>
          </div>
        </div>

        <RouteProgressBar
          progress={pct}
          fromLabel={STOPS[CUR_IDX].name}
          toLabel={STOPS[CUR_IDX + 1].name}
          gradient="linear-gradient(90deg, #34A853, #86EFAC)"
          busIcon={<TrackingModalBusIcon width={28} height={14} />}
        />
      </div>

      {/* Stop timeline */}
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column',  }}>
        <StopTimeline items={timelineItems} routeColor="#34A853" dotSize={26} />
      </div>
    </div>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function TrackingShowcaseScreen() {
  const [cycle, setCycle] = useState(0)
  const [notif, setNotif] = useState<CrowdNotif | null>(null)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    setNotif(null)
    for (const { atMs, payload } of NOTIFS) {
      timers.push(setTimeout(() => setNotif(payload), atMs))
    }

    const loopMs = Math.max(...NOTIFS.map(n => n.atMs)) + 3_000
    timers.push(setTimeout(() => setCycle(c => c + 1), loopMs))

    return () => timers.forEach(clearTimeout)
  }, [cycle])

  return (
    <ShuttleScreenBase
      title="Tracking"
      showPanel={false}
      busRoutes={ROUTE_BUSES}
      focusBusId="bus-3"
      focusZoom={16.0}
      focusDelayMs={0}
      routeCoords={ROUTE_B}
      routeColor="#34A853"
      skipRouteFitBounds
      initialCenter={[-1.5706, 6.6718]}
      initialZoom={15.2}
      overlayContent={
        <>
          {notif && (
            <StopNotification
              key={`${cycle}:${notif.stopName}:${notif.waitingCount}`}
              stopName={notif.stopName}
              waitingCount={notif.waitingCount}
              duration={6}
              onClose={() => setNotif(null)}
            />
          )}
          <TrackingCard />
        </>
      }
    />
  )
}
