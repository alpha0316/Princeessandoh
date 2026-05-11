import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

export type StopNotificationProps = {
  stopName: string
  waitingCount?: number
  appHeader?: ReactNode
  duration?: number // seconds, default 8
  onClose?: () => void
  style?: CSSProperties
  position?: 'absolute' | 'static'
  variant?: 'arrival' | 'crowding'
  title?: string
  message?: string
  compact?: boolean
  showProgressBar?: boolean
  showCrowdingPill?: boolean
  closeable?: boolean
}

export function StopNotification({
  stopName,
  waitingCount = 54,
  duration = 8,
  onClose,
  style,
  position = 'absolute',
  variant = 'arrival',
  title,
  message,
  compact = false,
  showProgressBar = true,
  showCrowdingPill,
  closeable = true,
  appHeader,
}: StopNotificationProps) {
  const [progress, setProgress] = useState(100)
  const [visible, setVisible] = useState(true)
  const onCloseRef = useRef(onClose)

  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000
      const pct = Math.max(0, ((duration - elapsed) / duration) * 100)
      setProgress(pct)
      if (elapsed >= duration) {
        clearInterval(id)
        setVisible(false)
        onCloseRef.current?.()
      }
    }, 50)
    return () => clearInterval(id)
  }, [duration])

  if (!visible) return null

  const resolvedShowCrowdingPill = showCrowdingPill ?? variant === 'arrival'
  const titleText = title ?? (variant === 'crowding'
    ? `High student crowding at ${stopName}!`
    : `Bus arrived at ${stopName}`)
  const bodyText = message ?? (variant === 'crowding'
    ? `Please proceed to the stop if you're nearby.`
    : `Route B bus is now boarding at ${stopName}. Tap to track.`)

  return (
    <div style={{
      position,
      top: position === 'absolute' ? 52 : undefined,
      left: position === 'absolute' ? 10 : undefined,
      right: position === 'absolute' ? 10 : undefined,
      zIndex: 50,
      borderRadius: compact ? 28 : 24,
      overflow: 'hidden',
      boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
      background: 'white',
      animation: 'sn-slide-in 0.3s ease-out',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      ...style,
    }}>
      {showProgressBar && <div style={{ height: 3, background: '#E5E7EB' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: '#22C55E',
          transition: 'width 0.05s linear',
        }} />
      </div>}

      {/* App header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: compact ? '14px 18px 10px' : '10px 12px 8px',
        borderBottom: compact ? 'none' : '1px solid #ECECEC',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Bell icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19.3399 14.49L18.3399 12.83C18.1299 12.46 17.9399 11.76 17.9399 11.35V8.82C17.9399 6.47 16.5599 4.44 14.5699 3.49C14.0499 2.57 13.0899 2 11.9899 2C10.8999 2 9.91994 2.59 9.39994 3.52C7.44994 4.49 6.09994 6.5 6.09994 8.82V11.35C6.09994 11.76 5.90994 12.46 5.69994 12.82L4.68994 14.49C4.28994 15.16 4.19994 15.9 4.44994 16.58C4.68994 17.25 5.25994 17.77 5.99994 18.02C7.93994 18.68 9.97994 19 12.0199 19C14.0599 19 16.0999 18.68 18.0399 18.03C18.7399 17.8 19.2799 17.27 19.5399 16.58C19.7999 15.89 19.7299 15.13 19.3399 14.49Z" fill="#4DB448"/>
            <path d="M14.8297 20.01C14.4097 21.17 13.2997 22 11.9997 22C11.2097 22 10.4297 21.68 9.87969 21.11C9.55969 20.81 9.31969 20.41 9.17969 20C9.30969 20.02 9.43969 20.03 9.57969 20.05C9.80969 20.08 10.0497 20.11 10.2897 20.13C10.8597 20.18 11.4397 20.21 12.0197 20.21C12.5897 20.21 13.1597 20.18 13.7197 20.13C13.9297 20.11 14.1397 20.1 14.3397 20.07C14.4997 20.05 14.6597 20.03 14.8297 20.01Z" fill="#4DB448"/>
          </svg>
          {appHeader ?? (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>KNUST</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#22C55E' }}>Shuttle</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#FBBF24' }}>App</span>
            </div>
          )}
        </div>
        {closeable && <button
          onClick={() => { setVisible(false); onCloseRef.current?.() }}
          style={{ background: 'none', border: 'none', color: compact ? '#111827' : '#6B7280', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 0 }}
        >
          ×
        </button>}
      </div>

      {/* Body */}
      <div style={{ padding: compact ? '0 18px 18px' : '10px 12px 12px' }}>
        <div style={{ background: '#fafafa', borderRadius: compact ? 18 : 12, padding: compact ? '12px 12px 10px' : '10px 10px 10px' }}>
          <p style={{ margin: '0 0 4px', fontSize: compact ? 12 : 13, fontWeight: 500, color: variant === 'crowding' ? '#F95C43' : '#16A34A' }}>
            {titleText}
          </p>
          <p style={{ margin: 0, fontSize: compact ? 11 : 12, color: '#6B7280', lineHeight: compact ? 1.3 : 1.4 }}>
            {bodyText}
          </p>

          {resolvedShowCrowdingPill && <div style={{
            marginTop: 8,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            border: '1px solid #D1D5DB',
            borderRadius: 999,
            padding: '3px 8px',
            background: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {['#93C5FD', '#A7F3D0', '#FDE68A'].map((c, i) => (
                <div key={i} style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: c, border: '1.5px solid #fff',
                  marginLeft: i === 0 ? 0 : -4,
                  fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>👤</div>
              ))}
            </div>
            <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 600 }}>{waitingCount}+</span>
            <span style={{ fontSize: 11, color: '#6B7280' }}>waiting</span>
          </div>}
        </div>
      </div>

      <style>{`
        @keyframes sn-slide-in {
          from { transform: translateY(-10px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </div>
  )
}
