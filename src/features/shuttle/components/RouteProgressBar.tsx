import type { ReactNode } from 'react'

type Props = {
  progress: number
  fromLabel: string
  toLabel: string
  gradient: string
  busIcon?: ReactNode
}

export function RouteProgressBar({ progress, fromLabel, toLabel, gradient, busIcon }: Props) {
  const markerLeft = Math.min(Math.max(progress, 4), 92)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '2px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#1F2937', maxWidth: '48%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {fromLabel}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#1F2937', maxWidth: '48%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>
          {toLabel}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: '#9CA3AF', whiteSpace: 'nowrap' }}>Start</span>
        <div style={{ flex: 1, height: 4, borderRadius: 999, background: '#E5E7EB', position: 'relative', overflow: 'visible' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${progress}%`,
            borderRadius: 999,
            background: gradient,
            transition: 'width 80ms linear',
          }} />
          {busIcon && progress > 1 && (
            <div style={{
              position: 'absolute',
              left: `${markerLeft}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              // width: 36, height: 20, borderRadius: 999,
              // background: 'white',
              // border: '1px solid #E5E7EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              // boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
              transition: 'left 80ms linear',
            }}>
              {busIcon}
            </div>
          )}
        </div>
        <span style={{ fontSize: 10, color: '#9CA3AF', whiteSpace: 'nowrap' }}>Arriving</span>
      </div>
    </div>
  )
}
