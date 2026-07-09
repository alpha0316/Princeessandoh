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
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  nx: 0.5,
  ny: 0.5,
  vx: 0,
  vy: 0,
  strength: 0,
  elementX: window.innerWidth / 2,
  elementY: window.innerHeight / 2,
}

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
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseleave', onLeave)
  return () => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseleave', onLeave)
  }
}

export function decayMouse() {
  mouse.strength *= 0.96
  mouse.vx *= 0.94
  mouse.vy *= 0.94
}
