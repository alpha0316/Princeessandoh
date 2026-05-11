// KNUSTOverviewScreen — Frame 2 in the portfolio showcase.
// Shows the full KNUST campus with all 5 buses active and a compact live-stats overlay.
// Replaces the old SplashScreen in the portfolio flow.

import { useEffect, useState } from 'react'
import ShuttleMap from './ShuttleMap'
import { MOCK_ROUTES } from '../../../data/mockRoutes'
import { MOBILE_BOTTOM_SHEET_LAYOUT } from './bottomSheetStyles'

const CAMPUS_CENTER: [number, number] = [-1.571, 6.674]
const OVERVIEW_ZOOM = 14.4

export default function KNUSTOverviewScreen() {
  // Start focused on bus-3 (continuity from home widget), zoom out after 1.8s
  const [focusBus, setFocusBus] = useState<string | undefined>('bus-3')

  useEffect(() => {
    const t = setTimeout(() => setFocusBus(undefined), 1800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="shuttle-screen" style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Full-screen map */}
      <ShuttleMap
        busRoutes={MOCK_ROUTES}
        focusBusId={focusBus}
        focusZoom={16.2}
        focusDelayMs={0}
        initialCenter={CAMPUS_CENTER}
        initialZoom={OVERVIEW_ZOOM}
        skipRouteFitBounds={!!focusBus}
      />

      {/* Top status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '14px 16px 10px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, transparent 100%)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10,
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'white', letterSpacing: -0.2 }}>
          ShuttleApp
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.82)', fontWeight: 500 }}>Live</span>
      </div>

      {/* Bottom stats card */}
      <div style={{
        position: 'absolute',
        ...MOBILE_BOTTOM_SHEET_LAYOUT,
        background: 'rgba(18, 18, 18, 0.78)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        borderRadius: MOBILE_BOTTOM_SHEET_LAYOUT.borderRadius,
        padding: '14px 16px',
        zIndex: 10,
        display: 'flex', gap: 0,
      }}>
        {([
          { label: 'Active Buses', value: '5' },
          { label: 'Routes',       value: '3' },
          { label: 'On Campus',    value: '340+' },
        ] as const).map(({ label, value }, i) => (
          <div key={label} style={{
            flex: 1,
            borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.10)' : 'none',
            paddingLeft: i > 0 ? 14 : 0,
            marginLeft: i > 0 ? 14 : 0,
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'white', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 3, fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Live pulse dot */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        display: 'flex', alignItems: 'center', gap: 5,
        zIndex: 11,
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#34A853',
          boxShadow: '0 0 0 0 rgba(52,168,83,0.7)',
          animation: 'liveMapPulse 2s ease-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes liveMapPulse {
          0%   { box-shadow: 0 0 0 0 rgba(52,168,83,0.7); }
          70%  { box-shadow: 0 0 0 7px rgba(52,168,83,0); }
          100% { box-shadow: 0 0 0 0 rgba(52,168,83,0); }
        }
      `}</style>
    </div>
  )
}
