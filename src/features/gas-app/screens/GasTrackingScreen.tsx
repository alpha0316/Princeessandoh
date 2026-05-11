import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import ShuttleMap from '../../shuttle/screens/ShuttleMap'
import { GasRiderMarker, GasStationMarker } from '../components/GasMapMarkers'
import GasStatusBar from '../components/GasStatusBar'

export type TimelineStep = {
  icon: 'scooter' | 'pump' | 'check'
  title: string
  subtitle: string
  subtitleTone: 'success' | 'muted' | 'pill'
  progress?: number
  iconStyle: 'solid' | 'ghost'
}

type GasAppTrackingScreenProps = {
  steps?: TimelineStep[]
  headerSubtitle?: string
}

const MAP_CENTER: [number, number] = [-1.5719, 6.6735]
const FILLING_STATION_POINT: [number, number] = [-1.5679, 6.6752]

const TIMELINE_STEPS: TimelineStep[] = [
  {
    icon: 'scooter',
    title: 'Rider has completed filling your gas',
    subtitle: 'Completed',
    subtitleTone: 'success',
    progress: 1,
    iconStyle: 'solid',
  },
  {
    icon: 'pump',
    title: 'Filling Process',
    subtitle: 'Completed',
    subtitleTone: 'pill',
    iconStyle: 'solid',
  },
  {
    icon: 'check',
    title: 'Refill Completed',
    subtitle: 'Rider will arrive in 5 minutes',
    subtitleTone: 'muted',
    progress: 0.36,
    iconStyle: 'ghost',
  },
]

export default function GasAppTrackingScreen({ steps = TIMELINE_STEPS, headerSubtitle }: GasAppTrackingScreenProps = {}) {
  const [userPoint, setUserPoint] = useState<[number, number]>(MAP_CENTER)
  const [isFullMapOpen, setIsFullMapOpen] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPoint([position.coords.longitude, position.coords.latitude])
      },
      () => {},
      { enableHighAccuracy: true, timeout: 5000 },
    )
  }, [])

  const routePath = useMemo(() => createRoadRouteToUser(userPoint), [userPoint])

  return (
    <div style={styles.screen}>
      <GasStatusBar style={styles.statusBar} />

      <div style={styles.content}>
        <header style={styles.header}>
          <div style={styles.avatar}>
            <AvatarIcon />
          </div>
          <div style={styles.headerText}>
            <div style={styles.headerTitle}>Hello Chris 👋</div>
            <p style={styles.headerSubtitle}>
              {headerSubtitle ?? "Let’s fill your LPG cylinder for you in less than 20 minutes"}
            </p>
          </div>
          <button type="button" style={styles.bellButton} aria-label="Notifications">
            <BellIcon />
          </button>
        </header>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Track All Activities Here</h2>
          <p style={styles.sectionSubtitle}>
            Enjoy real time track system as your Gas cylinder get filled
          </p>
        </section>

        <section style={styles.timeline}>
          {steps.map((step, index) => (
            <TimelineRow
              key={step.title}
              step={step}
              isLast={index === steps.length - 1}
            />
          ))}
        </section>

        <section style={styles.mapCard}>
          <button type="button" style={styles.mapTapButton} onClick={() => setIsFullMapOpen(true)} aria-label="Open full tracking map">
            <TrackingMapView routePath={routePath} userPoint={userPoint} compact showOverlay={false} />
          </button>
        </section>

        <div style={styles.homeIndicator} />
      </div>

      {isFullMapOpen ? (
        <div style={styles.fullMapOverlay}>
          <GasStatusBar style={styles.fullMapStatusBar} />
          <TrackingMapView routePath={routePath} userPoint={userPoint} showOverlay />
          <button type="button" style={styles.fullMapClose} onClick={() => setIsFullMapOpen(false)} aria-label="Close full tracking map">
            <BackChevronIcon />
          </button>
        </div>
      ) : null}
    </div>
  )
}

function TrackingMapView({
  routePath,
  userPoint,
  compact = false,
  showOverlay = true,
}: {
  routePath: [number, number][]
  userPoint: [number, number]
  compact?: boolean
  showOverlay?: boolean
}) {
  return (
    <div style={{ ...styles.mapFrame, ...(compact ? styles.mapFrameCompact : null) }}>
      <ShuttleMap
        showStopMarkers={false}
        initialCenter={FILLING_STATION_POINT}
        initialZoom={14.5}
        routeCoords={routePath}
        routeColor="#3F8CFF"
        dropPoints={[userPoint, FILLING_STATION_POINT]}
        dropPointIcons={[null, <GasStationMarker />]}
        riderPath={routePath}
        riderIcon={<GasRiderMarker />}
        riderDurationMs={14000}
        followRider
        riderFollowZoom={compact ? 15.9 : 16.7}
        riderFollowPitch={compact ? 42 : 52}
        riderFollowBearing
        busRoutes={[]}
      />
      <div style={styles.mapShade} />
      {showOverlay ? (
        <div style={{ ...styles.mapInfoPanel, ...(compact ? styles.mapInfoPanelCompact : null) }}>
          <div style={styles.mapInfoHead}>
            <div style={styles.mapCylinderWrap}>
              <MapCylinderIcon />
            </div>
            <div style={styles.mapInfoText}>
              <div style={styles.mapInfoTitle}>Rider Will Arrive In 5 Minutes</div>
              <div style={styles.mapInfoSubtitle}>Refill Completed</div>
            </div>
          </div>
          <div style={styles.mapRouteRow}>
            <MapStageDot active><MapScooterIcon /></MapStageDot>
            <div style={styles.mapRouteSolid} />
            <MapStageDot active><MapPumpIcon /></MapStageDot>
            <div style={styles.mapRouteDotted} />
            <MapStageDot><MapCheckIcon /></MapStageDot>
          </div>
          <div style={styles.mapPanelDivider} />
          <div style={styles.mapRiderRow}>
            <div style={styles.mapRiderAvatar}>
              <AvatarIcon />
            </div>
            <div style={styles.mapRiderText}>
              <div style={styles.mapRiderName}>Chris Arthur</div>
              <div style={styles.mapRiderPhone}>054 509 2105</div>
            </div>
            <div style={styles.mapRiderActions}>
              <MapGhostButton label="Call"><PhoneMiniIcon /></MapGhostButton>
              <MapGhostButton label="Message"><MessageMiniIcon /></MapGhostButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function createRoadRouteToUser(userPoint: [number, number]) {
  const [userLng, userLat] = userPoint
  const waypoints: [number, number][] = [
    FILLING_STATION_POINT,
    [-1.5718, 6.6751],
    [-1.5736, 6.6750],
    [-1.5750, 6.6747],
    [-1.5758, 6.6740],
    [-1.5759, 6.6732],
    [-1.5752, 6.6727],
    [-1.5742, 6.6725],
    [-1.5732, 6.6726],
    [-1.5724, 6.6729],
    [userLng, userLat],
  ]

  const path: [number, number][] = []
  waypoints.forEach((point, index) => {
    if (index === 0) {
      path.push(point)
      return
    }
    const prev = waypoints[index - 1]
    const steps = index === waypoints.length - 1 ? 28 : 16
    for (let step = 1; step <= steps; step += 1) {
      const t = step / steps
      path.push([
        prev[0] + (point[0] - prev[0]) * t,
        prev[1] + (point[1] - prev[1]) * t,
      ])
    }
  })
  return path
}

function TimelineRow({ step, isLast }: { step: TimelineStep; isLast: boolean }) {
  return (
    <div style={styles.timelineRow}>
      <div style={styles.timelineRail}>
        <div
          style={{
            ...styles.iconWrap,
            ...(step.iconStyle === 'solid' ? styles.iconWrapSolid : styles.iconWrapGhost),
          }}
        >
          {step.icon === 'scooter' && <ScooterIcon light={step.iconStyle === 'solid'} />}
          {step.icon === 'pump' && <PumpIcon light={step.iconStyle === 'solid'} />}
          {step.icon === 'check' && <CheckIcon light={step.iconStyle === 'solid'} />}
        </div>
        {!isLast && (
          <div style={styles.connectorTrack}>
            <div style={styles.connectorDashNeutral} />
            <div style={styles.connectorDashActive} />
          </div>
        )}
      </div>

      <div style={styles.timelineBody}>
        <div style={styles.timelineTitleRow}>
          <span style={styles.timelineTitle}>{step.title}</span>
          {step.subtitleTone === 'pill' && <span style={styles.statusPill}>{step.subtitle}</span>}
        </div>

        {step.subtitleTone !== 'pill' && (
          <span
            style={{
              ...styles.timelineSubtitle,
              ...(step.subtitleTone === 'success' ? styles.timelineSubtitleSuccess : styles.timelineSubtitleMuted),
            }}
          >
            {step.subtitle}
          </span>
        )}

        {typeof step.progress === 'number' && (
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${step.progress * 100}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function AvatarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#B9DFF7" />
      <circle cx="14" cy="12.3" r="5.1" fill="#E6B083" />
      <path d="M7.6 22.6c1.7-3.4 4.4-5.1 6.4-5.1 2 0 4.7 1.7 6.4 5.1" fill="#355271" />
      <path d="M9.4 10.2c1.1-3 3.8-4.8 6.8-4.8 2.1 0 3.8.8 4.8 2.1-.7.2-1.6.3-2.4.3-3.9 0-6.7-1.2-9.2 2.4Z" fill="#4D4D4D" />
      <path d="M9.6 14.5c.4 1 .9 1.8 1.8 2.4" stroke="#4D4D4D" strokeWidth="0.9" strokeLinecap="round" />
      <circle cx="12.2" cy="12.5" r="0.55" fill="#2F2F2F" />
      <circle cx="16" cy="12.5" r="0.55" fill="#2F2F2F" />
      <path d="M12.4 15.1c.6.4 1.5.4 2.1 0" stroke="#8D5839" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9Z"
        stroke="#7A7A7A"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#7A7A7A" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ScooterIcon({ light }: { light: boolean }) {
  const color = light ? '#FFFFFF' : '#111111'
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="17" r="2.3" stroke={color} strokeWidth="1.8" />
      <circle cx="18" cy="17" r="2.3" stroke={color} strokeWidth="1.8" />
      <path
        d="M8.4 17h5L16 11.5H10.6L8.7 7H5.7l1 3h1.7"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.4 11.5 15.1 13.2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function PumpIcon({ light }: { light: boolean }) {
  const color = light ? '#FFFFFF' : '#111111'
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M14.893 6.22 13.56 5.553c-.247-.12-.554-.027-.674.22-.127.253-.027.553.22.667l1.06.526V10.167l-2.5.006V3.333C11.667 2 10.773 1.333 9.667 1.333H4.333C3.227 1.333 2.333 2 2.333 3.333V14.167H1.333a.5.5 0 0 0 0 1h11.333a.5.5 0 0 0 0-1H11.667V11.173l3-.007c.28 0 .5-.226.5-.5V6.667a.5.5 0 0 0-.274-.447Z"
        fill={color}
      />
    </svg>
  )
}

function CheckIcon({ light }: { light: boolean }) {
  const color = light ? '#FFFFFF' : '#111111'
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6 9 17l-5-5"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BackChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M11.6667 15L6.66669 10L11.6667 5" stroke="#4F4F4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MapCylinderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9.7 3.5h4.6v2.1h1.1c.9 0 1.6.7 1.6 1.6v10.2c0 1.7-1.4 3.1-3.1 3.1h-3.8c-1.7 0-3.1-1.4-3.1-3.1V7.2c0-.9.7-1.6 1.6-1.6h1.1V3.5Z" fill="#1788F2"/>
      <path d="M10.8 2.6h2.4c.3 0 .5.2.5.5v1.7h-3.4V3.1c0-.3.2-.5.5-.5Z" fill="#7EC5FF"/>
      <path d="M9.4 8.2h5.2" stroke="#D9F0FF" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

function MapStageDot({ active = false, children }: { active?: boolean; children: ReactNode }) {
  return (
    <div style={{
      ...styles.mapStageDot,
      ...(active ? styles.mapStageDotActive : null),
    }}>
      {children}
    </div>
  )
}

function MapScooterIcon() {
  return <ScooterIcon light />
}

function MapPumpIcon() {
  return <PumpIcon light />
}

function MapCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M20 6 9 17l-5-5" stroke="#111111" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MapGhostButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} style={styles.mapGhostButton}>
      {children}
    </button>
  )
}

function PhoneMiniIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.55 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.44 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.41a16 16 0 0 0 6.68 6.68l1.78-1.78a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MessageMiniIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const styles: Record<string, CSSProperties> = {
  screen: {
    width: '100%',
    height: '100%',
    background: '#FFFFFF',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: 'hidden',
    position: 'relative',
  },
  statusBar: {
    top: 16,
    left: 16,
    right: 16,
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '58px 14px 10px',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '2px 2px 0',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    flexShrink: 0,
  },
  headerText: {
    minWidth: 0,
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    lineHeight: 1.2,
    fontWeight: 700,
    color: '#111111',
    marginBottom: 3,
  },
  headerSubtitle: {
    margin: 0,
    fontSize: 10.5,
    lineHeight: 1.35,
    color: '#767676',
  },
  bellButton: {
    width: 28,
    height: 28,
    border: 'none',
    background: 'transparent',
    display: 'grid',
    placeItems: 'center',
    padding: 0,
    flexShrink: 0,
  },
  section: {
    padding: '31px 2px 0',
  },
  sectionTitle: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.15,
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: '#111111',
  },
  sectionSubtitle: {
    margin: '5px 0 0',
    fontSize: 11.5,
    lineHeight: 1.3,
    color: '#757575',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    paddingTop: 22,
  },
  timelineRow: {
    display: 'flex',
    gap: 12,
    minHeight: 78,
  },
  timelineRail: {
    width: 38,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
  },
  iconWrapSolid: {
    background: '#070707',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  },
  iconWrapGhost: {
    background: '#FFFFFF',
    border: '1px dashed rgba(0,0,0,0.16)',
  },
  connectorTrack: {
    width: 10,
    flex: 1,
    marginTop: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  connectorDashNeutral: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.88) 0 26%, transparent 26% 38%, rgba(0,0,0,0.88) 38% 64%, transparent 64% 76%, rgba(0,0,0,0.88) 76% 100%)',
    opacity: 0.9,
  },
  connectorDashActive: {
    position: 'absolute',
    bottom: 0,
    width: 2,
    height: 22,
    backgroundImage: 'linear-gradient(to bottom, #2D7CFF 0 28%, transparent 28% 42%, #2D7CFF 42% 70%, transparent 70% 84%, #2D7CFF 84% 100%)',
  },
  timelineBody: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
  },
  timelineTitleRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  timelineTitle: {
    fontSize: 13,
    lineHeight: 1.25,
    fontWeight: 500,
    color: '#111111',
  },
  timelineSubtitle: {
    display: 'inline-block',
    fontSize: 11.5,
    lineHeight: 1.3,
    marginTop: 4,
  },
  timelineSubtitleSuccess: {
    color: '#7F8A7A',
  },
  timelineSubtitleMuted: {
    color: '#6F6F6F',
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 22,
    padding: '0 10px',
    borderRadius: 999,
    background: '#F7F9F4',
    color: '#7DC653',
    fontSize: 10.5,
    lineHeight: 1,
    fontWeight: 500,
  },
  progressTrack: {
    marginTop: 6,
    height: 7,
    width: '100%',
    borderRadius: 999,
    background: '#F0F0F0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    background: '#57BF21',
  },
  mapCard: {
    marginTop: 12,
    flex: 1,
    minHeight: 0,
    display: 'flex',
  },
  mapTapButton: {
    width: '100%',
    minHeight: 0,
    border: 'none',
    padding: 0,
    background: 'transparent',
    display: 'flex',
    cursor: 'pointer',
  },
  mapFrame: {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: 0,
    borderRadius: 28,
    overflow: 'hidden',
    background: '#EDF0EC',
  },
  mapFrameCompact: {
    borderRadius: 18,
  },
  mapShade: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 22%, rgba(65,135,224,0.10) 100%)',
  },
  mapInfoPanel: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 14,
    padding: '14px 16px 12px',
    borderRadius: 24,
    background: 'linear-gradient(135deg, rgba(142,175,214,0.92), rgba(183,197,214,0.88))',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    boxShadow: '0 18px 40px rgba(72,110,164,0.24)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  mapInfoPanelCompact: {
    left: 10,
    right: 10,
    bottom: 10,
    padding: '12px 12px 10px',
    borderRadius: 20,
    gap: 10,
  },
  mapInfoHead: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
  },
  mapCylinderWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.88)',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45)',
  },
  mapInfoText: {
    minWidth: 0,
    flex: 1,
  },
  mapInfoTitle: {
    fontSize: 17,
    fontWeight: 500,
    color: '#FFFFFF',
    letterSpacing: '-0.02em',
    lineHeight: 1.18,
  },
  mapInfoSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.72)',
  },
  mapRouteRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
  },
  mapStageDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(255,255,255,0.26)',
    border: '1px solid rgba(255,255,255,0.22)',
  },
  mapStageDotActive: {
    background: '#1788F2',
    border: 'none',
    boxShadow: '0 8px 18px rgba(23,136,242,0.24)',
  },
  mapRouteSolid: {
    flex: 1,
    height: 2,
    background: 'rgba(255,255,255,0.55)',
  },
  mapRouteDotted: {
    flex: 1,
    height: 0,
    borderTop: '2px dotted rgba(255,255,255,0.55)',
  },
  mapPanelDivider: {
    height: 1,
    background: 'rgba(255,255,255,0.28)',
  },
  mapRiderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  mapRiderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    flexShrink: 0,
  },
  mapRiderText: {
    minWidth: 0,
    flex: 1,
  },
  mapRiderName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#FFFFFF',
    lineHeight: 1.2,
  },
  mapRiderPhone: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.76)',
    marginTop: 2,
  },
  mapRiderActions: {
    display: 'flex',
    gap: 8,
    flexShrink: 0,
  },
  mapGhostButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    padding: 0,
  },
  fullMapOverlay: {
    position: 'absolute',
    inset: 0,
    background: '#FFFFFF',
    zIndex: 20,
    padding: '0 0 10px',
  },
  fullMapStatusBar: {
    top: 16,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  fullMapClose: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,0.35)',
    background: 'rgba(255,255,255,0.72)',
    display: 'grid',
    placeItems: 'center',
    padding: 0,
    cursor: 'pointer',
    zIndex: 3,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 999,
    background: '#111111',
    alignSelf: 'center',
    marginTop: 12,
    flexShrink: 0,
  },
}
