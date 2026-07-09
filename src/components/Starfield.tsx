import { useEffect, useRef } from 'react'

type Star = {
  x: number
  y: number
  r: number
  opacity: number
  twinkleSpeed: number
  twinklePhase: number
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    let stars: Star[] = []
    let id: number

    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      stars = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.4 + Math.random() * 1.6,
        opacity: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.005 + Math.random() * 0.025,
        twinklePhase: Math.random() * Math.PI * 2,
      }))
    }
    init()
    window.addEventListener('resize', init)

    const loop = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const t = now * 0.001

      for (const s of stars) {
        const alpha = s.opacity * (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed * 60 + s.twinklePhase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()
      }

      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', init)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        width: '100%', height: '100%', display: 'block',
      }}
    />
  )
}
