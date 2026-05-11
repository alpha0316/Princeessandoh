import { useEffect, useMemo, useState } from 'react'
import ShuttleScreenBase from './ShuttleScreenBase'
import Keyboard, { type TapSequenceItem } from '../components/keyboard'
import { BRUNEI_TO_KSB } from '../../../data/mockRoutes'
import { RouteProgressBar } from '../components/RouteProgressBar'
import { StopTimeline, type StopTimelineItem } from '../components/StopTimeline'
import { TrackingModalBusIcon } from '../components/TrackingModalBusIcon'

const ROUTE_STOPS = [
  { name: 'Brunei',           description: 'New Brunei, Complex, Katanga' },
  { name: 'Main Library',     description: 'Prempeh Library, Administration' },
  { name: 'Pentecost Busstop',description: 'On Campus' },
  { name: 'KSB',              description: 'Business School' },
]
const CUR_IDX = 1 // bus is currently at / leaving Main Library

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(false)
  const [showDropOff, setShowDropOff] = useState(false)
  const [showDropPoints, setShowDropPoints] = useState(false)
  const [selectedDropPoint, setSelectedDropPoint] = useState<string | null>(null)
  const [showRoute, setShowRoute] = useState(false)
  const [segmentProgress, setSegmentProgress] = useState(0)

  const pickUp: { name: string } | null = selected ? { name: 'Brunei' } : null

  // ── Sequence timers ──────────────────────────────────────────────────────
  useEffect(() => {
    const word = 'brunei'
    const timers: number[] = []
    timers.push(window.setTimeout(() => {
      word.split('').forEach((_, i) => {
        timers.push(window.setTimeout(() => {
          setQuery(word.slice(0, i + 1))
          if (i === word.length - 1) {
            setSelected(true)
            setShowDropOff(true)
            timers.push(window.setTimeout(() => {
              setShowDropPoints(true)
              timers.push(window.setTimeout(() => {
                setSelectedDropPoint('KSB')
                timers.push(window.setTimeout(() => setShowRoute(true), 600))
              }, 600))
            }, 500))
          }
        }, i * 260))
      })
    }, 600))
    return () => timers.forEach(clearTimeout)
  }, [])

  // ── Animate bus along segment when tracking modal appears ────────────────
  useEffect(() => {
    if (!showRoute) return
    let raf: number
    let current = 0
    const animate = () => {
      current = Math.min(current + 0.4, 68)
      setSegmentProgress(current)
      if (current < 68) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [showRoute])

  // ── Route coords for map — always show the Brunei→KSB path ─────────────
  const routeCoords = BRUNEI_TO_KSB

  const bruneiDropPoints = useMemo(
    () => [
      { name: 'Main Library',      description: 'Prempeh Library, Administration' },
      { name: 'Pentecost Busstop', description: 'On Campus' },
      { name: 'KSB',               description: 'Business School' },
    ],
    []
  )

  const locations = useMemo(
    () => [
      { name: 'Brunei',         description: 'New Brunei, Complex, Katanga' },
      { name: 'Conti Busstop',  description: 'Halls, Campus, Unity' },
      { name: 'KSB',            description: 'Campus' },
      { name: 'Medical Village',description: 'Campus' },
    ],
    []
  )

  const filtered = useMemo(() => {
    if (!query) return locations
    return locations.filter((l) => l.name.toLowerCase().includes(query.toLowerCase()))
  }, [locations, query])

  const sequence: TapSequenceItem[] = [
    { key: 'b', delay: 0 },
    { key: 'r', delay: 220 },
    { key: 'u', delay: 440 },
    { key: 'n', delay: 660 },
    { key: 'e', delay: 880 },
    { key: 'i', delay: 1100 },
  ]

  const timelineItems: StopTimelineItem[] = ROUTE_STOPS.map((stop, idx) => ({
    name: stop.name,
    description: stop.description,
    status: idx < CUR_IDX ? 'past' : idx === CUR_IDX ? 'current' : 'upcoming',
    isPickup: stop.name === 'Brunei',
    isDest: stop.name === 'KSB',
    connectorFill: idx < CUR_IDX ? 100 : idx === CUR_IDX ? segmentProgress : 0,
  }))

  const busIcon = <TrackingModalBusIcon width={28} height={14} />

  return (
    <ShuttleScreenBase
      title="Welcome to KNUST"
      highlight="ShuttleApp"
      showPanel={false}
      focusBusId={showRoute ? 'bus-1' : undefined}
      visibleBusIds={['bus-1']}
      skipRouteFitBounds
      initialCenter={[-1.5706, 6.6718]}
      initialZoom={15.2}
      routeCoords={routeCoords}
      overlayContent={
        showRoute ? (
          /* ── Tracking modal ─────────────────────────────────────────── */
          <div style={{
            display: 'flex', flexDirection: 'column', backgroundColor: 'white',
            position: 'absolute',
            left: 14, right: 14, bottom: 14,
           borderRadius: 38,
            border: '1px solid rgba(0,0,0,0.08)',
            zIndex: 20, overflow: 'hidden',
            boxShadow: '24px 4px 24px rgba(0,0,0,0.10)',
          }}>

            {/* Header */}
            <div style={{ padding: '20px 14px 12px', borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>

              {/* Route row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 8 }}>
                <button
                  onClick={() => setShowRoute(false)}
                  style={{ width: 32, height: 32, borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600 }}>
                    <span style={{ color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {pickUp?.name}
                    </span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedDropPoint}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>2 buses on route</div>
                </div>
              </div>

              <RouteProgressBar
                progress={segmentProgress}
                fromLabel={ROUTE_STOPS[CUR_IDX].name}
                toLabel={ROUTE_STOPS[CUR_IDX + 1].name}
                gradient="linear-gradient(90deg, #34A853, #86EFAC)"
                busIcon={busIcon}
              />
            </div>

            {/* Stop timeline */}
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column',  }}>
              <StopTimeline items={timelineItems} routeColor="#34A853" dotSize={26} />
            </div>
          </div>
        ) : (
          /* ── Selection panel + keyboard ─────────────────────────────── */
          <>
            <div className="shuttle-panel shuttle-panel--search flex flex-col gap-3">
              <div className="shuttle-panel-header">
                <p className="shuttle-title">
                  Welcome to KNUST <span className="shuttle-highlight">ShuttleApp</span>
                </p>
                <span className="shuttle-chevron" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 16 10" fill="none">
                    <path d="M2 2L8 8L14 2" stroke="#111111" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>

              <div className="flex flex-col gap-3 p-4 rounded-3xl bg-gray-50">
                <div className="flex flex-col gap-2">
                  <p className="m-0 text-[14px] text-[rgba(0,0,0,0.5)]">Starting Point</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 min-w-10 min-h-10 aspect-square flex items-center justify-center rounded-full border border-dashed transition-all duration-300 ${pickUp ? 'border-black bg-black' : 'border-black/80 bg-white'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20.6201 8.45C19.5701 3.83 15.5401 1.75 12.0001 1.75C11.9901 1.75 8.4601 1.75 3.3701 8.44C2.2001 13.6 5.3601 17.97 8.2201 20.72C9.2801 21.74 10.6401 22.25 12.0001 22.25C13.3601 22.25 14.7201 21.74 15.7701 20.72C18.6301 17.97 21.7901 13.61 20.6201 8.45ZM12.0001 13.46C10.2601 13.46 8.8501 12.05 8.8501 10.31C8.8501 8.57 10.2601 7.16 12.0001 7.16C13.7401 7.16 15.1501 8.57 15.1501 10.31C15.1501 12.05 13.7401 13.46 12.0001 13.46Z" fill={pickUp ? 'white' : 'black'} />
                      </svg>
                    </div>
                    <div className={`flex px-4 py-3 gap-2 bg-white rounded-[16px] items-center border transition-all duration-300 ${pickUp ? 'border-black/80' : 'border-black/40'} w-[90%]`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20.031 20.79L16.991 16.33C18.3064 14.8745 19.0336 12.9818 19.031 11.02C19.031 6.63 15.461 3.06 11.071 3.06C6.681 3.06 3.111 6.63 3.111 11.02C3.111 15.41 6.681 18.98 11.071 18.98C13.051 18.98 14.881 18.25 16.281 17.04L20.031 20.79ZM4.11 11.02C4.11 7.18 7.24 4.06 11.07 4.06C14.91 4.06 18.03 7.18 18.03 11.02C18.03 14.86 14.91 17.98 11.07 17.98C7.24 17.98 4.11 14.86 4.11 11.02Z" fill="black" fillOpacity="0.6" />
                      </svg>
                      <input
                        type="text"
                        placeholder="select pickup stop"
                        value={pickUp?.name ?? query}
                        readOnly
                        className={`flex-1 border-none bg-transparent text-[14px] ${pickUp ? 'text-black' : 'text-black/60'} outline-none p-0`}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4.26671 12.6666L3.33337 11.7333L7.06671 7.99992L3.33337 4.26659L4.26671 3.33325L8.00004 7.06659L11.7334 3.33325L12.6667 4.26659L8.93337 7.99992L12.6667 11.7333L11.7334 12.6666L8.00004 8.93325L4.26671 12.6666Z" fill={pickUp ? '#1D1B20' : 'rgba(0,0,0,0.4)'} />
                      </svg>
                    </div>
                  </div>
                </div>

                {showDropOff && (
                  <>
                    <div style={{ width: 0.1, height: 20, border: '1px dashed rgba(0,0,0,1)', position: 'relative', left: '6%' }} />
                    <div className="flex flex-col gap-2">
                      <p className="m-0 text-[14px] text-[rgba(0,0,0,0.5)]">Drop Off Point</p>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', borderRadius: 50, border: '1px dashed rgba(0,0,0,0.1)', justifyContent: 'center', backgroundColor: '#fff' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20.6202 8.7C19.5802 4.07 15.5402 2 12.0002 2C8.46024 2 4.43024 4.07 3.38024 8.69C2.20024 13.85 5.36024 18.22 8.22024 20.98C9.28024 22 10.6402 22.51 12.0002 22.51C13.3602 22.51 14.7202 22 15.7702 20.98C18.6302 18.22 21.7902 13.86 20.6202 8.7Z" fill="black" fillOpacity="0.6" />
                          </svg>
                        </div>
                        <div style={{ display: 'flex', paddingInline: 16, paddingBlock: 12, gap: 8, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center', border: '1px solid rgba(0,0,0,0.1)', width: '90%' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M20.031 20.79L16.991 16.33C18.3064 14.8745 19.0336 12.9818 19.031 11.02C19.031 6.63 15.461 3.06 11.071 3.06C6.681 3.06 3.111 6.63 3.111 11.02C3.111 15.41 6.681 18.98 11.071 18.98C13.051 18.98 14.881 18.25 16.281 17.04L20.031 20.79ZM4.11 11.02C4.11 7.18 7.24 4.06 11.07 4.06C14.91 4.06 18.03 7.18 18.03 11.02C18.03 14.86 14.91 17.98 11.07 17.98C7.24 17.98 4.11 14.86 4.11 11.02Z" fill="black" fillOpacity="0.6" />
                          </svg>
                          <input
                            type="text"
                            placeholder="Select Drop Point"
                            value={selectedDropPoint ?? ''}
                            readOnly
                            style={{ flex: 1, border: 'none', backgroundColor: 'transparent', fontSize: 14, color: 'rgba(0,0,0,0.6)', outline: 'none', padding: 0 }}
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4.26671 12.6666L3.33337 11.7333L7.06671 7.99992L3.33337 4.26659L4.26671 3.33325L8.00004 7.06659L11.7334 3.33325L12.6667 4.26659L8.93337 7.99992L12.6667 11.7333L11.7334 12.6666L8.00004 8.93325L4.26671 12.6666Z" fill="rgba(0,0,0,0.4)" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!showRoute && (
                <div className="shuttle-list">
                  {showDropPoints
                    ? bruneiDropPoints.map((stop) => (
                        <div key={stop.name} className={`shuttle-list-item${stop.name === selectedDropPoint ? ' shuttle-list-item--selected' : ''}`}>
                          <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 10, backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="shuttle-list-icon" />
                          </div>
                          <div className="shuttle-list-text">
                            <p>{stop.name}</p>
                            <span>{stop.description}</span>
                          </div>
                        </div>
                      ))
                    : filtered.slice(0, 4).map((stop) => (
                        <div
                          key={stop.name}
                          className={`shuttle-list-item${stop.name === 'Brunei' && selected ? ' shuttle-list-item--selected' : ''}`}
                        >
                          <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 10, backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="shuttle-list-icon" />
                          </div>
                          <div className="shuttle-list-text">
                            <p>{stop.name}</p>
                            <span>{stop.description}</span>
                          </div>
                        </div>
                      ))}
                </div>
              )}
            </div>

            <Keyboard tapSequence={sequence} loop loopDelay={1200} />
          </>
        )
      }
    />
  )
}
