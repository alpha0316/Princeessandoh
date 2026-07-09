import { useEffect, useRef } from 'react'

export type Weather = 'sunny' | 'cloudy' | 'rain' | 'snow'

type Drop = {
  x: number
  y: number
  len: number
  speed: number
  opacity: number
}

type Flake = {
  x: number
  y: number
  r: number
  speed: number
  wind: number
  wobble: number
  wobbleSpeed: number
  opacity: number
}

function createRain(width: number, height: number): Drop[] {
  return Array.from({ length: 250 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height * -1,
    len: 14 + Math.random() * 18,
    speed: 6 + Math.random() * 8,
    opacity: 0.3 + Math.random() * 0.5,
  }))
}

function createSnow(width: number, height: number): Flake[] {
  return Array.from({ length: 100 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height * -1,
    r: 1.5 + Math.random() * 3,
    speed: 0.6 + Math.random() * 1.2,
    wind: -0.3 + Math.random() * 0.6,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.01 + Math.random() * 0.02,
    opacity: 0.3 + Math.random() * 0.5,
  }))
}

export default function WeatherOverlay({ weather }: { weather: Weather }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    if (weather === 'sunny' || weather === 'cloudy') return

    const ctx = canvas.getContext('2d')!
    let drops = createRain(canvas.width, canvas.height)
    let flakes = createSnow(canvas.width, canvas.height)
    let id: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (weather === 'rain') drops = createRain(canvas.width, canvas.height)
      if (weather === 'snow') flakes = createSnow(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (weather === 'rain') {
        // Foreground drops
        for (const d of drops) {
          d.y += d.speed
          d.x -= 0.5
          if (d.y > canvas.height + d.len) { d.y = -d.len; d.x = Math.random() * canvas.width }
          ctx.beginPath()
          ctx.moveTo(d.x, d.y)
          ctx.lineTo(d.x - 1, d.y + d.len)
          ctx.strokeStyle = `rgba(160,185,220,${d.opacity})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
        // Background mist layer
        ctx.fillStyle = 'rgba(160,185,220,0.04)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      if (weather === 'snow') {
        for (const f of flakes) {
          f.wobble += f.wobbleSpeed
          f.y += f.speed
          f.x += f.wind + Math.sin(f.wobble) * 0.4
          if (f.y > canvas.height + f.r) { f.y = -f.r; f.x = Math.random() * canvas.width }
          ctx.beginPath()
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${f.opacity})`
          ctx.fill()
        }
      }

      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', resize)
    }
  }, [weather])

  // Sunny: warm gradient overlay
  if (weather === 'sunny') {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(circle at 30% 20%, rgba(255,220,150,0.15) 0%, rgba(255,200,100,0.05) 40%, transparent 70%)',
      }}>
        <div style={{
          position: 'absolute', top: '8%', left: '22%',
          width: 120, height: 120, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,230,150,0.25) 0%, rgba(255,200,100,0.1) 40%, transparent 70%)',
          boxShadow: '0 0 80px 40px rgba(255,200,100,0.12)',
        }} />
      </div>
    )
  }

  // Cloudy: soft grey gradient overlay
  if (weather === 'cloudy') {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(200,210,220,0.2) 0%, rgba(180,190,200,0.1) 50%, rgba(160,170,180,0.05) 100%)',
      }}>
        {[
          { top: '12%', left: '15%', w: 200, h: 60, o: 0.25 },
          { top: '25%', left: '55%', w: 260, h: 70, o: 0.2 },
          { top: '8%', left: '65%', w: 180, h: 50, o: 0.18 },
          { top: '30%', left: '30%', w: 160, h: 45, o: 0.15 },
        ].map((cloud, i) => (
          <div key={i} style={{
            position: 'absolute', top: cloud.top, left: cloud.left,
            width: cloud.w, height: cloud.h, borderRadius: '50%',
            background: `rgba(220,225,235,${cloud.o})`,
            filter: 'blur(20px)',
          }} />
        ))}
      </div>
    )
  }

  // Rain/Snow: canvas
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        width: '100%', height: '100%', display: 'block',
      }}
    />
  )
}
