// HomeShowcaseFrame — first phone on the portfolio home page.
//
// Flow (loops):
//   home    (5 000 ms) — static iOS home screen with live widget
//   tapping   (700 ms) — widget-tap ripple + white sweep
//   overview (7 000 ms) — KNUSTOverviewScreen, focused on bus-3 then zooms out
//
// Nothing inside HomeScreen.tsx or KNUSTOverviewScreen.tsx is modified.

import { useEffect, useState } from 'react'
import HomeScreen from './HomeScreen'
import TrackingShowcaseScreen from './TrackingShowcaseScreen'

type Phase = 'home' | 'tapping' | 'overview'

const HOME_MS     = 5_000
const TAP_MS      = 700
const OVERVIEW_MS = 7_000

const KEYFRAMES = `
  @keyframes widgetTapRipple {
    0%   { transform: scale(1);    opacity: 0.55; }
    60%  { transform: scale(1.06); opacity: 0.25; }
    100% { transform: scale(1.12); opacity: 0; }
  }
  @keyframes widgetTapDim {
    0%   { opacity: 0; }
    15%  { opacity: 0.18; }
    100% { opacity: 0; }
  }
  @keyframes homeToApp {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }
`

export default function HomeShowcaseFrame() {
  const [phase, setPhase] = useState<Phase>('home')

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>

    if (phase === 'home') {
      t = setTimeout(() => setPhase('tapping'), HOME_MS)
    } else if (phase === 'tapping') {
      t = setTimeout(() => setPhase('overview'), TAP_MS)
    } else {
      // overview — loop back after OVERVIEW_MS
      t = setTimeout(() => setPhase('home'), OVERVIEW_MS)
    }

    return () => clearTimeout(t)
  }, [phase])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <style>{KEYFRAMES}</style>

      {/* ── Home screen (always mounted during home + tapping so widget keeps running) ── */}
      {phase !== 'overview' && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <HomeScreen shuttleTapping={false} />
        </div>
      )}

      {/* ── Widget-tap overlay: ripple centred on the 2×2 widget (top-left of grid) ── */}
      {phase === 'tapping' && (
        <>
          {/* dark flash over widget area */}
          <div style={{
            position: 'absolute',
            top: '9%', left: '3%',
            width: '50%', height: '36%',
            borderRadius: 22,
            background: 'rgba(0,0,0,0.22)',
            animation: 'widgetTapDim 0.5s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 12,
          }} />

          {/* expanding ripple ring */}
          <div style={{
            position: 'absolute',
            top: '9%', left: '3%',
            width: '50%', height: '36%',
            borderRadius: 22,
            border: '2px solid rgba(255,255,255,0.6)',
            animation: 'widgetTapRipple 0.5s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 13,
          }} />

          {/* white sweep — bridges to overview */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'white',
            opacity: 0,
            animation: 'homeToApp 0.28s ease-in 0.38s forwards',
            pointerEvents: 'none',
            zIndex: 20,
          }} />
        </>
      )}

      {/* ── Tracking view (mounted fresh each cycle so map re-initialises) ── */}
      {phase === 'overview' && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <TrackingShowcaseScreen />
        </div>
      )}
    </div>
  )
}
