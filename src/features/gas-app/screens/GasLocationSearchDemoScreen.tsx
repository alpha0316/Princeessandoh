import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import ShuttleMap from '../../shuttle/screens/ShuttleMap'
import GasStatusBar from '../components/GasStatusBar'
import Keyboard from '../../shuttle/components/keyboard'
import type { TapSequenceItem } from '../../shuttle/components/keyboard'

// ── Location data ─────────────────────────────────────────────────────────────

type LocationPoint = {
  id: string
  name: string
  subtitle: string
  lng: number
  lat: number
}

const KNUST_FALLBACK: LocationPoint[] = [
  { id: 'brunei', name: 'Brunei Complex', subtitle: 'KNUST, Kumasi', lng: -1.5712, lat: 6.6749 },
  { id: 'commercial', name: 'Commercial Area', subtitle: 'KNUST, Kumasi', lng: -1.5754, lat: 6.6724 },
  { id: 'unity', name: 'Unity Hall Junction', subtitle: 'KNUST, Kumasi', lng: -1.5652, lat: 6.6796 },
]

const KNUST_CENTER: [number, number] = [-1.5719, 6.6735]
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string

// ── Build keyboard tap sequence from a name string ────────────────────────────

function buildTapSequence(name: string): TapSequenceItem[] {
  const word = name.split(' ')[0].toLowerCase().slice(0, 8)
  return word.split('').map((key, i) => ({
    key: key as TapSequenceItem['key'],
    delay: i * 220,
    duration: 140,
  }))
}

// ── Phase state machine ───────────────────────────────────────────────────────
// idle → open_sheet → type → select → confirm → idle (loop)

type Phase = 'idle' | 'open_sheet' | 'type' | 'select' | 'confirm'

const PHASE_ORDER: Phase[] = ['idle', 'open_sheet', 'type', 'select', 'confirm']

const PHASE_TIMINGS: Record<Phase, number> = {
  idle: 1800,
  open_sheet: 1800,
  type: 1800,
  select: 1600,
  confirm: 5000,
}

// ── Screen style ──────────────────────────────────────────────────────────────

const SCREEN_STYLE = `
  @keyframes gasSearchSlideUp {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  @keyframes gasSearchFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes gasAppFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes gasKbSlideUp {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
  }
`

// ── Component ─────────────────────────────────────────────────────────────────

export default function GasLocationSearchDemoScreen() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [typedText, setTypedText] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<LocationPoint | null>(null)
  const [flyTo, setFlyTo] = useState<[number, number]>(KNUST_CENTER)
  const [initialCenter] = useState<[number, number]>(KNUST_CENTER)
  const [dropPoints, setDropPoints] = useState<[number, number][] | undefined>(undefined)
  const [showKeyboard, setShowKeyboard] = useState(false)

  // Live data refs — safe to read inside advance() closure
  const [liveResults, setLiveResults] = useState<LocationPoint[]>(KNUST_FALLBACK)
  const [currentLocationLabel, setCurrentLocationLabel] = useState('Kumasi, Ghana')
  const liveResultsRef = useRef<LocationPoint[]>(KNUST_FALLBACK)
  const tapSequenceRef = useRef<TapSequenceItem[]>(buildTapSequence('Brunei'))
  const userCenterRef = useRef<[number, number]>(KNUST_CENTER)

  const phaseRef = useRef<Phase>('idle')
  const timerRef = useRef<number | undefined>(undefined)

  // Geolocation + Mapbox POI fetch on mount
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { longitude: lng, latitude: lat } = pos.coords
        userCenterRef.current = [lng, lat]
        setFlyTo([lng, lat])

        try {
          const geoUrl =
            `https://api.mapbox.com/geocoding/v5/mapbox.places/a.json` +
            `?proximity=${lng},${lat}&types=poi&limit=3&access_token=${MAPBOX_TOKEN}`
          const res = await fetch(geoUrl)
          const data = await res.json() as {
            features: Array<{
              id: string
              text: string
              place_name: string
              center: [number, number]
            }>
          }
          if (data.features && data.features.length > 0) {
            const points: LocationPoint[] = data.features.map((f) => ({
              id: f.id,
              name: f.text,
              subtitle: f.place_name.split(',').slice(1, 3).join(',').trim(),
              lng: f.center[0],
              lat: f.center[1],
            }))
            setLiveResults(points)
            liveResultsRef.current = points
            tapSequenceRef.current = buildTapSequence(points[0].name)
          }
        } catch {
          // silently fall back to KNUST mock
        }

        // Reverse geocode for "Use Current Location" label
        try {
          const revUrl =
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json` +
            `?types=neighborhood,place&limit=1&access_token=${MAPBOX_TOKEN}`
          const rev = await fetch(revUrl)
          const revData = await rev.json() as { features: Array<{ place_name: string }> }
          if (revData.features?.[0]) {
            setCurrentLocationLabel(revData.features[0].place_name.split(',').slice(0, 2).join(',').trim())
          }
        } catch {
          // keep default label
        }
      },
      () => {
        // permission denied — keep KNUST mock data unchanged
      },
      { timeout: 8000 },
    )
  }, [])

  const advance = () => {
    const current = phaseRef.current
    const idx = PHASE_ORDER.indexOf(current)
    const next = PHASE_ORDER[(idx + 1) % PHASE_ORDER.length]
    const results = liveResultsRef.current
    const first = results[0]

    if (next === 'open_sheet') {
      setTypedText('')
      setSelectedLocation(null)
      setFlyTo(userCenterRef.current)
      setDropPoints(undefined)
      setShowKeyboard(false)
    }

    if (next === 'type') {
      setShowKeyboard(true)
    }

    if (next === 'select') {
      setTypedText(first.name)
      setShowKeyboard(false)
    }

    if (next === 'confirm') {
      setSelectedLocation(first)
      setFlyTo([first.lng, first.lat])
      setDropPoints([[first.lng, first.lat]])
    }

    phaseRef.current = next
    setPhase(next)
    timerRef.current = window.setTimeout(advance, PHASE_TIMINGS[next])
  }

  useEffect(() => {
    phaseRef.current = 'idle'
    timerRef.current = window.setTimeout(advance, PHASE_TIMINGS['idle'])
    return () => window.clearTimeout(timerRef.current)
  }, [])

  // Type text character by character in 'type' phase
  useEffect(() => {
    if (phase !== 'type') return
    const target = liveResultsRef.current[0].name.split(' ')[0]
    let i = 0
    setTypedText('')
    const id = window.setInterval(() => {
      i++
      setTypedText(target.slice(0, i))
      if (i >= target.length) window.clearInterval(id)
    }, 230)
    return () => window.clearInterval(id)
  }, [phase])

  const isSearchOpen = phase === 'open_sheet' || phase === 'type' || phase === 'select'
  const showResults = phase === 'type' || phase === 'select'

  const filteredResults = useMemo(() => {
    if (!typedText) return liveResults
    return liveResults.filter(r =>
      r.name.toLowerCase().includes(typedText.toLowerCase()),
    )
  }, [typedText, liveResults])

  const mapHeight = showKeyboard ? 280 : isSearchOpen ? 310 : 420

  return (
    <div style={styles.screen}>
      <style>{SCREEN_STYLE}</style>
      <GasStatusBar />

      {/* Back button */}
      <div style={styles.backWrap}>
        <button type="button" style={styles.backBtn} aria-label="Back">
          <BackChevronIcon />
        </button>
      </div>

      {/* Map */}
      <div style={{ ...styles.mapWrap, height: mapHeight, transition: 'height 400ms ease' }}>
        <ShuttleMap
          initialCenter={initialCenter}
          initialZoom={15.8}
          flyToCoord={flyTo}
          flyToZoom={16.4}
          dropPoints={dropPoints}
          busRoutes={[]}
        />
      </div>

      {/* Bottom sheet */}
      <div
        style={{
          ...styles.sheet,
          ...(isSearchOpen ? styles.sheetExpanded : null),
          top: mapHeight,
          transition: 'top 400ms ease',
          animation: 'gasSearchSlideUp 500ms ease',
        }}
      >
        {/* Sheet header (expanded state) */}
        {isSearchOpen && (
          <div style={styles.sheetHeader}>
            <div style={{ width: 28 }} />
            <span style={styles.sheetHeaderTitle}>Your Route</span>
            <button type="button" style={styles.closeBtn} aria-label="Close">
              <CloseIcon />
            </button>
          </div>
        )}

        {/* Search input */}
        <div style={styles.searchRow}>
          <SearchIcon />
          <div style={styles.searchText}>
            {typedText || <span style={styles.searchPlaceholder}>Search for a pickup point</span>}
            {(phase === 'type') && <span style={styles.cursor}>|</span>}
          </div>
        </div>

        {/* Collapsed: current location + selected + button */}
        {!isSearchOpen && (
          <>
            <button type="button" style={{ ...styles.locationOption, ...styles.locationOptionSelected }}>
              <div style={styles.optionIconWrap}><HomeIcon /></div>
              <div style={styles.optionText}>
                <div style={styles.optionTitle}>Use Current Location</div>
                <div style={styles.optionSub}>{currentLocationLabel}</div>
              </div>
              <RadioDot selected />
            </button>

            {selectedLocation && (
              <button type="button" style={{ ...styles.locationOption, ...styles.locationOptionSelected }}>
                <div style={styles.optionIconWrap}><PinIcon filled /></div>
                <div style={styles.optionText}>
                  <div style={styles.optionTitle}>{selectedLocation.name}</div>
                  <div style={styles.optionSub}>{selectedLocation.subtitle}</div>
                </div>
                <RadioDot selected />
              </button>
            )}

            <button type="button" style={styles.continueBtn}>Continue</button>
          </>
        )}

        {/* Expanded: search results */}
        {showResults && (
          <div style={styles.resultsList}>
            {filteredResults.map((result) => {
              const isHighlighted = phase === 'select' && result.id === liveResultsRef.current[0].id
              return (
                <div
                  key={result.id}
                  style={{
                    ...styles.resultItem,
                    ...(isHighlighted ? styles.resultItemHighlighted : null),
                  }}
                >
                  <div style={styles.resultIconWrap}><PinIcon filled /></div>
                  <div style={styles.resultText}>
                    <div style={styles.resultTitle}>{result.name}</div>
                    <div style={styles.resultSub}>{result.subtitle}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Expanded idle: current + selected option */}
        {isSearchOpen && !showResults && (
          <button type="button" style={styles.locationOption}>
            <div style={styles.optionIconWrap}><HomeIcon /></div>
            <div style={styles.optionText}>
              <div style={styles.optionTitle}>Use Current Location</div>
              <div style={styles.optionSub}>{currentLocationLabel}</div>
            </div>
            <RadioDot selected />
          </button>
        )}
      </div>

      {/* Keyboard */}
      {showKeyboard && (
        <div style={styles.keyboardWrap}>
          <Keyboard
            tapSequence={tapSequenceRef.current}
            loop
            loopDelay={600}
          />
        </div>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div style={{
      width: 22,
      height: 22,
      borderRadius: 999,
      border: `1px solid ${selected ? '#111111' : 'rgba(0,0,0,0.18)'}`,
      display: 'grid',
      placeItems: 'center',
      flexShrink: 0,
    }}>
      {selected && <div style={{ width: 10, height: 10, borderRadius: 999, background: '#111111' }} />}
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function BackChevronIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M11.667 15L6.667 10l5-5" stroke="#4F4F4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M17.031 17.79c.46.46 1.17-.25.71-.7L13.99 13.33c1.316-1.455 2.043-3.348 2.04-5.31C16.031 3.63 12.461.06 8.071.06 3.681.06.11 3.63.11 8.02c0 4.39 3.57 7.96 7.96 7.96 1.98 0 3.81-.73 5.21-1.94l3.75 3.75zm-16-9.77c0-3.84 3.13-6.96 6.96-6.96 3.84 0 6.96 3.12 6.96 6.96 0 3.84-3.12 6.96-6.96 6.96-3.84 0-6.96-3.12-6.96-6.96z" fill="rgba(0,0,0,0.5)" />
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

function HomeIcon() {
  return (
    <svg width="15" height="16" viewBox="0 0 16 17" fill="none">
      <path d="M16 15.375V6.875a1 1 0 0 0-.4-.8l-7-5.25a1 1 0 0 0-1.2 0l-7 5.25A1 1 0 0 0 0 6.875v8.5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1z" fill="#00000060" />
    </svg>
  )
}

function PinIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M13.747 5.8c-.694-3.087-3.387-4.467-5.747-4.467S2.253 2.713 1.56 5.793c-.787 3.44 1.32 6.353 3.227 8.193.706.68 1.613 1.02 2.52 1.02s1.813-.34 2.513-1.02c1.907-1.84 4.013-4.747 3.233-8.187zm-3.56.553L7.52 9.02a.5.5 0 0 1-.707 0l-1.5-1.5a.5.5 0 0 1 .707-.707l1.147 1.147 2.313-2.313a.5.5 0 0 1 .707.707z" fill={filled ? '#111111' : '#00000060'} />
    </svg>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles: Record<string, CSSProperties> = {
  screen: {
    minHeight: '100%',
    width: '100%',
    background: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
  mapWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    background: '#EEF2F6',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    background: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTop: '1px solid rgba(0,0,0,0.08)',
    padding: '14px 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    zIndex: 4,
    boxShadow: '0 -8px 28px rgba(0,0,0,0.07)',
  },
  sheetExpanded: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTop: 'none',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
  },
  sheetHeader: {
    display: 'grid',
    gridTemplateColumns: '28px 1fr 28px',
    alignItems: 'center',
    marginBottom: 2,
  },
  sheetHeaderTitle: {
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
  searchPlaceholder: {
    color: 'rgba(0,0,0,0.38)',
  },
  cursor: {
    display: 'inline-block',
    color: '#111111',
    fontWeight: 100,
    animation: 'gasLiveDot 0.9s step-start infinite',
    marginLeft: 1,
  },
  locationOption: {
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
  locationOptionSelected: {
    borderColor: '#111111',
    background: '#FFFFFF',
  },
  optionIconWrap: {
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
    marginTop: 1,
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
    maxHeight: 200,
    overflowY: 'auto',
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
  resultItemHighlighted: {
    borderColor: '#111111',
    background: '#F8F8F8',
  },
  resultIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: '#F4F4F4',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
  },
  resultText: {
    minWidth: 0,
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
  keyboardWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 6,
    background: '#D1D5DB',
    animation: 'gasKbSlideUp 300ms ease',
  },
}
