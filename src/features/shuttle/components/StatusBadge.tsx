type Variant = 'bus-here' | 'pickup' | 'dropoff'

const STYLES: Record<Variant, { bg: string; color: string; label: string }> = {
  'bus-here': { bg: '#DCFCE7', color: '#15803D', label: 'Bus here' },
  'pickup':   { bg: '#DBEAFE', color: '#1D4ED8', label: 'Pickup' },
  'dropoff':  { bg: '#FEF3C7', color: '#92400E', label: 'Drop-off' },
}

export function StatusBadge({ variant }: { variant: Variant }) {
  const { bg, color, label } = STYLES[variant]
  return (
    <span style={{
      fontSize: 9, fontWeight: 700,
      padding: '1px 5px', borderRadius: 6,
      background: bg, color, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}
