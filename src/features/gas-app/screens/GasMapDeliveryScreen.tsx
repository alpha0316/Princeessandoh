import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import ShuttleMap from '../../shuttle/screens/ShuttleMap'
import GasStatusBar from '../components/GasStatusBar'

const DEFAULT_CENTER: [number, number] = [-1.5719, 6.6735]

export default function GasMapDeliveryScreen() {
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setCenter([pos.coords.latitude, pos.coords.longitude]),
      () => {},
    )
  }, [])

  return (
    <div style={s.screen}>
      <GasStatusBar style={s.statusBar} />

      {/* Full-screen map */}
      <div style={s.mapFill}>
        <ShuttleMap
          initialCenter={center}
          initialZoom={14.5}
          flyToCoord={center}
          flyToZoom={14.5}
          dropPoints={[center]}
          busRoutes={[]}
        />
        <div style={s.mapGradient} />
      </div>

      {/* Bottom widget overlay */}
      <div style={s.widget}>
        <div style={s.handle} />

        <div style={s.statusChip}>
          <span style={s.statusDot} />
          <span style={s.statusLabel}>Rider On The Way</span>
        </div>

        <p style={s.title}>Rider Will Arrive In 5 Minutes</p>

        <div style={s.progressDots}>
          <span style={{ ...s.dot, ...s.dotFilled }} />
          <span style={{ ...s.dot, ...s.dotFilled }} />
          <span style={{ ...s.dot, ...s.dotEmpty }} />
        </div>

        <div style={s.divider} />

        <div style={s.driverRow}>
          <div style={s.driverAvatar}>
            <DriverAvatarIcon />
          </div>
          <div style={s.driverInfo}>
            <div style={s.driverName}>Chris Arthur</div>
            <div style={s.driverPhone}>054 509 2105</div>
          </div>
          <div style={s.driverActions}>
            <button type="button" style={s.actionBtn} aria-label="Call driver">
              <PhoneIcon />
            </button>
            <button type="button" style={s.actionBtn} aria-label="Message driver">
              <MessageIcon />
            </button>
          </div>
        </div>

        <div style={s.homeIndicator} />
      </div>
    </div>
  )
}

function DriverAvatarIcon() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
      <circle cx="20" cy="20" r="20" fill="#2563EB" />
      <circle cx="20" cy="15" r="7" fill="rgba(255,255,255,0.85)" />
      <ellipse cx="20" cy="34" rx="12" ry="9" fill="rgba(255,255,255,0.85)" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.55 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.44 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.41a16 16 0 0 0 6.68 6.68l1.78-1.78a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MessageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const s: Record<string, CSSProperties> = {
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
  mapFill: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
  },
  mapGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    pointerEvents: 'none',
    background: 'linear-gradient(0deg, rgba(255,255,255,1) 30%, rgba(255,255,255,0) 100%)',
    zIndex: 1,
  },
  widget: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    padding: '0 16px 0',
    background: 'rgba(255,255,255,0.96)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '24px 24px 0 0',
    borderTop: '1px solid rgba(0,0,0,0.06)',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    background: 'rgba(0,0,0,0.14)',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 14,
    flexShrink: 0,
  },
  statusChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px 4px 8px',
    borderRadius: 999,
    background: '#EEF6E8',
    width: 'fit-content',
    marginBottom: 10,
  },
  statusDot: {
    display: 'block',
    width: 7,
    height: 7,
    borderRadius: 999,
    background: '#57BF21',
    flexShrink: 0,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#3B7D14',
    lineHeight: 1,
  },
  title: {
    margin: '0 0 10px',
    fontSize: 16,
    fontWeight: 700,
    color: '#111111',
    lineHeight: 1.3,
    letterSpacing: '-0.02em',
  },
  progressDots: {
    display: 'flex',
    gap: 5,
    marginBottom: 14,
  },
  dot: {
    display: 'block',
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  dotFilled: {
    background: '#2563EB',
  },
  dotEmpty: {
    background: '#E0E0E0',
  },
  divider: {
    height: 1,
    background: 'rgba(0,0,0,0.07)',
    marginBottom: 14,
  },
  driverRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    flexShrink: 0,
  },
  driverInfo: {
    flex: 1,
    minWidth: 0,
  },
  driverName: {
    fontSize: 13,
    fontWeight: 700,
    color: '#111111',
    lineHeight: 1.2,
  },
  driverPhone: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 1,
  },
  driverActions: {
    display: 'flex',
    gap: 8,
    flexShrink: 0,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: '#2563EB',
    border: 'none',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 999,
    background: '#111111',
    alignSelf: 'center',
    marginBottom: 8,
    flexShrink: 0,
  },
}
