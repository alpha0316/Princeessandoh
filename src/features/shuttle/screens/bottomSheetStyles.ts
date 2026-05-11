export const MOBILE_BOTTOM_SHEET_LAYOUT = {
  left:14,
  right: 14,
  bottom: 14,
  borderRadius: 40,
} as const

export const MOBILE_BOTTOM_SHEET_SURFACE = {
  ...MOBILE_BOTTOM_SHEET_LAYOUT,
  background: 'white',
  border: '1px solid rgba(0,0,0,0.07)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  overflow: 'hidden',
} as const
