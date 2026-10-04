import { useRef, type CSSProperties, type ReactNode } from 'react'

const MAX_TILT = 14
const SHADOW_REACH = 26

export default function TiltCard({
  className = '',
  style,
  children,
}: {
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    const angle = (Math.atan2(py, px) * 180) / Math.PI

    el.style.setProperty('--tilt-x', `${(-py * MAX_TILT * 2).toFixed(2)}deg`)
    el.style.setProperty('--tilt-y', `${(px * MAX_TILT * 2).toFixed(2)}deg`)
    el.style.setProperty('--shadow-x', `${(-px * SHADOW_REACH).toFixed(1)}px`)
    el.style.setProperty('--shadow-y', `${(-py * SHADOW_REACH + SHADOW_REACH * 0.5).toFixed(1)}px`)
    el.style.setProperty('--glow-x', `${((px + 0.5) * 100).toFixed(1)}%`)
    el.style.setProperty('--glow-y', `${((py + 0.5) * 100).toFixed(1)}%`)
    el.style.setProperty('--glow-angle', `${angle.toFixed(1)}deg`)
    el.style.setProperty('--glow-opacity', '1')
  }

  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
    el.style.setProperty('--shadow-x', '0px')
    el.style.setProperty('--shadow-y', `${SHADOW_REACH * 0.5}px`)
    el.style.setProperty('--glow-opacity', '0')
  }

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="tilt-card-inner">
        {children}
        <div className="tilt-card-stroke" aria-hidden="true" />
        <div className="tilt-card-shine" aria-hidden="true" />
      </div>
    </div>
  )
}
