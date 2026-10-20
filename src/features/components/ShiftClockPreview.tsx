import { useEffect, useRef, useState } from 'react'

// The shift runs 20:00 → 08:00, a 12-hour span. For the preview we compress
// that span into DEMO_CYCLE_MS of real time so the ring visibly sweeps and
// loops, rather than jumping between fixed snapshots.
const SHIFT_SECONDS = 12 * 60 * 60
const DEMO_CYCLE_MS = 36000
const TOTAL_TICKS = 72

const pad = (value: number) => String(value).padStart(2, '0')

const toneFor = (progress: number) => (progress < 100 / 3 ? 'alert' : progress < 200 / 3 ? 'warning' : 'active')

export default function ShiftClockPreview({ isPaused = false }: { isPaused?: boolean }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isShiftPaused, setIsShiftPaused] = useState(false)
  const frameRef = useRef<number>(0)
  const startRef = useRef<number | null>(null)
  const offsetRef = useRef(0)

  const frozen = isPaused || isShiftPaused

  useEffect(() => {
    if (frozen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      startRef.current = null
      return
    }

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const cycleMs = (now - startRef.current + offsetRef.current) % DEMO_CYCLE_MS
      const seconds = Math.floor((cycleMs / DEMO_CYCLE_MS) * SHIFT_SECONDS)
      setElapsedSeconds(seconds)
      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frameRef.current)
      if (startRef.current !== null) {
        offsetRef.current = (offsetRef.current + (performance.now() - startRef.current)) % DEMO_CYCLE_MS
      }
      startRef.current = null
    }
  }, [frozen])

  const progress = (elapsedSeconds / SHIFT_SECONDS) * 100
  const tone = toneFor(progress)
  const activeTicks = Math.round((progress / 100) * TOTAL_TICKS)

  const hours = Math.floor(elapsedSeconds / 3600)
  const minutes = Math.floor((elapsedSeconds % 3600) / 60)
  const seconds = elapsedSeconds % 60

  return (
    <div className={`shift-clock shift-clock--${tone}`} aria-label="Animated staff shift clock">
      <div className="shift-clock-head">
        <span className="shift-clock-eyebrow">TONIGHT’S SHIFT</span>
        <div className="shift-clock-role"><strong>Sleep-in</strong><span>·</span><span>Senior Carer</span></div>
        <span className="shift-clock-hours">20:00 – 08:00</span>
        <div className="shift-digital" aria-label={`Shift elapsed ${pad(hours)} hours ${pad(minutes)} minutes ${pad(seconds)} seconds`}>
          <span className="shift-watch-feet" aria-hidden="true" />
          <div className="shift-readout">
            <span>{pad(hours)}</span><i>:</i><span>{pad(minutes)}</span><i>:</i><span>{pad(seconds)}</span>
          </div>
        </div>
      </div>

      <div className="shift-clock-main">
        <div className="shift-progress" role="img" aria-label={`${Math.round(progress)}% of shift complete`}>
          <svg viewBox="0 0 220 220" aria-hidden="true">
            <circle className="shift-progress-track" cx="110" cy="110" r="92" />
            <g>
              {Array.from({ length: TOTAL_TICKS }, (_, index) => (
                <line
                  key={index}
                  className={index < activeTicks ? 'is-lit' : ''}
                  x1="110" y1="6" x2="110" y2="18"
                  transform={`rotate(${index * (360 / TOTAL_TICKS)} 110 110)`}
                />
              ))}
            </g>
          </svg>
          <button
            className={`shift-pause${isShiftPaused ? ' is-paused' : ''}`}
            type="button"
            aria-label={isShiftPaused ? 'Continue shift clock' : 'Pause shift clock'}
            aria-pressed={isShiftPaused}
            onClick={() => setIsShiftPaused((paused) => !paused)}
          ><i /><i /></button>
        </div>
      </div>

      <div className="shift-clock-foot">
        <svg className="shift-alarm-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M5 2.25 3.6 1.2M11 2.25l1.4-1.05M8 1.7v1.1M4.1 4.2 3 3.1M11.9 4.2 13 3.1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <circle cx="8" cy="9" r="5.4" stroke="currentColor" strokeWidth="1" />
          <path d="M8 5.8v3.4l2 1.1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Clock Out</span>
      </div>
    </div>
  )
}
