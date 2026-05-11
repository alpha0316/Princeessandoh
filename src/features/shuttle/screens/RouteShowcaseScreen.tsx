// RouteShowcaseScreen — Frame 3 in the portfolio showcase.
// Types a stop name to search → selects it → shows drop points → cycles.

import { useEffect, useMemo, useState } from 'react'
import ShuttleScreenBase from './ShuttleScreenBase'
import Keyboard, { type TapSequenceItem, type KeyId } from '../components/keyboard'
import { locationsss } from '../../../data/locations'

// ── Stops with real campus coordinates ────────────────────────────────────────

const STOPS = [
  { name: 'Brunei',          description: 'New Brunei, Complex, Katanga', coords: [-1.5741574445526254, 6.670465091472612]  as [number, number] },
  { name: 'KSB',             description: 'Business School',              coords: [-1.567181795001016,  6.669314250173885]  as [number, number] },
  { name: 'Commercial Area', description: 'Bomso, Central Bus stop',      coords: [-1.5769726260262382, 6.682751297721754]  as [number, number] },
]

// ── Typed search words per stop ───────────────────────────────────────────────

const TYPED_WORDS: Record<string, string> = {
  'Brunei':          'brunei',
  'KSB':             'ksb',
  'Commercial Area': 'comm',
}

// ── Drop points per stop ──────────────────────────────────────────────────────

const DROP_POINTS: Record<string, [number, number][]> = {
  'Brunei': [
    [-1.5741574445526254, 6.670465091472612],
    [-1.5752,             6.6718],
    [-1.5736,             6.6692],
    [-1.5756,             6.6698],
  ],
  'KSB': [
    [-1.567181795001016,  6.669314250173885],
    [-1.5665,             6.6700],
    [-1.5680,             6.6686],
    [-1.5676,             6.6710],
  ],
  'Commercial Area': [
    [-1.5769726260262382, 6.682751297721754],
    [-1.5778,             6.6835],
    [-1.5762,             6.6820],
    [-1.5782,             6.6815],
  ],
}

// ── Timing ────────────────────────────────────────────────────────────────────

const LETTER_INTERVAL = 240   // ms between key presses
const INITIAL_PAUSE   = 500   // ms before first key press
const SELECT_PAUSE    = 450   // ms after last letter before selecting
const DROPOFF_PAUSE   = 600   // ms after select before showing dropoff panel
const DROPOFF_MS      = 4500  // ms showing drop points before cycling

// ── Phase type ────────────────────────────────────────────────────────────────

type Phase = 'selection' | 'dropoff'

// ── Selection panel ───────────────────────────────────────────────────────────

function SelectionPanel({
  query,
  selected,
  activeIdx,
  tapSequence,
}: {
  query: string
  selected: boolean
  activeIdx: number
  tapSequence: TapSequenceItem[]
}) {
  const filtered = useMemo(() => {
    if (!query) return STOPS
    return STOPS.filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
  }, [query])

  const activeStop = STOPS[activeIdx]

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      display: 'flex', flexDirection: 'column', zIndex: 20,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderTopLeftRadius: 40, borderTopRightRadius: 40,
        padding: '30px 16px 0',
        display: 'flex', flexDirection: 'column', gap: 12,
        left: 12, right: 12, bottom: '100%', position: 'absolute',
      }}>

        

        {/* Header */}
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

        {/* Starting point input */}
        <div className="flex flex-col gap-3 p-4 rounded-3xl bg-gray-50">
          <div className="flex flex-col gap-2">
            <p className="m-0 text-[14px] text-[rgba(0,0,0,0.5)]">Starting Point</p>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 min-w-10 min-h-10 aspect-square flex items-center justify-center rounded-full border border-dashed transition-all duration-300 ${selected ? 'border-black bg-black' : 'border-black/80 bg-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20.6201 8.45C19.5701 3.83 15.5401 1.75 12.0001 1.75C11.9901 1.75 8.4601 1.75 3.3701 8.44C2.2001 13.6 5.3601 17.97 8.2201 20.72C9.2801 21.74 10.6401 22.25 12.0001 22.25C13.3601 22.25 14.7201 21.74 15.7701 20.72C18.6301 17.97 21.7901 13.61 20.6201 8.45ZM12.0001 13.46C10.2601 13.46 8.8501 12.05 8.8501 10.31C8.8501 8.57 10.2601 7.16 12.0001 7.16C13.7401 7.16 15.1501 8.57 15.1501 10.31C15.1501 12.05 13.7401 13.46 12.0001 13.46Z" fill={selected ? 'white' : 'black'} />
                </svg>
              </div>
              <div className={`flex px-4 py-3 gap-2 bg-white rounded-[16px] items-center border transition-all duration-300 ${selected ? 'border-black/80' : 'border-black/40'} w-[90%]`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20.031 20.79L16.991 16.33C18.3064 14.8745 19.0336 12.9818 19.031 11.02C19.031 6.63 15.461 3.06 11.071 3.06C6.681 3.06 3.111 6.63 3.111 11.02C3.111 15.41 6.681 18.98 11.071 18.98C13.051 18.98 14.881 18.25 16.281 17.04L20.031 20.79ZM4.11 11.02C4.11 7.18 7.24 4.06 11.07 4.06C14.91 4.06 18.03 7.18 18.03 11.02C18.03 14.86 14.91 17.98 11.07 17.98C7.24 17.98 4.11 14.86 4.11 11.02Z" fill="black" fillOpacity="0.6" />
                </svg>
                <span className={`flex-1 text-[14px] ${selected ? 'text-black' : 'text-black/60'}`}>
                  {selected ? activeStop.name : (query || 'select pickup stop')}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4.26671 12.6666L3.33337 11.7333L7.06671 7.99992L3.33337 4.26659L4.26671 3.33325L8.00004 7.06659L11.7334 3.33325L12.6667 4.26659L8.93337 7.99992L12.6667 11.7333L11.7334 12.6666L8.00004 8.93325L4.26671 12.6666Z" fill={selected ? '#1D1B20' : 'rgba(0,0,0,0.4)'} />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Stop list — filtered by query */}
        <div className="shuttle-list">
          {filtered.map((stop) => {
            const isActive = stop.name === activeStop.name
            return (
              <div key={stop.name} className={`shuttle-list-item${selected && isActive ? ' shuttle-list-item--selected' : ''}`}>
                <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 10, backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="shuttle-list-icon" />
                </div>
                <div className="shuttle-list-text">
                  <p>{stop.name}</p>
                  <span>{stop.description}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Keyboard
        tapSequence={tapSequence}
        style={{ position: 'relative', height: 'auto', borderRadius: 0 }}
      />
    </div>
  )
}

// ── Drop-off panel ────────────────────────────────────────────────────────────

function DropoffPanel({ stop }: { stop: typeof STOPS[0] }) {
  const location = locationsss.find(l => l.name === stop.name)
  const dropPoints = (location?.dropPoints ?? []).filter(dp => dp.name !== stop.name && !dp.hidden)

  return (
    <div className="shuttle-panel shuttle-panel--search flex flex-col gap-3" style={{ bottom: 16, minHeight: 0 }}>

      {/* Header */}
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

      {/* Inputs */}
      <div className="flex flex-col gap-3 p-4 rounded-3xl bg-gray-0">
        {/* Starting Point — filled */}
        <div className="flex flex-col gap-2">
          <p className="m-0 text-[14px] text-[rgba(0,0,0,0.5)]">Starting Point</p>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 min-w-10 min-h-10 aspect-square flex items-center justify-center rounded-full border border-dashed border-black bg-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20.6201 8.45C19.5701 3.83 15.5401 1.75 12.0001 1.75C11.9901 1.75 8.4601 1.75 3.3701 8.44C2.2001 13.6 5.3601 17.97 8.2201 20.72C9.2801 21.74 10.6401 22.25 12.0001 22.25C13.3601 22.25 14.7201 21.74 15.7701 20.72C18.6301 17.97 21.7901 13.61 20.6201 8.45ZM12.0001 13.46C10.2601 13.46 8.8501 12.05 8.8501 10.31C8.8501 8.57 10.2601 7.16 12.0001 7.16C13.7401 7.16 15.1501 8.57 15.1501 10.31C15.1501 12.05 13.7401 13.46 12.0001 13.46Z" fill="white" />
              </svg>
            </div>
            <div className="flex px-4 py-3 gap-2 bg-white rounded-[16px] items-center border border-black/80 w-[90%]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20.031 20.79L16.991 16.33C18.3064 14.8745 19.0336 12.9818 19.031 11.02C19.031 6.63 15.461 3.06 11.071 3.06C6.681 3.06 3.111 6.63 3.111 11.02C3.111 15.41 6.681 18.98 11.071 18.98C13.051 18.98 14.881 18.25 16.281 17.04L20.031 20.79ZM4.11 11.02C4.11 7.18 7.24 4.06 11.07 4.06C14.91 4.06 18.03 7.18 18.03 11.02C18.03 14.86 14.91 17.98 11.07 17.98C7.24 17.98 4.11 14.86 4.11 11.02Z" fill="black" fillOpacity="0.6" />
              </svg>
              <span className="flex-1 text-[14px] text-black">{stop.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4.26671 12.6666L3.33337 11.7333L7.06671 7.99992L3.33337 4.26659L4.26671 3.33325L8.00004 7.06659L11.7334 3.33325L12.6667 4.26659L8.93337 7.99992L12.6667 11.7333L11.7334 12.6666L8.00004 8.93325L4.26671 12.6666Z" fill="#1D1B20" />
              </svg>
            </div>
          </div>
        </div>

        {/* Dashed vertical connector */}
        <div style={{ width: 0.1, height: 20, border: '1px dashed rgba(0,0,0,1)', position: 'relative', left: '6%' }} />

        {/* Drop Off Point — empty */}
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
              <span style={{ flex: 1, fontSize: 14, color: 'rgba(0,0,0,0.6)' }}>select drop point</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4.26671 12.6666L3.33337 11.7333L7.06671 7.99992L3.33337 4.26659L4.26671 3.33325L8.00004 7.06659L11.7334 3.33325L12.6667 4.26659L8.93337 7.99992L12.6667 11.7333L11.7334 12.6666L8.00004 8.93325L4.26671 12.6666Z" fill="rgba(0,0,0,0.4)" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Drop point list */}
      <div className="shuttle-list">
        {dropPoints.map((dp, i) => {
          const dpLocation = locationsss.find(l => l.name === dp.name)
          return (
            <div key={dp.name} className={`shuttle-list-item${i === 0 ? ' shuttle-list-item--selected' : ''}`}>
              <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 10, backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="shuttle-list-icon" />
              </div>
              <div className="shuttle-list-text">
                <p>{dp.name}</p>
                <span>{dpLocation?.description ?? 'Campus'}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function RouteShowcaseScreen() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [phase, setPhase]         = useState<Phase>('selection')
  const [query, setQuery]         = useState('')
  const [selected, setSelected]   = useState(false)

  const stop = STOPS[activeIdx]

  // ── Typing animation (selection phase) ──────────────────────────────────────
  useEffect(() => {
    if (phase !== 'selection') return

    const word = TYPED_WORDS[stop.name]
    const timers: ReturnType<typeof setTimeout>[] = []

    setQuery('')
    setSelected(false)

    // Type each letter
    word.split('').forEach((_, i) => {
      timers.push(setTimeout(() => {
        setQuery(word.slice(0, i + 1))
      }, INITIAL_PAUSE + i * LETTER_INTERVAL))
    })

    // After last letter: pause → select → transition to dropoff
    const typingDone = INITIAL_PAUSE + (word.length - 1) * LETTER_INTERVAL
    timers.push(setTimeout(() => {
      setSelected(true)
    }, typingDone + SELECT_PAUSE))

    timers.push(setTimeout(() => {
      setPhase('dropoff')
    }, typingDone + SELECT_PAUSE + DROPOFF_PAUSE))

    return () => timers.forEach(clearTimeout)
  }, [phase, activeIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Dropoff phase — advance after timeout ────────────────────────────────────
  useEffect(() => {
    if (phase !== 'dropoff') return
    const t = setTimeout(() => {
      setActiveIdx(i => (i + 1) % STOPS.length)
      setPhase('selection')
    }, DROPOFF_MS)
    return () => clearTimeout(t)
  }, [phase, activeIdx])

  // ── Keyboard tap sequence (aligned with query typing) ───────────────────────
  const tapSequence = useMemo<TapSequenceItem[]>(() => {
    const word = TYPED_WORDS[stop.name]
    return word.split('').map((k, i) => ({
      key: k as KeyId,
      delay: INITIAL_PAUSE + i * LETTER_INTERVAL,
    }))
  }, [activeIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ShuttleScreenBase
      title="Welcome To KNUST"
      highlight="ShuttleApp"
      showPanel={false}
      skipRouteFitBounds
      initialCenter={[-1.5728, 6.6742]}
      initialZoom={14.0}
      flyToCoord={stop.coords}
      flyToZoom={16.0}
      flyToOffset={[0, 300]}
      dropPoints={phase === 'dropoff' ? DROP_POINTS[stop.name] : [stop.coords]}
      overlayContent={
        phase === 'selection'
          ? <SelectionPanel
              query={query}
              selected={selected}
              activeIdx={activeIdx}
              tapSequence={tapSequence}
            />
          : <DropoffPanel stop={stop} />
      }
    />
  )
}
