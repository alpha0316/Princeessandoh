// The cursor's position over any card broadcasts here; every card in the
// grid (any row, any column) reads this to time a traveling ripple that
// reaches it after a delay proportional to its 2D distance from that point,
// so the wave visibly spreads outward in every direction, not just sideways
// along a row.
export type RippleEvent = { x: number; y: number; time: number }

export const rippleStore: { event: RippleEvent | null } = { event: null }

let lastCall = 0
const MIN_INTERVAL = 45 // ms — throttles mousemove-driven triggers

export function triggerRipple(x: number, y: number) {
  const now = performance.now()
  if (now - lastCall < MIN_INTERVAL) return
  lastCall = now
  rippleStore.event = { x, y, time: now }
}
