import { useEffect, useRef, type RefObject } from 'react'
import { mouse } from '../stores/mouse'
import { rippleStore } from '../stores/cardRipple'

// Draws the wavy silhouette as a visible SVG stroke that hugs the card's
// edge, rather than clip-path'ing the card itself. A clip-path cut only
// shows up where it exposes something visually different behind it — on a
// white card sitting on a white page that's nothing, so the effect was
// invisible. A drawn stroke is visible regardless of what's behind the
// card, and keeps the screenshot content itself undistorted and legible.
const SEGMENTS_PER_EDGE = 15 // 60 points around the rectangle — enough to resolve WAVE_FREQ smoothly
const WAVE_FREQ = 7 // notches per full lap of the perimeter — broad, liquid swells rather than a scalloped/torn edge
// Amplitudes are a fraction of the card's own (smaller) dimension, so the
// wobble reads the same on a small mobile-mockup card and a large web card,
// and stays at the same relative "viscosity" as the main FluidBackground.
const IDLE_PCT = 0.025 // ~2-5% ambient wobble, always on, matching the background's idle drift
const HOVER_PCT = 0.09 // clearly livelier under the cursor — safe to push further since content is untouched
const RIPPLE_PCT = 0.06
const SPEED_PCT = 0.02 // extra wobble added per unit of cursor speed (capped below)
const RIPPLE_SPEED = 1.1 // px/ms the wave travels across the row
const RIPPLE_DURATION = 650 // ms the bump takes to pass through a given card
const EASE = 0.08

function buildWavyPath(w: number, h: number, amp: number, t: number, dirAngle: number) {
  const total = SEGMENTS_PER_EDGE * 4
  const pts: [number, number][] = new Array(total)

  for (let k = 0; k < total; k++) {
    const edge = Math.floor(k / SEGMENTS_PER_EDGE)
    const p = (k % SEGMENTS_PER_EDGE) / SEGMENTS_PER_EDGE
    let x = 0
    let y = 0
    let nx = 0
    let ny = 0
    if (edge === 0) {
      x = w * p
      y = 0
      ny = -1
    } else if (edge === 1) {
      x = w
      y = h * p
      nx = 1
    } else if (edge === 2) {
      x = w - w * p
      y = h
      ny = 1
    } else {
      x = 0
      y = h - h * p
      nx = -1
    }

    const angle = (k / total) * Math.PI * 2
    // Bulges in both directions around the resting edge (not just inward),
    // so the line reads as the edge itself rippling rather than a one-sided
    // notch.
    const wave = Math.sin(angle * WAVE_FREQ + t)
    const dirPull = Math.max(0, Math.cos(angle - dirAngle))
    const depth = amp * wave * (0.55 + 0.45 * dirPull)
    pts[k] = [x - nx * depth, y - ny * depth]
  }

  const n = pts.length
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} `
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6
    d += `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `
  }
  return d + 'Z'
}

/**
 * Animates an SVG `<path>`'s `d` attribute into a wavy outline that tracks
 * `elementRef`'s box size — used as an edge-hugging stroke overlay on top
 * of a card. `active` (hover) raises the amplitude; cursor speed/direction
 * and the shared ripple store both feed in too.
 */
export function useWavyClipPath(
  active: boolean,
  elementRef: RefObject<HTMLElement | null>,
  pathRef: RefObject<SVGPathElement | null>,
) {
  const state = useRef({ t: Math.random() * 1000, amp: 0, dirAngle: 0 })

  useEffect(() => {
    let raf: number

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const el = elementRef.current
      const path = pathRef.current
      if (!el || !path) return
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const s = state.current
      const minDim = Math.min(rect.width, rect.height)
      const speed = Math.min(Math.hypot(mouse.vx, mouse.vy), 1.5)
      s.t += 0.009 + speed * 0.01

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      let ripple = 0
      const evt = rippleStore.event
      if (evt) {
        const distance = Math.hypot(centerX - evt.x, centerY - evt.y)
        const delay = distance / RIPPLE_SPEED
        const elapsed = performance.now() - evt.time - delay
        if (elapsed >= 0 && elapsed <= RIPPLE_DURATION) {
          ripple = RIPPLE_PCT * minDim * Math.sin((Math.PI * elapsed) / RIPPLE_DURATION)
        }
      }

      const basePct = active ? HOVER_PCT : IDLE_PCT
      const target = basePct * minDim + speed * SPEED_PCT * minDim + Math.abs(ripple)
      s.amp += (target - s.amp) * EASE

      if (speed > 0.05) {
        s.dirAngle = Math.atan2(mouse.vy, mouse.vx)
      } else {
        s.dirAngle = Math.atan2(mouse.y - centerY, mouse.x - centerX)
      }

      path.setAttribute('d', buildWavyPath(rect.width, rect.height, s.amp, s.t, s.dirAngle))
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, elementRef, pathRef])
}
