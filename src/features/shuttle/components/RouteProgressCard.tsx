import { TrackingModalBusIcon } from './TrackingModalBusIcon'

type Props = {
  dark?: boolean
  fromCity?: string
  fromSub?: string
  toCity?: string
  toSub?: string
  startTime?: string
  arrivingTime?: string
  progress?: number
}

export function RouteProgressCard({
  dark = false,
  fromCity = 'Brunei',
  fromSub = 'Campus',
  toCity = 'KSB',
  toSub = 'Campus',
  startTime = '8:31 AM',
  arrivingTime = '8:45 AM',
  progress = 32,
}: Props) {
  const bg = dark ? '#111111' : '#FFFFFF'
  const border = dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)'
  const shadow = dark ? '0 4px 24px rgba(0,0,0,0.5)' : '0 4px 24px rgba(0,0,0,0.08)'
  const cityColor = dark ? '#FFFFFF' : '#111111'
  const subColor = dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.42)'
  const labelColor = dark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)'
  const timeColor = dark ? '#FFFFFF' : '#111111'
  const trackBg = dark ? 'rgba(255,255,255,0.12)' : '#E5E7EB'

  const clampedProgress = Math.min(Math.max(progress, 4), 88)

  return (
    <div style={{
      background: bg,
      border,
      borderRadius: 20,
      boxShadow: shadow,
      padding: '18px 20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* City labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: cityColor, lineHeight: 1.2 }}>{fromCity}</p>
          <p style={{ margin: 0, fontSize: 12, color: subColor, marginTop: 2 }}>{fromSub}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: cityColor, lineHeight: 1.2 }}>{toCity}</p>
          <p style={{ margin: 0, fontSize: 12, color: subColor, marginTop: 2 }}>{toSub}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative', height: 20 }}>
        <div style={{ flex: 1, height: 4, borderRadius: 999, background: trackBg, position: 'relative' }}>
          {/* Filled portion */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${progress}%`,
            borderRadius: 999,
            background: '#34A853',
          }} />
          {/* Bus icon marker */}
          <div style={{
            position: 'absolute',
            left: `${clampedProgress}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TrackingModalBusIcon width={48} height={30} />
          </div>
        </div>
      </div>

      {/* Time row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: labelColor }}>Start</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: timeColor }}>{startTime}</span>
        </div>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: labelColor }}>Arriving</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: timeColor }}>{arrivingTime}</span>
        </div>
      </div>
    </div>
  )
}
