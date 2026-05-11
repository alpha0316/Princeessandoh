import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import PrimaryButton from '../components/PrimaryButton'
import ShuttleMap from '../../shuttle/screens/ShuttleMap'

type LocationPoint = {
  id: string
  name: string
  subtitle: string
  lat: number
  lng: number
}

type SelectLocationScreenProps = {
  offerName?: string
  offerPrice?: number
  offerId?: number | string
  onBack?: () => void
  onContinue?: (payload: {
    offerName: string
    offerPrice: number
    offerId?: number | string
    locationName: string
    locationCoordinates: { latitude: number; longitude: number }
    locationType: 'current' | 'selected'
    selectedLocationDetails: LocationPoint
    timestamp: string
  }) => void
}

type Stage = 'hidden' | 'visible'

const SCREEN_STYLE = `
  @keyframes gasAppFadeUp {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const FALLBACK_CURRENT: LocationPoint = {
  id: 'current',
  name: 'KNUST Campus',
  subtitle: 'Kumasi, Ghana',
  lat: 6.6735,
  lng: -1.5719,
}

const SEARCH_RESULTS: LocationPoint[] = [
  {
    id: 'brunei',
    name: 'Brunei Complex',
    subtitle: 'KNUST, Kumasi',
    lat: 6.6749,
    lng: -1.5712,
  },
  {
    id: 'commercial',
    name: 'Commercial Area',
    subtitle: 'KNUST, Kumasi',
    lat: 6.6724,
    lng: -1.5754,
  },
  {
    id: 'unity',
    name: 'Unity Hall Junction',
    subtitle: 'KNUST, Kumasi',
    lat: 6.6796,
    lng: -1.5652,
  },
]

export default function SelectLocationScreen({
  offerName = 'Emergency Offer',
  offerPrice = 12,
  offerId,
  onBack,
  onContinue,
}: SelectLocationScreenProps) {
  const [stage, setStage] = useState<Stage>('hidden')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentLocation, setCurrentLocation] = useState<LocationPoint>(FALLBACK_CURRENT)
  const [selectedLocation, setSelectedLocation] = useState<LocationPoint | null>(null)
  const [useCurrentLocation, setUseCurrentLocation] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setStage('visible'), 120)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          id: 'current',
          name: 'Current Location',
          subtitle: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {
        // Keep fallback location silently for portfolio mode.
      },
      { enableHighAccuracy: true, timeout: 5000 },
    )
  }, [])

  const activeLocation = useCurrentLocation ? currentLocation : selectedLocation

  const searchMatches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return SEARCH_RESULTS
    return SEARCH_RESULTS.filter((item) =>
      `${item.name} ${item.subtitle}`.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const dropPoints = useMemo<[number, number][] | undefined>(() => {
    if (!activeLocation) return undefined
    return [[activeLocation.lng, activeLocation.lat]]
  }, [activeLocation])

  const flyToCoord = useMemo<[number, number] | undefined>(() => {
    if (!activeLocation) return undefined
    return [activeLocation.lng, activeLocation.lat]
  }, [activeLocation])

  const isDisabled = !activeLocation

  const handleUseCurrentLocation = () => {
    setUseCurrentLocation(true)
    setSelectedLocation(null)
  }

  const handleUseSelectedLocation = () => {
    if (!selectedLocation) return
    setUseCurrentLocation(false)
  }

  const handleSelectSearchResult = (location: LocationPoint) => {
    setSelectedLocation(location)
    setUseCurrentLocation(false)
    setIsSearchOpen(false)
    setSearchQuery(location.name)
  }

  const handleContinue = () => {
    if (!activeLocation) return
    onContinue?.({
      offerName,
      offerPrice,
      offerId,
      locationName: activeLocation.name,
      locationCoordinates: {
        latitude: activeLocation.lat,
        longitude: activeLocation.lng,
      },
      locationType: useCurrentLocation ? 'current' : 'selected',
      selectedLocationDetails: activeLocation,
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <div style={styles.screen}>
      <style>{SCREEN_STYLE}</style>

      <div style={styles.backButtonWrap}>
        <button type="button" onClick={onBack} style={styles.backButton} aria-label="Back">
          <BackChevronIcon />
        </button>
      </div>

      <div style={styles.mapWrap}>
        <ShuttleMap
          initialCenter={flyToCoord ?? [-1.5719, 6.6735]}
          initialZoom={16.1}
          flyToCoord={flyToCoord}
          flyToZoom={16.6}
          dropPoints={dropPoints}
        />

        <div style={styles.mapControls}>
          <button type="button" style={styles.mapControlButton} onClick={handleUseCurrentLocation}>
            <LocationAimIcon />
          </button>
          <button type="button" style={styles.mapControlButton}>
            <LayersIcon />
          </button>
        </div>
      </div>

      <aside
        style={{
          ...styles.sheet,
          ...(isSearchOpen ? styles.sheetExpanded : null),
          ...reveal(0, stage, 820),
        }}
      >
        {isSearchOpen ? (
          <div style={styles.searchHeader}>
            <button type="button" style={styles.closeButton} onClick={() => setIsSearchOpen(false)} aria-label="Close search">
              <CloseIcon />
            </button>
            <div style={styles.searchHeaderTitle}>Your Route</div>
            <div style={styles.searchHeaderSpacer} />
          </div>
        ) : null}

        <div style={styles.searchInputWrap}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search for a pickup point"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(event) => setSearchQuery(event.target.value)}
            style={styles.searchInput}
          />
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          style={{
            ...styles.locationOption,
            ...(useCurrentLocation ? styles.locationOptionSelected : null),
          }}
        >
          <div style={styles.optionIconWrap}>
            <HomeIcon />
          </div>
          <div style={styles.optionText}>
            <div style={styles.optionTitle}>Use Current Location</div>
            <div style={styles.optionSubtitle}>{currentLocation.subtitle || 'Save time by selecting your current location'}</div>
          </div>
          <RadioButton selected={useCurrentLocation} />
        </button>

        {!isSearchOpen ? (
          <button
            type="button"
            onClick={handleUseSelectedLocation}
            disabled={!selectedLocation}
            style={{
              ...styles.locationOption,
              ...(!selectedLocation ? styles.locationOptionDisabled : null),
              ...(!useCurrentLocation && selectedLocation ? styles.locationOptionSelected : null),
            }}
          >
            <div style={styles.optionIconWrap}>
              <PinIcon filled={!!selectedLocation && !useCurrentLocation} />
            </div>
            <div style={styles.optionText}>
              <div style={styles.optionTitle}>Selected Location</div>
              <div style={styles.optionSubtitle}>
                {selectedLocation ? `${selectedLocation.name}, ${selectedLocation.subtitle}` : 'Your selected pickup point will appear here'}
              </div>
            </div>
            <RadioButton selected={!useCurrentLocation && !!selectedLocation} />
          </button>
        ) : null}

        {isSearchOpen ? (
          <div style={styles.resultsList}>
            {searchMatches.map((result) => (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelectSearchResult(result)}
                style={styles.resultItem}
              >
                <div style={styles.resultIconWrap}>
                  <PinIcon filled />
                </div>
                <div style={styles.resultText}>
                  <div style={styles.resultTitle}>{result.name}</div>
                  <div style={styles.resultSubtitle}>{result.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <PrimaryButton title="Continue" onPress={handleContinue} disabled={isDisabled} />
        )}
      </aside>
    </div>
  )
}

function RadioButton({ selected }: { selected: boolean }) {
  return (
    <div style={{ ...styles.radioButton, ...(selected ? styles.radioButtonSelected : null) }}>
      {selected ? <CheckIcon /> : null}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.031 17.7901C17.491 18.2501 18.201 17.5401 17.741 17.0901L13.991 13.3301C15.3064 11.8746 16.0335 9.98189 16.031 8.02006C16.031 3.63006 12.461 0.0600586 8.07096 0.0600586C3.68096 0.0600586 0.110962 3.63006 0.110962 8.02006C0.110962 12.4101 3.68096 15.9801 8.07096 15.9801C10.051 15.9801 11.881 15.2501 13.281 14.0401L17.031 17.7901ZM1.10996 8.02006C1.10996 4.18006 4.23996 1.06006 8.06996 1.06006C11.91 1.06006 15.03 4.18006 15.03 8.02006C15.03 11.8601 11.91 14.9801 8.06996 14.9801C4.23996 14.9801 1.10996 11.8601 1.10996 8.02006Z" fill="black" fillOpacity="0.6" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="#1D1B20" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 15.375V6.875C16 6.71975 15.9639 6.56664 15.8944 6.42779C15.825 6.28893 15.7242 6.16815 15.6 6.075L8.6 0.825C8.4269 0.695178 8.21637 0.625 8 0.625C7.78363 0.625 7.5731 0.695178 7.4 0.825L0.4 6.075C0.275804 6.16815 0.175 6.28893 0.105573 6.42779C0.036145 6.56664 0 6.71975 0 6.875V15.375C0 15.6402 0.105357 15.8946 0.292893 16.0821C0.48043 16.2696 0.734784 16.375 1 16.375H5C5.26522 16.375 5.51957 16.2696 5.70711 16.0821C5.89464 15.8946 6 15.6402 6 15.375V12.375C6 12.1098 6.10536 11.8554 6.29289 11.6679C6.48043 11.4804 6.73478 11.375 7 11.375H9C9.26522 11.375 9.51957 11.4804 9.70711 11.6679C9.89464 11.8554 10 12.1098 10 12.375V15.375C10 15.6402 10.1054 15.8946 10.2929 16.0821C10.4804 16.2696 10.7348 16.375 11 16.375H15C15.2652 16.375 15.5196 16.2696 15.7071 16.0821C15.8946 15.8946 16 15.6402 16 15.375Z" fill="#00000060" />
    </svg>
  )
}

function PinIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.7465 5.80004C13.0532 2.71337 10.3598 1.33337 7.99983 1.33337C7.99983 1.33337 7.99983 1.33337 7.99317 1.33337C5.63983 1.33337 2.95317 2.71337 2.25317 5.79337C1.4665 9.23337 3.57317 12.1467 5.47983 13.9867C6.1865 14.6667 7.09317 15.0067 7.99983 15.0067C8.9065 15.0067 9.81317 14.6667 10.5132 13.9867C12.4198 12.1467 14.5265 9.24004 13.7465 5.80004ZM10.1865 6.35337L7.51983 9.02004C7.41983 9.12004 7.29317 9.16671 7.1665 9.16671C7.03983 9.16671 6.91317 9.12004 6.81317 9.02004L5.81317 8.02004C5.61983 7.82671 5.61983 7.50671 5.81317 7.31337C6.0065 7.12004 6.3265 7.12004 6.51983 7.31337L7.1665 7.96004L9.47983 5.64671C9.67317 5.45337 9.99317 5.45337 10.1865 5.64671C10.3798 5.84004 10.3798 6.16004 10.1865 6.35337Z" fill={filled ? '#000000' : '#00000060'} />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="black" />
    </svg>
  )
}

function BackChevronIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.6667 15L6.66669 10L11.6667 5" stroke="#4F4F4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LocationAimIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2V5" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 19V22" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 12H5" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 12H22" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="5" stroke="#111111" strokeWidth="2" />
    </svg>
  )
}

function LayersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L3 7.5L12 12L21 7.5L12 3Z" stroke="#111111" strokeWidth="2" strokeLinejoin="round" />
      <path d="M5.5 11.5L12 15L18.5 11.5" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 15.5L12 19L18.5 15.5" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function reveal(delay: number, stage: Stage, duration = 800) {
  if (stage === 'hidden') {
    return {
      opacity: 0,
      transform: 'translateY(24px)',
    }
  }

  return {
    opacity: 1,
    transform: 'translateY(0)',
    animation: `gasAppFadeUp ${duration}ms ease ${delay}ms both`,
  }
}

const styles: Record<string, CSSProperties> = {
  screen: {
    minHeight: '100%',
    width: '100%',
    background: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  backButtonWrap: {
    position: 'absolute',
    left: 16,
    top: 20,
    zIndex: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    border: '1px solid rgba(0,0,0,0.06)',
    background: 'rgba(255,255,255,0.94)',
    display: 'grid',
    placeItems: 'center',
    padding: 0,
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
  },
  mapWrap: {
    position: 'absolute',
    inset: 0,
    background: '#EEF2F6',
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: 88,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    zIndex: 2,
  },
  mapControlButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    border: '1px solid rgba(0,0,0,0.06)',
    background: 'rgba(255,255,255,0.94)',
    display: 'grid',
    placeItems: 'center',
    padding: 0,
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    background: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTop: '1px solid rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    zIndex: 2,
    boxShadow: '0 -10px 28px rgba(0,0,0,0.06)',
  },
  sheetExpanded: {
    top: 86,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  searchHeader: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 40px',
    alignItems: 'center',
  },
  closeButton: {
    width: 36,
    height: 36,
    border: 'none',
    background: 'transparent',
    display: 'grid',
    placeItems: 'center',
    padding: 0,
    cursor: 'pointer',
  },
  searchHeaderTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 700,
    color: '#111111',
  },
  searchHeaderSpacer: {
    width: 36,
    height: 36,
  },
  searchInputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 24,
    border: '1px solid rgba(0,0,0,0.12)',
    background: '#FAFAFA',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 14,
    color: '#111111',
  },
  locationOption: {
    width: '100%',
    border: '1px solid rgba(0,0,0,0.10)',
    background: '#FAFAFA',
    borderRadius: 16,
    padding: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textAlign: 'left',
    cursor: 'pointer',
  },
  locationOptionSelected: {
    borderColor: '#111111',
    background: '#FFFFFF',
  },
  locationOptionDisabled: {
    opacity: 0.55,
    cursor: 'not-allowed',
  },
  optionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 999,
    background: '#F4F4F4',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
  },
  optionText: {
    flex: 1,
    minWidth: 0,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#111111',
  },
  optionSubtitle: {
    fontSize: 12,
    lineHeight: 1.35,
    color: 'rgba(0,0,0,0.60)',
    marginTop: 2,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 999,
    border: '1px solid rgba(0,0,0,0.18)',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
  },
  radioButtonSelected: {
    borderColor: '#111111',
    background: 'transparent',
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    maxHeight: 300,
    overflowY: 'auto',
  },
  resultItem: {
    width: '100%',
    border: '1px solid rgba(0,0,0,0.08)',
    background: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textAlign: 'left',
    cursor: 'pointer',
  },
  resultIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: '#F6F6F6',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
  },
  resultText: {
    minWidth: 0,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#111111',
  },
  resultSubtitle: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.55)',
    marginTop: 2,
  },
}
