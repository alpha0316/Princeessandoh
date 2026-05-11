import { StatusBadge } from './StatusBadge'

export type StopTimelineItem = {
  name: string
  description?: string
  status: 'past' | 'current' | 'upcoming'
  connectorFill?: number  // 0–100; defaults: past=100, else=0
  isPickup?: boolean
  isDest?: boolean
}

type Props = {
  items: StopTimelineItem[]
  routeColor: string
  dotSize?: number
}

export function StopTimeline({ items, routeColor, dotSize = 24 }: Props) {
  const innerDot = dotSize >= 26 ? { dot: 9, small: 8 } : { dot: 8, small: 7 }

  return (
    <>
      {items.map((item, idx) => {
        const { name, description, status, isPickup, isDest } = item
        const isPast    = status === 'past'
        const isCurrent = status === 'current'
        const isLast    = idx === items.length - 1
        const connFill  = item.connectorFill ?? (isPast ? 100 : 0)

        const dotColor = isCurrent ? routeColor
          : isPast    ? '#D1D5DB'
          : isPickup  ? '#3B82F6'
          : isDest    ? '#F59E0B'
          : '#D1D5DB'

        const dotBg = isCurrent ? routeColor
          : isPast   ? '#F3F4F6'
          : isPickup ? '#EFF6FF'
          : isDest   ? '#FFFBEB'
          : '#F9FAFB'

        return (
          <div key={name} style={{ display: 'flex', gap: 10 }}>
            {/* Rail */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: dotSize, flexShrink: 0 }}>
              <div style={{
                width: dotSize, height: dotSize, borderRadius: '50%',
                background: dotBg,
                border: `2px solid ${dotColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.3s ease',
                boxShadow: isCurrent ? `0 0 0 4px ${routeColor}22` : 'none',
              }}>
                {isCurrent && (
                  <div style={{ width: innerDot.dot, height: innerDot.dot, borderRadius: '50%', background: 'white', animation: 'st-pulse 1.5s infinite' }} />
                )}
                {isPast && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {!isCurrent && !isPast && (
                  <div style={{ width: innerDot.small, height: innerDot.small, borderRadius: '50%', background: dotColor, opacity: 0.85 }} />
                )}
              </div>
              {!isLast && (
                <div style={{ width: 2, flexGrow: 1, background: '#E5E7EB', position: 'relative', overflow: 'hidden', minHeight: 20 }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: `${connFill}%`,
                    background: `linear-gradient(to bottom, ${routeColor}, ${routeColor}80)`,
                    transition: 'height 80ms linear',
                  }} />
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ paddingBottom: isLast ? 0 : 14, paddingTop: 3, flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: isCurrent || isPickup || isDest ? 700 : 400,
                  color: isPast ? '#9CA3AF' : '#111827',
                  textDecoration: isPast ? 'line-through' : 'none',
                }}>
                  {name}
                </span>
                {isCurrent && <StatusBadge variant="bus-here" />}
                {isPickup && !isCurrent && !isPast && <StatusBadge variant="pickup" />}
                {isDest && !isCurrent && !isPast && <StatusBadge variant="dropoff" />}
              </div>
              {/* {description && (
                <span style={{ fontSize: 10, color: '#9CA3AF' }}>{description}</span>
              )} */}
            </div>
          </div>
        )
      })}
      <style>{`
        @keyframes st-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
      `}</style>
    </>
  )
}
