import { useEffect, useRef, useState } from 'react'
import ShuttleScreenBase from './ShuttleScreenBase'
import { ROUTE_B, ROUTE_B_PINGPONG } from '../../../data/mockRoutes'
import { StopNotification } from '../components/StopNotification'
import { RouteProgressBar } from '../components/RouteProgressBar'
import { StopTimeline, type StopTimelineItem } from '../components/StopTimeline'
import { TrackingModalBusIcon } from '../components/TrackingModalBusIcon'
import { MOBILE_BOTTOM_SHEET_SURFACE } from './bottomSheetStyles'

const BUS_B_SOLO = [
  { id: 'bus-b-solo', totalMs: 110_000, startFraction: 0.0, path: ROUTE_B_PINGPONG },
]

const STOPS = [
  { name: 'Commercial Area' },
  { name: 'Hall 7' },
  { name: 'Otumfou R/A' },
  { name: 'Paa Joe R/A' },
  { name: 'SRC Busstop' },
  { name: 'KSB' },
]

const PICKUP = STOPS[0].name
const DEST = STOPS[STOPS.length - 1].name

const LEG_MS = 9_000


export default function SelectionToggleScreen() {
  const [busProgress, setBusProgress] = useState(2)
  const [direction, setDirection] = useState<'forward' | 'return'>('forward')
  const [notification, setNotification] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const startMs = Date.now()
    const totalMs = LEG_MS * 2
    let prevPhase: 'forward' | 'return' = 'forward'

    intervalRef.current = setInterval(() => {
      const cycle = (Date.now() - startMs) % totalMs
      let pct: number
      let phase: 'forward' | 'return'

      if (cycle < LEG_MS) {
        pct = (cycle / LEG_MS) * 100
        phase = 'forward'
      } else {
        pct = (1 - (cycle - LEG_MS) / LEG_MS) * 100
        phase = 'return'
      }

      setBusProgress(pct)
      setDirection(phase)

      if (phase !== prevPhase) {
        setNotification(phase === 'return' ? DEST : PICKUP)
        prevPhase = phase
      }
    }, 50)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const currentStopIdx = Math.min(
    Math.floor(busProgress / 100 * STOPS.length),
    STOPS.length - 1,
  )

  const routeColor = '#4285F4'

  const timelineItems: StopTimelineItem[] = STOPS.map((stop, idx) => {
    const isPast = direction === 'forward' ? idx < currentStopIdx : idx > currentStopIdx
    const isCurrent = idx === currentStopIdx
    const lineFilled = direction === 'forward' ? idx < currentStopIdx : idx >= currentStopIdx
    return {
      name: stop.name,
      status: isCurrent ? 'current' : isPast ? 'past' : 'upcoming',
      isPickup: stop.name === PICKUP,
      isDest: stop.name === DEST,
      connectorFill: lineFilled ? 100 : 0,
    }
  })

  return (
    <ShuttleScreenBase
      title="Tracking shuttle"
      showPanel={false}
      initialCenter={[-1.5721, 6.6760]}
      initialZoom={14.5}
      busRoutes={BUS_B_SOLO}
      visibleBusIds={['bus-b-solo']}
      routeCoords={ROUTE_B}
      routeColor={routeColor}
      overlayContent={
        <>
          {notification && (
            <StopNotification
              key={notification + direction}
              stopName={notification}
              waitingCount={notification === DEST ? 54 : 31}
              duration={7}
              onClose={() => setNotification(null)}
            />
          )}

          <div style={{
            position: 'absolute',
            ...MOBILE_BOTTOM_SHEET_SURFACE,
            backgroundColor: MOBILE_BOTTOM_SHEET_SURFACE.background,
            zIndex: 10,
            animation: 'slideIn 0.3s ease-out',
          }}>

            {/* Header */}
            <div style={{ padding: '20px 14px 12px', borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>

              {/* Route row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  border: '1.5px solid #E5E7EB', background: '#F9FAFB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600 }}>
                    <span style={{ color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 90 }}>
                      {direction === 'forward' ? PICKUP : DEST}
                    </span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 90 }}>
                      {direction === 'forward' ? DEST : PICKUP}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>1 bus on route</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#6B7280' }}>
                    {Math.round(busProgress)}%
                  </span>
                  <div style={{
                    width: 26, height: 26, borderRadius: 7,
                    border: '1px solid #E5E7EB', background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M13 6L8 11L3 6" stroke="black" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              <RouteProgressBar
                progress={busProgress}
                fromLabel={direction === 'forward' ? PICKUP : DEST}
                toLabel={direction === 'forward' ? DEST : PICKUP}
                gradient={`linear-gradient(90deg, ${routeColor}, #93C5FD)`}
                busIcon={<TrackingModalBusIcon width={28} height={14} />}
              />
            </div>

            {/* Stop timeline */}
            <div style={{ padding: '10px 14px 16px', }}>
              <StopTimeline items={timelineItems} routeColor={routeColor} />
            </div>
          </div>

          <style>{`
            @keyframes slideIn {
              from { transform: translateY(20px); opacity: 0; }
              to   { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </>
      }
    />
  )
}
