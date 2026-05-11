import { useEffect, useRef, useState } from 'react'
import SelectCylinderScreen from './SelectCylinderScreen'
import AmountScreen from './AmountScreen'

// ── Phase machine ─────────────────────────────────────────────────────────────
// cylinder → scroll-summary → hold → nav-out → amount → (loop)

type PhaseId = 'cylinder' | 'scroll-summary' | 'hold' | 'nav-out' | 'amount'

const PHASES: Array<{ id: PhaseId; dur: number; scrollTo?: number }> = [
  { id: 'cylinder',       dur: 1500 },
  { id: 'scroll-summary', dur: 1400, scrollTo: 320 },
  { id: 'hold',           dur: 1200 },
  { id: 'nav-out',        dur: 340 },
  { id: 'amount',         dur: 6000 },
]

const ANIM_CSS = `
  @keyframes gasCylSlideInRight {
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
  }
`

export default function GasCylinderToAmountSimulation() {
  const [phaseId, setPhaseId] = useState<PhaseId>('cylinder')
  const [cycle, setCycle] = useState(0)
  const cylScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let idx = 0
    let timeout: number
    let raf: number | undefined

    const animateScroll = (target: number, dur: number) => {
      if (!cylScrollRef.current) return
      if (raf !== undefined) cancelAnimationFrame(raf)
      const el = cylScrollRef.current
      const start = el.scrollTop
      const dist = target - start
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min((t - t0) / dur, 1)
        const e = -(Math.cos(Math.PI * p) - 1) / 2
        el.scrollTop = start + dist * e
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const advance = () => {
      const phaseIdx = idx % PHASES.length
      const phase = PHASES[phaseIdx]

      if (phaseIdx === 0) {
        setCycle(c => c + 1)
        if (cylScrollRef.current) cylScrollRef.current.scrollTop = 0
      }

      setPhaseId(phase.id)
      if (phase.scrollTo !== undefined) animateScroll(phase.scrollTo, phase.dur)

      idx++
      timeout = window.setTimeout(advance, phase.dur)
    }

    advance()
    return () => {
      clearTimeout(timeout)
      if (raf !== undefined) cancelAnimationFrame(raf)
    }
  }, [])

  const onCylinder =
    phaseId === 'cylinder' ||
    phaseId === 'scroll-summary' ||
    phaseId === 'hold' ||
    phaseId === 'nav-out'

  const onAmount = phaseId === 'amount'

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <style>{ANIM_CSS}</style>

      {/* Cylinder selection layer */}
      {onCylinder && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: phaseId === 'nav-out' ? 'translateX(-100%)' : 'none',
            transition: phaseId === 'nav-out' ? 'transform 330ms cubic-bezier(0.4,0,0.6,1)' : 'none',
          }}
        >
          <SelectCylinderScreen
            key={cycle}
            ref={cylScrollRef}
            offerName="Regular Offer"
            offerPrice={10}
            simulateSelectId="2"
          />
        </div>
      )}

      {/* Amount layer */}
      {onAmount && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            animation: 'gasCylSlideInRight 330ms cubic-bezier(0.0,0,0.2,1)',
          }}
        >
          <AmountScreen
            offerName="Regular Offer"
            offerPrice={10}
            cylinderName="Medium Size"
            cylinderPrice={5}
            autoSlide
          />
        </div>
      )}
    </div>
  )
}

export function GasAmountAutoSlide() {
  return (
    <AmountScreen
      offerName="Regular Offer"
      offerPrice={10}
      cylinderName="Medium Size"
      cylinderPrice={5}
      autoSlide
    />
  )
}

// ── Select-cylinder simulation ─────────────────────────────────────────────────
// Cycles: select Small → scroll down → scroll up → select Medium → scroll down → scroll up → loop

type SelPhaseId =
  | 'init'
  | 'select-1'
  | 'hold-1'
  | 'scroll-dn-1'
  | 'hold-dn-1'
  | 'scroll-up-1'
  | 'gap'
  | 'select-2'
  | 'hold-2'
  | 'scroll-dn-2'
  | 'hold-dn-2'
  | 'scroll-up-2'

const SEL_PHASES: Array<{ id: SelPhaseId; dur: number; scrollTo?: number }> = [
  { id: 'init',        dur: 700 },
  { id: 'select-1',    dur: 500 },
  { id: 'hold-1',      dur: 900 },
  { id: 'scroll-dn-1', dur: 1100, scrollTo: 360 },
  { id: 'hold-dn-1',   dur: 1000 },
  { id: 'scroll-up-1', dur: 1000, scrollTo: 0 },
  { id: 'gap',         dur: 500 },
  { id: 'select-2',    dur: 500 },
  { id: 'hold-2',      dur: 900 },
  { id: 'scroll-dn-2', dur: 1100, scrollTo: 360 },
  { id: 'hold-dn-2',   dur: 1000 },
  { id: 'scroll-up-2', dur: 1000, scrollTo: 0 },
]

export function GasCylinderSelectSimulation() {
  const [phaseId, setPhaseId] = useState<SelPhaseId>('init')
  const [cycle, setCycle] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let idx = 0
    let timeout: number
    let raf: number | undefined

    const animateScroll = (target: number, dur: number) => {
      if (!scrollRef.current) return
      if (raf !== undefined) cancelAnimationFrame(raf)
      const el = scrollRef.current
      const start = el.scrollTop
      const dist = target - start
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min((t - t0) / dur, 1)
        const e = -(Math.cos(Math.PI * p) - 1) / 2
        el.scrollTop = start + dist * e
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const advance = () => {
      const phaseIdx = idx % SEL_PHASES.length
      const phase = SEL_PHASES[phaseIdx]

      if (phaseIdx === 0) {
        setCycle(c => c + 1)
        if (scrollRef.current) scrollRef.current.scrollTop = 0
      }

      setPhaseId(phase.id)
      if (phase.scrollTo !== undefined) animateScroll(phase.scrollTo, phase.dur)

      idx++
      timeout = window.setTimeout(advance, phase.dur)
    }

    advance()
    return () => {
      clearTimeout(timeout)
      if (raf !== undefined) cancelAnimationFrame(raf)
    }
  }, [])

  const controlledId =
    phaseId === 'select-1' || phaseId === 'hold-1' || phaseId === 'scroll-dn-1' || phaseId === 'hold-dn-1' || phaseId === 'scroll-up-1'
      ? '1'
      : phaseId === 'select-2' || phaseId === 'hold-2' || phaseId === 'scroll-dn-2' || phaseId === 'hold-dn-2' || phaseId === 'scroll-up-2'
        ? '2'
        : null

  return (
    <SelectCylinderScreen
      key={cycle}
      ref={scrollRef}
      offerName="Regular Offer"
      offerPrice={10}
      controlledSelectedId={controlledId}
    />
  )
}
