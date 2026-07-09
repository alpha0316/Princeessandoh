export type MouseState = {
  x: number
  y: number
  nx: number
  ny: number
  vx: number
  vy: number
  strength: number
  elementX: number
  elementY: number
}

export const mouse: MouseState = {
  x: typeof window !== 'undefined' ? window.innerWidth / 2 : 400,
  y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
  nx: 0.5,
  ny: 0.5,
  vx: 0,
  vy: 0,
  strength: 0,
  elementX: typeof window !== 'undefined' ? window.innerWidth / 2 : 400,
  elementY: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
}

let tiltX = 0
let tiltY = 0

export function initMouseTracking() {
  const onMove = (e: MouseEvent) => {
    const nx = e.clientX / window.innerWidth
    const ny = e.clientY / window.innerHeight
    const dx = (nx - mouse.nx) * 15
    const dy = (ny - mouse.ny) * 15
    mouse.vx += dx
    mouse.vy += dy
    mouse.vx = Math.max(-1.5, Math.min(1.5, mouse.vx))
    mouse.vy = Math.max(-1.5, Math.min(1.5, mouse.vy))
    mouse.nx = nx
    mouse.ny = ny
    mouse.x = e.clientX
    mouse.y = e.clientY
    mouse.elementX = e.clientX
    mouse.elementY = e.clientY
    mouse.strength = Math.min(1, mouse.strength + 0.3)
  }
  const onLeave = () => {
    mouse.strength = 0
  }

  const onOrientation = (e: DeviceOrientationEvent) => {
    const g = e.gamma ?? 0
    const b = e.beta ?? 0
    const dx = ((g - tiltX) / 90) * 3
    const dy = ((b - tiltY) / 90) * 3
    tiltX = g
    tiltY = b
    mouse.vx += dx
    mouse.vy += dy
    mouse.vx = Math.max(-0.8, Math.min(0.8, mouse.vx))
    mouse.vy = Math.max(-0.8, Math.min(0.8, mouse.vy))
    mouse.nx = 0.5 + g / 180
    mouse.ny = 0.5 + b / 360
    mouse.strength = Math.min(1, mouse.strength + 0.3)
  }

  // ── Shake detection ─────────────────────────────────────────────
  let lastShake = 0
  let shakeCount = 0
  const SHAKE_THRESHOLD = 24
  const SHAKE_COOLDOWN = 1500

  const onMotion = (e: DeviceMotionEvent) => {
    const a = e.accelerationIncludingGravity
    if (!a || a.x === null || a.y === null || a.z === null) return
    const total = Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z)
    const now = Date.now()

    if (total > SHAKE_THRESHOLD && now - lastShake > 250) {
      lastShake = now
      shakeCount++
      if (shakeCount >= 2) {
        shakeCount = 0
        mouse.vx += (Math.random() - 0.5) * 1.5
        mouse.vy += (Math.random() - 0.5) * 1.5
        mouse.strength = 0.8
      }
    } else if (now - lastShake > SHAKE_COOLDOWN) {
      shakeCount = 0
    }
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseleave', onLeave)
  window.addEventListener('deviceorientation', onOrientation)
  window.addEventListener('devicemotion', onMotion)

  return () => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseleave', onLeave)
    window.removeEventListener('deviceorientation', onOrientation)
    window.removeEventListener('devicemotion', onMotion)
  }
}

export function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
    return (DeviceOrientationEvent as any).requestPermission()
  }
  return Promise.resolve('granted')
}

export function decayMouse() {
  mouse.strength *= 0.96
  mouse.vx *= 0.94
  mouse.vy *= 0.94
}
